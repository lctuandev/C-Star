import { describe, expect, it } from 'vitest';
import { testWorld } from '../test-world.fixture.js';
import { heldKpiOf, ledgerOf, summaryOf } from './ledger.js';
import { createGameState } from './game-state.js';
import type { GameState } from './game-state.js';

const { rules } = testWorld;

const after = (month: number, change: Partial<GameState> = {}): GameState => {
  const state = createGameState(1, rules);
  return { ...state, calendar: { ...state.calendar, month }, ...change };
};

describe('the ledger', () => {
  it('lists nothing before the first payday', () => {
    expect(ledgerOf(after(1), rules)).toEqual([]);
  });

  it('shows what each month was due and what came', () => {
    const rows = ledgerOf(after(3, { paidByMonth: { 1: rules.salary, 2: 5 } }), rules);
    expect(rows).toEqual([
      { month: 1, due: rules.salary, paid: rules.salary },
      { month: 2, due: rules.salary, paid: 5 },
    ]);
  });

  it('puts late money on the oldest unpaid month, as the transfers say', () => {
    const paid = { 1: rules.salary, 3: rules.salary - 5, 5: 7 };
    const rows = ledgerOf(after(5, { paidByMonth: paid }), rules);
    expect(rows.map((row) => row.paid)).toEqual([rules.salary, rules.salary, 2, 0]);
  });

  it('counts the month in progress once its payslip is out', () => {
    const slip = { month: 3 } as GameState['payslip'];
    expect(ledgerOf(after(3, { payslip: slip }), rules)).toHaveLength(3);
  });

  it('holds the KPI of every month after the first', () => {
    expect(heldKpiOf(after(2), rules)).toBe(0);
    expect(heldKpiOf(after(4), rules)).toBe(2 * rules.salary * rules.kpiShare);
  });
});

describe('the last page of a run', () => {
  it('adds up what the months cost', () => {
    const state = after(4, {
      paidByMonth: { 1: rules.salary },
      evidence: ['a', 'b'],
      relations: { dan: 20, uyen: 5, boss: -30 },
      money: { cash: 0, arrears: 0, loans: 0, companyDebt: 9 },
    });
    expect(summaryOf(state, rules)).toEqual({
      months: 3,
      received: rules.salary * (1 + rules.kpiShare),
      stillOwed: 9,
      heldKpi: 2 * rules.salary * rules.kpiShare,
      promisesHeard: 2,
      papers: 2,
      stillInTouch: 1,
    });
  });

  it('counts the settlement an ending pays after the last payday', () => {
    const state = after(8, {
      paidByMonth: { 1: rules.salary, 8: 90 },
      money: { cash: 0, arrears: 0, loans: 0, companyDebt: 0 },
    });
    expect(summaryOf(state, rules).received).toBe(rules.salary * (1 + rules.kpiShare) + 90);
  });

  it('does not call KPI held once the company owes nothing', () => {
    const state = after(8, { money: { cash: 0, arrears: 0, loans: 0, companyDebt: 0 } });
    expect(summaryOf(state, rules).heldKpi).toBe(0);
  });
});
