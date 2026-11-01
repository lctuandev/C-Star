import type { StoryGraph } from '@cstar/game-core';
import { storySchema } from './story-schema.js';

/** Who can speak. Portraits and names are the UI's (FEAT-004). */
export const characters = ['player', 'boss', 'hr', 'accountant', 'coworker'] as const;

/** Parsed at load: a story that does not fit the schema never reaches a player. */
export const story: StoryGraph = storySchema.parse({ scenes: {} });
