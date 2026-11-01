import type { GameRules } from '../calendar/world-types.js';
import type { GameState } from './game-state.js';

export interface LedgerRow {
  month: number;
  due: number;
  paid: number;
}

/** A relationship still worth a message after it is all over. */
const STILL_IN_TOUCH = 15;

/** The months the payroll has been through: the current one counts from its payslip on. */
const settledMonths = (state: GameState) =>
  state.payslip?.month === state.calendar.month ? state.calendar.month : state.calendar.month - 1;

const totalPaid = (state: GameState) =>
  Object.values(state.paidByMonth).reduce((sum, paid) => sum + paid, 0);

/**
 * Month by month: what the contract said, and how much of it has arrived. Money goes to the oldest
 * unpaid month, as the transfers say ("LUONG T2"), so the rows add up to the company's debt.
 */
export const ledgerOf = (state: GameState, rules: GameRules): LedgerRow[] => {
  let left = totalPaid(state);
  return Array.from({ length: settledMonths(state) }, (_, index) => {
    const paid = Math.min(left, rules.salary);
    left -= paid;
    return { month: index + 1, due: rules.salary, paid };
  });
};

/** The contract's KPI money, from the second month on: only the first was ever paid. */
export const heldKpiOf = (state: GameState, rules: GameRules): number =>
  Math.max(0, settledMonths(state) - 1) * rules.salary * rules.kpiShare;

export interface RunSummary {
  months: number;
  received: number;
  stillOwed: number;
  heldKpi: number;
  promisesHeard: number;
  papers: number;
  stillInTouch: number;
}

/** The last page of a run: what the months cost, in numbers. */
export const summaryOf = (state: GameState, rules: GameRules): RunSummary => {
  const ledger = ledgerOf(state, rules);
  const stillOwed = state.money.companyDebt;
  return {
    months: ledger.length,
    // The first month's KPI is the only one ever paid, and it never was a debt.
    received: totalPaid(state) + (ledger.length > 0 ? rules.salary * rules.kpiShare : 0),
    stillOwed,
    heldKpi: stillOwed > 0 ? heldKpiOf(state, rules) : 0,
    promisesHeard: ledger.filter(({ due, paid }) => paid < due).length,
    papers: state.evidence.length,
    stillInTouch: Object.values(state.relations).filter((value) => value >= STILL_IN_TOUCH).length,
  };
};
