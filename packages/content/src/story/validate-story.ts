import { isRouteNode } from '@cstar/game-core';
import type { Condition, Effect, GameWorld, Scene, StoryGraph, StoryNode } from '@cstar/game-core';

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
    case 'stat':
    case 'relation':
    case 'evidence':
    case 'crisisCount':
      return [];
    case 'not':
      return flagsIn(condition.condition);
    case 'all':
    case 'any':
      return condition.conditions.flatMap(flagsIn);
  }
};

/** Effects inside a `chance` count too. */
const flattenEffects = (effects: readonly Effect[]): Effect[] =>
  effects.flatMap((effect) =>
    effect.type === 'chance'
      ? [effect, ...flattenEffects(effect.then), ...flattenEffects(effect.otherwise ?? [])]
      : [effect],
  );

const flagsSetBy = (effects: readonly Effect[]): string[] =>
  flattenEffects(effects).flatMap((effect) => (effect.type === 'setFlag' ? [effect.flag] : []));

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

const conditionParts = (condition: Condition): Condition[] => {
  switch (condition.type) {
    case 'not':
      return [condition, ...conditionParts(condition.condition)];
    case 'all':
    case 'any':
      return [condition, ...condition.conditions.flatMap(conditionParts)];
    default:
      return [condition];
  }
};

/** Everything in the world that names an NPC, a paper or a crisis, with where it was. */
const referencesOf = (world: GameWorld) => {
  const places: { scene: string; effects: Effect[]; conditions: Condition[] }[] = [];
  for (const [key, scene] of Object.entries(world.story.scenes)) {
    for (const node of Object.values(scene.nodes)) {
      places.push({ scene: key, effects: effectsOf(node), conditions: conditionsOf(node) });
    }
  }
  for (const action of world.actions) {
    places.push({
      scene: 'week',
      effects: action.effects,
      conditions: action.requires ? [action.requires] : [],
    });
  }
  for (const beat of world.beats) {
    places.push({
      scene: beat.scene,
      effects: [],
      conditions: beat.requires ? [beat.requires] : [],
    });
  }
  for (const crisis of world.crises) {
    places.push({ scene: crisis.scene, effects: [], conditions: [crisis.when] });
  }
  return places;
};

const checkReferences = (world: GameWorld, catalog: StoryCatalog): StoryIssue[] => {
  const npcs = new Set(catalog.characters);
  const papers = new Set(world.evidence.map((item) => item.id));
  const crises = new Set(world.crises.map((crisis) => crisis.id));
  return referencesOf(world).flatMap(({ scene, effects, conditions }) => {
    const messages: string[] = [];
    for (const effect of flattenEffects(effects)) {
      if (effect.type === 'addRelation' && !npcs.has(effect.npc)) {
        messages.push(`relation with unknown npc "${effect.npc}"`);
      }
      if (effect.type === 'addEvidence' && !papers.has(effect.evidence)) {
        messages.push(`unknown evidence "${effect.evidence}"`);
      }
    }
    for (const part of conditions.flatMap(conditionParts)) {
      if (part.type === 'relation' && !npcs.has(part.npc)) {
        messages.push(`relation with unknown npc "${part.npc}"`);
      }
      if (part.type === 'evidence' && !papers.has(part.evidence)) {
        messages.push(`unknown evidence "${part.evidence}"`);
      }
      if (part.type === 'crisisCount' && !crises.has(part.crisis)) {
        messages.push(`unknown crisis "${part.crisis}"`);
      }
    }
    return messages.map((message) => ({ scene, message }));
  });
};

/** Every way a story can trap or confuse a player that can be seen without playing it. */
export const validateStory = (
  story: StoryGraph,
  catalog: StoryCatalog,
  flagsSetElsewhere: readonly string[] = [],
): StoryIssue[] => {
  const scenes = Object.entries(story.scenes);
  const issues = scenes.flatMap(([key, scene]) => checkScene(key, scene, catalog));

  const setFlags = new Set([
    ...flagsSetElsewhere,
    ...scenes.flatMap(([, scene]) =>
      Object.values(scene.nodes)
        .flatMap(effectsOf)
        .flatMap((effect) => flagsSetBy([effect])),
    ),
  ]);
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

/** The story plus what ties it to the calendar. */
export const validateWorld = (world: GameWorld, catalog: StoryCatalog): StoryIssue[] => {
  const scenes = world.story.scenes;
  const flagsFromActions = world.actions.flatMap((action) => flagsSetBy(action.effects));
  const issues = validateStory(world.story, catalog, flagsFromActions);
  const report = (scene: string, message: string) => issues.push({ scene, message });

  if (!(world.openingScene in scenes)) {
    report(world.openingScene, 'the opening scene does not exist');
  }
  issues.push(...checkReferences(world, catalog));
  const beatScenes = [
    ...world.beats.map((beat) => beat.scene),
    ...world.crises.map((crisis) => crisis.scene),
  ];
  for (const beat of world.beats) {
    if (!(beat.scene in scenes)) {
      report(beat.scene, `month ${beat.month} plays a scene that does not exist`);
    }
    if (beat.month > world.rules.lastMonth) {
      report(beat.scene, `planned for month ${beat.month}, after the last month`);
    }
    if (beat.week !== undefined && (beat.week < 1 || beat.week > world.rules.weeksPerMonth)) {
      report(beat.scene, `planned for week ${beat.week}, which no month has`);
    }
  }
  for (const key of Object.keys(scenes)) {
    if (key !== world.openingScene && !beatScenes.includes(key)) {
      report(key, 'no beat ever plays this scene');
    }
  }
  for (const crisis of world.crises) {
    if (!(crisis.scene in scenes)) {
      report(crisis.scene, `crisis "${crisis.id}" plays a scene that does not exist`);
    }
  }
  const usesTickets = world.actions.some((action) => action.tickets);
  if (usesTickets && world.tickets.length < world.rules.ticketsPerRound) {
    report('week', 'not enough tickets for a round');
  }
  if (new Set(world.evidence.map((item) => item.id)).size !== world.evidence.length) {
    report('week', 'two pieces of evidence share an id');
  }
  if (world.actions.every((action) => action.requires)) {
    report('week', 'every weekly action can be locked: the player could get stuck');
  }
  if (world.surprises.length === 0 && world.rules.surpriseChance > 0) {
    report('week', 'a surprise bill can come up with none to pick from');
  }
  for (const action of world.actions) {
    if (action.requires && !action.lockedReason) {
      report('week', `action "${action.id}" has no lockedReason`);
    }
    if (action.outcomes.length === 0) {
      report('week', `action "${action.id}" has no outcome line`);
    }
  }
  return issues;
};
