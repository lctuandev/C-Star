import { describe, expect, it } from 'vitest';
import { gameInfo, gameInfoSchema } from './game-info.js';

describe('gameInfo', () => {
  it('says the game is fiction', () => {
    expect(gameInfo.fictionNote).toContain('hư cấu');
  });

  it('refuses an empty note', () => {
    expect(gameInfoSchema.safeParse({ ...gameInfo, fictionNote: '' }).success).toBe(false);
  });

  it('refuses an unknown field', () => {
    expect(gameInfoSchema.safeParse({ ...gameInfo, extra: true }).success).toBe(false);
  });
});
