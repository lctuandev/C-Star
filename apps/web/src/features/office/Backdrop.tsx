import type { Place } from '@cstar/game-core';

/**
 * The same room, rendered in Blender (ADR-005): what the 2D screens show, and what shows while the
 * 3D scene loads. A plain image, so nothing about it can fail on a weak device.
 */
export const Backdrop = ({ place }: { place: Place }) => (
  <img
    key={place}
    src={`/art/places/${place}.webp`}
    alt=""
    aria-hidden
    className="animate-fade absolute inset-0 size-full object-cover"
  />
);
