import { describe, expect, it } from 'vitest';
import { cleanPlayerName, MAX_PLAYER_NAME, withPlayerName } from './player-name.js';

describe('cleanPlayerName', () => {
  it('keeps a Vietnamese name as typed', () => {
    expect(cleanPlayerName('Nguyễn Thị Ánh')).toBe('Nguyễn Thị Ánh');
  });

  it('tidies the spaces around and inside it', () => {
    expect(cleanPlayerName('  Lan   Anh \n')).toBe('Lan Anh');
  });

  it('accepts no name at all', () => {
    expect(cleanPlayerName('   ')).toBe('');
  });

  it('stops at the limit, without a trailing space', () => {
    const name = cleanPlayerName(`${'a'.repeat(MAX_PLAYER_NAME - 1)} b`);
    expect(name).toHaveLength(MAX_PLAYER_NAME - 1);
  });

  it('cannot smuggle a placeholder into the story', () => {
    expect(cleanPlayerName('{name}')).toBe('name');
  });
});

describe('withPlayerName', () => {
  it('puts the name in the line, every time it appears', () => {
    expect(withPlayerName('Chào {name}, {name} ơi', 'Lan')).toBe('Chào Lan, Lan ơi');
  });

  it('falls back to "bạn" inside a sentence', () => {
    expect(withPlayerName('Chào {name}', '')).toBe('Chào bạn');
  });
});
