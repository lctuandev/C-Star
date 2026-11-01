export type Motion = 'stand' | 'walk' | 'talk' | 'type';

export type Bone =
  | 'hips'
  | 'chest'
  | 'head'
  | 'armL'
  | 'foreL'
  | 'armR'
  | 'foreR'
  | 'legL'
  | 'shinL'
  | 'legR'
  | 'shinR';

export type Euler = readonly [number, number, number];

export interface Pose {
  /** How far the body drops: sitting is mostly this. */
  lift: number;
  bones: Partial<Record<Bone, Euler>>;
}

const WALK_RATE = 9.5;
/** Hips on a chair, from standing. */
const SEATED = -0.17;

/**
 * Where every joint is at `t` seconds. The rig's bones stand upright (ADR-005), so +X tips a limb
 * backward and -X swings it forward, for everyone. `seed` keeps a room from breathing in step.
 */
export const poseOf = (motion: Motion, t: number, seed = 0): Pose => {
  const clock = t + seed * 1.7;
  if (motion === 'walk') {
    const swing = Math.sin(clock * WALK_RATE);
    const bounce = Math.abs(Math.cos(clock * WALK_RATE));
    return {
      lift: bounce * 0.035,
      bones: {
        chest: [0.05, swing * 0.12, 0],
        head: [-0.05, -swing * 0.08, 0],
        legL: [-swing * 0.62, 0, 0],
        legR: [swing * 0.62, 0, 0],
        shinL: [Math.max(0, swing) * 0.85 + 0.08, 0, 0],
        shinR: [Math.max(0, -swing) * 0.85 + 0.08, 0, 0],
        armL: [swing * 0.55, 0, 0.06],
        armR: [-swing * 0.55, 0, -0.06],
        foreL: [-0.35, 0, 0],
        foreR: [-0.35, 0, 0],
      },
    };
  }
  if (motion === 'type') {
    const tap = Math.sin(clock * 11) * 0.05;
    const glance = Math.sin(clock * 0.37) * 0.14;
    return {
      lift: SEATED,
      bones: {
        chest: [0.06, 0, 0],
        head: [0.08 + Math.sin(clock * 0.53) * 0.03, glance, 0],
        legL: [-1.45, 0, 0],
        legR: [-1.45, 0, 0],
        shinL: [1.3, 0, 0],
        shinR: [1.3, 0, 0],
        armL: [-0.62, 0, 0.12],
        armR: [-0.62, 0, -0.12],
        foreL: [-0.95 + tap, 0, 0],
        foreR: [-0.95 - tap, 0, 0],
      },
    };
  }
  const breath = Math.sin(clock * 1.6) * 0.012;
  if (motion === 'talk') {
    const hand = Math.sin(clock * 3.1);
    return {
      lift: Math.abs(Math.sin(clock * 3.1)) * 0.006,
      bones: {
        chest: [breath, Math.sin(clock * 1.1) * 0.06, 0],
        head: [Math.sin(clock * 4.3) * 0.05, Math.sin(clock * 1.3) * 0.12, 0],
        armL: [-0.3 + hand * 0.12, 0, 0.14],
        foreL: [-0.9 + hand * 0.3, 0, 0],
        armR: [0.02, 0, -0.05],
        foreR: [-0.12, 0, 0],
      },
    };
  }
  return {
    lift: 0,
    bones: {
      chest: [breath, 0, 0],
      head: [0, Math.sin(clock * 0.41) * 0.1, 0],
      armL: [0.02, 0, 0.05 + breath],
      armR: [0.02, 0, -0.05 - breath],
      foreL: [-0.1, 0, 0],
      foreR: [-0.1, 0, 0],
    },
  };
};
