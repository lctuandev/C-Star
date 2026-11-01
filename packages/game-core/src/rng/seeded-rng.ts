/** The RNG's whole memory, an unsigned 32-bit integer. It lives in the game state, so saves resume it. */
export type RngState = number;

export interface RngDraw {
  /** In [0, 1). */
  value: number;
  next: RngState;
}

const GOLDEN_GAMMA = 0x6d2b79f5;

/** Turns any integer seed into a valid state. */
export const seedRng = (seed: number): RngState => seed >>> 0;

/** One draw of mulberry32. Pure: the same state always gives the same draw. */
export const drawRandom = (state: RngState): RngDraw => {
  const next = (state + GOLDEN_GAMMA) >>> 0;
  let mixed = next;
  mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
  mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
  return { value: ((mixed ^ (mixed >>> 14)) >>> 0) / 2 ** 32, next };
};
