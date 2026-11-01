export type Stat = 'cash' | 'arrears' | 'companyDebt' | 'energy' | 'stress' | 'month';

/** Conditions and effects are data, not functions: the validator can check them, saves can hold them. */
export type Condition =
  | { type: 'flag'; flag: string }
  | { type: 'stat'; stat: Stat; min?: number; max?: number }
  | { type: 'not'; condition: Condition }
  | { type: 'all'; conditions: Condition[] }
  | { type: 'any'; conditions: Condition[] };

export type Effect =
  | { type: 'setFlag'; flag: string; value?: boolean }
  /** A negative amount the player cannot cover goes to arrears: cash never drops below zero. */
  | { type: 'addCash'; amount: number }
  /** The only way the company's debt goes down (contracts/gameplay.md §3). */
  | { type: 'companyPays'; amount: number }
  | { type: 'addEnergy'; amount: number }
  | { type: 'addStress'; amount: number }
  /** Drawn from the run's RNG, so a replay gets the same luck. */
  | { type: 'chance'; chance: number; then: Effect[]; otherwise?: Effect[] };

export interface Choice {
  id: string;
  text: string;
  requires?: Condition;
  /** Required with `requires`: the player must know what is missing (contracts/gameplay.md §5). */
  lockedReason?: string;
  effects?: Effect[];
  next: string;
}

/** A line of the story. With neither `choices` nor `next` it ends the scene. */
export interface LineNode {
  /** A character id; narration without one. */
  speaker?: string;
  text: string;
  effects?: Effect[];
  choices?: Choice[];
  next?: string;
}

/** Turns the story on what happened before. The player never sees it. */
export interface RouteNode {
  routes: { when: Condition; next: string }[];
  otherwise: string;
}

export type StoryNode = LineNode | RouteNode;

export const PLACES = ['home', 'office', 'meeting', 'desk', 'hallway'] as const;
export type Place = (typeof PLACES)[number];

export interface Scene {
  id: string;
  /** Where it happens: the backdrop. */
  place: Place;
  start: string;
  nodes: Record<string, StoryNode>;
}

export interface StoryGraph {
  scenes: Record<string, Scene>;
}

export const isRouteNode = (node: StoryNode): node is RouteNode => 'routes' in node;
