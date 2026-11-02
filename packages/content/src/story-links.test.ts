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
  ...world.evidence.flatMap((item) => flagsIn(item.requires)),
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

/** Plays one scene from its start, taking the choices asked for, or else the first open one. */
const walkScene = (state: GameState, sceneId: string, wanted: readonly string[] = []) => {
  let current = startScene({ ...state, phase: 'scene' }, world.story, sceneId, world.evidence);
  const seen = new Set<string>();
  for (let step = 0; step < 60 && current.story.sceneId === sceneId; step += 1) {
    seen.add(current.story.nodeId ?? '');
    const view = viewOf(current, world.story);
    const open = view?.choices.filter(({ available }) => available) ?? [];
    const action: GameAction = view?.canAdvance
      ? { type: 'advance' }
      : {
          type: 'choose',
          choiceId: open.find(({ id }) => wanted.includes(id))?.id ?? open[0]?.id ?? '',
        };
    current = applyAction(current, action, world).state;
  }
  return { state: current, seen };
};

const playScene = (state: GameState, sceneId: string, ...wanted: string[]): GameState =>
  walkScene(state, sceneId, wanted).state;

const withFlags = (state: GameState, flags: Record<string, boolean>): GameState => ({
  ...state,
  story: { ...state.story, flags: { ...state.story.flags, ...flags } },
});

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

  it('lets someone Uyên left out earn a way in, with papers', () => {
    const run = runWith(1, false);
    const coldShoulder: GameState = { ...run, relations: { uyen: -20 }, evidence: [] };
    expect(playScene(coldShoulder, 'ch4-group', 'ask-in').story.flags.joinedGroup).toBeUndefined();
    const withPapers = { ...coldShoulder, evidence: ['contract', 'timesheet'] };
    expect(playScene(withPapers, 'ch4-group', 'ask-in').story.flags.joinedGroup).toBe(true);
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

describe('leaving in month 4 takes a second thought (SCENARIO-134)', () => {
  const run = runWith(1, false);

  it('ends the run only once the message is sent', () => {
    const gone = playScene(run, 'ch3-other-offer', 'walk-now', 'send-yes');
    expect(gone.story.flags.quitEarly).toBe(true);
    expect(gone.ending).toBe('survivor');
  });

  it('keeps someone who deletes it, and remembers the friend', () => {
    const kept = playScene(run, 'ch3-other-offer', 'walk-now', 'send-no');
    expect(kept.story.flags.quitEarly).toBeUndefined();
    expect(kept.story.flags.turnedDownFriend).toBe(true);
  });

  it('pays nothing for staying: the story does not take sides', () => {
    const kept = playScene(run, 'ch3-other-offer', 'walk-now', 'send-no');
    expect(kept.outlook).toEqual(run.outlook);
  });

  it('asks nothing of someone who says no straight away', () => {
    const { seen } = walkScene(run, 'ch3-other-offer', ['stay-on']);
    expect(seen.has('send-or-not')).toBe(false);
  });
});

describe('what happens to Uyên is on you (SCENARIO-135, SCENARIO-136)', () => {
  const grouped = withFlags(runWith(1, false), { joinedGroup: true });

  it('lets you overhear the name you gave, then costs you the group if you say nothing', () => {
    const named = playScene(grouped, 'ch5-company-reply', 'name-uyen');
    expect(named.story.flags.namedUyen).toBe(true);
    expect(walkScene(named, 'ch5-closed-door').seen.has('heard-name')).toBe(true);
    const silent = playScene(named, 'ch6-empty-office', 'say-nothing');
    expect(silent.story.flags.joinedGroup).toBe(false);
  });

  it('keeps a way back for someone who owns up with papers in hand', () => {
    const named = withFlags(grouped, { namedUyen: true });
    const armed = { ...named, evidence: ['contract', 'timesheet', 'kpi-mails'], relations: {} };
    const after = playScene(armed, 'ch6-empty-office', 'confess');
    expect(after.story.flags.joinedGroup).toBe(true);
    expect(after.relations.uyen).toBe(-10);
    const empty = { ...named, evidence: [] };
    expect(playScene(empty, 'ch6-empty-office', 'confess').story.flags.joinedGroup).toBe(false);
  });

  it('does not forget, even for someone who kept their place', () => {
    const named = withFlags(grouped, { namedUyen: true });
    expect(walkScene(named, 'ending-good').seen.has('still-remembers')).toBe(true);
    expect(walkScene(named, 'ending-collective').seen.has('last-line')).toBe(true);
    expect(walkScene(grouped, 'ending-collective').seen.has('last-line')).toBe(false);
  });

  it('asks nothing of someone outside the group who named her', () => {
    const outsider = withFlags(runWith(1, false), { namedUyen: true });
    const { seen } = walkScene(outsider, 'ch6-empty-office');
    expect(seen.has('uyen-knows')).toBe(true);
    expect(seen.has('own-up')).toBe(false);
  });

  it('leaves the last message of The Survivor to someone else', () => {
    const named = withFlags(grouped, { namedUyen: true, choseLeave: true });
    const { seen } = walkScene(named, 'ending-survivor');
    expect(seen.has('year-dan')).toBe(true);
    expect(seen.has('year-uyen')).toBe(false);
  });

  it('keeps the group for someone who only looks away', () => {
    const dodged = playScene(grouped, 'ch5-company-reply', 'not-sure');
    expect(playScene(dodged, 'ch6-empty-office').story.flags.joinedGroup).toBe(true);
  });

  it('gives someone who stands with her trust, not a paper', () => {
    const stood = playScene(grouped, 'ch5-company-reply', 'own-it');
    expect(stood.story.flags.stoodWithUyen).toBe(true);
    expect(walkScene(stood, 'ch5-closed-door').seen.has('hr-stood')).toBe(true);
    const after = walkScene(stood, 'ch6-empty-office');
    expect(after.seen.has('uyen-stood')).toBe(true);
    expect(after.state.evidence).toEqual(stood.evidence);
  });

  it('charges them for it: Vượt thác pays everyone but them', () => {
    const member: GameState = {
      ...withFlags(grouped, { joinedDragons: true }),
      money: { ...grouped.money, companyDebt: 60_000_000 },
      paidByMonth: {},
    };
    const stood = withFlags(member, { stoodWithUyen: true });
    expect(paidIn(playScene(member, 'ch5-payday'))).toBe(5_000_000);
    expect(paidIn(playScene(stood, 'ch5-payday'))).toBe(0);
  });

  it('makes the boss praise the nerve, not the calm, however you talked to HR before', () => {
    const stood = withFlags(grouped, { stoodWithUyen: true, keptNegotiating: true });
    const { seen } = walkScene(stood, 'ch5-offer');
    expect(seen.has('why-stood')).toBe(true);
    expect(seen.has('why-calm')).toBe(false);
  });

  it('gives nothing to someone who stood by her, then took the title', () => {
    const stood = playScene(grouped, 'ch5-company-reply', 'own-it');
    const titled = playScene(stood, 'ch5-offer', 'take-title');
    expect(titled.story.flags.joinedGroup).toBe(false);
    expect(walkScene(titled, 'ch6-empty-office').seen.has('uyen-stood')).toBe(false);
  });

  it('does not let an outsider claim the table', () => {
    const outsider = playScene(runWith(1, false), 'ch5-company-reply', 'own-it');
    expect(outsider.story.flags.stoodWithUyen).toBeUndefined();
  });
});

describe('what you tell your mother stays with you (SCENARIO-137)', () => {
  const run = runWith(1, false);
  const sent = withFlags(run, { sentHome: true });

  it('brings back the two million she never spent, and only then', () => {
    expect(playScene(sent, 'ch5-payday', 'tell-mom').money.cash).toBe(sent.money.cash + 2_000_000);
    expect(playScene(sent, 'ch5-payday', 'say-fine').money.cash).toBe(sent.money.cash);
    expect(playScene(run, 'ch5-payday', 'tell-mom').money.cash).toBe(run.money.cash);
  });

  it('eases the stress of telling, not of keeping quiet', () => {
    const tense: GameState = { ...run, mood: { ...run.mood, stress: 50 } };
    expect(playScene(tense, 'ch5-payday', 'tell-mom').mood.stress).toBe(46);
    expect(playScene(tense, 'ch5-payday', 'say-fine').mood.stress).toBe(52);
  });

  it('takes away the one place you could still pretend', () => {
    expect(walkScene(sent, 'ch5-payday', ['tell-mom']).seen.has('mom-worries')).toBe(true);
    expect(walkScene(run, 'ch5-payday', ['tell-mom']).seen.has('mom-worries')).toBe(true);
    expect(walkScene(run, 'ch5-payday', ['say-fine']).seen.has('mom-worries')).toBe(false);
  });

  it('comes back on the last day and in the endings', () => {
    const told = withFlags(run, { toldMom: true });
    expect(walkScene(told, 'ch6-last-day', ['leave']).seen.has('mom-text')).toBe(true);
    expect(walkScene(run, 'ch6-last-day', ['leave']).seen.has('mom-text')).toBe(false);
    expect(walkScene(told, 'ending-good').seen.has('call-told')).toBe(true);
    expect(walkScene(run, 'ending-good').seen.has('call-home')).toBe(true);
    expect(walkScene(told, 'ending-believer').seen.has('mom-asks')).toBe(true);
  });
});

describe('15 million for a signature (SCENARIO-138)', () => {
  const run: GameState = { ...runWith(1, false), evidence: [] };
  const grouped = withFlags(run, { joinedGroup: true });
  const offered = (state: GameState) => walkScene(state, 'ch6-last-day', ['leave']).seen;

  it('is only offered to someone who could still make trouble', () => {
    expect(offered(run).has('side-deal')).toBe(false);
    expect(offered(grouped).has('side-deal')).toBe(true);
    const papers = { ...run, evidence: ['contract', 'timesheet', 'kpi-mails'] };
    expect(offered(papers).has('side-deal')).toBe(true);
  });

  it('pays once, takes you out of the group and closes the road to pursuing', () => {
    const wanted = ['take-deal', 'pursue', 'leave-signed'];
    const { state, seen } = walkScene(grouped, 'ch6-last-day', wanted);
    expect(paidIn(state)).toBe(15_000_000);
    expect(state.story.flags.signedWaiver).toBe(true);
    expect(state.story.flags.joinedGroup).toBe(false);
    expect(seen.has('choice-signed')).toBe(true);
    expect(seen.has('choice')).toBe(false);
    expect(state.story.flags.chosePursue).toBeUndefined();
    expect(state.ending).toBe('survivor');
  });

  it('says so in The Survivor', () => {
    const signed = withFlags(run, { signedWaiver: true, choseLeave: true });
    expect(walkScene(signed, 'ending-survivor').seen.has('new-waived')).toBe(true);
  });

  it('costs nothing but goodwill to refuse', () => {
    const { state, seen } = walkScene(grouped, 'ch6-last-day', ['refuse-deal', 'pursue']);
    expect(paidIn(state)).toBe(0);
    expect(seen.has('choice')).toBe(true);
    expect(state.story.flags.chosePursue).toBe(true);
  });

  it('can be kept as a paper by someone who knows to', () => {
    const blind = playScene(grouped, 'ch6-last-day', 'copy-deal', 'leave');
    expect(blind.evidence).not.toContain('waiver-offer');
    const aware = { ...grouped, outlook: { trust: 40, awareness: 50 } };
    expect(playScene(aware, 'ch6-last-day', 'copy-deal', 'leave').evidence).toContain(
      'waiver-offer',
    );
    const advised = withFlags(grouped, { soughtAdvice: true });
    expect(playScene(advised, 'ch6-last-day', 'copy-deal', 'leave').evidence).toContain(
      'waiver-offer',
    );
  });

  it('burns the bridge: after the photo there is no signing and staying', () => {
    const aware = { ...grouped, outlook: { trust: 40, awareness: 50 } };
    const copied = playScene(aware, 'ch6-last-day', 'copy-deal', 'stay', 'leave');
    expect(copied.story.flags.choseStay).toBeUndefined();
    expect(copied.story.flags.choseLeave).toBe(true);
    const refused = playScene(aware, 'ch6-last-day', 'refuse-deal', 'stay');
    expect(refused.story.flags.choseStay).toBe(true);
  });

  it('turns that paper against the company in the endings', () => {
    const held = { ...run, evidence: ['waiver-offer'] };
    expect(walkScene(held, 'ending-good').seen.has('offer-top')).toBe(true);
    expect(walkScene(held, 'ending-investigator').seen.has('offer-top')).toBe(true);
    expect(walkScene(run, 'ending-investigator').seen.has('offer-top')).toBe(false);
  });
});

describe('someone who left early is shown the door they closed (SCENARIO-139)', () => {
  const run = runWith(1, false);

  const early = withFlags(run, { quitEarly: true });

  it('asks them what they would have chosen, and their answer reaches someone', () => {
    expect(walkScene(early, 'ending-survivor', ['warn-huni']).seen.has('huni-warned')).toBe(true);
    expect(walkScene(early, 'ending-survivor', ['leave-unread']).seen.has('huni-left')).toBe(true);
  });

  it('asks nothing of someone who stayed to the last day', () => {
    const late = withFlags(run, { choseLeave: true });
    expect(walkScene(late, 'ending-survivor').seen.has('huni-reply')).toBe(false);
  });

  it('still finishes the ending after the answer', () => {
    expect(walkScene(early, 'ending-survivor', ['warn-huni']).seen.has('year-uyen')).toBe(true);
  });
});

describe('the end of the game is played, not only read (FEAT-045)', () => {
  const decisions = (prefix: string) =>
    Object.values(world.story.scenes)
      .filter((scene) => scene.id.startsWith(prefix))
      .flatMap((scene) => Object.values(scene.nodes))
      .filter((node) => choicesOf(node).length > 0).length;

  it('keeps at least as many decisions as there were reasons to add them', () => {
    expect(decisions('ch5-')).toBeGreaterThanOrEqual(6);
    expect(decisions('ch6-')).toBeGreaterThanOrEqual(3);
  });
});

describe('nothing talks about debt before there is any (FEAT-043)', () => {
  const firstMonth = (seed: number): GameState => {
    const run = runWith(seed, false);
    return {
      ...run,
      calendar: { ...run.calendar, month: 1 },
      money: { ...run.money, companyDebt: 0 },
    };
  };

  it('keeps the unpaid jokes out of the first tickets', () => {
    const dealt = SEEDS.flatMap((seed) => take(firstMonth(seed), 'work').kpiRound?.tickets ?? []);
    const aboutDebt = world.tickets.filter(({ requires }) => requires).map(({ id }) => id);
    expect(aboutDebt.length).toBeGreaterThan(0);
    expect(dealt.filter((id) => aboutDebt.includes(id))).toEqual([]);
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

  it('lets every relationship change the story, not only a number in the dossier', () => {
    const relationsIn = (condition: Condition | undefined): string[] => {
      if (!condition) {
        return [];
      }
      if (condition.type === 'relation') {
        return [condition.npc];
      }
      if (condition.type === 'not') {
        return relationsIn(condition.condition);
      }
      return condition.type === 'all' || condition.type === 'any'
        ? condition.conditions.flatMap(relationsIn)
        : [];
    };
    const changed = new Set(
      nodes
        .flatMap((node) => choicesOf(node).flatMap((choice) => choice.effects ?? []))
        .flatMap((effect) => (effect.type === 'addRelation' ? [effect.npc] : [])),
    );
    const matter = new Set([
      ...nodes.flatMap((node) => routesOf(node).flatMap((route) => relationsIn(route.when))),
      ...nodes.flatMap((node) => choicesOf(node).flatMap((choice) => relationsIn(choice.requires))),
      ...world.endings.flatMap((ending) => relationsIn(ending.when)),
    ]);
    expect([...changed].filter((npc) => !matter.has(npc))).toEqual([]);
  });

  it('reads only flags that something sets, or the engine does', () => {
    const invented = [...flagsRead].filter((flag) => !flagsSet.has(flag) && flag !== 'renewed');
    expect(invented).toEqual([]);
  });
});
