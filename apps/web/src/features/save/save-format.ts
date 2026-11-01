import type { GameState } from '@cstar/game-core';
import { z } from 'zod';

/** Raise it with every change to the shape below, and add the step in `MIGRATIONS` (contracts/save.md §3). */
export const SAVE_VERSION = 1;

const money = z.number().int().nonnegative();
const mood = z.number().int().min(0).max(100);

const payslipSchema = z.strictObject({
  month: z.number().int().positive(),
  salaryDue: money,
  salaryPaid: money,
  bills: z.array(z.strictObject({ label: z.string(), amount: money })),
  arrears: money,
  cash: money,
  companyDebt: money,
});

const gameStateSchema: z.ZodType<GameState> = z.strictObject({
  seed: z.number(),
  rng: z.number().int().nonnegative(),
  phase: z.enum(['scene', 'week', 'payslip', 'ended']),
  calendar: z.strictObject({
    month: z.number().int().positive(),
    week: z.number().int().positive(),
    actionsLeft: z.number().int().nonnegative(),
    payday: z.boolean(),
  }),
  money: z.strictObject({ cash: money, arrears: money, companyDebt: money }),
  mood: z.strictObject({ energy: mood, stress: mood }),
  story: z.strictObject({
    sceneId: z.string().nullable(),
    nodeId: z.string().nullable(),
    flags: z.record(z.string(), z.boolean()),
    seenScenes: z.array(z.string()),
  }),
  payslip: payslipSchema.nullable(),
  lastOutcome: z.string().nullable(),
});

const saveFileSchema = z.strictObject({
  saveVersion: z.literal(SAVE_VERSION),
  savedAt: z.string(),
  state: gameStateSchema,
});

export type SaveFile = z.infer<typeof saveFileSchema>;

type Migration = (file: Record<string, unknown>) => Record<string, unknown>;

/** Step N takes a save of version N to version N + 1. Steps are never removed. */
const MIGRATIONS: Record<number, Migration> = {};

export const createSaveFile = (state: GameState, savedAt: string): SaveFile => ({
  saveVersion: SAVE_VERSION,
  savedAt,
  state,
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** Null for anything that is not a save this version can read, including a newer one. */
export const readSaveFile = (raw: unknown): SaveFile | null => {
  let file = raw;
  while (isRecord(file) && typeof file.saveVersion === 'number') {
    const step = MIGRATIONS[file.saveVersion];
    if (!step) {
      break;
    }
    file = { ...step(file), saveVersion: file.saveVersion + 1 };
  }
  const parsed = saveFileSchema.safeParse(file);
  return parsed.success ? parsed.data : null;
};
