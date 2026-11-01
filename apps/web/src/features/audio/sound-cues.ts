import { chapterOf } from '@cstar/content';
import type { GameAction, GameState } from '@cstar/game-core';

export type SoundCue =
  | 'ting'
  | 'paper'
  | 'ending'
  | 'tap'
  | 'denied'
  | 'choose'
  | 'warm'
  | 'sour'
  | 'coins'
  | 'debt'
  | 'file'
  | 'leave'
  | 'keys'
  | 'rest'
  | 'chat'
  | 'right'
  | 'wrong'
  | 'chapter'
  | 'alarm'
  | 'step';

/** Each way to spend a turn sounds like what it is. */
const ACTION_CUES: Readonly<Record<string, SoundCue>> = {
  work: 'keys',
  'side-gig': 'coins',
  rest: 'rest',
  chat: 'chat',
  investigate: 'file',
};

const trust = (state: GameState) =>
  Object.values(state.relations).reduce((sum, value) => sum + value, 0);

const isCrisis = (state: GameState) => state.story.sceneId?.startsWith('crisis-') ?? false;

/** What a choice did to the player, heard before it is read. */
const choiceCue = (before: GameState, after: GameState): SoundCue => {
  if (after.story.flags.runOver && !before.story.flags.runOver) {
    return 'leave';
  }
  if (after.money.loans > before.money.loans) {
    return 'debt';
  }
  if (after.money.cash > before.money.cash) {
    return 'coins';
  }
  if (after.evidence.length > before.evidence.length) {
    return 'file';
  }
  if (after.mood.stress > before.mood.stress) {
    return 'sour';
  }
  if (after.mood.stress < before.mood.stress || trust(after) > trust(before)) {
    return 'warm';
  }
  return trust(after) < trust(before) ? 'sour' : 'choose';
};

/**
 * What a change of state sounds like. The bank's "ting" means money actually arrived, so a payday
 * with no salary makes no sound at all: that silence is the point (GDD §7).
 */
export const cueFor = (
  before: GameState | null,
  after: GameState,
  action: GameAction | null = null,
): SoundCue | null => {
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
  if (isCrisis(after) && !isCrisis(before)) {
    return 'alarm';
  }
  const chapter = chapterOf(after.story.sceneId);
  if (chapter && chapter.number !== chapterOf(before.story.sceneId)?.number) {
    return 'chapter';
  }
  switch (action?.type) {
    case 'takeAction':
      return ACTION_CUES[action.actionId] ?? 'choose';
    case 'answerTicket':
      return after.kpiRound?.last?.correct ? 'right' : 'wrong';
    case 'choose':
      return choiceCue(before, after);
    case 'closePayslip':
      return 'paper';
    default:
      return null;
  }
};
