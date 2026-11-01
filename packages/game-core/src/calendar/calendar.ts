import { drawRandom } from '../rng/seeded-rng.js';
import type { GameState, PayslipLine } from '../state/game-state.js';
import { meets } from '../story/conditions.js';
import {
  applyEffects,
  withMood,
  withOutlook,
  withPayment,
  withRelation,
} from '../story/effects.js';
import { startScene } from '../story/story-engine.js';
import type { Effect } from '../story/story-types.js';
import { roundIsOver, startKpiRound } from './tickets.js';
import type { EndingRule, GameWorld, WeeklyAction } from './world-types.js';

export interface ActionView {
  id: string;
  label: string;
  hint: string;
  /** What it costs and pays: the screen spells it out. */
  effects: readonly Effect[];
  available: boolean;
  lockedReason?: string;
}

const isOffered = (state: GameState, action: WeeklyAction) =>
  action.appearsWhen === undefined || meets(state, action.appearsWhen);

const isOpen = (state: GameState, action: WeeklyAction) =>
  isOffered(state, action) && (action.requires === undefined || meets(state, action.requires));

export const weekActions = (state: GameState, world: GameWorld): ActionView[] =>
  world.actions
    .filter((action) => isOffered(state, action))
    .map((action) => {
      const available = isOpen(state, action);
      return {
        id: action.id,
        label: action.label,
        hint: action.hint,
        effects: action.effects,
        available,
        ...(!available && { lockedReason: action.lockedReason }),
      };
    });

export const kpiTargetOf = (world: GameWorld, month: number): number =>
  world.rules.kpiTargets[month - 1] ?? 0;

/** A scene sets this flag on the last decision of a run. */
export const RUN_OVER_FLAG = 'runOver';

export const selectEnding = (state: GameState, world: GameWorld): EndingRule => {
  const rule = world.endings.find(({ when }) => when === undefined || meets(state, when));
  if (!rule) {
    throw new Error('No ending rule holds: the content validator should catch this.');
  }
  return rule;
};

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

const dueCrisis = (state: GameState, world: GameWorld) =>
  world.crises.find(
    (crisis) =>
      state.crises[crisis.id]?.lastMonth !== state.calendar.month && meets(state, crisis.when),
  );

const playScene = (state: GameState, world: GameWorld, sceneId: string): GameState => ({
  ...startScene(state, world.story, sceneId, world.evidence),
  phase: 'scene',
});

const concludeRun = (state: GameState, world: GameWorld): GameState => {
  const rule = world.endings.find(({ id }) => id === state.ending) ?? selectEnding(state, world);
  return state.story.seenScenes.includes(rule.scene)
    ? { ...state, phase: 'ended' }
    : playScene({ ...state, ending: rule.id }, world, rule.scene);
};

/** Plays what is due now, or moves to what the calendar is waiting for. */
export const continueCalendar = (state: GameState, world: GameWorld): GameState => {
  if (state.story.flags[RUN_OVER_FLAG]) {
    return concludeRun(state, world);
  }
  // Not on payday: the slip comes first, and it may settle what the crisis is about.
  const crisis = state.calendar.payday ? undefined : dueCrisis(state, world);
  if (crisis) {
    const count = (state.crises[crisis.id]?.count ?? 0) + 1;
    const record = { count, lastMonth: state.calendar.month };
    const marked = { ...state, crises: { ...state.crises, [crisis.id]: record } };
    return playScene(marked, world, crisis.scene);
  }
  const beat = dueBeat(state, world);
  if (beat) {
    return playScene(state, world, beat.scene);
  }
  if (state.calendar.payday) {
    return { ...state, phase: 'payslip' };
  }
  // A burnout can take the rest of a week away while a scene plays.
  return state.calendar.actionsLeft > 0 ? { ...state, phase: 'week' } : endWeek(state, world);
};

const pickOutcome = (state: GameState, outcomes: readonly string[]): GameState => {
  const { value, next } = drawRandom(state.rng);
  const line = outcomes[Math.floor(value * outcomes.length)] ?? null;
  return { ...state, rng: next, lastOutcome: line };
};

/** The month's target, if there is one: the boss notices either way. */
const settleKpi = (state: GameState, world: GameWorld, target: number): GameState => {
  if (target === 0) {
    return state;
  }
  const { kpiMissStress, kpiTrust } = world.rules;
  return state.kpi >= target
    ? withRelation(state, 'boss', kpiTrust)
    : withRelation(withMood(state, { stress: kpiMissStress }), 'boss', -kpiTrust);
};

const TRUST_LOST_PER_MISSED_SALARY = 8;

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
    loans: state.money.loans,
    companyDebt: state.money.companyDebt + salary - salaryPaid,
  };

  const target = kpiTargetOf(world, month);
  const recorded = salaryPaid > 0 ? withPayment(state, salaryPaid) : state;
  const unpaid =
    salaryPaid < salary
      ? withOutlook(withMood(recorded, { stress: unpaidStress }), {
          trust: -TRUST_LOST_PER_MISSED_SALARY,
        })
      : recorded;
  return {
    ...settleKpi(unpaid, world, target),
    rng: pick.next,
    money,
    payslip: {
      month,
      salaryDue: salary,
      salaryPaid,
      bills,
      ...money,
      kpi: target > 0 ? { points: state.kpi, target } : null,
    },
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

/** The action counts: its line is picked, the turn is spent, and the calendar moves. */
const finishAction = (
  state: GameState,
  world: GameWorld,
  action: WeeklyAction,
  evidenceBefore: number,
): GameState => {
  const owed = state.money.companyDebt > 0 ? (action.outcomesOnceOwed ?? []) : [];
  const situational = (action.outcomesWhen ?? [])
    .filter(({ when }) => meets(state, when))
    .flatMap(({ lines }) => lines);
  const told = pickOutcome(state, [...action.outcomes, ...owed, ...situational]);
  const found = world.evidence.find(({ id }) => id === told.evidence[evidenceBefore]);
  return continueCalendar(
    {
      ...told,
      phase: 'week',
      kpiRound: null,
      lastOutcome: found ? `Bạn lưu lại: ${found.title}.` : told.lastOutcome,
      calendar: { ...told.calendar, actionsLeft: told.calendar.actionsLeft - 1 },
    },
    world,
  );
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
  const acted = applyEffects(state, action.effects, world.evidence);
  return action.tickets
    ? startKpiRound(acted, world, action.id)
    : finishAction(acted, world, action, state.evidence.length);
};

const closeRound = (state: GameState, world: GameWorld, points: number): GameState | null => {
  const action = world.actions.find(({ id }) => id === state.kpiRound?.actionId);
  if (state.phase !== 'kpi' || !action) {
    return null;
  }
  return finishAction({ ...state, kpi: state.kpi + points }, world, action, state.evidence.length);
};

/** Back to the week once the last reply has been read. */
export const finishKpiRound = (state: GameState, world: GameWorld): GameState | null => {
  const round = state.kpiRound;
  return round && roundIsOver(round) ? closeRound(state, world, round.score) : null;
};

/** "Làm cho có": the round is skipped, for fewer points. */
export const skipKpiRound = (state: GameState, world: GameWorld): GameState | null =>
  state.kpiRound ? closeRound(state, world, world.rules.quickTaskPoints) : null;

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
  return continueCalendar({ ...state, calendar, kpi: 0, payslip: null, lastOutcome: null }, world);
};
