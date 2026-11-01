import { describe, expect, it } from 'vitest';
import { world } from '../world.js';
import { characters } from './index.js';
import { validateWorld } from './validate-story.js';

describe('the content', () => {
  it('passes the validator', () => {
    expect(validateWorld(world, { characters })).toEqual([]);
  });

  it('never pays more than the salary', () => {
    expect(world.payroll.every((share) => share <= 1)).toBe(true);
  });
});
