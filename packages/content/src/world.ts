import type { GameWorld } from '@cstar/game-core';
import { z } from 'zod';
import { bills, payroll, rules, surprises, weeklyActions } from './economy.js';
import { OPENING_SCENE, story } from './story/index.js';
import { beats } from './story/schedule.js';
import { conditionSchema, effectSchema, storySchema } from './story/story-schema.js';

const text = z.string().trim().min(1);
const money = z.number().int().nonnegative();
const billSchema = z.strictObject({ label: text, amount: money });

const worldSchema = z.strictObject({
  story: storySchema,
  openingScene: text,
  rules: z.strictObject({
    actionsPerWeek: z.number().int().positive(),
    weeksPerMonth: z.number().int().positive(),
    lastMonth: z.number().int().positive(),
    startingCash: money,
    startingEnergy: z.number().int().min(0).max(100),
    startingStress: z.number().int().min(0).max(100),
    salary: money,
    weeklyEnergyRecovery: z.number().int().nonnegative(),
    unpaidStress: z.number().int().nonnegative(),
    surpriseChance: z.number().min(0).max(1),
  }),
  actions: z.array(
    z.strictObject({
      id: text,
      label: text,
      hint: text,
      requires: conditionSchema.optional(),
      lockedReason: text.optional(),
      effects: z.array(effectSchema),
      outcomes: z.array(text),
    }),
  ),
  beats: z.array(
    z.strictObject({
      scene: text,
      month: z.number().int().positive(),
      week: z.number().int().optional(),
      requires: conditionSchema.optional(),
    }),
  ),
  payroll: z.array(z.number().min(0).max(1)),
  bills: z.array(billSchema),
  surprises: z.array(billSchema),
});

/** Parsed at load: content that does not fit never reaches a player. */
export const world: GameWorld = worldSchema.parse({
  story,
  openingScene: OPENING_SCENE,
  rules,
  actions: weeklyActions,
  beats,
  payroll,
  bills,
  surprises,
});
