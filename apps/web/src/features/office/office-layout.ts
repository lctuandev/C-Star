import type { Place } from '@cstar/game-core';

export type Vec3 = readonly [number, number, number];

export interface CameraPose {
  position: Vec3;
  target: Vec3;
}

/** One office, one camera per place, framed for the wide strip between the HUD and the panel. */
export const CAMERAS: Record<Place, CameraPose> = {
  office: { position: [0, 8.2, 8.6], target: [0, 0, 0.4] },
  desk: { position: [-2.4, 2.6, 4.6], target: [-2.4, 0.9, 0.6] },
  meeting: { position: [4.2, 2.3, 0.4], target: [4.2, 1, -3.8] },
  hallway: { position: [3.2, 2.2, 6.4], target: [3.8, 1, 2.2] },
  home: { position: [30, 2.4, 4.6], target: [30, 0.9, -0.6] },
};

/** Where the week's actions live: tapping one walks there and does it (FEAT-019). */
export interface Hotspot {
  actionId: string;
  label: string;
  position: Vec3;
  /** Where the player stands to use it. */
  stand: Vec3;
}

export const HOTSPOTS: readonly Hotspot[] = [
  { actionId: 'work', label: 'Bàn làm việc', position: [-2.4, 0, 1], stand: [-2.4, 0, 1.9] },
  { actionId: 'chat', label: 'Hành lang', position: [3.8, 0, 2.6], stand: [3, 0, 3.2] },
  { actionId: 'rest', label: 'Ghế nghỉ', position: [-5, 0, 4], stand: [-4.2, 0, 3.6] },
  { actionId: 'side-gig', label: 'Điện thoại', position: [0.2, 0, 4.2], stand: [0.2, 0, 3.4] },
  { actionId: 'investigate', label: 'Tủ hồ sơ', position: [-5, 0, -3.8], stand: [-4.2, 0, -3] },
];

export const PLAYER_HOME: Vec3 = [-2.4, 0, 2.6];

/** Where each person stands when they are not speaking. */
export const NPC_SEATS: Record<string, Vec3> = {
  boss: [5.2, 0, -4.2],
  hr: [2.6, 0, -1.2],
  accountant: [-4.6, 0, -1.2],
  dan: [-3.6, 0, 0],
  uyen: [-1.2, 0, 0],
  khoa: [-2.4, 0, -0.8],
};

/** Where someone who speaks stands, in front of the camera. */
export const STAGE: Record<Place, Vec3> = {
  office: [0.6, 0, 2],
  desk: [-1.2, 0, 1.9],
  meeting: [4.2, 0, -4.5],
  hallway: [4.6, 0, 3.2],
  home: [31, 0, 0.4],
};

/** Where the player stands in a scene. */
export const PLAYER_STAGE: Record<Place, Vec3> = {
  office: [-0.8, 0, 2.4],
  desk: [-3.2, 0, 2.2],
  meeting: [3, 0, -2],
  hallway: [3, 0, 3.8],
  home: [29.2, 0, 0.8],
};
