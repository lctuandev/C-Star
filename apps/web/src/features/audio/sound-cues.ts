import type { GameState } from '@cstar/game-core';

export type SoundCue = 'ting' | 'paper' | 'ending';

/**
 * What a change of state sounds like. The bank's "ting" means money actually arrived, so a payday
 * with no salary makes no sound at all: that silence is the point (GDD §7).
 */
export const cueFor = (before: GameState | null, after: GameState): SoundCue | null => {
  if (!before) {
    return null;
  }
  if (before.phase !== 'ended' && after.phase === 'ended') {
    return 'ending';
  }
  const paidByCompany = before.money.companyDebt > after.money.companyDebt;
  const salaryCame = !before.payslip && (after.payslip?.salaryPaid ?? 0) > 0;
  if (paidByCompany || salaryCame) {
    return 'ting';
  }
  if (before.phase !== 'payslip' && after.phase === 'payslip') {
    return 'paper';
  }
  return null;
};
