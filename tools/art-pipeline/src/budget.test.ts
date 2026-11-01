import { describe, expect, it } from 'vitest';
import { overruns } from './budget.ts';

const stats = { bytes: 10, drawCalls: 2, triangles: 3, largestTexture: 4, materials: 5 };

describe('overruns', () => {
  it('lets an asset through at the limit', () => {
    expect(overruns(stats, stats)).toEqual([]);
  });

  it('lists every metric that is over', () => {
    const budget = { ...stats, bytes: 9, materials: 1 };
    expect(overruns(stats, budget).map(({ metric }) => metric)).toEqual(['bytes', 'materials']);
  });
});
