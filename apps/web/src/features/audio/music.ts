import { midiToHertz, SCORES, secondsPerBar } from './score';
import type { Hit, Score, Track } from './score';

/** How far ahead notes are handed to the audio clock: long enough to survive a busy frame. */
const LOOK_AHEAD = 0.4;
const TICK_MS = 100;
const FADE_SECONDS = 0.7;
const MUSIC_LEVEL = 0.55;

/** Synthesized and generated bar by bar: nothing to download, and it can change with the story. */
export class MusicPlayer {
  private readonly bus: GainNode;
  private readonly filter: BiquadFilterNode;
  private readonly noise: AudioBuffer;
  private timer: ReturnType<typeof setInterval> | null = null;
  private score: Score | null = null;
  private track: Track | null = null;
  private nextBar = 0;
  private bar = 0;

  constructor(
    private readonly context: AudioContext,
    output: AudioNode,
  ) {
    this.bus = context.createGain();
    this.bus.gain.value = 0;
    this.filter = context.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.connect(this.bus).connect(output);
    const samples = context.sampleRate / 4;
    this.noise = context.createBuffer(1, samples, context.sampleRate);
    const channel = this.noise.getChannelData(0);
    for (let index = 0; index < samples; index += 1) {
      channel[index] = Math.random() * 2 - 1;
    }
  }

  play(track: Track): void {
    if (track === this.track) {
      return;
    }
    this.track = track;
    const now = this.context.currentTime;
    this.bus.gain.cancelScheduledValues(now);
    this.bus.gain.setTargetAtTime(0, now, FADE_SECONDS / 3);
    const start = now + FADE_SECONDS;
    this.score = SCORES[track];
    this.filter.frequency.setTargetAtTime(this.score.cutoff, start, 0.2);
    this.bus.gain.setTargetAtTime(MUSIC_LEVEL, start, FADE_SECONDS);
    this.nextBar = start;
    this.bar = 0;
    this.timer ??= setInterval(() => this.schedule(), TICK_MS);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = null;
    this.track = null;
    this.score = null;
    this.bus.gain.setTargetAtTime(0, this.context.currentTime, FADE_SECONDS / 3);
  }

  private schedule(): void {
    const { score } = this;
    while (score && this.nextBar < this.context.currentTime + LOOK_AHEAD) {
      const beat = 60 / score.bpm;
      for (const hit of score.bars[this.bar % score.bars.length] ?? []) {
        this.sound(hit, this.nextBar + hit.beat * beat, hit.beats * beat, score.wobble);
      }
      this.nextBar += secondsPerBar(score);
      this.bar += 1;
    }
  }

  private sound(hit: Hit, at: number, length: number, wobble: number): void {
    if (hit.voice === 'hat') {
      this.brush(hit, at);
      return;
    }
    // A soft electric piano is two sines an octave and a bit apart, the upper one dying first.
    const partials =
      hit.voice === 'keys'
        ? [
            { ratio: 1, level: 1, type: 'triangle' as const },
            { ratio: 2, level: 0.25, type: 'sine' as const },
          ]
        : hit.voice === 'bell'
          ? [
              { ratio: 2, level: 1, type: 'sine' as const },
              { ratio: 6, level: 0.12, type: 'sine' as const },
            ]
          : [{ ratio: 1, level: 1, type: 'sine' as const }];
    const detune = (Math.random() - 0.5) * 2 * wobble;
    for (const { ratio, level, type } of partials) {
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      oscillator.type = type;
      oscillator.frequency.value = midiToHertz(hit.midi) * ratio;
      oscillator.detune.value = detune;
      const peak = hit.level * level;
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(peak, at + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + length + 0.3);
      oscillator.connect(gain).connect(this.filter);
      oscillator.start(at);
      oscillator.stop(at + length + 0.35);
    }
  }

  private brush(hit: Hit, at: number): void {
    const source = this.context.createBufferSource();
    const gain = this.context.createGain();
    const highpass = this.context.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 6000;
    source.buffer = this.noise;
    gain.gain.setValueAtTime(hit.level, at);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.05);
    source.connect(highpass).connect(gain).connect(this.bus);
    source.start(at, Math.random() * 0.2, 0.06);
  }
}
