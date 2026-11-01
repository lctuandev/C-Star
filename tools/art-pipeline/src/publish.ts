/**
 * Copies what the pipeline made into the web app. The result is committed: neither CI nor a fresh
 * checkout needs Blender.
 * Usage: node src/publish.ts
 */
import { copyFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { MODELS, OFFICE_FEATURE, OUT, PUBLIC_ART } from './assets.ts';

await mkdir(PUBLIC_ART, { recursive: true });
await Promise.all(
  MODELS.map(({ name }) => copyFile(join(OUT, `${name}.glb`), join(PUBLIC_ART, `${name}.glb`))),
);
await copyFile(join(OUT, 'office-plan.json'), join(OFFICE_FEATURE, 'office-plan.json'));
console.log(`published to ${PUBLIC_ART}`);
