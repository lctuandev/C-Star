import { MusicPlayer } from './music';
import type { Track } from './score';
import type { SoundCue } from './sound-cues';

/** A strip light's hum sits about here (mains hum and its harmonic), very quietly. */
const HUM_FREQUENCY = 100;
const HUM_LEVEL = 0.012;

/** No matter how fast the text runs: a tick per glyph is a rattle, not a voice. */
const TYPE_GAP = 0.05;
const TYPE_LEVEL = 0.1;

/** Colleagues typing in the distance: the fewer are left, the less often. */
const ROOM_TICK_MS = 260;
const ROOM_LEVEL = 0.018;

/** Everyone sounds a little different as they "type": narration lowest, the youngest highest. */
const VOICES: Readonly<Record<string, number>> = {
  chairman: 0.7,
  boss: 0.8,
  manager: 0.88,
  accountant: 0.94,
  deputy: 1,
  dan: 1.04,
  player: 1.1,
  hr: 1.16,
  uyen: 1.24,
  khoa: 1.34,
};
const NARRATOR = 0.76;

interface Note {
  frequency: number;
  at: number;
  length: number;
  level: number;
  type: OscillatorType;
}

const note = (
  frequency: number,
  at: number,
  length: number,
  level: number,
  type: OscillatorType = 'sine',
): Note => ({
  frequency,
  at,
  length,
  level,
  type,
});

const SAMPLES = [
  'mouse-click-2',
  'pop-hand',
  'message-pop-reply',
  'notification-ding',
  'several-coins',
  'money-chalking',
  'fast-whoosh',
  'dull-thud',
  'tick',
] as const;

type Sample = (typeof SAMPLES)[number];

interface Recording {
  sample: Sample;
  level: number;
  at?: number;
  rate?: number;
}

const TYPING_RUN: readonly Recording[] = [0, 0.09, 0.15, 0.27, 0.36, 0.41, 0.55, 0.62].map(
  (at, index) => ({ sample: 'tick', level: 0.22, at, rate: 1.1 + (index % 3) * 0.08 }),
);

/** The recordings, CC0, see docs/sound-credits.md. Whatever has none is made here. */
const RECORDED: Partial<Record<SoundCue, readonly Recording[]>> = {
  ting: [{ sample: 'notification-ding', level: 0.5 }],
  tap: [{ sample: 'mouse-click-2', level: 0.28 }],
  choose: [{ sample: 'pop-hand', level: 0.4 }],
  coins: [{ sample: 'several-coins', level: 0.4 }],
  debt: [{ sample: 'money-chalking', level: 0.3, rate: 0.8 }],
  chat: [{ sample: 'message-pop-reply', level: 0.4 }],
  chapter: [{ sample: 'fast-whoosh', level: 0.3 }],
  leave: [{ sample: 'dull-thud', level: 0.5 }],
  alarm: [{ sample: 'dull-thud', level: 0.4, rate: 0.7 }],
  keys: TYPING_RUN,
};

const SYNTHESIZED: Record<SoundCue, readonly Note[]> = {
  ting: [note(1319, 0, 0.5, 0.2), note(1976, 0.09, 0.8, 0.16)],
  paper: [note(180, 0, 0.12, 0.12, 'triangle'), note(320, 0.05, 0.1, 0.06, 'triangle')],
  file: [note(240, 0, 0.1, 0.1, 'triangle'), note(420, 0.09, 0.12, 0.08, 'triangle')],
  ending: [note(392, 0, 1, 0.1), note(494, 0.25, 1, 0.1), note(587, 0.5, 1.4, 0.1)],
  tap: [note(900, 0, 0.03, 0.04, 'triangle')],
  denied: [note(150, 0, 0.09, 0.08, 'square'), note(120, 0.08, 0.12, 0.08, 'square')],
  choose: [note(620, 0, 0.09, 0.09)],
  warm: [note(523, 0, 0.3, 0.09), note(659, 0.08, 0.34, 0.09), note(784, 0.16, 0.4, 0.07)],
  sour: [note(233, 0, 0.3, 0.1, 'triangle'), note(185, 0.13, 0.42, 0.1, 'triangle')],
  coins: [note(1800, 0, 0.1, 0.08), note(2400, 0.07, 0.14, 0.07)],
  debt: [note(146, 0, 0.5, 0.1, 'triangle')],
  leave: [note(110, 0, 0.3, 0.14)],
  keys: [note(1100, 0, 0.02, 0.03, 'square')],
  rest: [note(523, 0, 0.7, 0.08), note(440, 0.2, 0.8, 0.08), note(349, 0.4, 1.1, 0.08)],
  chat: [note(740, 0, 0.1, 0.09)],
  right: [note(880, 0, 0.14, 0.1), note(1175, 0.09, 0.22, 0.1)],
  wrong: [note(196, 0, 0.18, 0.11, 'triangle'), note(147, 0.11, 0.3, 0.11, 'triangle')],
  chapter: [note(330, 0, 0.5, 0.05)],
  alarm: [note(110, 0, 0.6, 0.14, 'triangle')],
  step: [note(85, 0, 0.07, 0.06)],
};

export class AudioEngine {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private hum: OscillatorNode | null = null;
  private music: MusicPlayer | null = null;
  private readonly buffers = new Map<Sample, AudioBuffer>();
  private volume = 0;
  private ambience = false;
  private wantsMusic = false;
  private typing = false;
  private track: Track = 'menu';
  private lastTick = 0;
  private roomTimer: ReturnType<typeof setInterval> | null = null;
  private roomBusy = 0;

  /** Browsers only allow sound after a gesture: call this from one. */
  unlock(): void {
    if (this.context || typeof AudioContext === 'undefined') {
      void this.context?.resume();
      return;
    }
    this.context = new AudioContext();
    this.master = this.context.createGain();
    this.master.gain.value = this.volume;
    // The one place everything meets: nothing a player can stack up may clip.
    const limiter = this.context.createDynamicsCompressor?.();
    if (limiter) {
      this.master.connect(limiter).connect(this.context.destination);
    } else {
      this.master.connect(this.context.destination);
    }
    this.applyAmbience();
    this.applyMusic();
    void this.loadSamples(this.context);
  }

  setVolume(volume: number): void {
    this.volume = volume;
    if (this.master) {
      this.master.gain.value = volume;
    }
    this.applyMusic();
  }

  setAmbience(on: boolean): void {
    this.ambience = on;
    this.applyAmbience();
  }

  setMusic(on: boolean): void {
    this.wantsMusic = on;
    this.applyMusic();
  }

  setTyping(on: boolean): void {
    this.typing = on;
  }

  /** What is playing, or will be once sound is allowed. */
  setTrack(track: Track): void {
    this.track = track;
    this.applyMusic();
  }

  /** 0 to 1: how many people are still typing around the player. */
  setRoomBusy(busy: number): void {
    this.roomBusy = busy;
    this.applyRoom();
  }

  /** A tab in the background stays quiet. */
  setHidden(hidden: boolean): void {
    if (hidden) {
      void this.context?.suspend?.();
    } else {
      void this.context?.resume();
    }
  }

  /** One tick of the text appearing, in the voice of whoever is speaking. */
  typeFor(speaker: string | null): void {
    const { context } = this;
    if (!context || !this.typing || !this.buffers.has('tick')) {
      return;
    }
    if (context.currentTime - this.lastTick < TYPE_GAP) {
      return;
    }
    this.lastTick = context.currentTime;
    const voice = speaker ? (VOICES[speaker] ?? 1) : NARRATOR;
    this.playRecording({
      sample: 'tick',
      level: speaker ? TYPE_LEVEL : TYPE_LEVEL * 0.6,
      rate: voice * (0.96 + Math.random() * 0.08),
    });
  }

  play(cue: SoundCue): void {
    const { context, master } = this;
    if (!context || !master) {
      return;
    }
    const recorded = RECORDED[cue];
    if (recorded?.every(({ sample }) => this.buffers.has(sample))) {
      recorded.forEach((recording) => this.playRecording(recording));
      return;
    }
    for (const part of SYNTHESIZED[cue]) {
      const start = context.currentTime + part.at;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = part.type;
      oscillator.frequency.value = part.frequency;
      gain.gain.setValueAtTime(part.level, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + part.length);
      oscillator.connect(gain).connect(master);
      oscillator.start(start);
      oscillator.stop(start + part.length);
    }
  }

  private playRecording({ sample, level, at = 0, rate = 1 }: Recording): void {
    const { context, master } = this;
    const buffer = this.buffers.get(sample);
    if (!context || !master || !buffer) {
      return;
    }
    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    source.playbackRate.value = rate;
    gain.gain.value = level;
    source.connect(gain).connect(master);
    source.start(context.currentTime + at);
  }

  private async loadSamples(context: AudioContext): Promise<void> {
    await Promise.all(
      SAMPLES.map(async (sample) => {
        try {
          const response = await fetch(`/audio/sfx/${sample}.wav`);
          this.buffers.set(sample, await context.decodeAudioData(await response.arrayBuffer()));
        } catch {
          // Sound is a bonus: every cue that uses a recording has a synthesized stand-in.
        }
      }),
    );
  }

  private applyMusic(): void {
    const { context, master } = this;
    if (!context || !master) {
      return;
    }
    if (!this.wantsMusic || this.volume === 0) {
      this.music?.stop();
      return;
    }
    this.music ??= new MusicPlayer(context, master);
    this.music.play(this.track);
  }

  private applyRoom(): void {
    if (this.roomBusy <= 0) {
      if (this.roomTimer) {
        clearInterval(this.roomTimer);
      }
      this.roomTimer = null;
      return;
    }
    this.roomTimer ??= setInterval(() => {
      if (this.ambience && Math.random() < this.roomBusy) {
        this.playRecording({
          sample: 'tick',
          level: ROOM_LEVEL * (0.5 + Math.random()),
          rate: 0.8 + Math.random() * 0.5,
        });
      }
    }, ROOM_TICK_MS);
  }

  private applyAmbience(): void {
    const { context, master } = this;
    if (!context || !master) {
      return;
    }
    if (!this.ambience) {
      this.hum?.stop();
      this.hum = null;
      return;
    }
    if (!this.hum) {
      const gain = context.createGain();
      gain.gain.value = HUM_LEVEL;
      this.hum = context.createOscillator();
      this.hum.type = 'sawtooth';
      this.hum.frequency.value = HUM_FREQUENCY;
      this.hum.connect(gain).connect(master);
      this.hum.start();
    }
  }
}

export const audioEngine = new AudioEngine();
