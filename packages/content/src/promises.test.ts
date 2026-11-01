import { describe, expect, it } from 'vitest';
import { promiseFor, promises, slipIsMissing, syncLineFor } from './promises.js';

describe('promiseFor', () => {
  it('starts with the first month that goes unpaid', () => {
    expect(promiseFor(2)).toBe(promises[0]);
  });

  it('never runs out, and never promises the same thing two months in a row', () => {
    for (let month = 2; month < 40; month += 1) {
      expect(promiseFor(month)).not.toBe(promiseFor(month + 1));
    }
  });
});

describe('syncLineFor', () => {
  it('starts once the salary is late', () => {
    expect(syncLineFor(2, 4)).toBeNull();
    expect(syncLineFor(3, 1)).not.toBeNull();
  });

  it('always has an answer, and it is never quite the same one twice running', () => {
    expect(syncLineFor(3, 1)).not.toBe(syncLineFor(3, 2));
    expect(syncLineFor(3, 4)).not.toBe(syncLineFor(4, 1));
    expect(syncLineFor(40, 2)).not.toBeNull();
  });
});

describe('slipIsMissing', () => {
  it('leaves the first slips alone: the player has to know what one looks like', () => {
    expect([1, 2, 3, 4].some(slipIsMissing)).toBe(false);
  });

  it('skips a slip in the months the story says it did', () => {
    expect(slipIsMissing(5)).toBe(true);
  });
});
