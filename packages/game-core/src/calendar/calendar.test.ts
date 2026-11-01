import { describe, expect, it } from 'vitest';
import { applyAction, beginRun, replay } from '../actions/apply-action.js';
import type { GameAction } from '../actions/apply-action.js';
import type { GameState } from '../state/game-state.js';
import { testWorld as world } from '../test-world.fixture.js';
import { weekActions } from './calendar.js';
import type { GameWorld } from './world-types.js';

const intoTheWeek: GameAction[] = [
  { type: 'advance' },
  { type: 'choose', choiceId: 'polite' },
  { type: 'advance' },
];
const act = (actionId: string): GameAction => ({ type: 'takeAction', actionId });
const advance: GameAction = { type: 'advance' };
const closePayslip: GameAction = { type: 'closePayslip' };

/** Two actions a week, a scene at week two, a scene on payday. */
const toPayslip = [
  ...intoTheWeek,
  act('rest'),
  act('rest'),
  advance,
  act('rest'),
  act('rest'),
  advance,
];

const week = (seed = 1, game = world) => replay(seed, intoTheWeek, game);

describe('the week (SCENARIO-024)', () => {
  it('starts with the actions of the week', () => {
    expect(week().phase).toBe('week');
    expect(week().calendar).toEqual({ month: 1, week: 1, actionsLeft: 2, payday: false });
  });

  it('takes an action: it counts, it costs, it says something', () => {
    const state = replay(1, [...intoTheWeek, act('work')], world);
    expect(state.calendar.actionsLeft).toBe(1);
    expect(state.mood).toEqual({ energy: 30, stress: 25 });
    expect(state.lastOutcome).toBe('Xong một task.');
  });

  it('moves to the next week only when the actions are used', () => {
    const state = replay(1, [...intoTheWeek, act('rest'), act('rest')], world);
    expect(state.calendar).toMatchObject({ week: 2, actionsLeft: 2 });
  });

  it('gives a week’s sleep', () => {
    const state = replay(1, [...intoTheWeek, act('work'), act('work')], world);
    expect(state.mood.energy).toBe(20);
  });

  it('refuses an action that does not exist, or outside the week', () => {
    const refused = (state: GameState, action: GameAction) => {
      const result = applyAction(state, action, world);
      expect(result.ok).toBe(false);
      expect(result.state).toBe(state);
    };
    refused(week(), act('nope'));
    refused(beginRun(1, world), act('rest'));
    refused(replay(1, toPayslip, world), act('rest'));
  });

  it('locks an action with its reason, and leaves another open', () => {
    const tired: GameState = { ...week(), mood: { energy: 10, stress: 0 } };
    expect(weekActions(tired, world)).toEqual([
      {
        id: 'work',
        label: 'Làm task',
        hint: 'Tốn sức',
        available: false,
        lockedReason: 'Không còn sức',
      },
      { id: 'rest', label: 'Nghỉ', hint: 'Lấy lại sức', available: true },
      { id: 'desk', label: 'Làm ticket', hint: 'Có KPI', available: true },
      { id: 'look', label: 'Tìm hiểu', hint: 'Tìm giấy tờ', available: true },
    ]);
    expect(applyAction(tired, act('work'), world).ok).toBe(false);
    expect(applyAction(tired, act('rest'), world).ok).toBe(true);
  });
});

describe('beats (SCENARIO-025)', () => {
  it('play at their week, once', () => {
    const state = replay(1, [...intoTheWeek, act('rest'), act('rest')], world);
    expect(state.phase).toBe('scene');
    expect(state.story.sceneId).toBe('week-two');

    const after = replay(1, [...intoTheWeek, act('rest'), act('rest'), advance], world);
    expect(after.phase).toBe('week');
  });

  it('play on payday, before the slip', () => {
    const atBeat = replay(1, toPayslip.slice(0, -1), world);
    expect(atBeat.story.sceneId).toBe('pay-one');
    expect(atBeat.phase).toBe('scene');
    expect(replay(1, toPayslip, world).phase).toBe('payslip');
  });

  it('wait for their condition', () => {
    const guarded: GameWorld = {
      ...world,
      beats: [{ scene: 'week-two', month: 1, week: 2, requires: { type: 'flag', flag: 'never' } }],
    };
    const state = replay(1, [...intoTheWeek, act('rest'), act('rest')], guarded);
    expect(state.phase).toBe('week');
  });
});

describe('payday (SCENARIO-026)', () => {
  it('pays the salary and the bills', () => {
    expect(replay(1, toPayslip, world).payslip).toEqual({
      month: 1,
      salaryDue: 1_000,
      salaryPaid: 1_000,
      bills: [{ label: 'Tiền nhà', amount: 600 }],
      arrears: 0,
      cash: 1_400,
      loans: 0,
      companyDebt: 0,
      kpi: null,
    });
  });

  it('shows the same slip after a reload', () => {
    const state = replay(1, toPayslip, world);
    expect((JSON.parse(JSON.stringify(state)) as GameState).payslip).toEqual(state.payslip);
  });

  it('cannot be closed twice', () => {
    const toMonthTwo = replay(1, [...toPayslip, closePayslip], world);
    expect(toMonthTwo.calendar).toEqual({ month: 2, week: 1, actionsLeft: 2, payday: false });
    expect(toMonthTwo.payslip).toBeNull();
    expect(applyAction(toMonthTwo, closePayslip, world).ok).toBe(false);
  });

  it('writes an unpaid salary into the company’s debt, and it hurts', () => {
    const unpaid: GameWorld = { ...world, payroll: [0] };
    const state = replay(1, toPayslip, unpaid);
    expect(state.payslip).toMatchObject({ salaryPaid: 0, cash: 400, companyDebt: 1_000 });
    expect(state.mood.stress).toBe(30);
  });

  it('pays part of a salary', () => {
    const partly: GameWorld = { ...world, payroll: [0.3] };
    expect(replay(1, toPayslip, partly).payslip).toMatchObject({
      salaryPaid: 300,
      companyDebt: 700,
    });
  });

  it('keeps cash at zero and carries what is missing (SCENARIO-027)', () => {
    const broke: GameWorld = {
      ...world,
      crises: [],
      payroll: [0, 0],
      bills: [{ label: 'Tiền nhà', amount: 1_500 }],
    };
    const first = replay(1, toPayslip, broke);
    expect(first.money).toMatchObject({ cash: 0, arrears: 500 });
    expect(first.payslip?.arrears).toBe(500);

    const second = replay(
      1,
      [...toPayslip, closePayslip, act('rest'), act('rest'), act('rest'), act('rest')],
      broke,
    );
    expect(second.payslip?.bills).toEqual([
      { label: 'Còn thiếu từ trước', amount: 500 },
      { label: 'Tiền nhà', amount: 1_500 },
    ]);
    expect(second.money).toMatchObject({ cash: 0, arrears: 2_000 });
  });

  it('pays arrears first when money comes', () => {
    const late: GameWorld = {
      ...world,
      crises: [],
      payroll: [0, 5],
      bills: [{ label: 'Tiền nhà', amount: 1_500 }],
    };
    const state = replay(
      1,
      [...toPayslip, closePayslip, act('rest'), act('rest'), act('rest'), act('rest')],
      late,
    );
    expect(state.money).toMatchObject({ cash: 3_000, arrears: 0 });
  });

  it('draws a surprise bill from the seed', () => {
    const unlucky: GameWorld = {
      ...world,
      rules: { ...world.rules, surpriseChance: 1 },
    };
    const state = replay(1, toPayslip, unlucky);
    expect(state.payslip?.bills).toEqual([
      { label: 'Tiền nhà', amount: 600 },
      { label: 'Hỏng xe', amount: 300 },
    ]);
    expect(replay(1, toPayslip, unlucky)).toEqual(state);
  });

  it('ends where the content ends', () => {
    const state = replay(
      1,
      [
        ...toPayslip,
        closePayslip,
        act('rest'),
        act('rest'),
        act('rest'),
        act('rest'),
        closePayslip,
      ],
      world,
    );
    expect(state.phase).toBe('ended');
    expect(applyAction(state, act('rest'), world).ok).toBe(false);
  });
});

describe('a run stays in bounds', () => {
  it('whatever the player does', () => {
    const script: GameAction[] = [...intoTheWeek];
    const names = ['work', 'rest', 'look'] as const;
    for (const seed of [1, 2, 3]) {
      let state = replay(seed, script, world);
      for (let i = 0; i < 40 && state.phase !== 'ended'; i += 1) {
        const action: GameAction =
          state.phase === 'payslip'
            ? closePayslip
            : state.phase === 'scene'
              ? advance
              : act(names[(i * seed) % 3] as string);
        const result = applyAction(state, action, world);
        state = result.ok ? result.state : applyAction(state, act('rest'), world).state;
        expect(state.money.cash).toBeGreaterThanOrEqual(0);
        expect(state.mood.energy).toBeGreaterThanOrEqual(0);
        expect(state.mood.energy).toBeLessThanOrEqual(100);
        expect(state.mood.stress).toBeLessThanOrEqual(100);
      }
      expect(state.phase).toBe('ended');
    }
  });
});
