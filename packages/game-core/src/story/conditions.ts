import type { GameState } from '../state/game-state.js';
import type { Condition } from './story-types.js';

export const meets = (state: GameState, condition: Condition): boolean => {
  switch (condition.type) {
    case 'flag':
      return state.story.flags[condition.flag] === true;
    case 'not':
      return !meets(state, condition.condition);
    case 'all':
      return condition.conditions.every((item) => meets(state, item));
    case 'any':
      return condition.conditions.some((item) => meets(state, item));
  }
};
