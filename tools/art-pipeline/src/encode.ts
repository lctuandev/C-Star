/**
 * Rendered PNGs → the WebP files the web app serves.
 * Usage: node src/encode.ts
 */
import { mkdir, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import sharp from 'sharp';
import { OUT, PUBLIC_ART } from './assets.ts';

const RENDERED = join(OUT, 'rendered');
const INK = '#0d1220';
const QUALITY: Record<string, number> = { places: 78, portraits: 86, cover: 80 };

const files = (await readdir(RENDERED, { recursive: true, withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.endsWith('.png'))
  .map((entry) => join(entry.parentPath, entry.name));

for (const file of files) {
  const relative = file.slice(RENDERED.length + 1);
  const target = join(PUBLIC_ART, relative.replace(/\.png$/, '.webp'));
  await mkdir(dirname(target), { recursive: true });
  const kind = relative.split('/')[0]?.replace(/\.png$/, '') ?? '';
  // The cover has nothing behind the room: it sits on the page's own ink.
  const picture = kind === 'cover' ? sharp(file).flatten({ background: INK }) : sharp(file);
  const { size } = await picture.webp({ quality: QUALITY[kind] ?? 80, effort: 6 }).toFile(target);
  console.log(`${relative}: ${String(Math.round(size / 1024))} KB`);
}
