import { afterEach, describe, expect, it, vi } from 'vitest';
import { installHintFor, isIos, readHintDismissed, writeHintDismissed } from './install-hint';

const situation = { standalone: false, dismissed: false, canPrompt: false, ios: false };

describe('installHintFor', () => {
  it('offers the browser prompt when there is one', () => {
    expect(installHintFor({ ...situation, canPrompt: true })).toBe('native');
  });

  it('shows the steps on iOS', () => {
    expect(installHintFor({ ...situation, ios: true })).toBe('ios-steps');
  });

  it('stays quiet in a browser that cannot install', () => {
    expect(installHintFor(situation)).toBe('none');
  });

  it('stays quiet in the installed app', () => {
    expect(installHintFor({ ...situation, standalone: true, canPrompt: true })).toBe('none');
    expect(installHintFor({ ...situation, standalone: true, ios: true })).toBe('none');
  });

  it('does not come back once dismissed', () => {
    expect(installHintFor({ ...situation, dismissed: true, canPrompt: true })).toBe('none');
    expect(installHintFor({ ...situation, dismissed: true, ios: true })).toBe('none');
  });
});

describe('isIos', () => {
  it.each([
    ['Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X)', 5, true],
    ['Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)', 5, true],
    ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 5, true],
    ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 0, false],
    ['Mozilla/5.0 (Linux; Android 16; Pixel 7)', 5, false],
  ])('%s with %i touch points: %s', (userAgent, touchPoints, expected) => {
    expect(isIos(userAgent, touchPoints)).toBe(expected);
  });
});

describe('dismissal storage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('remembers across visits', () => {
    expect(readHintDismissed()).toBe(false);
    writeHintDismissed();
    expect(readHintDismissed()).toBe(true);
  });

  it('survives a browser that blocks storage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError');
    });
    expect(() => writeHintDismissed()).not.toThrow();
    expect(readHintDismissed()).toBe(false);
  });
});
