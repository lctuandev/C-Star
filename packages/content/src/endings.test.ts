import { applyAction, beginRun, roundIsOver, viewOf, weekActions } from '@cstar/game-core';
import type { GameAction, GameState } from '@cstar/game-core';
import { describe, expect, it } from 'vitest';
import { world } from './world.js';

interface Plan {
  /** Taken whenever they are on screen, in this order. */
  choices: readonly string[];
  /** The week's actions in order of preference. */
  actions: readonly string[];
}

const answerOf = (state: GameState) => {
  const round = state.kpiRound;
  const ticket = world.tickets.find(({ id }) => id === round?.tickets[round.index]);
  return ticket?.answer ?? 'do';
};

/** Plays a run to the end the way one kind of player would. */
const playAs = (plan: Plan, seed = 1) => {
  let state = beginRun(seed, world);
  for (let step = 0; step < 3_000 && state.phase !== 'ended'; step += 1) {
    const action = decide(state, plan);
    const result = applyAction(state, action, world);
    expect(result.ok).toBe(true);
    state = result.state;
  }
  expect(state.phase).toBe('ended');
  return state;
};

const decide = (state: GameState, plan: Plan): GameAction => {
  if (state.phase === 'payslip') {
    return { type: 'closePayslip' };
  }
  if (state.phase === 'kpi') {
    return roundIsOver(state.kpiRound!)
      ? { type: 'finishTickets' }
      : { type: 'answerTicket', answer: answerOf(state) };
  }
  if (state.phase === 'week') {
    const open = weekActions(state, world).filter((action) => action.available);
    const wanted = plan.actions.find((id) => open.some((action) => action.id === id));
    return { type: 'takeAction', actionId: wanted ?? open[0]!.id };
  }
  const view = viewOf(state, world.story);
  if (view?.canAdvance) {
    return { type: 'advance' };
  }
  const open = view!.choices.filter((choice) => choice.available);
  const wanted = plan.choices.find((id) => open.some((choice) => choice.id === id));
  return { type: 'choose', choiceId: wanted ?? open[0]!.id };
};

const careful = ['read-contract', 'near-uyen', 'start-notes', 'join', 'invite-dan', 'act'];
const earner = ['side-gig', 'rest', 'investigate', 'chat'];
const keeper = ['investigate', 'side-gig', 'rest', 'chat'];

const PLANS: Record<string, Plan> = {
  good: {
    choices: [...careful, 'formal', 'refuse-title', 'pursue'],
    actions: keeper,
  },
  collective: {
    choices: ['accept-fast', 'near-uyen', 'join', 'not-yet', 'talk', 'refuse-title', 'pursue'],
    actions: earner,
  },
  investigator: {
    choices: ['read-contract', 'start-notes', 'decline', 'formal', 'take-title', 'pursue'],
    actions: keeper,
  },
  survivor: {
    choices: ['accept-fast', 'not-yet', 'decline', 'talk', 'refuse-title', 'leave'],
    actions: earner,
  },
  believer: {
    choices: [
      'accept-fast',
      'clap',
      'volunteer',
      'decline',
      'wait',
      'back-boss',
      'talk',
      'take-title',
      'stay',
    ],
    actions: ['work', 'rest', 'side-gig'],
  },
  'empty-promise': {
    choices: [
      'accept-fast',
      'look-down',
      'quiet',
      'not-yet',
      'decline',
      'wait',
      'talk',
      'refuse-title',
      'stay',
    ],
    actions: ['rest', 'side-gig'],
  },
};

describe('every ending has a way to it (SCENARIO-047)', () => {
  it('covers all of them', () => {
    expect(Object.keys(PLANS).sort()).toEqual(world.endings.map(({ id }) => id).sort());
  });

  it.each(Object.entries(PLANS))('%s', (id, plan) => {
    expect(playAs(plan).ending).toBe(id);
    expect(playAs(plan, 7).ending).toBe(id);
  });

  it('pays what each ending promises', () => {
    const debtOf = (id: string) => playAs(PLANS[id]!).money.companyDebt;
    expect(debtOf('good')).toBe(0);
    expect(debtOf('collective')).toBeLessThan(debtOf('survivor'));
    expect(debtOf('investigator')).toBeLessThan(debtOf('survivor'));
  });

  it('can quit early once the money crisis has come three times', () => {
    const poor = { ...world, rules: { ...world.rules, startingCash: 0 } };
    expect(poor.crises[0]?.id).toBe('broke');
    const quitter: Plan = { choices: ['quit', 'sell'], actions: ['rest'] };
    let state = beginRun(1, poor);
    for (let step = 0; step < 3_000 && state.phase !== 'ended'; step += 1) {
      const result = applyAction(state, decide(state, quitter), poor);
      state = result.state;
    }
    expect(state.ending).toBe('survivor');
    expect(state.calendar.month).toBeLessThan(8);
  });
});

describe('the loop of Ending 5 (SCENARIO-048)', () => {
  it('starts over, keeps the debt, and can be left', () => {
    const over = playAs(PLANS['empty-promise']!);
    const renewed = applyAction(over, { type: 'renewContract' }, world);
    expect(renewed.ok).toBe(true);
    expect(renewed.state.money.companyDebt).toBe(over.money.companyDebt);
    expect(renewed.state.story.sceneId).toBe(world.renewalScene);
    expect(renewed.state.calendar.month).toBe(1);
  });

  it('plays a second time through', () => {
    const over = playAs(PLANS['empty-promise']!);
    let state = applyAction(over, { type: 'renewContract' }, world).state;
    const plan = PLANS['empty-promise']!;
    for (let step = 0; step < 3_000 && state.phase !== 'ended'; step += 1) {
      const result = applyAction(state, decide(state, plan), world);
      expect(result.ok).toBe(true);
      state = result.state;
    }
    expect(state.ending).toBe('empty-promise');
    expect(state.loops).toBe(1);
    expect(state.money.companyDebt).toBeGreaterThan(over.money.companyDebt);
  });
});
