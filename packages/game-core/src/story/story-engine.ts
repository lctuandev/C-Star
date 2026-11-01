import type { GameState } from '../state/game-state.js';
import { meets } from './conditions.js';
import { applyEffects } from './effects.js';
import { isRouteNode } from './story-types.js';
import type { Choice, LineNode, StoryGraph } from './story-types.js';

export interface ChoiceView {
  id: string;
  text: string;
  available: boolean;
  lockedReason?: string;
}

/** What the UI draws for the current line. Derived, never saved. */
export interface NodeView {
  sceneId: string;
  nodeId: string;
  speaker: string | null;
  text: string;
  choices: ChoiceView[];
  /** False while a choice is on screen. */
  canAdvance: boolean;
}

const currentLine = (state: GameState, story: StoryGraph): LineNode | null => {
  const { sceneId, nodeId } = state.story;
  if (sceneId === null || nodeId === null) {
    return null;
  }
  const node = story.scenes[sceneId]?.nodes[nodeId];
  return node && !isRouteNode(node) ? node : null;
};

const leaveScene = (state: GameState): GameState => ({
  ...state,
  story: { ...state.story, sceneId: null, nodeId: null },
});

/** Moves to a node: runs through route nodes and applies a line's effects, once, on arrival. */
const enterNode = (
  state: GameState,
  story: StoryGraph,
  sceneId: string,
  nodeId: string,
): GameState => {
  const node = story.scenes[sceneId]?.nodes[nodeId];
  if (!node) {
    throw new Error(`Unknown node ${sceneId}/${nodeId}: the content validator should catch this.`);
  }
  if (isRouteNode(node)) {
    const route = node.routes.find(({ when }) => meets(state, when));
    return enterNode(state, story, sceneId, route?.next ?? node.otherwise);
  }
  return applyEffects({ ...state, story: { ...state.story, sceneId, nodeId } }, node.effects);
};

export const startScene = (state: GameState, story: StoryGraph, sceneId: string): GameState => {
  const scene = story.scenes[sceneId];
  if (!scene) {
    throw new Error(`Unknown scene ${sceneId}.`);
  }
  const seen = state.story.seenScenes.includes(sceneId)
    ? state.story.seenScenes
    : [...state.story.seenScenes, sceneId];
  return enterNode(
    { ...state, story: { ...state.story, seenScenes: seen } },
    story,
    sceneId,
    scene.start,
  );
};

/** Null when the line waits for a choice, or there is no line: the caller rejects the action. */
export const advance = (state: GameState, story: StoryGraph): GameState | null => {
  const line = currentLine(state, story);
  if (!line || line.choices) {
    return null;
  }
  return line.next === undefined
    ? leaveScene(state)
    : enterNode(state, story, state.story.sceneId as string, line.next);
};

const isOpen = (state: GameState, choice: Choice) =>
  choice.requires === undefined || meets(state, choice.requires);

/** Null for a choice that is not on screen or is locked: a repeated tap ends here. */
export const choose = (state: GameState, story: StoryGraph, choiceId: string): GameState | null => {
  const choice = currentLine(state, story)?.choices?.find(({ id }) => id === choiceId);
  if (!choice || !isOpen(state, choice)) {
    return null;
  }
  return enterNode(
    applyEffects(state, choice.effects),
    story,
    state.story.sceneId as string,
    choice.next,
  );
};

export const viewOf = (state: GameState, story: StoryGraph): NodeView | null => {
  const line = currentLine(state, story);
  if (!line) {
    return null;
  }
  return {
    sceneId: state.story.sceneId as string,
    nodeId: state.story.nodeId as string,
    speaker: line.speaker ?? null,
    text: line.text,
    choices: (line.choices ?? []).map((choice) => {
      const available = isOpen(state, choice);
      return {
        id: choice.id,
        text: choice.text,
        available,
        ...(!available && { lockedReason: choice.lockedReason }),
      };
    }),
    canAdvance: !line.choices,
  };
};
