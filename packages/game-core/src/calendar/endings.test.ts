import { describe, expect, it } from 'vitest';
import { applyAction, beginRun } from '../actions/apply-action.js';
import type { GameAction } from '../actions/apply-action.js';
import type { GameState } from '../state/game-state.js';
import { startScene } from '../story/story-engine.js';
import { testWorld as world } from '../test-world.fixture.js';
import { selectEnding } from './calendar.js';

const advance: GameAction = { type: 'advance' };
const renew: GameAction = { type: 'renewContract' };

/** The last scene of a run, with whatever the player has by then. */
const atFinale = (change: Partial<GameState> = {}): GameState => {
  const state = beginRun(1, world);
  const week: GameState = {
    ...state,
    ...change,
    phase: 'week',
    money: { ...state.money, companyDebt: 5_000 },
    story: { ...state.story, sceneId: null, nodeId: null },
  };
  return { ...startScene(week, world.story, 'finale', world.evidence), phase: 'scene' };
};

const step = (state: GameState, action: GameAction) => {
  const result = applyAction(state, action, world);
  expect(result.ok).toBe(true);
  return result.state;
};

describe('selectEnding (SCENARIO-047)', () => {
  it('takes the first rule that holds', () => {
    expect(selectEnding(atFinale({ evidence: ['contract'] }), world).id).toBe('good');
  });

  it('falls through to the last rule', () => {
    expect(selectEnding(atFinale(), world).id).toBe('loop');
  });

  it('refuses a world with no rule to catch a run', () => {
    expect(() => selectEnding(atFinale(), { ...world, endings: [] })).toThrow('No ending rule');
  });
});

describe('the end of a run (SCENARIO-047)', () => {
  it('plays the ending’s scene, then stops', () => {
    const inEnding = step(atFinale({ evidence: ['contract'] }), advance);
    expect(inEnding).toMatchObject({ phase: 'scene', ending: 'good' });
    expect(inEnding.story.sceneId).toBe('end-good');

    const over = step(inEnding, advance);
    expect(over).toMatchObject({ phase: 'ended', ending: 'good' });
    expect(applyAction(over, advance, world).ok).toBe(false);
  });

  it('survives a reload in the ending scene', () => {
    const inEnding = step(atFinale(), advance);
    const loaded = JSON.parse(JSON.stringify(inEnding)) as GameState;
    expect(step(loaded, advance).phase).toBe('ended');
  });
});

describe('renewing the contract (SCENARIO-048)', () => {
  const over = () => step(step(atFinale(), advance), advance);

  it('starts over and keeps the debt', () => {
    const renewed = step(over(), renew);
    expect(renewed).toMatchObject({
      phase: 'scene',
      ending: null,
      loops: 1,
      calendar: { month: 1, week: 1 },
      evidence: [],
    });
    expect(renewed.money.companyDebt).toBe(5_000);
    expect(renewed.story.sceneId).toBe('renewal');
    expect(renewed.story.flags).toEqual({ renewed: true });
  });

  it('draws different luck the second time', () => {
    expect(step(over(), renew).seed).toBe(over().seed + 1);
  });

  it('counts each loop', () => {
    const twice: GameState = { ...over(), loops: 2 };
    expect(step(twice, renew).loops).toBe(3);
  });

  it('is only for the ending that loops', () => {
    const good = step(step(atFinale({ evidence: ['contract'] }), advance), advance);
    expect(applyAction(good, renew, world).ok).toBe(false);
  });

  it('is refused while the run is going', () => {
    expect(applyAction(beginRun(1, world), renew, world).ok).toBe(false);
  });
});
