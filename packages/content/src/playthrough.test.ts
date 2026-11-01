import {
  applyAction,
  beginRun,
  drawRandom,
  roundIsOver,
  seedRng,
  viewOf,
  weekActions,
} from '@cstar/game-core';
import type { GameAction, GameState, GameWorld, RngState } from '@cstar/game-core';
import { describe, expect, it } from 'vitest';
import { world } from './world.js';

const MAX_STEPS = 2_000;

/** Plays a whole run, picking at random among whatever the game offers. */
const playRandomly = (seed: number, game: GameWorld = world) => {
  let state = beginRun(seed, game);
  let dice: RngState = seedRng(seed * 7 + 1);
  const seen = new Set<string>();

  const pick = <T>(items: readonly T[]): T => {
    const { value, next } = drawRandom(dice);
    dice = next;
    return items[Math.floor(value * items.length)] as T;
  };

  const nextAction = (current: GameState): GameAction => {
    if (current.phase === 'payslip') {
      return { type: 'closePayslip' };
    }
    if (current.phase === 'kpi') {
      const round = current.kpiRound!;
      if (roundIsOver(round)) {
        return { type: 'finishTickets' };
      }
      return pick<GameAction>([
        { type: 'answerTicket', answer: 'do' },
        { type: 'answerTicket', answer: 'defer' },
        { type: 'skipTickets' },
      ]);
    }
    if (current.phase === 'week') {
      const open = weekActions(current, game).filter((action) => action.available);
      return { type: 'takeAction', actionId: pick(open).id };
    }
    const view = viewOf(current, game.story);
    if (!view) {
      throw new Error(`Nothing to do in phase ${current.phase}`);
    }
    if (view.canAdvance) {
      return { type: 'advance' };
    }
    const open = view.choices.filter((choice) => choice.available);
    return { type: 'choose', choiceId: pick(open).id };
  };

  for (let step = 0; step < MAX_STEPS && state.phase !== 'ended'; step += 1) {
    if (state.story.nodeId) {
      seen.add(`${state.story.sceneId}/${state.story.nodeId}`);
    }
    const result = applyAction(state, nextAction(state), game);
    expect(result.ok).toBe(true);
    state = result.state;

    expect(state.money.cash).toBeGreaterThanOrEqual(0);
    expect(state.money.companyDebt).toBeGreaterThanOrEqual(0);
    expect(state.mood.energy).toBeGreaterThanOrEqual(0);
    expect(state.mood.energy).toBeLessThanOrEqual(100);
    expect(state.mood.stress).toBeGreaterThanOrEqual(0);
    expect(state.mood.stress).toBeLessThanOrEqual(100);
  }
  return { state, seen };
};

describe('a random player', () => {
  const runs = Array.from({ length: 60 }, (_, index) => playRandomly(index + 1));
  /** Starts with nothing, so the money crisis is reached too. */
  const poor: GameWorld = { ...world, rules: { ...world.rules, startingCash: 0 } };
  const poorRuns = Array.from({ length: 30 }, (_, index) => playRandomly(index + 1, poor));

  it('always reaches the end of the content, without being stuck or refused', () => {
    for (const { state } of runs) {
      expect(state.phase).toBe('ended');
    }
  });

  it('plays every scene the calendar promises', () => {
    for (const { state } of runs) {
      for (const beat of world.beats.filter((item) => !item.requires)) {
        expect(state.story.seenScenes).toContain(beat.scene);
      }
    }
  });

  it('hits the walls sometimes, and comes through them', () => {
    expect(runs.flatMap((run) => Object.keys(run.state.crises))).toContain('burnout');
    expect(poorRuns.every(({ state }) => state.phase === 'ended')).toBe(true);
    expect(poorRuns.some(({ state }) => (state.crises.broke?.count ?? 0) > 0)).toBe(true);
  });

  it('can see every line of the story', () => {
    const seen = new Set([...runs, ...poorRuns].flatMap((run) => [...run.seen]));
    const lines = Object.values(world.story.scenes).flatMap((scene) =>
      Object.entries(scene.nodes)
        .filter(([, node]) => !('routes' in node))
        .map(([nodeId]) => `${scene.id}/${nodeId}`),
    );
    expect(lines.filter((line) => !seen.has(line))).toEqual([]);
  });

  it('feels the company’s debt by the end', () => {
    for (const { state } of runs) {
      const unpaidMonths = world.rules.lastMonth - world.payroll.length;
      expect(state.money.companyDebt).toBe(world.rules.salary * unpaidMonths - 4_500_000);
    }
  });
});
