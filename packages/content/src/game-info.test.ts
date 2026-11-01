import { describe, expect, it } from 'vitest';
import { gameInfo, gameInfoSchema } from './game-info.js';

describe('gameInfo', () => {
  it('refuses an empty title', () => {
    expect(gameInfoSchema.safeParse({ ...gameInfo, title: '' }).success).toBe(false);
  });

  it('refuses an unknown field', () => {
    expect(gameInfoSchema.safeParse({ ...gameInfo, extra: true }).success).toBe(false);
  });
});
