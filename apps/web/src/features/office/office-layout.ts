import type { Place } from '@cstar/game-core';
import plan from './office-plan.json';

export type Vec3 = readonly [number, number, number];

export interface CameraPose {
  position: Vec3;
  target: Vec3;
  fov: number;
}

/** Written by tools/art-pipeline from the same numbers that built the room: they cannot drift. */
export type View = Place | 'overview';
export const CAMERAS = plan.cameras as unknown as Record<View, CameraPose>;

export interface Desk {
  desk: readonly [number, number];
  seat: Vec3;
}

/** In the order they empty: the first is the player's. */
export const DESKS = plan.desks as unknown as readonly Desk[];

/** The chair of everyone with a desk, by their place in `DESKS`. */
export const DESK_OF: Readonly<Record<string, number>> = {
  dan: 1,
  uyen: 2,
  khoa: 3,
  accountant: 4,
  manager: 5,
  deputy: 6,
};

const FACING_SCREEN = Math.PI;

/** Where the week's actions live: tapping one walks there and does it (FEAT-019). */
export interface Hotspot {
  actionId: string;
  label: string;
  position: Vec3;
  /** Where the player stands to use it. */
  stand: Vec3;
}

export const HOTSPOTS: readonly Hotspot[] = [
  { actionId: 'work', label: 'Bàn làm việc', position: [-2.1, 0.9, 2.1], stand: [-2.1, 0, 3.1] },
  { actionId: 'chat', label: 'Hành lang', position: [4.05, 1.1, 2], stand: [3.2, 0, 2.7] },
  { actionId: 'rest', label: 'Ghế nghỉ', position: [-5.2, 0.7, 3.9], stand: [-4.75, 0, 3.1] },
  { actionId: 'side-gig', label: 'Điện thoại', position: [0.5, 0.7, 4.1], stand: [0.2, 0, 3.6] },
  {
    actionId: 'investigate',
    label: 'Tủ hồ sơ',
    position: [-4.95, 1.4, -4.5],
    stand: [-4.95, 0, -3.9],
  },
];

export const PLAYER_HOME: Vec3 = [-2.1, 0, 3.1];

export type RestPose = 'stand' | 'type';

export interface Seat {
  at: Vec3;
  heading: number;
  pose: RestPose;
}

const atDesk = (index: number): Seat => ({
  at: (DESKS[index] as Desk).seat,
  heading: FACING_SCREEN,
  pose: 'type',
});

/** The player's chair, for the tickets and the payslip. */
export const PLAYER_DESK = atDesk(0);

/** Where each person is when they are not speaking. */
export const NPC_SEATS: Record<string, Seat> = {
  /** Only ever seen when he speaks: he has other companies. */
  chairman: { at: [3.9, 0, -4.4], heading: 0, pose: 'stand' },
  boss: { at: [3.9, 0, -4.4], heading: 0, pose: 'stand' },
  manager: atDesk(DESK_OF.manager as number),
  deputy: atDesk(DESK_OF.deputy as number),
  hr: { at: [3.75, 0, -0.3], heading: 0, pose: 'stand' },
  accountant: atDesk(DESK_OF.accountant as number),
  dan: atDesk(DESK_OF.dan as number),
  uyen: atDesk(DESK_OF.uyen as number),
  khoa: atDesk(DESK_OF.khoa as number),
};

/** Where someone who speaks stands, in front of the camera. */
export const STAGE: Record<Place, Vec3> = {
  office: [0.1, 0, 3.15],
  desk: [-1.05, 0, 3.15],
  meeting: [3.9, 0, -4.35],
  hallway: [4.7, 0, 3.0],
  home: [31, 0, 0.7],
};

/** Where the player stands in a scene. */
export const PLAYER_STAGE: Record<Place, Vec3> = {
  office: [-1.3, 0, 3.15],
  desk: [-2.75, 0, 3.2],
  meeting: [2.45, 0, -1.3],
  hallway: [3.2, 0, 3.4],
  home: [29.7, 0, 0.3],
};
