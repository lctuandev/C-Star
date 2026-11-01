/**
 * Raw Blender GLBs → what the game ships (ADR-005): deduplicated, Meshopt geometry, WebP pictures.
 * Usage: node src/optimize.ts
 */
import { join } from 'node:path';
import { dedup, meshopt, prune, reorder, textureCompress, weld } from '@gltf-transform/functions';
import { MeshoptEncoder } from 'meshoptimizer';
import sharp from 'sharp';
import { MODELS, OUT } from './assets.ts';
import { createIo } from './io.ts';

const LIGHT_QUALITY = 92;
const PICTURE_QUALITY = 88;

const io = await createIo();

for (const { name } of MODELS) {
  const document = await io.read(join(OUT, `${name}.raw.glb`));
  await document.transform(
    // Lightmap UVs and colours look unused to a plain prune: the game's own materials read them.
    prune({ keepAttributes: true, keepExtras: false }),
    dedup(),
    weld(),
    textureCompress({
      encoder: sharp,
      targetFormat: 'webp',
      quality: PICTURE_QUALITY,
      slots: /baseColor|emissive/,
    }),
    textureCompress({
      encoder: sharp,
      targetFormat: 'webp',
      quality: LIGHT_QUALITY,
      slots: /occlusion/,
    }),
    reorder({ encoder: MeshoptEncoder }),
    meshopt({ encoder: MeshoptEncoder, level: 'medium', quantizeTexcoord: 14, quantizeColor: 8 }),
  );
  await io.write(join(OUT, `${name}.glb`), document);
  console.log(`optimized ${name}`);
}
