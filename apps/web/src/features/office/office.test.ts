import { world } from '@cstar/content';
import { beginRun } from '@cstar/game-core';
import type { GameState } from '@cstar/game-core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isTooSlow, supportsWebGl } from './graphics';
import { HOTSPOTS, NPC_SEATS } from './office-layout';
import { officeMood } from './office-mood';
import { useOfficeStore } from './office-store';
import { hasArrived, headingOf, stepToward } from './walk';

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

  it('knows when it has arrived', () => {
    expect(hasArrived([1, 0, 1], [1, 0, 1])).toBe(true);
    expect(hasArrived([1, 0, 0], [1, 0, 1])).toBe(false);
  });

  it('faces where it goes', () => {
    expect(headingOf([0, 0, 0], [0, 0, 1])).toBe(0);
    expect(headingOf([0, 0, 0], [1, 0, 0])).toBeCloseTo(Math.PI / 2);
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
