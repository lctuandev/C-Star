/**
 * The logo at every size the platforms ask for, from the one drawing in docs/brand.
 * Usage: node src/icons.ts
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import { PUBLIC_ART, ROOT } from './assets.ts';

const INK = '#0d1220';
const BRAND = join(ROOT, 'docs/brand');
const WEB = join(ROOT, 'apps/web');

const mark = await readFile(join(BRAND, 'logo-mark.svg'), 'utf8');
const inner = /<svg[^>]*>([\s\S]*)<\/svg>/.exec(mark)?.[1] ?? '';

/** The mark on the ink, at `scale` of the tile. Launchers crop maskable icons to a circle. */
const tile = (radius: number, scale: number) => {
  const inset = (512 * (1 - scale)) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="${String(radius)}" fill="${INK}"/>
  <g transform="translate(${String(inset)} ${String(inset)}) scale(${String(scale)})">${inner}</g>
</svg>
`;
};

const png = (svg: string, size: number, path: string) =>
  sharp(Buffer.from(svg), { density: 300 }).resize(size, size).png().toFile(path);

await writeFile(join(BRAND, 'logo.svg'), tile(96, 0.8));
await writeFile(join(WEB, 'src/app/icon.svg'), tile(96, 0.8));
await writeFile(join(PUBLIC_ART, 'mark.svg'), mark);
await png(tile(96, 0.8), 1024, join(BRAND, 'logo.png'));
await png(tile(0, 0.8), 180, join(WEB, 'src/app/apple-icon.png'));
await png(tile(96, 0.8), 192, join(WEB, 'public/icons/icon-192.png'));
await png(tile(96, 0.8), 512, join(WEB, 'public/icons/icon-512.png'));
await png(tile(0, 0.62), 512, join(WEB, 'public/icons/icon-maskable-512.png'));
console.log('icons written');
