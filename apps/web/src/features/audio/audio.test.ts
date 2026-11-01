import { world } from '@cstar/content';
import { beginRun } from '@cstar/game-core';
import type { GameState, Payslip } from '@cstar/game-core';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AudioEngine } from './audio-engine';
import { cueFor } from './sound-cues';

const run = beginRun(1, world);
const slip: Payslip = {
  month: 2,
  salaryDue: 15_000_000,
  salaryPaid: 0,
  bills: [],
  arrears: 0,
  cash: 0,
  loans: 0,
  companyDebt: 15_000_000,
  kpi: null,
};
const withSlip = (salaryPaid: number): GameState => ({
  ...run,
  phase: 'payslip',
  payslip: { ...slip, salaryPaid },
});

describe('cueFor (SCENARIO-050)', () => {
  it('rings the bank when the salary comes', () => {
    expect(cueFor(run, withSlip(15_000_000))).toBe('ting');
  });

  it('rings when the company pays part of what it owes', () => {
    const owed: GameState = { ...run, money: { ...run.money, companyDebt: 1_000 } };
    expect(cueFor(owed, run)).toBe('ting');
  });

  it('stays silent on a payday with no salary: only paper', () => {
    expect(cueFor(run, withSlip(0))).toBe('paper');
  });

  it('marks the end of a run', () => {
    expect(cueFor(run, { ...run, phase: 'ended' })).toBe('ending');
  });

  it('is quiet the rest of the time, and on a loaded run', () => {
    expect(cueFor(run, { ...run, lastOutcome: 'Ngủ.' })).toBeNull();
    expect(cueFor(null, withSlip(15_000_000))).toBeNull();
  });
});

describe('AudioEngine', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const fakeContext = () => {
    const param = () => ({
      value: 0,
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    });
    const node = () => {
      const created = {
        gain: param(),
        frequency: param(),
        type: 'sine',
        connect: vi.fn((target: unknown) => target),
        start: vi.fn(),
        stop: vi.fn(),
      };
      return created;
    };
    const created = {
      oscillators: [] as ReturnType<typeof node>[],
      gains: [] as ReturnType<typeof node>[],
      resume: vi.fn(() => Promise.resolve()),
    };
    class FakeAudioContext {
      currentTime = 0;
      destination = {};
      resume = created.resume;
      createGain() {
        const gain = node();
        created.gains.push(gain);
        return gain;
      }
      createOscillator() {
        const oscillator = node();
        created.oscillators.push(oscillator);
        return oscillator;
      }
    }
    vi.stubGlobal('AudioContext', FakeAudioContext);
    return created;
  };

  it('makes no sound before a gesture', () => {
    const created = fakeContext();
    new AudioEngine().play('ting');
    expect(created.oscillators).toHaveLength(0);
  });

  it('plays after a gesture, at the chosen volume', () => {
    const created = fakeContext();
    const engine = new AudioEngine();
    engine.setVolume(0.5);
    engine.unlock();
    engine.play('ting');
    expect(created.gains[0]?.gain.value).toBe(0.5);
    expect(created.oscillators).toHaveLength(2);
  });

  it('hums only when asked, and stops', () => {
    const created = fakeContext();
    const engine = new AudioEngine();
    engine.unlock();
    expect(created.oscillators).toHaveLength(0);

    engine.setAmbience(true);
    expect(created.oscillators).toHaveLength(1);
    engine.setAmbience(true);
    expect(created.oscillators).toHaveLength(1);

    engine.setAmbience(false);
    expect(created.oscillators[0]?.stop).toHaveBeenCalled();
  });

  it('wakes the context again on a later gesture', () => {
    const created = fakeContext();
    const engine = new AudioEngine();
    engine.unlock();
    engine.unlock();
    expect(created.resume).toHaveBeenCalledOnce();
  });

  it('does nothing in a browser without audio', () => {
    vi.stubGlobal('AudioContext', undefined);
    const engine = new AudioEngine();
    expect(() => {
      engine.unlock();
      engine.play('ting');
    }).not.toThrow();
  });
});
