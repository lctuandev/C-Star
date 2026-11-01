import { MAX_PLAYER_NAME } from '@cstar/game-core';
import type { GameState } from '@cstar/game-core';
import { z } from 'zod';

/** Raise it with every change to the shape below, and add the step in `MIGRATIONS` (contracts/save.md §3). */
export const SAVE_VERSION = 5;

const money = z.number().int().nonnegative();
const mood = z.number().int().min(0).max(100);

const payslipSchema = z.strictObject({
  month: z.number().int().positive(),
  salaryDue: money,
  salaryPaid: money,
  bills: z.array(z.strictObject({ label: z.string(), amount: money })),
  arrears: money,
  cash: money,
  loans: money,
  companyDebt: money,
  kpi: z
    .strictObject({ points: z.number().int().nonnegative(), target: z.number().int().positive() })
    .nullable(),
});

const gameStateSchema: z.ZodType<GameState> = z.strictObject({
  seed: z.number(),
  playerName: z.string().max(MAX_PLAYER_NAME),
  rng: z.number().int().nonnegative(),
  phase: z.enum(['scene', 'week', 'kpi', 'payslip', 'ended']),
  calendar: z.strictObject({
    month: z.number().int().positive(),
    week: z.number().int().positive(),
    actionsLeft: z.number().int().nonnegative(),
    payday: z.boolean(),
  }),
  money: z.strictObject({ cash: money, arrears: money, loans: money, companyDebt: money }),
  mood: z.strictObject({ energy: mood, stress: mood }),
  outlook: z.strictObject({ trust: mood, awareness: mood }),
  paidByMonth: z.record(z.string(), money),
  story: z.strictObject({
    sceneId: z.string().nullable(),
    nodeId: z.string().nullable(),
    flags: z.record(z.string(), z.boolean()),
    seenScenes: z.array(z.string()),
  }),
  relations: z.record(z.string(), z.number().int().min(-100).max(100)),
  kpi: z.number().int().nonnegative(),
  kpiRound: z
    .strictObject({
      actionId: z.string(),
      tickets: z.array(z.string()),
      index: z.number().int().nonnegative(),
      score: z.number().int().nonnegative(),
      last: z.strictObject({ ticketId: z.string(), correct: z.boolean() }).nullable(),
    })
    .nullable(),
  evidence: z.array(z.string()),
  crises: z.record(
    z.string(),
    z.strictObject({ count: z.number().int(), lastMonth: z.number().int() }),
  ),
  ending: z.string().nullable(),
  loops: z.number().int().nonnegative(),
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
const MIGRATIONS: Record<number, Migration> = {
  /** M2: loans, relations, KPI, evidence, crises. Nobody had any of them yet. */
  1: (file) => {
    const state = file.state as Record<string, unknown>;
    const payslip = state.payslip as Record<string, unknown> | null;
    return {
      ...file,
      state: {
        ...state,
        money: { ...(state.money as object), loans: 0 },
        relations: {},
        kpi: 0,
        kpiRound: null,
        evidence: [],
        crises: {},
        payslip: payslip && { ...payslip, loans: 0, kpi: null },
      },
    };
  },
  /** M4: endings and renewed contracts. */
  2: (file) => ({
    ...file,
    state: { ...(file.state as object), ending: null, loops: 0 },
  }),
  /** M6: the player's name. Nobody was asked yet, and "bạn" reads fine. */
  3: (file) => ({
    ...file,
    state: { ...(file.state as object), playerName: '' },
  }),
  /** M6: trust, awareness and the ledger. What was paid before this version is not on record. */
  4: (file) => {
    const state = file.state as GameState;
    const khoaLeft = state.story.seenScenes.includes('ch4-khoa-leaves');
    return {
      ...file,
      state: {
        ...state,
        story: { ...state.story, flags: { ...state.story.flags, ...(khoaLeft && { khoaLeft }) } },
        outlook: { trust: 50, awareness: 30 },
        paidByMonth: {},
      },
    };
  },
};

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
