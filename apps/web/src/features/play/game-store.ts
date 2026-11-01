import { world } from '@cstar/content';
import { applyAction, beginRun, viewOf } from '@cstar/game-core';
import type { GameAction, GameState } from '@cstar/game-core';
import { create } from 'zustand';

export { world };

export interface HistoryLine {
  key: string;
  speaker: string | null;
  text: string;
}

const HISTORY_LIMIT = 40;

interface GameStore {
  state: GameState | null;
  /** Lines already shown: UI state, never saved (contracts/save.md §2). */
  history: readonly HistoryLine[];
  newRun: (seed: number) => void;
  dispatch: (action: GameAction) => void;
}

const withLine = (history: readonly HistoryLine[], state: GameState) => {
  const view = viewOf(state, world.story);
  if (!view) {
    return history;
  }
  const line = {
    key: `${view.sceneId}/${view.nodeId}/${history.length}`,
    speaker: view.speaker,
    text: view.text,
  };
  return [...history, line].slice(-HISTORY_LIMIT);
};

/** The UI's only door to the rules: it asks, `applyAction` decides. */
export const useGameStore = create<GameStore>((set, get) => ({
  state: null,
  history: [],

  newRun: (seed) => {
    const state = beginRun(seed, world);
    set({ state, history: withLine([], state) });
  },

  dispatch: (action) => {
    const { state, history } = get();
    if (!state) {
      return;
    }
    const result = applyAction(state, action, world);
    if (result.ok) {
      set({ state: result.state, history: withLine(history, result.state) });
    }
  },
}));
