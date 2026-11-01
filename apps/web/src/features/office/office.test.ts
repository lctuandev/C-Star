import { world } from '@cstar/content';
import { beginRun } from '@cstar/game-core';
import type { GameState } from '@cstar/game-core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isTooSlow, supportsWebGl } from './graphics';
import { findPath } from './nav';
import { DESKS, HOTSPOTS, NPC_SEATS, PLAYER_HOME, PLAYER_STAGE, STAGE } from './office-layout';
import type { Vec3 } from './office-layout';
import plan from './office-plan.json';
import { officeMood, officeStageOf } from './office-mood';
import { useOfficeStore } from './office-store';
import { poseOf } from './pose';
import { fitView } from './view-fit';
import { headingOf, stepToward } from './walk';

const run = beginRun(1, world);
const inMonth = (month: number, extra: Partial<GameState> = {}): GameState => ({
  ...run,
  ...extra,
  calendar: { ...run.calendar, month },
});

describe('officeMood (SCENARIO-052)', () => {
  it('starts full of promise', () => {
    expect(officeMood(inMonth(1))).toMatchObject({
      coffeeMachine: true,
      fruit: 'full',
      plants: 1,
      flicker: false,
    });
  });

  it('loses the coffee machine in month 2, as the story says', () => {
    expect(officeMood(inMonth(2)).coffeeMachine).toBe(false);
  });

  it('runs out of fruit, then of plants', () => {
    expect(officeMood(inMonth(2)).fruit).toBe('half');
    expect(officeMood(inMonth(3)).fruit).toBe('bananas');
    expect(officeMood(inMonth(5)).fruit).toBe('empty');
    expect(officeMood(inMonth(8)).plants).toBe(0);
  });

  it('empties desk by desk, and keeps a few', () => {
    expect(officeMood(inMonth(1)).occupiedDesks).toBe(10);
    expect(officeMood(inMonth(8)).occupiedDesks).toBe(3);
    expect(officeMood(inMonth(40)).occupiedDesks).toBe(2);
  });

  it('loses Khoa once he has left', () => {
    expect(officeMood(inMonth(4)).people).toContain('khoa');
    const left = inMonth(5, {
      story: { ...run.story, seenScenes: ['ch4-khoa-leaves'] },
    });
    expect(officeMood(left).people).not.toContain('khoa');
  });

  it('keeps the screens of named colleagues on, however empty the room', () => {
    expect(officeMood(inMonth(8)).litDesks).toEqual([0, 1, 2, 3, 4, 5, 6]);
    const left = inMonth(8, { story: { ...run.story, seenScenes: ['ch4-khoa-leaves'] } });
    expect(officeMood(left).litDesks).toEqual([0, 1, 2, 4, 5, 6]);
  });

  it('drains the colour month by month, and stops short of grey', () => {
    expect(officeMood(inMonth(1)).drain).toBe(0);
    expect(officeMood(inMonth(4)).drain).toBeGreaterThan(officeMood(inMonth(2)).drain);
    expect(officeMood(inMonth(40)).drain).toBeLessThan(1);
  });

  const launched = (month: number) =>
    inMonth(month, { story: { ...run.story, seenScenes: ['ch3-dragon'] } });

  it('puts the banner up with the scene that launches the campaign, not a week before', () => {
    expect(officeMood(inMonth(4)).banner).toBe(false);
    expect(officeMood(launched(4)).banner).toBe(true);
    expect(officeMood(launched(8)).banner).toBe(true);
  });

  it('picks the rendering of the room that fits the story, for the 2D screens', () => {
    expect(officeStageOf(inMonth(1))).toBe('early');
    expect(officeStageOf(inMonth(2))).toBe('signs');
    expect(officeStageOf(inMonth(4))).toBe('signs');
    expect(officeStageOf(launched(4))).toBe('mid');
    expect(officeStageOf(launched(5))).toBe('mid');
    expect(officeStageOf(launched(6))).toBe('late');
    expect(officeStageOf(launched(40))).toBe('late');
  });

  it('flickers when the player is near the edge', () => {
    expect(officeMood(inMonth(1, { mood: { energy: 50, stress: 69 } })).flicker).toBe(false);
    expect(officeMood(inMonth(1, { mood: { energy: 50, stress: 70 } })).flicker).toBe(true);
  });
});

describe('walking (SCENARIO-053)', () => {
  it('moves by the distance asked, along the floor', () => {
    expect(stepToward([0, 0, 0], [10, 0, 0], 2)).toEqual([2, 0, 0]);
  });

  it('lands on the target rather than circling it', () => {
    const to = [1, 0, 1] as const;
    expect(stepToward([0.99, 0, 1], to, 2)).toBe(to);
  });

  it('cuts between home and the office instead of walking 30 metres of nothing', () => {
    const to = [-2.4, 0, 2.6] as const;
    expect(stepToward([29.2, 0, 0.8], to, 0.05)).toBe(to);
  });

  it('walks across the whole office', () => {
    expect(stepToward([-5, 0, -4], [5, 0, 4], 1)).not.toEqual([5, 0, 4]);
  });

  it('faces where it goes', () => {
    expect(headingOf([0, 0, 0], [0, 0, 1])).toBe(0);
    expect(headingOf([0, 0, 0], [1, 0, 0])).toBeCloseTo(Math.PI / 2);
  });
});

const crossesFurniture = (from: Vec3, to: Vec3) => {
  const steps = Math.ceil(Math.hypot(to[0] - from[0], to[2] - from[2]) / 0.05);
  return Array.from({ length: steps + 1 }, (_, step) => {
    const t = step / steps;
    const x = from[0] + (to[0] - from[0]) * t;
    const z = from[2] + (to[2] - from[2]) * t;
    return (plan.solids as number[][]).some(
      ([x0, z0, x1, z1]) =>
        x > (x0 as number) && x < (x1 as number) && z > (z0 as number) && z < (z1 as number),
    );
  }).some(Boolean);
};

describe('finding the way (FEAT-030)', () => {
  const places: Vec3[] = [
    PLAYER_HOME,
    ...HOTSPOTS.map(({ stand }) => stand),
    ...(['office', 'desk', 'meeting', 'hallway'] as const).flatMap((place) => [
      STAGE[place],
      PLAYER_STAGE[place],
    ]),
    ...Object.values(NPC_SEATS).map(({ at }) => at),
    ...DESKS.map(({ seat }) => seat),
  ];

  it('reaches every place from every place, ending exactly there', () => {
    for (const from of places) {
      for (const to of places) {
        expect(findPath(from, to).at(-1)).toEqual(to);
      }
    }
  });

  it('goes around desks instead of through them', () => {
    const from: Vec3 = [-4.5, 0, 3.1];
    const to: Vec3 = [-4.5, 0, -3.9];
    expect(crossesFurniture(from, to)).toBe(true);
    const path = findPath(from, to);
    const legs = path.map((point, index) => [path[index - 1] ?? from, point] as const);
    expect(legs.some(([a, b]) => crossesFurniture(a, b))).toBe(false);
  });

  it('enters the meeting room by its door', () => {
    const path = findPath(PLAYER_HOME, STAGE.meeting);
    const legs = path.map((point, index) => [path[index - 1] ?? PLAYER_HOME, point] as const);
    expect(legs.some(([a, b]) => crossesFurniture(a, b))).toBe(false);
  });

  it('cuts to and from home: it is another place', () => {
    expect(findPath(PLAYER_HOME, STAGE.home)).toEqual([STAGE.home]);
    expect(findPath(STAGE.home, PLAYER_HOME)).toEqual([PLAYER_HOME]);
  });
});

describe('the body (FEAT-029)', () => {
  it('walks with the legs and arms in opposition', () => {
    const { bones } = poseOf('walk', 0.16);
    expect(Math.sign(bones.legL?.[0] ?? 0)).toBe(-Math.sign(bones.legR?.[0] ?? 0));
    expect(Math.sign(bones.armL?.[0] ?? 0)).toBe(-Math.sign(bones.legL?.[0] ?? 0));
  });

  it('sits lower than it stands, reaching for the keyboard', () => {
    expect(poseOf('type', 1).lift).toBeLessThan(poseOf('stand', 1).lift);
    expect(poseOf('type', 1).bones.armL?.[0]).toBeLessThan(0);
  });

  it('does not breathe in step with the rest of the room', () => {
    expect(poseOf('stand', 1, 3).bones.chest).not.toEqual(poseOf('stand', 1, 5).bones.chest);
  });
});

describe('fitting the shot to the free window (FEAT-033)', () => {
  const canvas = { width: 390, height: 844 };

  it('changes nothing when the whole canvas is free and wide', () => {
    const wide = { width: 1600, height: 1000 };
    expect(fitView(40, wide, { left: 0, top: 0, ...wide })).toMatchObject({
      offsetX: 0,
      offsetY: 0,
    });
    expect(fitView(40, wide, { left: 0, top: 0, ...wide }).fov).toBeCloseTo(40);
  });

  it('moves the middle of the picture to the middle of the window', () => {
    const fit = fitView(40, canvas, { left: 0, top: 130, width: 390, height: 300 });
    expect(fit.offsetX).toBe(0);
    expect(fit.offsetY).toBe(844 / 2 - (130 + 150));
  });

  it('widens the lens for a small window, within reason', () => {
    const fit = fitView(40, canvas, { left: 0, top: 130, width: 390, height: 300 });
    expect(fit.fov).toBeGreaterThan(40);
    expect(fit.fov).toBeLessThanOrEqual(112);
  });

  it('sees the same width through a narrow window', () => {
    const square = { width: 1000, height: 1000 };
    expect(fitView(40, square, { left: 0, top: 0, ...square }).fov).toBeGreaterThan(40);
  });
});

describe('the office store (SCENARIO-053)', () => {
  beforeEach(() => {
    useOfficeStore.setState({ walk: null });
  });

  it('takes one walk at a time', () => {
    const store = useOfficeStore.getState();
    store.walkTo({ to: [1, 0, 1], actionId: 'rest' });
    store.walkTo({ to: [2, 0, 2], actionId: 'work' });
    expect(useOfficeStore.getState().walk?.actionId).toBe('rest');
  });

  it('runs an action once, even if a frame arrives twice', () => {
    const store = useOfficeStore.getState();
    store.walkTo({ to: [1, 0, 1], actionId: 'rest' });
    expect(store.arrive()?.actionId).toBe('rest');
    expect(store.arrive()).toBeNull();
  });
});

describe('the map of the office', () => {
  it('has a place for every weekly action', () => {
    expect(HOTSPOTS.map(({ actionId }) => actionId).sort()).toEqual(
      world.actions.map(({ id }) => id).sort(),
    );
  });

  it('has a seat for everyone who appears', () => {
    const { people } = officeMood(inMonth(1));
    expect(people.every((id) => id in NPC_SEATS)).toBe(true);
  });
});

describe('isTooSlow (SCENARIO-054)', () => {
  const frames = (count: number, seconds: number) => Array<number>(count).fill(seconds);

  it('waits for enough frames', () => {
    expect(isTooSlow(frames(50, 1))).toBeNull();
  });

  it('ignores a slow start', () => {
    expect(isTooSlow([...frames(30, 1), ...frames(90, 1 / 60)])).toBe(false);
  });

  it('steps aside when the device cannot keep up', () => {
    expect(isTooSlow(frames(120, 1 / 10))).toBe(true);
  });

  it('accepts a modest device', () => {
    expect(isTooSlow(frames(120, 1 / 24))).toBe(false);
  });

  it('can be asked to expect more, before lowering the detail', () => {
    expect(isTooSlow(frames(120, 1 / 24), 30)).toBe(true);
  });
});

describe('supportsWebGl', () => {
  it('asks once and gives the context back: browsers cap live contexts', () => {
    const loseContext = vi.fn();
    const getContext = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      getExtension: () => ({ loseContext }),
    } as unknown as RenderingContext);

    expect(supportsWebGl()).toBe(true);
    expect(supportsWebGl()).toBe(true);
    expect(supportsWebGl()).toBe(true);
    expect(getContext).toHaveBeenCalledOnce();
    expect(loseContext).toHaveBeenCalledOnce();
  });
});
