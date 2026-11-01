import { world } from '@cstar/content';
import type { GameState } from '@cstar/game-core';

export type Track = 'menu' | 'bright' | 'tired' | 'hollow' | 'home' | 'tense';

export type Voice = 'keys' | 'bass' | 'bell' | 'hat';

export interface Hit {
  beat: number;
  midi: number;
  beats: number;
  voice: Voice;
  level: number;
}

export interface Score {
  bpm: number;
  /** Everything goes through one lowpass: the later in the story, the darker. */
  cutoff: number;
  /** Cents of random detune per note: a tape slowly going off. */
  wobble: number;
  bars: readonly (readonly Hit[])[];
}

const BEATS_PER_BAR = 4;

const keys = (chord: readonly number[], beat: number, beats: number, level: number): Hit[] =>
  chord.map((midi) => ({ beat, midi, beats, voice: 'keys', level }));

const bass = (midi: number, beat: number, beats: number, level = 0.26): Hit => ({
  beat,
  midi,
  beats,
  voice: 'bass',
  level,
});

const bell = (midi: number, beat: number, level = 0.07): Hit => ({
  beat,
  midi,
  beats: 2,
  voice: 'bell',
  level,
});

const brush = (level: number): Hit[] =>
  Array.from({ length: BEATS_PER_BAR * 2 }, (_, index) => ({
    beat: index / 2,
    midi: 0,
    beats: 0.1,
    voice: 'hat',
    level: index % 2 === 0 ? level : level * 0.6,
  }));

const CMAJ7 = [60, 64, 67, 71];
const AM7 = [57, 60, 64, 67];
const DM7 = [57, 60, 65, 69];
const G7 = [55, 59, 65, 69];
const FMAJ7 = [57, 60, 64, 65];
const E7 = [56, 59, 62, 68];
const EM7 = [59, 62, 64, 67];

/** Elevator music for a company with a vision: bright, smooth, and about nothing. */
const bright: Score = {
  bpm: 92,
  cutoff: 3200,
  wobble: 0,
  bars: [
    [
      ...keys(CMAJ7, 0, 1, 0.1),
      ...keys(CMAJ7, 1.5, 1, 0.08),
      ...keys(CMAJ7, 3, 0.8, 0.08),
      bass(36, 0, 1.5),
      bass(43, 2.5, 1, 0.2),
      bell(76, 0),
      bell(79, 1.5),
      ...brush(0.018),
    ],
    [
      ...keys(AM7, 0, 1, 0.1),
      ...keys(AM7, 1.5, 1, 0.08),
      ...keys(AM7, 3, 0.8, 0.08),
      bass(33, 0, 1.5),
      bass(40, 2.5, 1, 0.2),
      bell(72, 0.5),
      ...brush(0.018),
    ],
    [
      ...keys(DM7, 0, 1, 0.1),
      ...keys(DM7, 1.5, 1, 0.08),
      ...keys(DM7, 3, 0.8, 0.08),
      bass(38, 0, 1.5),
      bass(45, 2.5, 1, 0.2),
      bell(74, 0),
      bell(77, 1.5),
      ...brush(0.018),
    ],
    [
      ...keys(G7, 0, 1, 0.1),
      ...keys(G7, 1.5, 1, 0.08),
      ...keys(G7, 3, 0.8, 0.08),
      bass(31, 0, 1.5),
      bass(38, 2.5, 1, 0.2),
      bell(71, 2),
      ...brush(0.018),
    ],
  ],
};

/** The same office, a few months on: the tune has lost its major key and its drummer. */
const tired: Score = {
  bpm: 82,
  cutoff: 2000,
  wobble: 5,
  bars: [
    [...keys(AM7, 0, 1.5, 0.09), ...keys(AM7, 2.5, 1, 0.07), bass(33, 0, 2), bell(76, 1)],
    [...keys(FMAJ7, 0, 1.5, 0.09), ...keys(FMAJ7, 2.5, 1, 0.07), bass(29, 0, 2)],
    [...keys(DM7, 0, 1.5, 0.09), ...keys(DM7, 2.5, 1, 0.07), bass(38, 0, 2), bell(74, 1)],
    [...keys(E7, 0, 1.5, 0.09), ...keys(E7, 2.5, 1, 0.07), bass(28, 0, 2)],
  ],
};

/** Almost nobody left to hear it. */
const hollow: Score = {
  bpm: 64,
  cutoff: 1100,
  wobble: 14,
  bars: [
    [...keys([57, 60, 64], 0, 3.6, 0.07), bass(33, 0, 3, 0.16)],
    [...keys([57, 60, 64], 0, 3.6, 0.06)],
    [...keys(FMAJ7, 0, 3.6, 0.07), bass(29, 0, 3, 0.16)],
    [...keys([56, 59, 64], 0, 3.6, 0.06)],
  ],
};

const arpeggio = (chord: readonly number[], level: number) =>
  chord.flatMap((midi, index) => keys([midi], index, 1.8, level));

/** The one place the company has not reached. */
const home: Score = {
  bpm: 70,
  cutoff: 1700,
  wobble: 2,
  bars: [
    [...arpeggio([62, 66, 69, 73], 0.1), bass(38, 0, 3, 0.18)],
    [...arpeggio([59, 62, 66, 69], 0.1), bass(35, 0, 3, 0.18)],
    [...arpeggio([59, 62, 66, 67], 0.1), bass(31, 0, 3, 0.18)],
    [...arpeggio([57, 62, 64, 67], 0.1), bass(33, 0, 3, 0.18)],
  ],
};

const menu: Score = {
  bpm: 80,
  cutoff: 2600,
  wobble: 1,
  bars: [
    [
      ...keys(FMAJ7, 0, 1.2, 0.09),
      ...keys(FMAJ7, 2, 1.2, 0.07),
      bass(41, 0, 1.5, 0.2),
      bell(72, 0),
      bell(77, 2),
    ],
    [...keys(EM7, 0, 1.2, 0.09), ...keys(EM7, 2, 1.2, 0.07), bass(40, 0, 1.5, 0.2), bell(71, 1)],
    [
      ...keys(DM7, 0, 1.2, 0.09),
      ...keys(DM7, 2, 1.2, 0.07),
      bass(38, 0, 1.5, 0.2),
      bell(69, 0),
      bell(74, 2),
    ],
    [
      ...keys(CMAJ7, 0, 1.2, 0.09),
      ...keys(CMAJ7, 2, 1.2, 0.07),
      bass(36, 0, 1.5, 0.2),
      bell(67, 2),
    ],
  ],
};

/** The rent is due: two notes that will not resolve. */
const tense: Score = {
  bpm: 60,
  cutoff: 800,
  wobble: 8,
  bars: [
    [...keys([57, 58], 0, 1.8, 0.07), ...keys([57, 58], 2, 1.8, 0.05), bass(33, 0, 3.5, 0.2)],
    [...keys([57, 58], 0, 1.8, 0.05), ...keys([60, 61], 2, 1.8, 0.05), bass(33, 0, 3.5, 0.16)],
  ],
};

export const SCORES: Readonly<Record<Track, Score>> = { menu, bright, tired, hollow, home, tense };

export const secondsPerBar = ({ bpm }: Score) => (60 / bpm) * BEATS_PER_BAR;

export const midiToHertz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

const LAST_BRIGHT_MONTH = 2;
const LAST_TIRED_MONTH = 4;

/** What plays over a run: it follows the place, and the months take the tune apart. */
export const trackFor = (state: GameState | null): Track => {
  if (!state || state.phase === 'ended') {
    return 'menu';
  }
  const sceneId = state.story.sceneId ?? '';
  if (sceneId.startsWith('crisis-')) {
    return 'tense';
  }
  if (world.story.scenes[sceneId]?.place === 'home') {
    return 'home';
  }
  const { month } = state.calendar;
  if (month <= LAST_BRIGHT_MONTH) {
    return 'bright';
  }
  return month <= LAST_TIRED_MONTH ? 'tired' : 'hollow';
};
