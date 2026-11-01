import { describe, expect, it } from 'vitest';
import { beginRun } from '../actions/apply-action.js';
import type { GameState } from '../state/game-state.js';
import { testWorld as world } from '../test-world.fixture.js';
import { applyEffects } from './effects.js';
import type { Effect } from './story-types.js';

const state = beginRun(1, world);

describe('money effects (SCENARIO-027)', () => {
  it('spends and earns', () => {
    expect(applyEffects(state, [{ type: 'addCash', amount: -200 }]).money.cash).toBe(800);
    expect(applyEffects(state, [{ type: 'addCash', amount: 200 }]).money.cash).toBe(1_200);
  });

  it('never goes below zero: what is missing goes to arrears', () => {
    expect(applyEffects(state, [{ type: 'addCash', amount: -1_500 }]).money).toEqual({
      cash: 0,
      arrears: 500,
      loans: 0,
      companyDebt: 0,
    });
  });

  it('lets the company pay no more than it owes', () => {
    const owed = { ...state, money: { ...state.money, companyDebt: 300 } };
    expect(applyEffects(owed, [{ type: 'companyPays', amount: 200 }]).money).toMatchObject({
      cash: 1_200,
      companyDebt: 100,
    });
    expect(applyEffects(owed, [{ type: 'companyPays', amount: 900 }]).money).toMatchObject({
      cash: 1_300,
      companyDebt: 0,
    });
  });
});

describe('mood effects (SCENARIO-028)', () => {
  it('stay between 0 and 100', () => {
    expect(applyEffects(state, [{ type: 'addEnergy', amount: 500 }]).mood.energy).toBe(100);
    expect(applyEffects(state, [{ type: 'addEnergy', amount: -500 }]).mood.energy).toBe(0);
    expect(applyEffects(state, [{ type: 'addStress', amount: 500 }]).mood.stress).toBe(100);
    expect(applyEffects(state, [{ type: 'addStress', amount: -500 }]).mood.stress).toBe(0);
  });
});

describe('relations (SCENARIO-037)', () => {
  it('start at zero, add up, and stay between -100 and 100', () => {
    const once = applyEffects(state, [{ type: 'addRelation', npc: 'boss', amount: 30 }]);
    expect(once.relations.boss).toBe(30);
    const again = applyEffects(once, [{ type: 'addRelation', npc: 'boss', amount: 500 }]);
    expect(again.relations.boss).toBe(100);
    const fallen = applyEffects(state, [{ type: 'addRelation', npc: 'hr', amount: -500 }]);
    expect(fallen.relations.hr).toBe(-100);
  });
});

describe('evidence (SCENARIO-039)', () => {
  it('counts each paper once', () => {
    const effects: Effect[] = [
      { type: 'addEvidence', evidence: 'contract' },
      { type: 'addEvidence', evidence: 'contract' },
    ];
    expect(applyEffects(state, effects).evidence).toEqual(['contract']);
  });

  it('finds the next paper the month allows', () => {
    const find: Effect[] = [{ type: 'findEvidence' }];
    const first = applyEffects(state, find, world.evidence);
    expect(first.evidence).toEqual(['contract']);
    expect(applyEffects(first, find, world.evidence).evidence).toEqual(['contract', 'early']);
  });

  it('skips what is not there yet, or no longer', () => {
    const inMonthOne: GameState = { ...state, evidence: ['contract', 'early'] };
    const find: Effect[] = [{ type: 'findEvidence' }];
    expect(applyEffects(inMonthOne, find, world.evidence).evidence).toHaveLength(2);

    const later: GameState = {
      ...state,
      evidence: ['contract'],
      calendar: { ...state.calendar, month: 2 },
    };
    expect(applyEffects(later, find, world.evidence).evidence).toEqual(['contract', 'late']);
  });
});

describe('loans and arrears (SCENARIO-040)', () => {
  it('a loan is cash now, and written down', () => {
    expect(applyEffects(state, [{ type: 'takeLoan', amount: 500 }]).money).toMatchObject({
      cash: 1_500,
      loans: 500,
    });
  });

  it('pays arrears as far as cash goes', () => {
    const behind = { ...state, money: { ...state.money, cash: 300, arrears: 500 } };
    expect(applyEffects(behind, [{ type: 'payArrears' }]).money).toMatchObject({
      cash: 0,
      arrears: 200,
    });
  });
});

describe('chance', () => {
  const lucky = { type: 'setFlag', flag: 'lucky' } as const;
  const unlucky = { type: 'setFlag', flag: 'unlucky' } as const;

  it('takes the sure side', () => {
    const sure = applyEffects(state, [{ type: 'chance', chance: 1, then: [lucky] }]);
    expect(sure.story.flags.lucky).toBe(true);
    const never = applyEffects(state, [
      { type: 'chance', chance: 0, then: [lucky], otherwise: [unlucky] },
    ]);
    expect(never.story.flags).toEqual({ unlucky: true });
  });

  it('moves the RNG, the same way every time', () => {
    const effect: Effect[] = [{ type: 'chance', chance: 0.5, then: [lucky] }];
    expect(applyEffects(state, effect).rng).not.toBe(state.rng);
    expect(applyEffects(state, effect)).toEqual(applyEffects(state, effect));
  });
});
