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
  | 'step'
  | 'clap'
  | 'applause'
  | 'chair'
  | 'ask'
  | 'pen'
  | 'dishes'
  | 'send'
  | 'quiet'
  | 'sigh'
  | 'pat'
  | 'calculator'
  | 'knock'
  | 'stamp'
  | 'phone'
  | 'mouse'
  | 'page';

/** Each way to spend a turn sounds like what it is. */
const ACTION_CUES: Readonly<Record<string, SoundCue>> = {
  work: 'keys',
  'side-gig': 'coins',
  rest: 'rest',
  chat: 'chat',
  investigate: 'file',
};

/**
 * What each choice sounds like when it is taken: the thing it describes, or, where it describes
 * nothing you could hear, how it feels. A test holds every choice in the story to this list.
 */
export const CHOICE_CUES: Readonly<Record<string, SoundCue>> = {
  'accept-fast': 'mouse',
  'read-contract': 'page',
  'near-dan': 'chair',
  'near-uyen': 'chair',
  'near-khoa': 'chair',
  clap: 'clap',
  'ask-pay': 'ask',
  'look-down': 'pen',
  'treat-team': 'dishes',
  'send-home': 'send',
  'save-it': 'coins',
  'ask-straight': 'ask',
  pretend: 'page',
  'ask-public': 'send',
  'ask-private': 'chat',
  'stay-quiet': 'quiet',
  'ask-salary': 'ask',
  volunteer: 'applause',
  quiet: 'pen',
  'start-notes': 'pen',
  'not-yet': 'sigh',
  'thank-minh': 'file',
  'side-with-tin': 'pat',
  lend: 'coins',
  sorry: 'sigh',
  'back-uyen': 'ask',
  'back-boss': 'pat',
  'stay-fish': 'quiet',
  'join-dragons': 'pen',
  'stay-on': 'sigh',
  'walk-now': 'leave',
  'keep-it': 'quiet',
  share: 'warm',
  join: 'warm',
  decline: 'sigh',
  'do-the-math': 'calculator',
  'write-it-down': 'pen',
  cheer: 'applause',
  'invite-dan': 'chat',
  comfort: 'pat',
  act: 'stamp',
  wait: 'sigh',
  formal: 'send',
  advice: 'knock',
  talk: 'knock',
  'take-title': 'dishes',
  'refuse-title': 'stamp',
  pursue: 'stamp',
  leave: 'leave',
  stay: 'sigh',
  borrow: 'debt',
  sell: 'coins',
  'call-home': 'phone',
  credit: 'debt',
  quit: 'leave',
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
      return CHOICE_CUES[action.choiceId] ?? choiceCue(before, after);
    case 'skipTickets':
      return 'sigh';
    case 'closePayslip':
      return 'paper';
    default:
      return null;
  }
};
