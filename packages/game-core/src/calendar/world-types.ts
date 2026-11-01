import type { RunStart } from '../state/game-state.js';
import type { Condition, Effect, StoryGraph } from '../story/story-types.js';

export interface GameRules extends RunStart {
  weeksPerMonth: number;
  /** The month the content ends on. */
  lastMonth: number;
  salary: number;
  /** A week's sleep. */
  weeklyEnergyRecovery: number;
  /** What a payday without the full salary does to a person. */
  unpaidStress: number;
  /** The chance of a surprise bill each month. */
  surpriseChance: number;
}

/** One of the week's choices (GDD §4). */
export interface WeeklyAction {
  id: string;
  label: string;
  /** What it costs and gives, in the player's words. */
  hint: string;
  requires?: Condition;
  lockedReason?: string;
  effects: Effect[];
  /** One is picked at random and shown under the week. */
  outcomes: string[];
}

/** A scene the calendar plays once: at the start of a week, or on the month's payday. */
export interface Beat {
  scene: string;
  month: number;
  /** Omitted: on payday. */
  week?: number;
  requires?: Condition;
}

export interface Bill {
  label: string;
  amount: number;
}

/** Everything a run reads but never changes: the content. */
export interface GameWorld {
  story: StoryGraph;
  openingScene: string;
  rules: GameRules;
  actions: readonly WeeklyAction[];
  beats: readonly Beat[];
  /** The share of the salary paid each month, from month 1. Past the end: nothing. */
  payroll: readonly number[];
  bills: readonly Bill[];
  surprises: readonly Bill[];
}
