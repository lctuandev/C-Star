import type { GameWorld } from '@cstar/game-core';
import { describe, expect, it } from 'vitest';
import { characters } from './story/index.js';
import { validateWorld } from './story/validate-story.js';
import { world } from './world.js';

const issuesOf = (change: Partial<GameWorld>) =>
  validateWorld({ ...world, ...change }, { characters }).map((issue) => issue.message);

describe('validateWorld', () => {
  it('catches a beat for a scene that does not exist', () => {
    expect(issuesOf({ beats: [{ scene: 'gone', month: 1, week: 1 }] })).toContain(
      'month 1 plays a scene that does not exist',
    );
  });

  it('catches a beat outside the calendar', () => {
    const scene = world.openingScene;
    expect(issuesOf({ beats: [{ scene, month: 99, week: 1 }] })).toContain(
      'planned for month 99, after the last month',
    );
    expect(issuesOf({ beats: [{ scene, month: 1, week: 9 }] })).toContain(
      'planned for week 9, which no month has',
    );
  });

  it('catches a scene nothing ever plays', () => {
    const extra = {
      id: 'extra',
      place: 'office' as const,
      start: 'a',
      nodes: { a: { text: 'x' } },
    };
    expect(issuesOf({ story: { scenes: { ...world.story.scenes, extra } } })).toContain(
      'no beat ever plays this scene',
    );
  });

  it('catches a week the player could get stuck in', () => {
    const locked = world.actions.map((action) => ({
      ...action,
      requires: { type: 'flag' as const, flag: 'x' },
      lockedReason: 'Khóa',
    }));
    expect(issuesOf({ actions: locked })).toContain(
      'every weekly action can be locked: the player could get stuck',
    );
  });

  it('catches an action with no reason for its lock, or no outcome', () => {
    const [first, ...rest] = world.actions;
    const broken = { ...first!, requires: { type: 'flag' as const, flag: 'x' }, outcomes: [] };
    delete (broken as { lockedReason?: string }).lockedReason;
    expect(issuesOf({ actions: [broken, ...rest] })).toEqual(
      expect.arrayContaining([
        `action "${first!.id}" has no lockedReason`,
        `action "${first!.id}" has no outcome line`,
      ]),
    );
  });

  it('counts a flag set by a weekly action, even inside a chance', () => {
    const story = {
      scenes: {
        ...world.story.scenes,
        reader: {
          id: 'reader',
          place: 'office' as const,
          start: 'a',
          nodes: {
            a: {
              routes: [{ when: { type: 'flag' as const, flag: 'lucky' }, next: 'z' }],
              otherwise: 'z',
            },
            z: { text: 'x' },
          },
        },
      },
    };
    const action = {
      ...world.actions[0]!,
      effects: [
        {
          type: 'chance' as const,
          chance: 0.5,
          then: [{ type: 'setFlag' as const, flag: 'lucky' }],
        },
      ],
    };
    expect(
      issuesOf({ story, actions: [action], beats: [{ scene: 'reader', month: 1, week: 1 }] }),
    ).toEqual(expect.not.arrayContaining(['reads flag "lucky", set nowhere']));
  });
});
