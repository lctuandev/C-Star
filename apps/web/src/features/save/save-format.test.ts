// @vitest-environment node
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { world } from '@cstar/content';
import { beginRun } from '@cstar/game-core';
import { describe, expect, it } from 'vitest';
import { createSaveFile, readSaveFile, SAVE_VERSION } from './save-format';

const FIXTURES = path.resolve(import.meta.dirname, 'fixtures');
const load = (name: string): unknown =>
  JSON.parse(readFileSync(path.join(FIXTURES, name), 'utf8')) as unknown;

const fresh = () => createSaveFile(beginRun(1, world), '2026-11-01T00:00:00.000Z');

describe('a save file', () => {
  it('reads back what was written, through JSON', () => {
    const file = fresh();
    expect(readSaveFile(JSON.parse(JSON.stringify(file)))).toEqual(file);
  });

  it('has a fixture for every version, and all of them still load (contracts/save.md §3)', () => {
    const fixtures = readdirSync(FIXTURES);
    for (let version = 1; version <= SAVE_VERSION; version += 1) {
      expect(fixtures).toContain(`save-v${version}.json`);
      expect(readSaveFile(load(`save-v${version}.json`))).not.toBeNull();
    }
  });

  it('brings an old save up to date without losing what it had', () => {
    const file = readSaveFile(load('save-v1.json'));
    expect(file?.saveVersion).toBe(SAVE_VERSION);
    expect(file?.state.money).toEqual({
      cash: 12_000_000,
      arrears: 0,
      loans: 0,
      companyDebt: 0,
    });
    expect(file?.state.story.flags).toEqual({ readContract: true });
    expect(file?.state.evidence).toEqual([]);
  });

  it.each([
    ['nothing', null],
    ['a string', 'save'],
    ['a list', []],
    ['an empty object', {}],
    ['no state', { saveVersion: SAVE_VERSION, savedAt: 'x' }],
  ])('refuses %s', (_, raw) => {
    expect(readSaveFile(raw)).toBeNull();
  });

  it('refuses a save from a newer version', () => {
    expect(readSaveFile({ ...fresh(), saveVersion: SAVE_VERSION + 1 })).toBeNull();
  });

  it('refuses a state that breaks the rules', () => {
    const file = fresh();
    const withMoney = (cash: number) => ({
      ...file,
      state: { ...file.state, money: { ...file.state.money, cash } },
    });
    expect(readSaveFile(withMoney(-1))).toBeNull();
    expect(readSaveFile(withMoney(1.5))).toBeNull();
    expect(
      readSaveFile({
        ...file,
        state: { ...file.state, mood: { energy: 101, stress: 0 } },
      }),
    ).toBeNull();
    expect(
      readSaveFile({ ...file, state: { ...file.state, relations: { boss: 500 } } }),
    ).toBeNull();
  });

  it('refuses a field it does not know', () => {
    expect(readSaveFile({ ...fresh(), extra: 1 })).toBeNull();
  });
});
