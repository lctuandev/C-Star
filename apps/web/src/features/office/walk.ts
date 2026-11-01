import type { Vec3 } from './office-layout';

export const WALK_SPEED = 3.2;

/** Longer than any walk in the office: home is another place, reached by a cut, not on foot. */
const CUT_DISTANCE = 20;

/** One frame of walking on the floor. Lands exactly on the target instead of circling it. */
export const stepToward = (from: Vec3, to: Vec3, distance: number): Vec3 => {
  const dx = to[0] - from[0];
  const dz = to[2] - from[2];
  const left = Math.hypot(dx, dz);
  if (left <= distance || left > CUT_DISTANCE) {
    return to;
  }
  return [from[0] + (dx / left) * distance, from[1], from[2] + (dz / left) * distance];
};

/** The way to face while walking from one point to another. */
export const headingOf = (from: Vec3, to: Vec3): number =>
  Math.atan2(to[0] - from[0], to[2] - from[2]);
