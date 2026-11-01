import { seedRng } from '../rng/seeded-rng.js';
import type { RngState } from '../rng/seeded-rng.js';

export interface StoryProgress {
  /** Null between scenes. */
  sceneId: string | null;
  nodeId: string | null;
  flags: Readonly<Record<string, boolean>>;
  seenScenes: readonly string[];
}

/** See architecture/gameplay.md §2. `ended`: the end of the content so far, or of the run. */
export type Phase = 'scene' | 'week' | 'kpi' | 'payslip' | 'ended';

export interface Calendar {
  month: number;
  week: number;
  actionsLeft: number;
  /** The month's four weeks are over and payday is being settled. */
  payday: boolean;
}

export interface Money {
  /** Whole VND, never negative (contracts/gameplay.md §3). */
  cash: number;
  /** What the player could not pay: bills, and whatever else cash did not cover. */
  arrears: number;
  /** Borrowed from friends and family, kept apart from what is owed to bills. */
  loans: number;
  /** What the company owes the player. */
  companyDebt: number;
}

export interface Mood {
  energy: number;
  stress: number;
}

export interface PayslipLine {
  label: string;
  amount: number;
}

/** The month's settlement, kept in the state so a reload shows the same slip. */
export interface Payslip {
  month: number;
  salaryDue: number;
  salaryPaid: number;
  bills: readonly PayslipLine[];
  /** Left unpaid after this slip. */
  arrears: number;
  cash: number;
  loans: number;
  companyDebt: number;
  /** Null in the months before KPIs exist. */
  kpi: { points: number; target: number } | null;
}

/** A round of tickets at the desk (FEAT-012). */
export interface KpiRound {
  /** The weekly action it belongs to, finished when the round is. */
  actionId: string;
  tickets: readonly string[];
  /** The ticket on screen. */
  index: number;
  score: number;
  /** How the last answer went, shown above the next ticket. */
  last: { ticketId: string; correct: boolean } | null;
}

export interface CrisisRecord {
  count: number;
  lastMonth: number;
}

/** The whole of a run (contracts/gameplay.md §1). Plain JSON, so a save is just this. */
export interface GameState {
  seed: number;
  rng: RngState;
  phase: Phase;
  calendar: Calendar;
  money: Money;
  mood: Mood;
  story: StoryProgress;
  /** By NPC, -100 to 100. A missing NPC is at 0. */
  relations: Readonly<Record<string, number>>;
  /** This month's points. */
  kpi: number;
  kpiRound: KpiRound | null;
  /** Ids, in the order found. */
  evidence: readonly string[];
  crises: Readonly<Record<string, CrisisRecord>>;
  /** Set when the run is decided: the id of an `EndingRule`. */
  ending: string | null;
  /** How many times this run renewed its contract (Ending 5). */
  loops: number;
  payslip: Payslip | null;
  /** The line under the week screen after an action. */
  lastOutcome: string | null;
}

export interface RunStart {
  actionsPerWeek: number;
  startingCash: number;
  startingEnergy: number;
  startingStress: number;
}

export const createGameState = (seed: number, start: RunStart): GameState => ({
  seed,
  rng: seedRng(seed),
  phase: 'scene',
  calendar: { month: 1, week: 1, actionsLeft: start.actionsPerWeek, payday: false },
  money: { cash: start.startingCash, arrears: 0, loans: 0, companyDebt: 0 },
  mood: { energy: start.startingEnergy, stress: start.startingStress },
  story: { sceneId: null, nodeId: null, flags: {}, seenScenes: [] },
  relations: {},
  kpi: 0,
  kpiRound: null,
  evidence: [],
  crises: {},
  ending: null,
  loops: 0,
  payslip: null,
  lastOutcome: null,
});
