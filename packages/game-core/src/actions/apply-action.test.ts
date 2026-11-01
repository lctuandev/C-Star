import { describe, expect, it } from 'vitest';
import { createGameState } from '../state/game-state.js';
import type { GameState } from '../state/game-state.js';
import { viewOf } from '../story/story-engine.js';
import type { StoryGraph } from '../story/story-types.js';
import { applyAction, replay } from './apply-action.js';
import type { GameAction, GameWorld } from './apply-action.js';

const story: StoryGraph = {
  scenes: {
    meeting: {
      id: 'meeting',
      start: 'hello',
      nodes: {
        hello: { speaker: 'boss', text: 'Chào em.', next: 'ask' },
        ask: {
          speaker: 'boss',
          text: 'Em thấy sao?',
          effects: [{ type: 'setFlag', flag: 'heardTheAsk' }],
          choices: [
            {
              id: 'polite',
              text: 'Dạ tốt ạ.',
              effects: [{ type: 'setFlag', flag: 'polite' }],
              next: 'turn',
            },
            {
              id: 'blunt',
              text: 'Lương đâu ạ?',
              requires: { type: 'flag', flag: 'hasReceipts' },
              lockedReason: 'Chưa có phiếu lương trong tay',
              next: 'turn',
            },
          ],
        },
        turn: {
          routes: [{ when: { type: 'flag', flag: 'polite' }, next: 'nice' }],
          otherwise: 'cold',
        },
        nice: { speaker: 'boss', text: 'Tốt lắm.' },
        cold: { speaker: 'boss', text: 'Ừ.' },
      },
    },
    empty: { id: 'empty', start: 'only', nodes: { only: { text: 'Hết.' } } },
  },
};

const world: GameWorld = { story };
const start: GameAction = { type: 'startScene', sceneId: 'meeting' };
const toTheChoice: GameAction[] = [start, { type: 'advance' }];

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
  it('runs line by line and ends', () => {
    let state = expectOk(createGameState(1), { type: 'startScene', sceneId: 'empty' });
    expect(viewOf(state, story)?.text).toBe('Hết.');
    state = expectOk(state, { type: 'advance' });
    expect(viewOf(state, story)).toBeNull();
    expect(state.story.seenScenes).toEqual(['empty']);
  });

  it('shows who speaks', () => {
    const state = expectOk(createGameState(1), start);
    expect(viewOf(state, story)).toMatchObject({
      speaker: 'boss',
      text: 'Chào em.',
      canAdvance: true,
      choices: [],
    });
  });

  it('applies a line’s effects on arrival', () => {
    const state = replay(1, toTheChoice, world);
    expect(state.story.flags.heardTheAsk).toBe(true);
  });

  it('refuses to start over a running scene, or a scene that does not exist', () => {
    refused(expectOk(createGameState(1), start), start);
    refused(createGameState(1), { type: 'startScene', sceneId: 'nowhere' });
  });

  it('refuses to advance with no scene', () => {
    refused(createGameState(1), { type: 'advance' });
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
    refused(expectOk(createGameState(1), start), { type: 'choose', choiceId: 'polite' });
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
    const after = expectOk(state, { type: 'choose', choiceId: 'blunt' });
    expect(after.story.nodeId).toBe('cold');
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
    expect(expectOk(loaded, script[2]!)).toEqual(replay(9, script, world));
  });

  it('says which action a wrong script broke on', () => {
    expect(() => replay(1, [{ type: 'advance' }], world)).toThrow('Action 0');
  });

  it('never changes the state it was given', () => {
    const state = Object.freeze(replay(9, toTheChoice, world));
    expect(() => applyAction(state, script[2]!, world)).not.toThrow();
  });
});
