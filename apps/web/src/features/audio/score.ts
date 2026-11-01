import { world } from '@cstar/content';
import type { GameState } from '@cstar/game-core';

export type Track =
  | 'menu'
  | 'dawn'
  | 'routine'
  | 'uneasy'
  | 'weary'
  | 'hollow'
  | 'bleak'
  | 'home'
  | 'homeLate'
  | 'tense';

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
const C = [60, 64, 67, 72];
const F = [60, 65, 69, 72];
const AM7 = [57, 60, 64, 67];
const DM7 = [57, 60, 65, 69];
const G7 = [55, 59, 65, 69];
const FMAJ7 = [57, 60, 64, 65];
const E7 = [56, 59, 62, 68];
const EM7 = [59, 62, 64, 67];

const bounce = (chord: readonly number[], root: number, fifth: number) => [
  bass(root, 0, 0.8, 0.24),
  ...keys(chord, 1, 0.5, 0.08),
  bass(fifth, 2, 0.8, 0.2),
  ...keys(chord, 3, 0.5, 0.08),
  ...keys(chord, 3.5, 0.4, 0.06),
];

/** Month 1. The first job, the first salary: a tune that walks with a spring in it. */
const dawn: Score = {
  bpm: 118,
  cutoff: 4200,
  wobble: 0,
  bars: [
    [
      ...bounce(C, 36, 43),
      bell(76, 0, 0.09),
      bell(79, 1, 0.09),
      bell(84, 2, 0.1),
      bell(79, 3, 0.08),
      ...brush(0.02),
    ],
    [
      ...bounce(AM7, 33, 40),
      bell(81, 0, 0.09),
      bell(79, 1, 0.08),
      bell(76, 2, 0.09),
      ...brush(0.02),
    ],
    [
      ...bounce(F, 41, 48),
      bell(77, 0, 0.09),
      bell(81, 1, 0.09),
      bell(84, 2, 0.1),
      bell(81, 3, 0.08),
      ...brush(0.02),
    ],
    [
      ...bounce(G7, 31, 38),
      bell(79, 0, 0.09),
      bell(77, 1.5, 0.08),
      bell(74, 2.5, 0.08),
      bell(71, 3, 0.08),
      ...brush(0.02),
    ],
  ],
};

/** Month 2. Still pleasant, a little less sure: the office's elevator music. */
const routine: Score = {
  bpm: 96,
  cutoff: 3000,
  wobble: 1,
  bars: [
    [
      ...keys(CMAJ7, 0, 1, 0.1),
      ...keys(CMAJ7, 1.5, 1, 0.08),
      ...keys(CMAJ7, 3, 0.8, 0.08),
      bass(36, 0, 1.5),
      bass(43, 2.5, 1, 0.2),
      bell(76, 0),
      bell(79, 1.5),
      ...brush(0.016),
    ],
    [
      ...keys(AM7, 0, 1, 0.1),
      ...keys(AM7, 1.5, 1, 0.08),
      ...keys(AM7, 3, 0.8, 0.08),
      bass(33, 0, 1.5),
      bass(40, 2.5, 1, 0.2),
      bell(72, 0.5),
      ...brush(0.016),
    ],
    [
      ...keys(DM7, 0, 1, 0.1),
      ...keys(DM7, 1.5, 1, 0.08),
      ...keys(DM7, 3, 0.8, 0.08),
      bass(38, 0, 1.5),
      bass(45, 2.5, 1, 0.2),
      bell(74, 0),
      bell(77, 1.5),
      ...brush(0.016),
    ],
    [
      ...keys(G7, 0, 1, 0.1),
      ...keys(G7, 1.5, 1, 0.08),
      ...keys(G7, 3, 0.8, 0.08),
      bass(31, 0, 1.5),
      bass(38, 2.5, 1, 0.2),
      bell(71, 2),
      ...brush(0.016),
    ],
  ],
};

/** Months 3 and 4. The salary is late: the major key has gone, and so has the drummer. */
const uneasy: Score = {
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

/** Months 5 and 6. Tired: long gaps, and the tune no longer finishes its phrases. */
const weary: Score = {
  bpm: 68,
  cutoff: 1400,
  wobble: 9,
  bars: [
    [...keys(AM7, 0, 2.5, 0.08), bass(33, 0, 3, 0.2)],
    [...keys(FMAJ7, 0, 2.5, 0.07), bell(72, 3, 0.04)],
    [...keys(DM7, 0, 2.5, 0.08), bass(38, 0, 3, 0.18)],
    [...keys(E7, 1, 2.5, 0.06)],
  ],
};

/** Month 7. Hardly anyone left to hear it. */
const hollow: Score = {
  bpm: 58,
  cutoff: 1000,
  wobble: 14,
  bars: [
    [...keys([57, 60, 64], 0, 3.6, 0.07), bass(33, 0, 3, 0.16)],
    [...keys([57, 60, 63], 0, 3.6, 0.06)],
    [...keys(FMAJ7, 0, 3.6, 0.06), bass(29, 0, 3, 0.16)],
    [...keys([56, 59, 64], 0, 3.6, 0.06)],
  ],
};

/** Month 8 on. Barely music: a low note, and something that will not resolve above it. */
const bleak: Score = {
  bpm: 50,
  cutoff: 700,
  wobble: 20,
  bars: [
    [...keys([50, 53], 0, 3.8, 0.06), bass(26, 0, 3.8, 0.2)],
    [...keys([50, 56], 1, 2.8, 0.05)],
    [...keys([49, 53], 0, 3.8, 0.05), bass(25, 0, 3.8, 0.18)],
    [],
  ],
};

const arpeggio = (chord: readonly number[], level: number) =>
  chord.flatMap((midi, index) => keys([midi], index, 1.8, level));

/** The one place the company has not reached, in the good months. */
const home: Score = {
  bpm: 76,
  cutoff: 2000,
  wobble: 2,
  bars: [
    [...arpeggio([62, 66, 69, 73], 0.1), bass(38, 0, 3, 0.18)],
    [...arpeggio([59, 62, 66, 69], 0.1), bass(35, 0, 3, 0.18)],
    [...arpeggio([59, 62, 66, 67], 0.1), bass(31, 0, 3, 0.18)],
    [...arpeggio([57, 62, 64, 67], 0.1), bass(33, 0, 3, 0.18)],
  ],
};

/** Home again, once the rent is the only thing to think about at night. */
const homeLate: Score = {
  bpm: 60,
  cutoff: 1200,
  wobble: 8,
  bars: [
    [...arpeggio([57, 60, 64, 67], 0.07), bass(33, 0, 3, 0.14)],
    [...arpeggio([57, 60, 65, 69], 0.06)],
    [...arpeggio([55, 58, 62, 65], 0.07), bass(31, 0, 3, 0.14)],
    [...arpeggio([56, 59, 62, 64], 0.06)],
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

export const SCORES: Readonly<Record<Track, Score>> = {
  menu,
  dawn,
  routine,
  uneasy,
  weary,
  hollow,
  bleak,
  home,
  homeLate,
  tense,
};

export const secondsPerBar = ({ bpm }: Score) => (60 / bpm) * BEATS_PER_BAR;

export const midiToHertz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

/** The office from the first month to the last, from light to dark. */
const ARC: readonly Track[] = [
  'dawn',
  'routine',
  'uneasy',
  'uneasy',
  'weary',
  'weary',
  'hollow',
  'bleak',
];

const HIGH_STRESS = 70;
const LOW_ENERGY = 20;
const LAST_GOOD_MONTH_AT_HOME = 3;

/** How each way out of the company sounds: the good ones get their light back. */
const ENDINGS: Readonly<Record<string, Track>> = {
  good: 'dawn',
  collective: 'home',
  investigator: 'home',
  survivor: 'home',
  believer: 'hollow',
  'empty-promise': 'routine',
};

const endingOf = (sceneId: string) =>
  sceneId.startsWith('ending-') ? sceneId.slice('ending-'.length) : null;

/**
 * What plays over a run. The story darkens it month by month, and so does the player: someone at
 * the end of their rope hears the office a stage further on than the calendar says.
 */
export const trackFor = (state: GameState | null): Track => {
  if (!state) {
    return 'menu';
  }
  const sceneId = state.story.sceneId ?? '';
  const ending = state.ending ?? endingOf(sceneId);
  if (ending) {
    return ENDINGS[ending] ?? 'menu';
  }
  if (sceneId.startsWith('crisis-')) {
    return 'tense';
  }
  // The contract renews itself, and the music is delighted all over again.
  if (sceneId === world.renewalScene) {
    return 'dawn';
  }
  const { month } = state.calendar;
  if (world.story.scenes[sceneId]?.place === 'home') {
    return month <= LAST_GOOD_MONTH_AT_HOME ? 'home' : 'homeLate';
  }
  const worn = state.mood.stress >= HIGH_STRESS || state.mood.energy <= LOW_ENERGY ? 1 : 0;
  // The opening month stays bright whatever the mood: nothing has gone wrong yet.
  const stage = month === 1 ? 0 : Math.min(ARC.length - 1, month - 1 + worn);
  return ARC[stage] as Track;
};
