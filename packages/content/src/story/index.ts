import type { StoryGraph } from '@cstar/game-core';
import { chapter1Scenes } from './chapters/chapter-1.js';
import { chapter2Scenes } from './chapters/chapter-2.js';
import { storySchema } from './story-schema.js';

export { characterInfo, characters } from './characters.js';
export type { CharacterId, CharacterInfo } from './characters.js';

/** The scene every run opens on. */
export const OPENING_SCENE = 'ch1-offer';

export const story: StoryGraph = storySchema.parse({
  scenes: { ...chapter1Scenes, ...chapter2Scenes },
});
