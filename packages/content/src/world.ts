import type { GameWorld } from '@cstar/game-core';
import { z } from 'zod';
import { bills, payroll, rules, surprises, weeklyActions } from './economy.js';
import { endings } from './endings.js';
import { evidence } from './evidence.js';
import { OPENING_SCENE, RENEWAL_SCENE, story } from './story/index.js';
import { beats, crises } from './story/schedule.js';
import { conditionSchema, effectSchema, storySchema } from './story/story-schema.js';
import { tickets } from './tickets.js';

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
    kpiTargets: z.array(z.number().int().nonnegative()),
    kpiMissStress: z.number().int().nonnegative(),
    kpiTrust: z.number().int().nonnegative(),
    ticketsPerRound: z.number().int().positive(),
    quickTaskPoints: z.number().int().nonnegative(),
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
      tickets: z.boolean().optional(),
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
  tickets: z.array(
    z.strictObject({
      id: text,
      from: text,
      text,
      answer: z.enum(['do', 'defer']),
      reply: text,
    }),
  ),
  evidence: z.array(
    z.strictObject({
      id: text,
      title: text,
      description: text,
      fromMonth: z.number().int().positive().optional(),
      toMonth: z.number().int().positive().optional(),
      requires: conditionSchema.optional(),
    }),
  ),
  crises: z.array(z.strictObject({ id: text, scene: text, when: conditionSchema })),
  endings: z.array(
    z.strictObject({
      id: text,
      title: text,
      summary: text,
      hint: text,
      scene: text,
      when: conditionSchema.optional(),
      loops: z.boolean().optional(),
    }),
  ),
  renewalScene: text,
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
  tickets,
  evidence,
  crises,
  endings,
  renewalScene: RENEWAL_SCENE,
});
