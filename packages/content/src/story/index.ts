import type { StoryGraph } from '@cstar/game-core';
import { chapter1Scenes } from './chapters/chapter-1.js';
import { chapter2Scenes } from './chapters/chapter-2.js';
import { chapter3Scenes } from './chapters/chapter-3.js';
import { chapter4Scenes } from './chapters/chapter-4.js';
import { chapter5Scenes } from './chapters/chapter-5.js';
import { chapter6Scenes } from './chapters/chapter-6.js';
import { crisisScenes } from './chapters/crises.js';
import { storySchema } from './story-schema.js';

export { characterInfo, characters } from './characters.js';
export type { CharacterId, CharacterInfo } from './characters.js';

/** The scene every run opens on. */
export const OPENING_SCENE = 'ch1-offer';

/** The scene a renewed contract opens on (Ending 5). */
export const RENEWAL_SCENE = 'loop-renewal';

export const story: StoryGraph = storySchema.parse({
  scenes: {
    ...chapter1Scenes,
    ...chapter2Scenes,
    ...chapter3Scenes,
    ...chapter4Scenes,
    ...chapter5Scenes,
    ...chapter6Scenes,
    ...crisisScenes,
  },
});
