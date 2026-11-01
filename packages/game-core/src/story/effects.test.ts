import { describe, expect, it } from 'vitest';
import { beginRun } from '../actions/apply-action.js';
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
