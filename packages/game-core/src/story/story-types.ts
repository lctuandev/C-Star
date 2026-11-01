/** Conditions and effects are data, not functions: the validator can check them, saves can hold them. */
export type Condition =
  | { type: 'flag'; flag: string }
  | { type: 'not'; condition: Condition }
  | { type: 'all'; conditions: Condition[] }
  | { type: 'any'; conditions: Condition[] };

export type Effect = { type: 'setFlag'; flag: string; value?: boolean };

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

export interface Scene {
  id: string;
  start: string;
  nodes: Record<string, StoryNode>;
}

export interface StoryGraph {
  scenes: Record<string, Scene>;
}

export const isRouteNode = (node: StoryNode): node is RouteNode => 'routes' in node;
