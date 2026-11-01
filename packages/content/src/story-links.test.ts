import { applyAction, beginRun } from '@cstar/game-core';
import type { Condition, Effect, GameState, StoryNode } from '@cstar/game-core';
import { describe, expect, it } from 'vitest';
import { world } from './world.js';

/** Flags the rules read rather than the story: not choices that lead nowhere. */
const NOT_A_CHOICE = new Set(['runOver', 'choseStay']);

const flagsIn = (condition: Condition | undefined): string[] => {
  if (!condition) {
    return [];
  }
  if (condition.type === 'flag') {
    return [condition.flag];
  }
  if (condition.type === 'not') {
    return flagsIn(condition.condition);
  }
  return condition.type === 'all' || condition.type === 'any'
    ? condition.conditions.flatMap(flagsIn)
    : [];
};

const flagsSetBy = (effects: readonly Effect[] = []): string[] =>
  effects.flatMap((effect) =>
    effect.type === 'setFlag'
      ? [effect.flag]
      : effect.type === 'chance'
        ? flagsSetBy(effect.then)
        : [],
  );

const nodes = Object.values(world.story.scenes).flatMap((scene) => Object.values(scene.nodes));
const effectsOf = (node: StoryNode) => ('effects' in node ? node.effects : undefined);
const choicesOf = (node: StoryNode) => ('choices' in node ? (node.choices ?? []) : []);
const routesOf = (node: StoryNode) => ('routes' in node ? node.routes : []);

const flagsSet = new Set([
  ...nodes.flatMap((node) => flagsSetBy(effectsOf(node))),
  ...nodes.flatMap((node) => choicesOf(node).flatMap((choice) => flagsSetBy(choice.effects))),
  ...world.actions.flatMap((action) => flagsSetBy(action.effects)),
]);

const flagsRead = new Set([
  ...nodes.flatMap((node) => routesOf(node).flatMap((route) => flagsIn(route.when))),
  ...nodes.flatMap((node) => choicesOf(node).flatMap((choice) => flagsIn(choice.requires))),
  ...world.beats.flatMap((beat) => flagsIn(beat.requires)),
  ...world.endings.flatMap((ending) => flagsIn(ending.when)),
  ...world.tickets.flatMap((ticket) => flagsIn(ticket.requires)),
  ...world.actions.flatMap((action) => [
    ...flagsIn(action.appearsWhen),
    ...flagsIn(action.requires),
    ...(action.outcomesWhen ?? []).flatMap(({ when }) => flagsIn(when)),
  ]),
]);

const SEEDS = Array.from({ length: 60 }, (_, index) => index + 1);

const runWith = (seed: number, khoaLeft: boolean): GameState => {
  const run = beginRun(seed, world);
  return {
    ...run,
    phase: 'week',
    calendar: { ...run.calendar, month: khoaLeft ? 6 : 4 },
    story: { ...run.story, sceneId: null, nodeId: null, flags: { khoaLeft } },
    money: { ...run.money, companyDebt: 30_000_000 },
  };
};

const take = (state: GameState, actionId: string) => {
  const result = applyAction(state, { type: 'takeAction', actionId }, world);
  return result.ok ? result.state : state;
};

const ticketsDealt = (khoaLeft: boolean) =>
  SEEDS.flatMap((seed) => take(runWith(seed, khoaLeft), 'work').kpiRound?.tickets ?? []);

const chatLines = (khoaLeft: boolean) =>
  SEEDS.map((seed) => take(runWith(seed, khoaLeft), 'chat').lastOutcome);

describe('Khoa after he has left (FEAT-041)', () => {
  it('sends no more tickets', () => {
    expect(ticketsDealt(false)).toContain('server-full');
    expect(ticketsDealt(true)).not.toContain('server-full');
  });

  it('is no longer in the small talk, except as the empty desk', () => {
    const talksOf = (lines: readonly (string | null)[]) =>
      lines.filter((line) => line?.includes('Khoa'));
    expect(talksOf(chatLines(false)).some((line) => line?.includes('Khoa tin'))).toBe(true);
    expect(talksOf(chatLines(true)).every((line) => line?.startsWith('Bàn của Khoa'))).toBe(true);
    expect(talksOf(chatLines(true))).not.toEqual([]);
  });
});

describe('the story hangs together (FEAT-041)', () => {
  it('remembers every choice it records: a flag nothing reads is a choice that led nowhere', () => {
    const forgotten = [...flagsSet].filter(
      (flag) => !flagsRead.has(flag) && !NOT_A_CHOICE.has(flag),
    );
    expect(forgotten).toEqual([]);
  });

  it('reads only flags that something sets, or the engine does', () => {
    const invented = [...flagsRead].filter((flag) => !flagsSet.has(flag) && flag !== 'renewed');
    expect(invented).toEqual([]);
  });
});
