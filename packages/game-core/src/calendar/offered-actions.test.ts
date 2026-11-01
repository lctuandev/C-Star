import { describe, expect, it } from 'vitest';
import { applyAction } from '../actions/apply-action.js';
import { createGameState } from '../state/game-state.js';
import type { GameState } from '../state/game-state.js';
import { testWorld } from '../test-world.fixture.js';
import { weekActions } from './calendar.js';
import type { GameWorld } from './world-types.js';

const LATE_LINE = 'Vẫn chưa có lương.';

const world: GameWorld = {
  ...testWorld,
  actions: [
    {
      id: 'always',
      label: 'Luôn có',
      hint: 'x',
      effects: [],
      outcomes: ['Bình thường.'],
      outcomesOnceOwed: [LATE_LINE],
    },
    {
      id: 'later',
      label: 'Về sau',
      hint: 'x',
      appearsWhen: { type: 'stat', stat: 'companyDebt', min: 1 },
      effects: [],
      outcomes: ['Có việc.'],
    },
  ],
};

const week = (companyDebt: number): GameState => {
  const state = createGameState(1, world.rules);
  return { ...state, phase: 'week', money: { ...state.money, companyDebt } };
};

describe('what the week offers (SCENARIO-086)', () => {
  it('leaves out what the story has not reached', () => {
    expect(weekActions(week(0), world).map(({ id }) => id)).toEqual(['always']);
  });

  it('brings it in once it has', () => {
    expect(weekActions(week(1), world).map(({ id }) => id)).toEqual(['always', 'later']);
  });

  it('refuses it even if something asks for it directly', () => {
    expect(applyAction(week(0), { type: 'takeAction', actionId: 'later' }, world).ok).toBe(false);
  });

  it('never tells a story of late pay before pay is late', () => {
    for (let seed = 0; seed < 40; seed += 1) {
      const start = { ...week(0), rng: seed };
      const { state } = applyAction(start, { type: 'takeAction', actionId: 'always' }, world);
      expect(state.lastOutcome).not.toBe(LATE_LINE);
    }
  });

  it('tells it afterwards', () => {
    const lines = Array.from({ length: 40 }, (_, seed) => {
      const start = { ...week(1), rng: seed * 7919 };
      return applyAction(start, { type: 'takeAction', actionId: 'always' }, world).state
        .lastOutcome;
    });
    expect(lines).toContain(LATE_LINE);
  });
});
