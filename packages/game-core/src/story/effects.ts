import type { GameState } from '../state/game-state.js';
import type { Effect } from './story-types.js';

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
  }
};

export const applyEffects = (state: GameState, effects: readonly Effect[] = []): GameState =>
  effects.reduce(applyEffect, state);
