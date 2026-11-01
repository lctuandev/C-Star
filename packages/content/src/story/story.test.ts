import { describe, expect, it } from 'vitest';
import { characters, OPENING_SCENE, story } from './index.js';
import { validateStory } from './validate-story.js';

describe('the story', () => {
  it('passes the validator', () => {
    expect(validateStory(story, { characters })).toEqual([]);
  });

  it('has the scene every run opens on', () => {
    expect(story.scenes).toHaveProperty(OPENING_SCENE);
  });
});
