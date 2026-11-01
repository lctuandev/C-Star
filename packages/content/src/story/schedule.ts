import type { Beat } from '@cstar/game-core';

/** When each scene plays (GDD §3). A beat without a week plays on that month's payday. */
export const beats: readonly Beat[] = [
  { scene: 'ch1-first-day', month: 1, week: 1 },
  { scene: 'ch1-town-hall', month: 1, week: 2 },
  { scene: 'ch1-fruit-friday', month: 1, week: 3 },
  { scene: 'ch1-payday', month: 1 },
  { scene: 'ch2-new-month', month: 2, week: 1 },
  { scene: 'ch2-small-signs', month: 2, week: 3 },
  { scene: 'ch2-payday-silence', month: 2 },
];
