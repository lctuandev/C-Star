import type { Document } from '@gltf-transform/core';

export interface AssetStats {
  bytes: number;
  drawCalls: number;
  triangles: number;
  largestTexture: number;
  materials: number;
}

const trianglesOf = (indices: number, vertices: number) => Math.floor((indices || vertices) / 3);

/** What a file costs: draw calls are primitives, since each node here is drawn once. */
export const statsOf = (document: Document, bytes: number): AssetStats => {
  const root = document.getRoot();
  const primitives = root.listNodes().flatMap((node) => node.getMesh()?.listPrimitives() ?? []);
  return {
    bytes,
    drawCalls: primitives.length,
    triangles: primitives.reduce(
      (sum, primitive) =>
        sum +
        trianglesOf(
          primitive.getIndices()?.getCount() ?? 0,
          primitive.getAttribute('POSITION')?.getCount() ?? 0,
        ),
      0,
    ),
    largestTexture: Math.max(
      0,
      ...root.listTextures().map((texture) => Math.max(...(texture.getSize() ?? [0, 0]))),
    ),
    materials: root.listMaterials().length,
  };
};
