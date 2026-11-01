import { describe, expect, it } from 'vitest';
import { applyAction, replay } from '../actions/apply-action.js';
import type { GameAction } from '../actions/apply-action.js';
import type { GameState } from '../state/game-state.js';
import { testWorld as world } from '../test-world.fixture.js';
import { ticketView } from './tickets.js';
import type { GameWorld } from './world-types.js';

const intoTheWeek: GameAction[] = [
  { type: 'advance' },
  { type: 'choose', choiceId: 'polite' },
  { type: 'advance' },
];
const act = (actionId: string): GameAction => ({ type: 'takeAction', actionId });
const answer = (value: 'do' | 'defer'): GameAction => ({ type: 'answerTicket', answer: value });
const finish: GameAction = { type: 'finishTickets' };
const skip: GameAction = { type: 'skipTickets' };
const fourRests = [act('rest'), act('rest'), act('rest'), act('rest')];
const refused = (state: GameState, action: GameAction, game = world) => {
  const result = applyAction(state, action, game);
  expect(result.ok).toBe(false);
  expect(result.state).toBe(state);
};
const atDesk = (seed = 1) => replay(seed, [...intoTheWeek, act('desk')], world);

/** The right answers for the round on screen. */
const answers = (state: GameState): GameAction[] =>
  (state.kpiRound?.tickets ?? []).map((id) =>
    answer(world.tickets.find((ticket) => ticket.id === id)?.answer ?? 'do'),
  );
const wrong = (action: GameAction): GameAction =>
  answer((action as { answer: string }).answer === 'do' ? 'defer' : 'do');

describe('a round of tickets (SCENARIO-038)', () => {
  it('stops the week until it is done', () => {
    const state = atDesk();
    expect(state.phase).toBe('kpi');
    expect(state.calendar.actionsLeft).toBe(2);
    refused(state, act('rest'));
  });

  it('deals different tickets, from the seed', () => {
    const { tickets } = atDesk().kpiRound!;
    expect(tickets).toHaveLength(2);
    expect(new Set(tickets).size).toBe(2);
    expect(atDesk().kpiRound).toEqual(atDesk().kpiRound);
  });

  it('scores right answers, shows each reply, then counts the action', () => {
    const start = atDesk();
    const script = answers(start);
    const first = replay(1, [...intoTheWeek, act('desk'), script[0]!], world);
    const view = ticketView(first, world);
    expect(view?.number).toBe(2);
    expect(view?.last?.correct).toBe(true);
    expect(view?.last?.reply).toBeTruthy();

    const answered = replay(1, [...intoTheWeek, act('desk'), ...script], world);
    expect(ticketView(answered, world)?.ticket).toBeNull();
    refused(answered, answer('do'));

    const done = replay(1, [...intoTheWeek, act('desk'), ...script, finish], world);
    expect(done).toMatchObject({ phase: 'week', kpi: 2, kpiRound: null });
    expect(done.calendar.actionsLeft).toBe(1);
    expect(done.lastOutcome).toBe('Xong ticket.');
  });

  it('gives nothing for wrong answers', () => {
    const script = answers(atDesk()).map(wrong);
    const done = replay(1, [...intoTheWeek, act('desk'), ...script, finish], world);
    expect(done.kpi).toBe(0);
  });

  it('cannot be finished early', () => {
    refused(atDesk(), finish);
  });

  it('can be skipped, for fewer points', () => {
    const done = replay(1, [...intoTheWeek, act('desk'), skip], world);
    expect(done).toMatchObject({ phase: 'week', kpi: 1 });
  });

  it('refuses tickets outside a round', () => {
    const week = replay(1, intoTheWeek, world);
    refused(week, answer('do'));
    refused(week, finish);
    refused(week, skip);
  });

  it('survives a reload in the middle', () => {
    const state = JSON.parse(JSON.stringify(atDesk())) as GameState;
    const script = answers(state);
    expect(applyAction(state, script[0]!, world).ok).toBe(true);
  });
});

describe('the month’s KPI (SCENARIO-038)', () => {
  const monthTwo: GameAction[] = [
    ...intoTheWeek,
    act('rest'),
    act('rest'),
    { type: 'advance' },
    act('rest'),
    act('rest'),
    { type: 'advance' },
    { type: 'closePayslip' },
  ];
  const noCrisis: GameWorld = { ...world, crises: [] };

  it('is on the slip, and missing it costs trust and sleep', () => {
    const state = replay(1, [...monthTwo, ...fourRests], noCrisis);
    expect(state.payslip?.kpi).toEqual({ points: 0, target: 3 });
    expect(state.relations.boss).toBe(-10);
  });

  it('pleases the boss when met', () => {
    const easy: GameWorld = {
      ...noCrisis,
      rules: { ...world.rules, kpiTargets: [0, 1] },
    };
    const state = replay(
      1,
      [...monthTwo, act('desk'), skip, act('rest'), act('rest'), act('rest')],
      easy,
    );
    expect(state.payslip?.kpi).toEqual({ points: 1, target: 1 });
    expect(state.relations.boss).toBe(10);
  });

  it('shows no KPI on a month without a target', () => {
    const none: GameWorld = { ...noCrisis, rules: { ...world.rules, kpiTargets: [0, 0] } };
    expect(replay(1, [...monthTwo, ...fourRests], none).payslip?.kpi).toBeNull();
  });

  it('resets on the new month', () => {
    const paid = replay(1, monthTwo, noCrisis);
    expect(paid.kpi).toBe(0);
  });
});

describe('looking for papers (SCENARIO-039)', () => {
  it('says what was found', () => {
    const state = replay(1, [...intoTheWeek, act('look')], world);
    expect(state.evidence).toEqual(['contract']);
    expect(state.lastOutcome).toBe('Bạn lưu lại: Hợp đồng.');
  });

  it('says so when there is nothing more', () => {
    const state = replay(
      1,
      [...intoTheWeek, act('look'), act('look'), { type: 'advance' }, act('look')],
      world,
    );
    expect(state.evidence).toEqual(['contract', 'early']);
    expect(state.lastOutcome).toBe('Không tìm thêm được gì.');
  });
});

describe('crises (SCENARIO-040, 041)', () => {
  const broke: GameWorld = {
    ...world,
    payroll: [0, 0],
    bills: [{ label: 'Tiền nhà', amount: 1_500 }],
  };
  const toMonthTwo: GameAction[] = [
    ...intoTheWeek,
    act('rest'),
    act('rest'),
    { type: 'advance' },
    act('rest'),
    act('rest'),
    { type: 'advance' },
    { type: 'closePayslip' },
  ];

  it('play when money runs out, after the slip, not before', () => {
    const state = replay(1, toMonthTwo, broke);
    expect(state.phase).toBe('scene');
    expect(state.story.sceneId).toBe('broke');
    expect(state.crises.broke).toEqual({ count: 1, lastMonth: 2 });
  });

  it('let the player borrow, keep cash positive, and write the loan down', () => {
    const state = replay(1, [...toMonthTwo, { type: 'advance' }], broke);
    expect(state.phase).toBe('week');
    expect(state.money).toMatchObject({ arrears: 0, cash: 1_500, loans: 2_000 });
  });

  it('play at most once a month', () => {
    const after = replay(1, [...toMonthTwo, { type: 'advance' }], broke);
    const still: GameState = { ...after, money: { ...after.money, arrears: 100 } };
    const result = applyAction(still, act('rest'), broke);
    expect(result.state.story.sceneId).toBeNull();
  });

  it('take the rest of the week when the player burns out, and never end the run', () => {
    const drained: GameWorld = {
      ...world,
      actions: [
        {
          id: 'grind',
          label: 'Cày',
          hint: 'x',
          effects: [{ type: 'addEnergy', amount: -100 }],
          outcomes: ['Hết sức.'],
        },
      ],
    };
    const state = replay(1, [...intoTheWeek, act('grind')], drained);
    expect(state.story.sceneId).toBe('burnout');

    const after = replay(1, [...intoTheWeek, act('grind'), { type: 'advance' }], drained);
    expect(after.calendar.week).toBe(2);
    expect(after.mood.energy).toBeGreaterThan(0);
  });
});
