import { PLACES } from '@cstar/game-core';
import type { Condition, Effect, Scene, StoryGraph, StoryNode } from '@cstar/game-core';
import { z } from 'zod';

const id = z.string().min(1);
const text = z.string().trim().min(1);

export const conditionSchema: z.ZodType<Condition> = z.lazy(() =>
  z.discriminatedUnion('type', [
    z.strictObject({ type: z.literal('flag'), flag: id }),
    z.strictObject({
      type: z.literal('stat'),
      stat: z.enum(['cash', 'arrears', 'companyDebt', 'energy', 'stress', 'month']),
      min: z.number().optional(),
      max: z.number().optional(),
    }),
    z.strictObject({ type: z.literal('not'), condition: conditionSchema }),
    z.strictObject({ type: z.literal('all'), conditions: z.array(conditionSchema).min(1) }),
    z.strictObject({ type: z.literal('any'), conditions: z.array(conditionSchema).min(1) }),
  ]),
);

const amount = z.number().int();

export const effectSchema: z.ZodType<Effect> = z.lazy(() =>
  z.discriminatedUnion('type', [
    z.strictObject({ type: z.literal('setFlag'), flag: id, value: z.boolean().optional() }),
    z.strictObject({ type: z.literal('addCash'), amount }),
    z.strictObject({ type: z.literal('companyPays'), amount: amount.positive() }),
    z.strictObject({ type: z.literal('addEnergy'), amount }),
    z.strictObject({ type: z.literal('addStress'), amount }),
    z.strictObject({
      type: z.literal('chance'),
      chance: z.number().min(0).max(1),
      then: z.array(effectSchema),
      otherwise: z.array(effectSchema).optional(),
    }),
  ]),
);

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
  place: z.enum(PLACES),
  start: id,
  nodes: z.record(id, nodeSchema),
});

export const storySchema: z.ZodType<StoryGraph> = z.strictObject({
  scenes: z.record(id, sceneSchema),
});
