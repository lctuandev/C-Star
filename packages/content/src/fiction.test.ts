import { describe, expect, it } from 'vitest';
import { disclaimer } from './disclaimer.js';
import { world } from './world.js';

/** Every string in a value, however deep. Ids go through too, which is harmless and simpler. */
const stringsIn = (value: unknown): string[] => {
  if (typeof value === 'string') {
    return [value];
  }
  if (Array.isArray(value)) {
    return value.flatMap(stringsIn);
  }
  return typeof value === 'object' && value !== null ? Object.values(value).flatMap(stringsIn) : [];
};

const playerText = stringsIn(world);

/** contracts/content.md §1: products and companies that exist, by name. */
const REAL_BRANDS =
  /\b(slack|excel|word|powerpoint|zalo|facebook|messenger|google|gmail|youtube|tiktok|shopee|grab|momo|vnpay|telegram|notion|jira|trello|microsoft|apple|samsung|viettel|vinamilk|vingroup|fpt|vnpt|techcombank|vietcombank|sacombank|bidv|agribank)\b/i;

/** contracts/content.md §4: the game does not give legal advice or state the law as fact. */
const LEGAL_CLAIMS =
  /(bộ luật|luật lao động|điều \d+|khoản \d+|nghị định|thông tư|tòa án|thanh tra lao động|sở lao động|phòng lao động|luật sư|bồi thường \d|trong vòng \d+ ngày|\d+ ngày làm việc)/i;

describe('the fiction rules (contracts/content.md)', () => {
  it('finds the text it is meant to check', () => {
    expect(playerText.length).toBeGreaterThan(300);
    expect(playerText.some((text) => text.includes('trái cây thứ Sáu'))).toBe(true);
  });

  it('names no real company or product', () => {
    expect(playerText.filter((text) => REAL_BRANDS.test(text))).toEqual([]);
  });

  it('states no law, court or deadline', () => {
    expect(playerText.filter((text) => LEGAL_CLAIMS.test(text))).toEqual([]);
  });

  it('keeps evidence to the player’s own papers', () => {
    const taken = /(lén|trộm|hack|xâm nhập|mật khẩu của|sao chép trái phép)/i;
    const papers = stringsIn(world.evidence);
    expect(papers.filter((text) => taken.test(text))).toEqual([]);
  });

  it('never asks the player for anything real', () => {
    const personal = /(số tài khoản|cccd|căn cước|số điện thoại của bạn|email của bạn)/i;
    expect(playerText.filter((text) => personal.test(text))).toEqual([]);
  });

  it('keeps the words of the disclaimer on the end of the road', () => {
    expect(disclaimer.reminder).toContain('hư cấu');
  });
});
