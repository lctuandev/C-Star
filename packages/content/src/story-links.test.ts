import { applyAction, beginRun, startScene, viewOf } from '@cstar/game-core';
import type { Condition, Effect, GameAction, GameState, StoryNode } from '@cstar/game-core';
import { describe, expect, it } from 'vitest';
import { world } from './world.js';

/** Read by the rules, not the story: it ends the run. */
const NOT_A_CHOICE = new Set(['runOver']);

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

/** Plays one scene from its start, taking the choice asked for, or else the first open one. */
const playScene = (state: GameState, sceneId: string, choiceId?: string): GameState => {
  let current = startScene({ ...state, phase: 'scene' }, world.story, sceneId, world.evidence);
  for (let step = 0; step < 60 && current.story.sceneId === sceneId; step += 1) {
    const view = viewOf(current, world.story);
    const open = view?.choices.filter(({ available }) => available) ?? [];
    const action: GameAction = view?.canAdvance
      ? { type: 'advance' }
      : {
          type: 'choose',
          choiceId: open.find(({ id }) => id === choiceId)?.id ?? open[0]?.id ?? '',
        };
    current = applyAction(current, action, world).state;
  }
  return current;
};

const paidIn = (state: GameState) =>
  Object.values(state.paidByMonth).reduce((sum, paid) => sum + paid, 0);

describe('a payment only happens once (FEAT-042)', () => {
  const qualified = (flags: Record<string, boolean>): GameState => ({
    ...runWith(1, false),
    story: { ...runWith(1, false).story, flags },
    relations: { boss: 40 },
    money: { ...runWith(1, false).money, companyDebt: 60_000_000 },
    paidByMonth: {},
  });

  it("pays 5 million in month 5 to someone on both the list and the boss's good side", () => {
    const after = playScene(qualified({ joinedDragons: true }), 'ch4-second-tranche');
    expect(paidIn(after)).toBe(5_000_000);
  });

  it('pays 5 million in month 7, however many reasons there are', () => {
    const flags = { joinedDragons: true, tookPromotion: true, heldOutForPay: true };
    expect(paidIn(playScene(qualified(flags), 'ch5-payday'))).toBe(5_000_000);
  });
});

describe('the rules GPT asked to pin down (FEAT-042)', () => {
  it('sends someone who gives up to The Survivor, not to a run with no ending', () => {
    const worn: GameState = { ...runWith(1, false), outlook: { trust: 20, awareness: 20 } };
    const after = playScene(worn, 'ch4-six-months', 'walk-away');
    expect(after.story.flags.quitEarly).toBe(true);
    expect(after.ending).toBe('survivor');
  });

  it('counts a paper once, whoever hands it over', () => {
    const run = runWith(1, false);
    const held: GameState = {
      ...run,
      evidence: ['timesheet'],
      story: { ...run.story, flags: { helpedKhoa: true } },
    };
    expect(playScene(held, 'ch4-khoa-leaves').evidence).toEqual(['timesheet']);
  });

  it("pays Khoa's loan back once, and only if there was one", () => {
    const run = runWith(1, false);
    const owed: GameState = { ...run, story: { ...run.story, flags: { helpedKhoa: true } } };
    expect(playScene(owed, 'ch6-empty-office').money.cash).toBe(owed.money.cash + 1_000_000);
    expect(playScene(run, 'ch6-empty-office').money.cash).toBe(run.money.cash);
  });
});

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
