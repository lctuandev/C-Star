import { describe, expect, it } from 'vitest';
import { createGameState } from '../state/game-state.js';
import type { GameState } from '../state/game-state.js';
import { meets } from './conditions.js';
import type { Condition } from './story-types.js';

const withFlags = (flags: Record<string, boolean>): GameState => {
  const state = createGameState(1);
  return { ...state, story: { ...state.story, flags } };
};

const a: Condition = { type: 'flag', flag: 'a' };
const b: Condition = { type: 'flag', flag: 'b' };

describe('meets', () => {
  it('reads a flag; a flag never set or set false is not met', () => {
    expect(meets(withFlags({ a: true }), a)).toBe(true);
    expect(meets(withFlags({}), a)).toBe(false);
    expect(meets(withFlags({ a: false }), a)).toBe(false);
  });

  it('combines', () => {
    const state = withFlags({ a: true });
    expect(meets(state, { type: 'not', condition: b })).toBe(true);
    expect(meets(state, { type: 'all', conditions: [a, b] })).toBe(false);
    expect(meets(state, { type: 'any', conditions: [a, b] })).toBe(true);
  });
});
