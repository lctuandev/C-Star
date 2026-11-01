import type { Beat, CrisisRule } from '@cstar/game-core';

/** When each scene plays (GDD §3). A beat without a week plays on that month's payday. */
export const beats: readonly Beat[] = [
  { scene: 'ch1-first-day', month: 1, week: 1 },
  { scene: 'ch1-town-hall', month: 1, week: 2 },
  { scene: 'ch1-fruit-friday', month: 1, week: 3 },
  { scene: 'ch1-team-lunch', month: 1, week: 4 },
  { scene: 'ch1-payday', month: 1 },
  { scene: 'ch2-new-month', month: 2, week: 1 },
  { scene: 'ch2-small-signs', month: 2, week: 3 },
  { scene: 'ch2-hard-times', month: 2, week: 4 },
  { scene: 'ch2-payday-silence', month: 2 },
  { scene: 'ch3-kpi-launch', month: 3, week: 1 },
  { scene: 'ch3-first-tranche', month: 3, week: 2 },
  { scene: 'ch3-next-week', month: 3, week: 3 },
  { scene: 'ch3-side-rumor', month: 3, week: 4 },
  { scene: 'ch3-weekly-sync', month: 3, week: 4 },
  { scene: 'ch3-badge', month: 3 },
  { scene: 'ch3-no-news', month: 4, week: 1 },
  { scene: 'ch3-new-project', month: 4, week: 1 },
  { scene: 'ch3-dragon', month: 4, week: 2 },
  { scene: 'ch3-chart', month: 4, week: 3 },
  { scene: 'ch3-other-offer', month: 4, week: 4 },
  { scene: 'ch3-promise', month: 4 },
  { scene: 'ch4-second-tranche', month: 5, week: 1 },
  { scene: 'ch4-khoa-stairs', month: 5, week: 2 },
  { scene: 'ch4-khoa-leaves', month: 5, week: 3 },
  { scene: 'ch4-borrowing', month: 5, week: 3 },
  { scene: 'ch4-different-debts', month: 5, week: 4 },
  { scene: 'ch4-date-passes', month: 5 },
  { scene: 'ch4-group', month: 6, week: 1 },
  { scene: 'ch4-roger-crack', month: 6, week: 1 },
  { scene: 'ch4-the-dollars', month: 6, week: 2 },
  { scene: 'ch4-dan-doubts', month: 6, week: 3 },
  { scene: 'ch4-kpi-held', month: 6, week: 4 },
  { scene: 'ch4-performance-review', month: 6, week: 4 },
  { scene: 'ch4-six-months', month: 6 },
  { scene: 'ch5-compare', month: 7, week: 1 },
  {
    scene: 'ch5-wrong-number',
    month: 7,
    week: 1,
    requires: { type: 'flag', flag: 'joinedGroup' },
  },
  { scene: 'ch5-choose-way', month: 7, week: 2 },
  { scene: 'ch5-company-reply', month: 7, week: 3 },
  { scene: 'ch5-closed-door', month: 7, week: 3 },
  { scene: 'ch5-offer', month: 7, week: 4 },
  { scene: 'ch5-payday', month: 7 },
  { scene: 'ch6-empty-office', month: 8, week: 1 },
  { scene: 'ch6-last-day', month: 8, week: 1 },
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
