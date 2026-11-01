import type { StoryGraph } from '@cstar/game-core';
import { chapter1Scenes } from './chapters/chapter-1.js';
import { storySchema } from './story-schema.js';

export { characterInfo, characters } from './characters.js';
export type { CharacterId, CharacterInfo } from './characters.js';

/** The scene every run opens on. */
export const OPENING_SCENE = 'ch1-offer';

/** Parsed at load: a story that does not fit the schema never reaches a player. */
export const story: StoryGraph = storySchema.parse({ scenes: { ...chapter1Scenes } });
