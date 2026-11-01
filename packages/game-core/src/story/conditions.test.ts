import { describe, expect, it } from 'vitest';
import { beginRun } from '../actions/apply-action.js';
import type { GameState } from '../state/game-state.js';
import { testWorld as world } from '../test-world.fixture.js';
import { meets } from './conditions.js';
import type { Condition } from './story-types.js';

const run = beginRun(1, world);
const withFlags = (flags: Record<string, boolean>): GameState => ({
  ...run,
  story: { ...run.story, flags },
});

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

  it('compares stats, both ends included', () => {
    expect(meets(run, { type: 'stat', stat: 'cash', min: 1_000 })).toBe(true);
    expect(meets(run, { type: 'stat', stat: 'cash', min: 1_001 })).toBe(false);
    expect(meets(run, { type: 'stat', stat: 'stress', max: 20 })).toBe(true);
    expect(meets(run, { type: 'stat', stat: 'stress', max: 19 })).toBe(false);
    expect(meets(run, { type: 'stat', stat: 'energy', min: 40, max: 60 })).toBe(true);
    expect(meets(run, { type: 'stat', stat: 'month', min: 2 })).toBe(false);
    expect(meets(run, { type: 'stat', stat: 'companyDebt', max: 0 })).toBe(true);
    expect(meets(run, { type: 'stat', stat: 'arrears', min: 1 })).toBe(false);
  });

  it('reads relations, evidence and crises', () => {
    const state: GameState = {
      ...run,
      relations: { boss: 20 },
      evidence: ['contract'],
      crises: { broke: { count: 2, lastMonth: 1 } },
    };
    expect(meets(state, { type: 'relation', npc: 'boss', min: 20 })).toBe(true);
    expect(meets(state, { type: 'relation', npc: 'boss', max: 10 })).toBe(false);
    expect(meets(state, { type: 'relation', npc: 'hr', max: 0 })).toBe(true);
    expect(meets(state, { type: 'evidence', evidence: 'contract' })).toBe(true);
    expect(meets(state, { type: 'evidence', evidence: 'other' })).toBe(false);
    expect(meets(state, { type: 'stat', stat: 'evidenceCount', min: 1 })).toBe(true);
    expect(meets(state, { type: 'crisisCount', crisis: 'broke', min: 2 })).toBe(true);
    expect(meets(state, { type: 'crisisCount', crisis: 'burnout', min: 1 })).toBe(false);
  });
});
