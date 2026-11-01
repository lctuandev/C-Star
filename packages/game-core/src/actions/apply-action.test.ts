import { describe, expect, it } from 'vitest';
import { viewOf } from '../story/story-engine.js';
import type { GameState } from '../state/game-state.js';
import { testWorld as world } from '../test-world.fixture.js';
import { applyAction, beginRun, replay, resumeRun } from './apply-action.js';
import type { GameAction } from './apply-action.js';

const { story } = world;
const toTheChoice: GameAction[] = [{ type: 'advance' }];

const expectOk = (state: GameState, action: GameAction) => {
  const result = applyAction(state, action, world);
  expect(result.ok).toBe(true);
  return result.state;
};

const refused = (state: GameState, action: GameAction) => {
  const result = applyAction(state, action, world);
  expect(result.ok).toBe(false);
  expect(result.state).toBe(state);
};

describe('a scene (SCENARIO-013)', () => {
  it('opens the run', () => {
    const state = beginRun(1, world);
    expect(state.phase).toBe('scene');
    expect(state.story.seenScenes).toEqual(['meeting']);
  });

  it('shows who speaks', () => {
    expect(viewOf(beginRun(1, world), story)).toMatchObject({
      speaker: 'boss',
      text: 'Chào em.',
      canAdvance: true,
      choices: [],
    });
  });

  it('applies a line’s effects on arrival', () => {
    expect(replay(1, toTheChoice, world).story.flags.heardTheAsk).toBe(true);
  });

  it('ends, and the calendar takes over', () => {
    const state = replay(
      1,
      [...toTheChoice, { type: 'choose', choiceId: 'polite' }, { type: 'advance' }],
      world,
    );
    expect(viewOf(state, story)).toBeNull();
    expect(state.phase).toBe('week');
  });

  it('refuses to advance with no scene', () => {
    const inTheWeek = replay(
      1,
      [...toTheChoice, { type: 'choose', choiceId: 'polite' }, { type: 'advance' }],
      world,
    );
    refused(inTheWeek, { type: 'advance' });
  });
});

describe('a choice (SCENARIO-014)', () => {
  it('applies its effects and follows its branch', () => {
    const state = expectOk(replay(1, toTheChoice, world), { type: 'choose', choiceId: 'polite' });
    expect(state.story.flags.polite).toBe(true);
    expect(viewOf(state, story)?.text).toBe('Tốt lắm.');
  });

  it('cannot be skipped by advancing', () => {
    refused(replay(1, toTheChoice, world), { type: 'advance' });
  });

  it('refuses a choice that is not on screen', () => {
    refused(replay(1, toTheChoice, world), { type: 'choose', choiceId: 'nope' });
    refused(beginRun(1, world), { type: 'choose', choiceId: 'polite' });
  });
});

describe('a locked choice (SCENARIO-015)', () => {
  it('shows with its reason, and cannot be taken', () => {
    const state = replay(1, toTheChoice, world);
    expect(viewOf(state, story)?.choices).toEqual([
      { id: 'polite', text: 'Dạ tốt ạ.', available: true },
      {
        id: 'blunt',
        text: 'Lương đâu ạ?',
        available: false,
        lockedReason: 'Chưa có phiếu lương trong tay',
      },
    ]);
    refused(state, { type: 'choose', choiceId: 'blunt' });
  });

  it('opens when the condition is met', () => {
    const atChoice = replay(1, toTheChoice, world);
    const state: GameState = {
      ...atChoice,
      story: { ...atChoice.story, flags: { ...atChoice.story.flags, hasReceipts: true } },
    };
    expect(viewOf(state, story)?.choices[1]?.available).toBe(true);
    expectOk(state, { type: 'choose', choiceId: 'blunt' });
  });
});

describe('a repeated tap (SCENARIO-016)', () => {
  it('counts once', () => {
    const once = expectOk(replay(1, toTheChoice, world), { type: 'choose', choiceId: 'polite' });
    refused(once, { type: 'choose', choiceId: 'polite' });
  });
});

describe('a route (SCENARIO-017)', () => {
  it('turns on what happened, unseen', () => {
    const atChoice = replay(1, toTheChoice, world);
    const state: GameState = {
      ...atChoice,
      story: { ...atChoice.story, flags: { hasReceipts: true } },
    };
    expect(expectOk(state, { type: 'choose', choiceId: 'blunt' }).story.nodeId).toBe('cold');
  });
});

describe('replay (SCENARIO-018)', () => {
  const script: GameAction[] = [...toTheChoice, { type: 'choose', choiceId: 'polite' }];

  it('gives the same state for the same seed and actions', () => {
    expect(replay(9, script, world)).toEqual(replay(9, script, world));
  });

  it('survives a trip through JSON, as a save does', () => {
    const atChoice = replay(9, toTheChoice, world);
    const loaded = JSON.parse(JSON.stringify(atChoice)) as GameState;
    expect(expectOk(loaded, script[1]!)).toEqual(replay(9, script, world));
  });

  it('says which action a wrong script broke on', () => {
    expect(() => replay(1, [{ type: 'closePayslip' }], world)).toThrow('Action 0');
  });

  it('never changes the state it was given', () => {
    const state = Object.freeze(replay(9, toTheChoice, world));
    expect(() => applyAction(state, script[1]!, world)).not.toThrow();
  });
});

describe('resumeRun', () => {
  it('leaves a sound run alone', () => {
    const state = replay(1, toTheChoice, world);
    expect(resumeRun(state, world)).toBe(state);
  });

  it('moves on from a line that no longer exists', () => {
    const state = replay(1, toTheChoice, world);
    const stale: GameState = { ...state, story: { ...state.story, nodeId: 'renamed' } };
    expect(resumeRun(stale, world)).toMatchObject({
      phase: 'week',
      story: { sceneId: null, nodeId: null },
    });
  });

  it('moves on from a scene that no longer exists', () => {
    const state = replay(1, toTheChoice, world);
    const stale: GameState = { ...state, story: { ...state.story, sceneId: 'gone' } };
    expect(resumeRun(stale, world).phase).toBe('week');
  });
});
