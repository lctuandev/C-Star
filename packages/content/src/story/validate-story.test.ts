import type { Scene, StoryGraph, StoryNode } from '@cstar/game-core';
import { describe, expect, it } from 'vitest';
import { storySchema } from './story-schema.js';
import { validateStory } from './validate-story.js';

const catalog = { characters: ['boss'] };

const sceneOf = (nodes: Record<string, StoryNode>, start = 'a'): Scene => ({
  id: 's',
  place: 'office',
  start,
  nodes,
});
const issuesOf = (nodes: Record<string, StoryNode>, start?: string) =>
  validateStory({ scenes: { s: sceneOf(nodes, start) } }, catalog).map((issue) => issue.message);

const locked = (id: string) => ({
  id,
  text: 'Khóa',
  requires: { type: 'flag' as const, flag: 'open' },
  lockedReason: 'Chưa mở',
  next: 'z',
});

describe('validateStory', () => {
  it('passes a sound scene', () => {
    expect(
      issuesOf({
        a: {
          speaker: 'boss',
          text: 'Chào.',
          effects: [{ type: 'setFlag', flag: 'open' }],
          next: 'b',
        },
        b: {
          text: 'Chọn đi.',
          choices: [{ id: 'free', text: 'Đi', next: 'c' }, locked('key')],
        },
        c: { routes: [{ when: { type: 'flag', flag: 'open' }, next: 'z' }], otherwise: 'z' },
        z: { text: 'Hết.' },
      }),
    ).toEqual([]);
  });

  it('catches a missing start', () => {
    expect(issuesOf({ a: { text: 'x' } }, 'nope')).toEqual(['start "nope" does not exist']);
  });

  it('catches a jump to nowhere', () => {
    expect(issuesOf({ a: { text: 'x', next: 'gone' } })).toContain(
      'goes to "gone", which does not exist',
    );
  });

  it('catches a node nothing leads to', () => {
    expect(issuesOf({ a: { text: 'x' }, lost: { text: 'y' } })).toEqual(['can never be reached']);
  });

  it('catches a loop with no way out', () => {
    expect(issuesOf({ a: { text: 'x', next: 'b' }, b: { text: 'y', next: 'a' } })).toContain(
      'can never reach the end of the scene',
    );
  });

  it('allows a loop with a way out', () => {
    expect(
      issuesOf({
        a: {
          text: 'Hỏi lại?',
          choices: [
            { id: 'again', text: 'Lại', next: 'a' },
            { id: 'stop', text: 'Thôi', next: 'z' },
          ],
        },
        z: { text: 'Hết.' },
      }),
    ).toEqual([]);
  });

  it('catches a choice that can leave the player stuck', () => {
    expect(
      issuesOf({
        a: { text: 'x', effects: [{ type: 'setFlag', flag: 'open' }], choices: [locked('only')] },
        z: { text: 'y' },
      }),
    ).toContain('every choice can be locked: the player could get stuck');
  });

  it('catches a lock with no reason', () => {
    expect(
      issuesOf({
        a: {
          text: 'x',
          effects: [{ type: 'setFlag', flag: 'open' }],
          choices: [
            { id: 'free', text: 'Đi', next: 'z' },
            { id: 'key', text: 'Khóa', requires: { type: 'flag', flag: 'open' }, next: 'z' },
          ],
        },
        z: { text: 'y' },
      }),
    ).toContain('choice "key" has no lockedReason');
  });

  it('catches an unknown speaker', () => {
    expect(issuesOf({ a: { speaker: 'ghost', text: 'x' } })).toContain('unknown speaker "ghost"');
  });

  it('catches a flag that is read but set nowhere', () => {
    expect(
      issuesOf({
        a: { routes: [{ when: { type: 'flag', flag: 'never' }, next: 'z' }], otherwise: 'z' },
        z: { text: 'y' },
      }),
    ).toContain('reads flag "never", set nowhere');
  });

  it('accepts a flag set in another scene', () => {
    const story: StoryGraph = {
      scenes: {
        s: sceneOf({ a: { text: 'x', effects: [{ type: 'setFlag', flag: 'done' }] } }),
        t: {
          id: 't',
          place: 'office',
          start: 'a',
          nodes: {
            a: { routes: [{ when: { type: 'flag', flag: 'done' }, next: 'z' }], otherwise: 'z' },
            z: { text: 'y' },
          },
        },
      },
    };
    expect(validateStory(story, catalog)).toEqual([]);
  });

  it('catches route nodes that loop with nothing on screen', () => {
    expect(
      issuesOf({
        a: { routes: [{ when: { type: 'flag', flag: 'x' }, next: 'b' }], otherwise: 'z' },
        b: { routes: [{ when: { type: 'flag', flag: 'x' }, next: 'a' }], otherwise: 'z' },
        z: { text: 'y', effects: [{ type: 'setFlag', flag: 'x' }] },
      }),
    ).toContain('route nodes loop with no line in between');
  });

  it('catches duplicate choice ids, and both choices and next', () => {
    expect(
      issuesOf({
        a: {
          text: 'x',
          next: 'z',
          choices: [
            { id: 'same', text: '1', next: 'z' },
            { id: 'same', text: '2', next: 'z' },
          ],
        },
        z: { text: 'y' },
      }),
    ).toEqual(
      expect.arrayContaining(['has both choices and next', 'has two choices with the same id']),
    );
  });

  it('catches a scene filed under the wrong key', () => {
    const story: StoryGraph = { scenes: { other: sceneOf({ a: { text: 'x' } }) } };
    expect(validateStory(story, catalog)[0]?.message).toBe('scene id "s" differs from its key');
  });
});

describe('storySchema', () => {
  it('refuses an empty line, and an effect it does not know', () => {
    const scene = (node: unknown) => ({
      scenes: { s: { id: 's', place: 'office', start: 'a', nodes: { a: node } } },
    });
    expect(storySchema.safeParse(scene({ text: '   ' })).success).toBe(false);
    expect(
      storySchema.safeParse(scene({ text: 'x', effects: [{ type: 'addMagic' }] })).success,
    ).toBe(false);
    expect(storySchema.safeParse(scene({ text: 'x' })).success).toBe(true);
  });
});
