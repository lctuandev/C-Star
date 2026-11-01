import { seedRng } from '../rng/seeded-rng.js';
import type { RngState } from '../rng/seeded-rng.js';

export interface StoryProgress {
  /** Null between scenes. */
  sceneId: string | null;
  nodeId: string | null;
  flags: Readonly<Record<string, boolean>>;
  seenScenes: readonly string[];
}

/** The whole of a run (contracts/gameplay.md §1). Plain JSON, so a save is just this. */
export interface GameState {
  seed: number;
  rng: RngState;
  story: StoryProgress;
}

export const createGameState = (seed: number): GameState => ({
  seed,
  rng: seedRng(seed),
  story: { sceneId: null, nodeId: null, flags: {}, seenScenes: [] },
});
