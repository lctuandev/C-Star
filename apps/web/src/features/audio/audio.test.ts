import { world } from '@cstar/content';
import { beginRun } from '@cstar/game-core';
import type { GameState, Payslip } from '@cstar/game-core';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AudioEngine } from './audio-engine';
import { midiToHertz, SCORES, secondsPerBar, trackFor } from './score';
import { CHOICE_CUES, cueFor } from './sound-cues';

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

  it('gives each way to spend a turn its own sound (SCENARIO-087)', () => {
    const cue = (actionId: string) => cueFor(run, run, { type: 'takeAction', actionId });
    expect(cue('work')).toBe('keys');
    expect(cue('side-gig')).toBe('coins');
    expect(cue('rest')).toBe('rest');
    expect(cue('chat')).toBe('chat');
    expect(cue('investigate')).toBe('file');
  });

  it('tells a right ticket from a wrong one', () => {
    const answered = (correct: boolean): GameState => ({
      ...run,
      kpiRound: {
        actionId: 'work',
        tickets: [],
        index: 1,
        score: 0,
        last: { ticketId: 'x', correct },
      },
    });
    const action = { type: 'answerTicket', answer: 'do' } as const;
    expect(cueFor(run, answered(true), action)).toBe('right');
    expect(cueFor(run, answered(false), action)).toBe('wrong');
  });

  describe('a choice with no sound of its own sounds like what it did', () => {
    const action = { type: 'choose', choiceId: 'something-new' } as const;
    const after = (change: Partial<GameState>): GameState => ({ ...run, ...change });

    it('a calmer player', () => {
      const calmer = after({ mood: { ...run.mood, stress: run.mood.stress - 1 } });
      expect(cueFor(run, calmer, action)).toBe('warm');
    });

    it('a worse day', () => {
      const worse = after({ mood: { ...run.mood, stress: run.mood.stress + 1 } });
      expect(cueFor(run, worse, action)).toBe('sour');
    });

    it('a loan taken', () => {
      expect(cueFor(run, after({ money: { ...run.money, loans: 1 } }), action)).toBe('debt');
    });

    it('walking out', () => {
      const out = after({ story: { ...run.story, flags: { runOver: true } } });
      expect(cueFor(run, out, action)).toBe('leave');
    });

    it('nothing in particular', () => {
      expect(cueFor(run, run, action)).toBe('choose');
    });
  });

  it('marks a crisis and a new chapter', () => {
    const inScene = (sceneId: string): GameState => ({
      ...run,
      story: { ...run.story, sceneId },
    });
    expect(cueFor(inScene('ch1-payday'), inScene('crisis-broke'))).toBe('alarm');
    expect(cueFor(inScene('ch1-payday'), inScene('ch2-new-month'))).toBe('chapter');
    expect(cueFor(inScene('ch1-payday'), inScene('ch1-payday'))).toBeNull();
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

describe('the music follows the story (SCENARIO-088)', () => {
  const at = (month: number, sceneId: string | null = null): GameState => ({
    ...run,
    phase: sceneId ? 'scene' : 'week',
    calendar: { ...run.calendar, month },
    story: { ...run.story, sceneId, nodeId: null },
  });
  const worn = (state: GameState): GameState => ({
    ...state,
    mood: { ...state.mood, stress: 85 },
  });

  it('starts bright and goes dark, month by month', () => {
    const arc = [1, 2, 3, 5, 7, 8].map((month) => trackFor(at(month)));
    expect(arc).toEqual(['dawn', 'routine', 'uneasy', 'weary', 'hollow', 'bleak']);
  });

  it('gets slower and darker at every stage', () => {
    const stages = [
      SCORES.dawn,
      SCORES.routine,
      SCORES.uneasy,
      SCORES.weary,
      SCORES.hollow,
      SCORES.bleak,
    ];
    stages.slice(1).forEach((score, index) => {
      const before = stages[index] as (typeof stages)[number];
      expect(score.bpm).toBeLessThan(before.bpm);
      expect(score.cutoff).toBeLessThan(before.cutoff);
      expect(score.wobble).toBeGreaterThan(before.wobble);
    });
  });

  it('darkens early for a player at the end of their rope', () => {
    expect(trackFor(worn(at(3)))).toBe('uneasy');
    expect(trackFor(worn(at(4)))).toBe('weary');
    expect(trackFor(worn(at(6)))).toBe('hollow');
  });

  it('never goes past the end of the arc', () => {
    expect(trackFor(worn(at(40)))).toBe('bleak');
  });

  it('leaves the first month alone: nothing has gone wrong yet', () => {
    expect(trackFor(worn(at(1)))).toBe('dawn');
  });

  it('is warm at home at first, and later not', () => {
    expect(trackFor(at(2, 'ch1-offer'))).toBe('home');
    expect(trackFor(at(6, 'ch5-payday'))).toBe('homeLate');
  });

  it('is uneasy in a crisis', () => {
    expect(trackFor(at(6, 'crisis-broke'))).toBe('tense');
  });

  it('gives each ending its own colour', () => {
    expect(trackFor({ ...run, phase: 'ended', ending: 'good' })).toBe('dawn');
    expect(trackFor({ ...run, phase: 'ended', ending: 'believer' })).toBe('hollow');
    expect(trackFor(at(8, 'ending-survivor'))).toBe('home');
  });

  it('is delighted all over again when the contract renews itself', () => {
    expect(trackFor(at(1, world.renewalScene))).toBe('dawn');
  });

  it('goes back to the menu tune when there is no run', () => {
    expect(trackFor(null)).toBe('menu');
  });

  it('keeps every bar inside its four beats, and every level low enough to mix', () => {
    for (const score of Object.values(SCORES)) {
      expect(secondsPerBar(score)).toBeGreaterThan(0);
      for (const hit of score.bars.flat()) {
        expect(hit.beat).toBeLessThan(4);
        expect(hit.level).toBeLessThanOrEqual(0.3);
      }
    }
  });

  it('knows its notes', () => {
    expect(midiToHertz(69)).toBe(440);
    expect(midiToHertz(81)).toBe(880);
  });
});

describe('every choice has its own sound (SCENARIO-087)', () => {
  const choices = Object.values(world.story.scenes).flatMap((scene) =>
    Object.values(scene.nodes).flatMap((node) => ('choices' in node ? (node.choices ?? []) : [])),
  );

  it('leaves no choice in the story without one', () => {
    expect(choices.length).toBeGreaterThan(50);
    expect(choices.filter(({ id }) => !(id in CHOICE_CUES)).map(({ id }) => id)).toEqual([]);
  });

  it('keeps no sound for a choice that no longer exists', () => {
    const ids = new Set(choices.map(({ id }) => id));
    expect(Object.keys(CHOICE_CUES).filter((id) => !ids.has(id))).toEqual([]);
  });

  it('claps when the choice says to clap', () => {
    expect(cueFor(run, run, { type: 'choose', choiceId: 'clap' })).toBe('clap');
    expect(cueFor(run, run, { type: 'choose', choiceId: 'cheer' })).toBe('applause');
  });

  it('still rings the bank when a choice brings money from the company', () => {
    const owed: GameState = { ...run, money: { ...run.money, companyDebt: 5 } };
    expect(cueFor(owed, run, { type: 'choose', choiceId: 'join-dragons' })).toBe('ting');
  });
});
