import { describe, expect, it } from 'vitest';
import { drawRandom, seedRng } from './seeded-rng.js';
import type { RngState } from './seeded-rng.js';

const drawMany = (start: RngState, count: number): number[] => {
  const values: number[] = [];
  let state = start;
  for (let i = 0; i < count; i += 1) {
    const draw = drawRandom(state);
    values.push(draw.value);
    state = draw.next;
  }
  return values;
};

describe('seeded RNG', () => {
  it('gives the same sequence for the same seed', () => {
    expect(drawMany(seedRng(42), 100)).toEqual(drawMany(seedRng(42), 100));
  });

  it('gives another sequence for another seed', () => {
    expect(drawMany(seedRng(1), 10)).not.toEqual(drawMany(seedRng(2), 10));
  });

  it('resumes where a saved state left off', () => {
    const whole = drawMany(seedRng(7), 6);
    let state = seedRng(7);
    for (let i = 0; i < 3; i += 1) {
      state = drawRandom(state).next;
    }
    const saved = JSON.parse(JSON.stringify(state)) as RngState;
    expect(drawMany(saved, 3)).toEqual(whole.slice(3));
  });

  it('stays in [0, 1) and spreads evenly', () => {
    const values = drawMany(seedRng(2026), 10_000);
    expect(values.every((value) => value >= 0 && value < 1)).toBe(true);
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    expect(mean).toBeGreaterThan(0.48);
    expect(mean).toBeLessThan(0.52);
  });

  it('accepts negative and oversized seeds', () => {
    for (const seed of [-1, 2 ** 40, 0]) {
      const state = seedRng(seed);
      expect(Number.isInteger(state)).toBe(true);
      expect(state).toBeGreaterThanOrEqual(0);
      expect(state).toBeLessThan(2 ** 32);
    }
  });
});
