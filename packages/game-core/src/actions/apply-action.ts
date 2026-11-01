import {
  closePayslip,
  continueCalendar,
  finishKpiRound,
  skipKpiRound,
  takeWeeklyAction,
} from '../calendar/calendar.js';
import { answerTicket } from '../calendar/tickets.js';
import type { GameWorld, TicketAnswer } from '../calendar/world-types.js';
import { createGameState } from '../state/game-state.js';
import type { GameState } from '../state/game-state.js';
import { advance, choose, startScene } from '../story/story-engine.js';

export type GameAction =
  | { type: 'advance' }
  | { type: 'choose'; choiceId: string }
  | { type: 'takeAction'; actionId: string }
  | { type: 'answerTicket'; answer: TicketAnswer }
  | { type: 'finishTickets' }
  | { type: 'skipTickets' }
  | { type: 'closePayslip' }
  | { type: 'renewContract' };

export type ActionResult =
  | { ok: true; state: GameState }
  /** The state is unchanged (contracts/gameplay.md §1). */
  | { ok: false; state: GameState };

const afterStory = (state: GameState | null, world: GameWorld) =>
  state && state.story.sceneId === null ? continueCalendar(state, world) : state;

/** Set on a renewed run: scenes can notice they are being played again. */
export const RENEWED_FLAG = 'renewed';

/**
 * Ending 5: the run starts over and the debt stays, which is the joke (GDD §6). A new seed, or the
 * same bad luck would repeat word for word.
 */
const renewContract = (state: GameState, world: GameWorld): GameState | null => {
  const ending = world.endings.find(({ id }) => id === state.ending);
  if (state.phase !== 'ended' || !ending?.loops) {
    return null;
  }
  const fresh = createGameState(state.seed + 1, world.rules);
  const renewed: GameState = {
    ...fresh,
    loops: state.loops + 1,
    money: { ...fresh.money, companyDebt: state.money.companyDebt },
    story: { ...fresh.story, flags: { [RENEWED_FLAG]: true } },
  };
  return startScene(renewed, world.story, world.renewalScene, world.evidence);
};

const reduce = (state: GameState, action: GameAction, world: GameWorld): GameState | null => {
  switch (action.type) {
    case 'advance':
      return afterStory(advance(state, world.story, world.evidence), world);
    case 'choose':
      return afterStory(choose(state, world.story, action.choiceId, world.evidence), world);
    case 'takeAction':
      return takeWeeklyAction(state, world, action.actionId);
    case 'answerTicket':
      return answerTicket(state, world, action.answer);
    case 'finishTickets':
      return finishKpiRound(state, world);
    case 'skipTickets':
      return skipKpiRound(state, world);
    case 'closePayslip':
      return closePayslip(state, world);
    case 'renewContract':
      return renewContract(state, world);
  }
};

/** The one way a run changes. Pure: the UI asks, this decides. */
export const applyAction = (
  state: GameState,
  action: GameAction,
  world: GameWorld,
): ActionResult => {
  const next = reduce(state, action, world);
  return next === null ? { ok: false, state } : { ok: true, state: next };
};

export const beginRun = (seed: number, world: GameWorld): GameState =>
  startScene(createGameState(seed, world.rules), world.story, world.openingScene, world.evidence);

/**
 * Takes up a loaded run. A save can outlive a scene a later version renamed: it must not strand the
 * player on a line that no longer exists.
 */
export const resumeRun = (state: GameState, world: GameWorld): GameState => {
  const { sceneId, nodeId } = state.story;
  const known = sceneId !== null && nodeId !== null && world.story.scenes[sceneId]?.nodes[nodeId];
  if (state.phase !== 'scene' || known) {
    return state;
  }
  return continueCalendar(
    { ...state, story: { ...state.story, sceneId: null, nodeId: null } },
    world,
  );
};

/** Replays a run from its seed. An action that is refused here means the script is wrong. */
export const replay = (seed: number, actions: readonly GameAction[], world: GameWorld): GameState =>
  actions.reduce(
    (state, action, index) => {
      const result = applyAction(state, action, world);
      if (!result.ok) {
        throw new Error(`Action ${index} was refused: ${JSON.stringify(action)}`);
      }
      return result.state;
    },
    beginRun(seed, world),
  );
