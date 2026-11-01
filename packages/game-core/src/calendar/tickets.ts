import { drawRandom } from '../rng/seeded-rng.js';
import type { RngState } from '../rng/seeded-rng.js';
import type { GameState, KpiRound } from '../state/game-state.js';
import { meets } from '../story/conditions.js';
import type { GameWorld, Ticket, TicketAnswer } from './world-types.js';

/** Picks `count` different tickets, from the run's RNG. */
const dealTickets = (
  rng: RngState,
  pool: readonly Ticket[],
  count: number,
): { tickets: string[]; rng: RngState } => {
  const deck = pool.map((ticket) => ticket.id);
  let state = rng;
  for (let index = 0; index < Math.min(count, deck.length); index += 1) {
    const { value, next } = drawRandom(state);
    state = next;
    const swap = index + Math.floor(value * (deck.length - index));
    [deck[index], deck[swap]] = [deck[swap] as string, deck[index] as string];
  }
  return { tickets: deck.slice(0, count), rng: state };
};

export const startKpiRound = (state: GameState, world: GameWorld, actionId: string): GameState => {
  const pool = world.tickets.filter(({ requires }) => !requires || meets(state, requires));
  const { tickets, rng } = dealTickets(state.rng, pool, world.rules.ticketsPerRound);
  const kpiRound: KpiRound = { actionId, tickets, index: 0, score: 0, last: null };
  return { ...state, rng, phase: 'kpi', kpiRound };
};

const findTicket = (world: GameWorld, id: string | undefined) =>
  world.tickets.find((ticket) => ticket.id === id);

/** Null when the round is over or there is none: a repeated tap ends here. */
export const answerTicket = (
  state: GameState,
  world: GameWorld,
  answer: TicketAnswer,
): GameState | null => {
  const round = state.kpiRound;
  const ticket = findTicket(world, round?.tickets[round.index]);
  if (state.phase !== 'kpi' || !round || !ticket) {
    return null;
  }
  const correct = ticket.answer === answer;
  return {
    ...state,
    kpiRound: {
      ...round,
      index: round.index + 1,
      score: round.score + (correct ? 1 : 0),
      last: { ticketId: ticket.id, correct },
    },
  };
};

export const roundIsOver = (round: KpiRound): boolean => round.index >= round.tickets.length;

export interface TicketView {
  /** Null when the round has been answered: only the last reply is left to read. */
  ticket: Ticket | null;
  number: number;
  total: number;
  last: { correct: boolean; reply: string } | null;
}

export const ticketView = (state: GameState, world: GameWorld): TicketView | null => {
  const round = state.kpiRound;
  if (!round) {
    return null;
  }
  const previous = findTicket(world, round.last?.ticketId);
  return {
    ticket: findTicket(world, round.tickets[round.index]) ?? null,
    number: Math.min(round.index + 1, round.tickets.length),
    total: round.tickets.length,
    last: round.last && previous ? { correct: round.last.correct, reply: previous.reply } : null,
  };
};
