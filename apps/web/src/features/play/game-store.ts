import { world } from '@cstar/content';
import { applyAction, beginRun, resumeRun, viewOf } from '@cstar/game-core';
import type { GameAction, GameState } from '@cstar/game-core';
import { create } from 'zustand';
import { useProgressStore } from '@/features/endings/progress-store';
import { useSaveStore } from '@/features/save/save-store';

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
  /** What the player last asked for: the sound of it depends on what, not just on the result. */
  lastAction: GameAction | null;
  /** Set by the menu on the way to the application form: a new run replaces the one saved. */
  startingNewGame: boolean;
  setStartingNewGame: (starting: boolean) => void;
  newRun: (seed: number, playerName?: string) => void;
  /** Takes up a saved run. */
  resume: (state: GameState) => void;
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
  lastAction: null,
  startingNewGame: false,
  setStartingNewGame: (startingNewGame) => set({ startingNewGame }),

  newRun: (seed, playerName) => {
    const state = beginRun(seed, world, playerName);
    set({ state, history: withLine([], state), startingNewGame: false });
    useSaveStore.getState().autosave(state);
  },

  resume: (saved) => {
    const state = resumeRun(saved, world);
    set({ state, history: withLine([], state) });
  },

  dispatch: (action) => {
    const { state, history } = get();
    if (!state) {
      return;
    }
    const result = applyAction(state, action, world);
    if (result.ok) {
      set({
        state: result.state,
        history: withLine(history, result.state),
        lastAction: action,
      });
      useSaveStore.getState().autosave(result.state);
      if (state.phase !== 'ended' && result.state.phase === 'ended' && result.state.ending) {
        void useProgressStore.getState().record(result.state.ending);
      }
    }
  },
}));
