import type { SoundCue } from './sound-cues';

/** A strip light's hum sits about here (mains hum and its harmonic), very quietly. */
const HUM_FREQUENCY = 100;
const HUM_LEVEL = 0.012;

interface Note {
  frequency: number;
  at: number;
  length: number;
  level: number;
  type: OscillatorType;
}

/** Everything is synthesized: no files to download, license or precache. */
const SOUNDS: Record<SoundCue, readonly Note[]> = {
  ting: [
    { frequency: 1319, at: 0, length: 0.5, level: 0.2, type: 'sine' },
    { frequency: 1976, at: 0.09, length: 0.8, level: 0.16, type: 'sine' },
  ],
  paper: [{ frequency: 180, at: 0, length: 0.12, level: 0.12, type: 'triangle' }],
  ending: [
    { frequency: 392, at: 0, length: 1, level: 0.1, type: 'sine' },
    { frequency: 494, at: 0.25, length: 1, level: 0.1, type: 'sine' },
    { frequency: 587, at: 0.5, length: 1.4, level: 0.1, type: 'sine' },
  ],
};

export class AudioEngine {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private hum: OscillatorNode | null = null;
  private volume = 0;
  private ambience = false;

  /** Browsers only allow sound after a gesture: call this from one. */
  unlock(): void {
    if (this.context || typeof AudioContext === 'undefined') {
      void this.context?.resume();
      return;
    }
    this.context = new AudioContext();
    this.master = this.context.createGain();
    this.master.gain.value = this.volume;
    this.master.connect(this.context.destination);
    this.applyAmbience();
  }

  setVolume(volume: number): void {
    this.volume = volume;
    if (this.master) {
      this.master.gain.value = volume;
    }
  }

  setAmbience(on: boolean): void {
    this.ambience = on;
    this.applyAmbience();
  }

  play(cue: SoundCue): void {
    const { context, master } = this;
    if (!context || !master) {
      return;
    }
    for (const note of SOUNDS[cue]) {
      const start = context.currentTime + note.at;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = note.type;
      oscillator.frequency.value = note.frequency;
      gain.gain.setValueAtTime(note.level, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + note.length);
      oscillator.connect(gain).connect(master);
      oscillator.start(start);
      oscillator.stop(start + note.length);
    }
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
