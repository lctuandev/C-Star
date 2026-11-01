import type { Beat, CrisisRule } from '@cstar/game-core';

/** When each scene plays (GDD §3). A beat without a week plays on that month's payday. */
export const beats: readonly Beat[] = [
  { scene: 'ch1-first-day', month: 1, week: 1 },
  { scene: 'ch1-town-hall', month: 1, week: 2 },
  { scene: 'ch1-fruit-friday', month: 1, week: 3 },
  { scene: 'ch1-payday', month: 1 },
  { scene: 'ch2-new-month', month: 2, week: 1 },
  { scene: 'ch2-small-signs', month: 2, week: 3 },
  { scene: 'ch2-payday-silence', month: 2 },
  { scene: 'ch3-kpi-launch', month: 3, week: 1 },
  { scene: 'ch3-first-tranche', month: 3, week: 2 },
  { scene: 'ch3-side-rumor', month: 3, week: 4 },
  { scene: 'ch3-badge', month: 3 },
  { scene: 'ch3-new-project', month: 4, week: 1 },
  { scene: 'ch3-chart', month: 4, week: 3 },
  { scene: 'ch3-promise', month: 4 },
];

/** Checked in this order (GDD §5.1, §5.2). */
export const crises: readonly CrisisRule[] = [
  { id: 'broke', scene: 'crisis-broke', when: { type: 'stat', stat: 'arrears', min: 1 } },
  {
    id: 'burnout',
    scene: 'crisis-burnout',
    when: {
      type: 'any',
      conditions: [
        { type: 'stat', stat: 'energy', max: 0 },
        { type: 'stat', stat: 'stress', min: 100 },
      ],
    },
  },
];
