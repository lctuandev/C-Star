import { describe, expect, it } from 'vitest';
import { shouldShowDisclaimer } from './disclaimer-rule.js';

describe('shouldShowDisclaimer', () => {
  const opening = { currentVersion: 2, entering: 'app' as const };

  it('asks a first-time player', () => {
    expect(shouldShowDisclaimer({ ...opening, acceptedVersion: null })).toBe(true);
  });

  it('leaves alone someone who accepted this text', () => {
    expect(shouldShowDisclaimer({ ...opening, acceptedVersion: 2 })).toBe(false);
  });

  it('asks again when the text changed', () => {
    expect(shouldShowDisclaimer({ ...opening, acceptedVersion: 1 })).toBe(true);
  });

  it('asks again when an older build meets a newer acceptance', () => {
    expect(shouldShowDisclaimer({ ...opening, acceptedVersion: 3 })).toBe(true);
  });

  it('always asks on a new game', () => {
    expect(
      shouldShowDisclaimer({ currentVersion: 2, entering: 'new-game', acceptedVersion: 2 }),
    ).toBe(true);
  });
});
