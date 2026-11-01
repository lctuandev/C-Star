import { drawRandom } from '../rng/seeded-rng.js';
import type { GameState, PayslipLine } from '../state/game-state.js';
import { meets } from '../story/conditions.js';
import { applyEffects, withMood } from '../story/effects.js';
import { startScene } from '../story/story-engine.js';
import type { GameWorld, WeeklyAction } from './world-types.js';

export interface ActionView {
  id: string;
  label: string;
  hint: string;
  available: boolean;
  lockedReason?: string;
}

const isOpen = (state: GameState, action: WeeklyAction) =>
  action.requires === undefined || meets(state, action.requires);

export const weekActions = (state: GameState, world: GameWorld): ActionView[] =>
  world.actions.map((action) => {
    const available = isOpen(state, action);
    return {
      id: action.id,
      label: action.label,
      hint: action.hint,
      available,
      ...(!available && { lockedReason: action.lockedReason }),
    };
  });

const dueBeat = (state: GameState, world: GameWorld) => {
  const { month, week, payday } = state.calendar;
  return world.beats.find(
    (beat) =>
      beat.month === month &&
      (payday ? beat.week === undefined : beat.week === week) &&
      !state.story.seenScenes.includes(beat.scene) &&
      (beat.requires === undefined || meets(state, beat.requires)),
  );
};

/** Plays what is due now, or moves to what the calendar is waiting for. */
export const continueCalendar = (state: GameState, world: GameWorld): GameState => {
  const beat = dueBeat(state, world);
  if (beat) {
    return { ...startScene(state, world.story, beat.scene), phase: 'scene' };
  }
  return { ...state, phase: state.calendar.payday ? 'payslip' : 'week' };
};

const pickOutcome = (state: GameState, outcomes: readonly string[]): GameState => {
  const { value, next } = drawRandom(state.rng);
  const line = outcomes[Math.floor(value * outcomes.length)] ?? null;
  return { ...state, rng: next, lastOutcome: line };
};

/** Pays what can be paid and writes the slip. Arrears come back on the next one. */
const settlePayday = (state: GameState, world: GameWorld): GameState => {
  const { month } = state.calendar;
  const { salary, surpriseChance, unpaidStress } = world.rules;
  const salaryPaid = Math.round(salary * (world.payroll[month - 1] ?? 0));

  const roll = drawRandom(state.rng);
  const pick = drawRandom(roll.next);
  const surprise =
    roll.value < surpriseChance
      ? world.surprises[Math.floor(pick.value * world.surprises.length)]
      : undefined;

  const bills: PayslipLine[] = [
    ...(state.money.arrears > 0
      ? [{ label: 'Còn thiếu từ trước', amount: state.money.arrears }]
      : []),
    ...world.bills,
    ...(surprise ? [surprise] : []),
  ];
  const owed = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const available = state.money.cash + salaryPaid;
  const paid = Math.min(available, owed);
  const money = {
    cash: available - paid,
    arrears: owed - paid,
    companyDebt: state.money.companyDebt + salary - salaryPaid,
  };

  const settled = salaryPaid < salary ? withMood(state, { stress: unpaidStress }) : state;
  return {
    ...settled,
    rng: pick.next,
    money,
    payslip: { month, salaryDue: salary, salaryPaid, bills, ...money },
  };
};

const endWeek = (state: GameState, world: GameWorld): GameState => {
  const { rules } = world;
  const rested = withMood(state, { energy: rules.weeklyEnergyRecovery });
  const { week } = rested.calendar;
  if (week < rules.weeksPerMonth) {
    const calendar = { ...rested.calendar, week: week + 1, actionsLeft: rules.actionsPerWeek };
    return continueCalendar({ ...rested, calendar }, world);
  }
  const calendar = { ...rested.calendar, actionsLeft: 0, payday: true };
  return continueCalendar(settlePayday({ ...rested, calendar }, world), world);
};

export const takeWeeklyAction = (
  state: GameState,
  world: GameWorld,
  actionId: string,
): GameState | null => {
  const action = world.actions.find(({ id }) => id === actionId);
  if (state.phase !== 'week' || !action || !isOpen(state, action)) {
    return null;
  }
  const acted = pickOutcome(applyEffects(state, action.effects), action.outcomes);
  const actionsLeft = acted.calendar.actionsLeft - 1;
  const counted = { ...acted, calendar: { ...acted.calendar, actionsLeft } };
  return actionsLeft > 0 ? counted : endWeek(counted, world);
};

/** The slip is closed: the next month, or the end of what exists. */
export const closePayslip = (state: GameState, world: GameWorld): GameState | null => {
  if (state.phase !== 'payslip') {
    return null;
  }
  const { rules } = world;
  if (state.calendar.month >= rules.lastMonth) {
    return { ...state, phase: 'ended' };
  }
  const calendar = {
    month: state.calendar.month + 1,
    week: 1,
    actionsLeft: rules.actionsPerWeek,
    payday: false,
  };
  return continueCalendar({ ...state, calendar, payslip: null, lastOutcome: null }, world);
};
