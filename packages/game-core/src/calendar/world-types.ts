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
  /** Per month, from month 1. 0 or past the end: no KPI yet. */
  kpiTargets: readonly number[];
  /** Missing the month's target. */
  kpiMissStress: number;
  /** What the boss's trust does when the target is met, or missed by the same amount. */
  kpiTrust: number;
  ticketsPerRound: number;
  /** Points for skipping the round with "Làm cho có". */
  quickTaskPoints: number;
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
  /** Plays a round of tickets before the action counts. */
  tickets?: boolean;
}

export type TicketAnswer = 'do' | 'defer';

/** One item of the desk mini-game (GDD §5.5). */
export interface Ticket {
  id: string;
  from: string;
  text: string;
  answer: TicketAnswer;
  /** Shown after the player's answer, right or wrong. */
  reply: string;
}

/** A paper the player can keep (GDD §5.3). */
export interface EvidenceItem {
  id: string;
  title: string;
  description: string;
  /** Outside these months `findEvidence` cannot find it: some papers can be missed. */
  fromMonth?: number;
  toMonth?: number;
  requires?: Condition;
}

/** A scene that plays when the player hits a wall, at most once a month. */
export interface CrisisRule {
  id: string;
  scene: string;
  when: Condition;
}

/** One of the ways a run ends. The first rule that holds wins (GDD §6). */
export interface EndingRule {
  id: string;
  title: string;
  /** Shown on the end screen. */
  summary: string;
  /** Shown in the collection until it has been reached. */
  hint: string;
  scene: string;
  /** Omitted on the last rule, which catches every other run. */
  when?: Condition;
  /** Ending 5: instead of an end, the contract renews (GDD §6). */
  loops?: boolean;
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
  tickets: readonly Ticket[];
  evidence: readonly EvidenceItem[];
  crises: readonly CrisisRule[];
  /** In order: the first that holds. The last has no condition. */
  endings: readonly EndingRule[];
  /** Opens a renewed run. */
  renewalScene: string;
}
