import { resolve } from 'node:path';

export const ROOT = resolve(import.meta.dirname, '../../..');
export const OUT = resolve(import.meta.dirname, '../out');
export const BUDGETS = resolve(import.meta.dirname, '../budgets');
export const PUBLIC_ART = resolve(ROOT, 'apps/web/public/art');
export const OFFICE_FEATURE = resolve(ROOT, 'apps/web/src/features/office');

/** Every model the game loads, and the limit each one answers to. */
export const MODELS = [
  { name: 'office', budget: 'office.json' },
  { name: 'characters', budget: 'characters.json' },
] as const;
