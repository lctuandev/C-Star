import { describe, expect, it } from 'vitest';
import { formatMoney, formatMoneyShort } from './format-money';

describe('money on screen', () => {
  it('writes the whole amount the Vietnamese way', () => {
    expect(formatMoney(15_000_000)).toBe('15.000.000 đ');
    expect(formatMoney(0)).toBe('0 đ');
  });

  it('shortens it for the HUD', () => {
    expect(formatMoneyShort(15_000_000)).toBe('15 tr');
    expect(formatMoneyShort(7_400_000)).toBe('7,4 tr');
    expect(formatMoneyShort(600_000)).toBe('600 k');
    expect(formatMoneyShort(500)).toBe('500 đ');
    expect(formatMoneyShort(0)).toBe('0 đ');
  });
});
