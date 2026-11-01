import { drawRandom } from '../rng/seeded-rng.js';
import type { GameState, Money, Mood } from '../state/game-state.js';
import type { Effect } from './story-types.js';

const MOOD_MAX = 100;

const clampMood = (value: number) => Math.min(MOOD_MAX, Math.max(0, value));

export const withMood = (state: GameState, change: Partial<Mood>): GameState => ({
  ...state,
  mood: {
    energy: clampMood(state.mood.energy + (change.energy ?? 0)),
    stress: clampMood(state.mood.stress + (change.stress ?? 0)),
  },
});

const changeCash = (money: Money, amount: number): Money => {
  const cash = money.cash + amount;
  return cash >= 0 ? { ...money, cash } : { ...money, cash: 0, arrears: money.arrears - cash };
};

const companyPays = (money: Money, amount: number): Money => {
  const paid = Math.min(amount, money.companyDebt);
  return { ...money, cash: money.cash + paid, companyDebt: money.companyDebt - paid };
};

const applyEffect = (state: GameState, effect: Effect): GameState => {
  switch (effect.type) {
    case 'setFlag':
      return {
        ...state,
        story: {
          ...state.story,
          flags: { ...state.story.flags, [effect.flag]: effect.value ?? true },
        },
      };
    case 'addCash':
      return { ...state, money: changeCash(state.money, effect.amount) };
    case 'companyPays':
      return { ...state, money: companyPays(state.money, effect.amount) };
    case 'addEnergy':
      return withMood(state, { energy: effect.amount });
    case 'addStress':
      return withMood(state, { stress: effect.amount });
    case 'chance': {
      const { value, next } = drawRandom(state.rng);
      return applyEffects(
        { ...state, rng: next },
        value < effect.chance ? effect.then : effect.otherwise,
      );
    }
  }
};

export const applyEffects = (state: GameState, effects: readonly Effect[] = []): GameState =>
  effects.reduce(applyEffect, state);
