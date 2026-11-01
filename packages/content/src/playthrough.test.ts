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

/** How warm a choice is towards the people the story keeps score of. */
const warmth = (game: GameWorld, state: GameState, choiceId: string): number => {
  const node = game.story.scenes[state.story.sceneId ?? '']?.nodes[state.story.nodeId ?? ''];
  const choice =
    node && 'choices' in node ? node.choices?.find(({ id }) => id === choiceId) : undefined;
  return (choice?.effects ?? []).reduce(
    (sum, effect) => sum + (effect.type === 'addRelation' ? effect.amount : 0),
    0,
  );
};

/**
 * Plays a whole run, picking at random among whatever the game offers. A loner mostly takes the
 * coldest answer and never chats: some scenes only happen to someone with no friends.
 */
const playRandomly = (seed: number, game: GameWorld = world, loner = false) => {
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
      const open = weekActions(current, game).filter(
        (action) => action.available && !(loner && action.id === 'chat'),
      );
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
    const coldest = Math.min(...open.map(({ id }) => warmth(game, current, id)));
    const cold = open.filter(({ id }) => warmth(game, current, id) === coldest);
    return { type: 'choose', choiceId: pick(loner && pick([1, 2, 3, 4]) > 1 ? cold : open).id };
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
  // Half of them take the way out in month 4 and never see the rest: hence so many.
  const runs = Array.from({ length: 240 }, (_, index) => playRandomly(index + 1));
  /** Starts with nothing, so the money crisis is reached too. */
  const poor: GameWorld = { ...world, rules: { ...world.rules, startingCash: 0 } };
  const poorRuns = Array.from({ length: 60 }, (_, index) => playRandomly(index + 1, poor));
  const lonerRuns = Array.from({ length: 80 }, (_, index) => playRandomly(index + 1, world, true));

  it('always reaches the end of the content, without being stuck or refused', () => {
    for (const { state } of runs) {
      expect(state.phase).toBe('ended');
    }
  });

  it('plays every scene the calendar promises', () => {
    // Quitting early is an ending too: it skips what comes after.
    for (const { state } of runs.filter((run) => !run.state.story.flags.quitEarly)) {
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
    const seen = new Set([...runs, ...poorRuns, ...lonerRuns].flatMap((run) => [...run.seen]));
    // The endings have their own directed runs in endings.test.ts, the renewal too.
    const played = Object.values(world.story.scenes).filter(
      (scene) => !scene.id.startsWith('ending-') && scene.id !== world.renewalScene,
    );
    const lines = played.flatMap((scene) =>
      Object.entries(scene.nodes)
        .filter(([, node]) => !('routes' in node))
        .map(([nodeId]) => `${scene.id}/${nodeId}`),
    );
    // Only a renewed run says the first, the second has a directed test in story-links.test.ts.
    const directed = new Set(['ch1-first-day/deja-vu', 'ch4-group/let-in']);
    const rest = lines.filter((line) => !directed.has(line));
    expect(rest.filter((line) => !seen.has(line))).toEqual([]);
  });

  it('always gets one of the endings', () => {
    const ids = world.endings.map((ending) => ending.id);
    for (const { state } of runs) {
      expect(ids).toContain(state.ending);
    }
  });
});
