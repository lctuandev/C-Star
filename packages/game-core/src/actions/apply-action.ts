import { createGameState } from '../state/game-state.js';
import type { GameState } from '../state/game-state.js';
import { advance, choose, startScene } from '../story/story-engine.js';
import type { StoryGraph } from '../story/story-types.js';

/** Everything a run reads but never changes: the content. */
export interface GameWorld {
  story: StoryGraph;
}

export type GameAction =
  | { type: 'startScene'; sceneId: string }
  | { type: 'advance' }
  | { type: 'choose'; choiceId: string };

export type ActionResult =
  | { ok: true; state: GameState }
  /** The state is unchanged (contracts/gameplay.md §1). */
  | { ok: false; state: GameState };

const reduce = (state: GameState, action: GameAction, world: GameWorld): GameState | null => {
  switch (action.type) {
    case 'startScene':
      return state.story.sceneId === null && action.sceneId in world.story.scenes
        ? startScene(state, world.story, action.sceneId)
        : null;
    case 'advance':
      return advance(state, world.story);
    case 'choose':
      return choose(state, world.story, action.choiceId);
  }
};

/** The one way a run changes. Pure: the UI asks, this decides. */
export const applyAction = (
  state: GameState,
  action: GameAction,
  world: GameWorld,
): ActionResult => {
  const next = reduce(state, action, world);
  return next === null ? { ok: false, state } : { ok: true, state: next };
};

/** Replays a run from its seed. An action that is refused here means the script is wrong. */
export const replay = (seed: number, actions: readonly GameAction[], world: GameWorld): GameState =>
  actions.reduce((state, action, index) => {
    const result = applyAction(state, action, world);
    if (!result.ok) {
      throw new Error(`Action ${index} was refused: ${JSON.stringify(action)}`);
    }
    return result.state;
  }, createGameState(seed));
