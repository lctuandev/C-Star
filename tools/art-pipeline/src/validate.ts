/**
 * Checks the shipped models against budgets/ (ADR-005). Exits 1 if any is over.
 * Usage: node src/validate.ts            what `pnpm art` just built, in out/
 *        node src/validate.ts --public   what is committed, in apps/web/public/art: this is CI's.
 */
import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { BUDGETS, MODELS, OUT, PUBLIC_ART } from './assets.ts';
import { overruns } from './budget.ts';
import type { Budget } from './budget.ts';
import { createIo } from './io.ts';
import { statsOf } from './stats.ts';

const folder = process.argv.includes('--public') ? PUBLIC_ART : OUT;
const io = await createIo();
let failed = false;

for (const { name, budget } of MODELS) {
  const file = join(folder, `${name}.glb`);
  const limit = JSON.parse(await readFile(join(BUDGETS, budget), 'utf8')) as Budget;
  const stats = statsOf(await io.read(file), (await stat(file)).size);
  console.log(name, stats);
  for (const { metric, actual, limit: most } of overruns(stats, limit)) {
    console.error(`  OVER BUDGET ${metric}: ${String(actual)} > ${String(most)}`);
    failed = true;
  }
}

process.exitCode = failed ? 1 : 0;
