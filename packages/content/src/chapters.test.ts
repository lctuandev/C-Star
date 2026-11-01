import { describe, expect, it } from 'vitest';
import { chapterOf } from './chapters.js';
import { world } from './world.js';

describe('chapterOf', () => {
  it('finds the chapter of a scene from its id', () => {
    expect(chapterOf('ch3-kpi-review')?.title).toBe('KPI Never Sleeps');
  });

  it('leaves out scenes outside the chapters, and no scene at all', () => {
    expect(chapterOf('crisis-broke')).toBeNull();
    expect(chapterOf(null)).toBeNull();
  });

  it('knows all six chapters of the story', () => {
    const numbers = Object.keys(world.story.scenes).flatMap((id) => chapterOf(id)?.number ?? []);
    expect([...new Set(numbers)].sort()).toEqual([1, 2, 3, 4, 5, 6]);
  });
});
