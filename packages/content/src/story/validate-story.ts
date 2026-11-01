import { isRouteNode } from '@cstar/game-core';
import type { Condition, Effect, Scene, StoryGraph, StoryNode } from '@cstar/game-core';

export interface StoryIssue {
  scene: string;
  node?: string;
  message: string;
}

export interface StoryCatalog {
  characters: readonly string[];
}

const nextsOf = (node: StoryNode): string[] => {
  if (isRouteNode(node)) {
    return [...node.routes.map((route) => route.next), node.otherwise];
  }
  return [...(node.choices ?? []).map((choice) => choice.next), ...(node.next ? [node.next] : [])];
};

const isEnd = (node: StoryNode) => !isRouteNode(node) && nextsOf(node).length === 0;

/** Nodes reachable from `from`, following `linksOf`. */
const walk = (from: string[], linksOf: (nodeId: string) => string[]): Set<string> => {
  const seen = new Set<string>();
  const pending = [...from];
  while (pending.length > 0) {
    const nodeId = pending.pop() as string;
    if (!seen.has(nodeId)) {
      seen.add(nodeId);
      pending.push(...linksOf(nodeId));
    }
  }
  return seen;
};

const flagsIn = (condition: Condition): string[] => {
  switch (condition.type) {
    case 'flag':
      return [condition.flag];
    case 'not':
      return flagsIn(condition.condition);
    case 'all':
    case 'any':
      return condition.conditions.flatMap(flagsIn);
  }
};

const conditionsOf = (node: StoryNode): Condition[] =>
  isRouteNode(node)
    ? node.routes.map((route) => route.when)
    : (node.choices ?? []).flatMap((choice) => (choice.requires ? [choice.requires] : []));

const effectsOf = (node: StoryNode): Effect[] =>
  isRouteNode(node)
    ? []
    : [...(node.effects ?? []), ...(node.choices ?? []).flatMap((choice) => choice.effects ?? [])];

/** A loop of route nodes alone would hang the game with nothing on screen. */
const hasRouteLoop = (scene: Scene, start: string): boolean => {
  const inProgress = new Set<string>();
  const finished = new Set<string>();
  const visit = (nodeId: string): boolean => {
    if (inProgress.has(nodeId)) {
      return true;
    }
    const node = scene.nodes[nodeId];
    if (finished.has(nodeId) || !node || !isRouteNode(node)) {
      return false;
    }
    inProgress.add(nodeId);
    const looped = nextsOf(node).some(visit);
    inProgress.delete(nodeId);
    finished.add(nodeId);
    return looped;
  };
  return visit(start);
};

const checkScene = (key: string, scene: Scene, catalog: StoryCatalog): StoryIssue[] => {
  const issues: StoryIssue[] = [];
  const report = (message: string, node?: string) =>
    issues.push({ scene: key, message, ...(node !== undefined && { node }) });

  if (scene.id !== key) {
    report(`scene id "${scene.id}" differs from its key`);
  }
  if (!(scene.start in scene.nodes)) {
    report(`start "${scene.start}" does not exist`);
    return issues;
  }

  const nodes = Object.entries(scene.nodes);
  for (const [nodeId, node] of nodes) {
    for (const next of nextsOf(node)) {
      if (!(next in scene.nodes)) {
        report(`goes to "${next}", which does not exist`, nodeId);
      }
    }
    if (hasRouteLoop(scene, nodeId)) {
      report('route nodes loop with no line in between', nodeId);
    }
    if (isRouteNode(node)) {
      continue;
    }
    if (node.speaker !== undefined && !catalog.characters.includes(node.speaker)) {
      report(`unknown speaker "${node.speaker}"`, nodeId);
    }
    if (node.choices && node.next !== undefined) {
      report('has both choices and next', nodeId);
    }
    const choices = node.choices ?? [];
    if (new Set(choices.map((choice) => choice.id)).size !== choices.length) {
      report('has two choices with the same id', nodeId);
    }
    if (choices.length > 0 && choices.every((choice) => choice.requires)) {
      report('every choice can be locked: the player could get stuck', nodeId);
    }
    for (const choice of choices) {
      if (choice.requires && !choice.lockedReason) {
        report(`choice "${choice.id}" has no lockedReason`, nodeId);
      }
    }
  }

  const known = (nodeId: string) => (scene.nodes[nodeId] ? nextsOf(scene.nodes[nodeId]) : []);
  const reachable = walk([scene.start], known);
  const incoming = new Map<string, string[]>();
  for (const [nodeId, node] of nodes) {
    for (const next of nextsOf(node)) {
      incoming.set(next, [...(incoming.get(next) ?? []), nodeId]);
    }
  }
  const ends = nodes.filter(([, node]) => isEnd(node)).map(([nodeId]) => nodeId);
  const canFinish = walk(ends, (nodeId) => incoming.get(nodeId) ?? []);

  for (const [nodeId] of nodes) {
    if (!reachable.has(nodeId)) {
      report('can never be reached', nodeId);
    } else if (!canFinish.has(nodeId)) {
      report('can never reach the end of the scene', nodeId);
    }
  }
  return issues;
};

/** Every way a story can trap or confuse a player that can be seen without playing it. */
export const validateStory = (story: StoryGraph, catalog: StoryCatalog): StoryIssue[] => {
  const scenes = Object.entries(story.scenes);
  const issues = scenes.flatMap(([key, scene]) => checkScene(key, scene, catalog));

  const setFlags = new Set(
    scenes.flatMap(([, scene]) =>
      Object.values(scene.nodes)
        .flatMap(effectsOf)
        .flatMap((effect) => (effect.type === 'setFlag' ? [effect.flag] : [])),
    ),
  );
  for (const [key, scene] of scenes) {
    for (const [nodeId, node] of Object.entries(scene.nodes)) {
      for (const flag of conditionsOf(node).flatMap(flagsIn)) {
        if (!setFlags.has(flag)) {
          issues.push({ scene: key, node: nodeId, message: `reads flag "${flag}", set nowhere` });
        }
      }
    }
  }
  return issues;
};
