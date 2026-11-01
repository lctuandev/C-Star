import type { Condition, Effect, Scene, StoryGraph, StoryNode } from '@cstar/game-core';
import { z } from 'zod';

const id = z.string().min(1);
const text = z.string().trim().min(1);

const conditionSchema: z.ZodType<Condition> = z.lazy(() =>
  z.discriminatedUnion('type', [
    z.strictObject({ type: z.literal('flag'), flag: id }),
    z.strictObject({ type: z.literal('not'), condition: conditionSchema }),
    z.strictObject({ type: z.literal('all'), conditions: z.array(conditionSchema).min(1) }),
    z.strictObject({ type: z.literal('any'), conditions: z.array(conditionSchema).min(1) }),
  ]),
);

const effectSchema: z.ZodType<Effect> = z.strictObject({
  type: z.literal('setFlag'),
  flag: id,
  value: z.boolean().optional(),
});

const choiceSchema = z.strictObject({
  id,
  text,
  requires: conditionSchema.optional(),
  lockedReason: text.optional(),
  effects: z.array(effectSchema).optional(),
  next: id,
});

const lineSchema = z.strictObject({
  speaker: id.optional(),
  text,
  effects: z.array(effectSchema).optional(),
  choices: z.array(choiceSchema).min(1).optional(),
  next: id.optional(),
});

const routeSchema = z.strictObject({
  routes: z.array(z.strictObject({ when: conditionSchema, next: id })).min(1),
  otherwise: id,
});

const nodeSchema: z.ZodType<StoryNode> = z.union([routeSchema, lineSchema]);

const sceneSchema: z.ZodType<Scene> = z.strictObject({
  id,
  start: id,
  nodes: z.record(id, nodeSchema),
});

export const storySchema: z.ZodType<StoryGraph> = z.strictObject({
  scenes: z.record(id, sceneSchema),
});
