import type { GameState } from '@cstar/game-core';
import { DESK_OF, DESKS } from './office-layout';

export type FruitTray = 'full' | 'half' | 'bananas' | 'empty';

/** What the office looks like this month: the story, told by the furniture. */
export interface OfficeMood {
  coffeeMachine: boolean;
  fruit: FruitTray;
  /** 0 to 1: how much of the wall of plants is left. */
  plants: number;
  /** Colleagues at their desks. */
  people: readonly string[];
  /** Of the twelve desks in the room. */
  occupiedDesks: number;
  /** Desks whose screen is on: the ones still taken, and anyone named who is still here. */
  litDesks: readonly number[];
  flicker: boolean;
  /** 0 to 1: how much colour the months have taken out of the room. */
  drain: number;
  /** The dragon campaign's banner, up from the scene that launches it. */
  banner: boolean;
}

const DRAIN_PER_MONTH = 0.11;
const MAX_DRAIN = 0.72;

/** 0 to 1: how much colour the months have taken out of the room. */
export const drainOf = (month: number) => Math.min(MAX_DRAIN, (month - 1) * DRAIN_PER_MONTH);

const campaignHasStarted = (state: GameState) => state.story.seenScenes.includes('ch3-dragon');

/** Which rendering of the office fits the story so far: the 2D screens have four. */
export type OfficeStage = 'early' | 'signs' | 'mid' | 'late';

export const officeStageOf = (state: GameState): OfficeStage => {
  const { month } = state.calendar;
  if (month <= 1) {
    return 'early';
  }
  if (month > 5) {
    return 'late';
  }
  return campaignHasStarted(state) ? 'mid' : 'signs';
};

const fruitOf = (month: number): FruitTray => {
  if (month <= 1) {
    return 'full';
  }
  if (month === 2) {
    return 'half';
  }
  return month <= 4 ? 'bananas' : 'empty';
};

/** Derived from the run, never saved: a loaded game looks the way its month does. */
export const officeMood = (state: GameState): OfficeMood => {
  const { month } = state.calendar;
  const khoaLeft = state.story.seenScenes.includes('ch4-khoa-leaves');
  const people = [
    'boss',
    'manager',
    'deputy',
    'hr',
    'accountant',
    'dan',
    'uyen',
    ...(khoaLeft ? [] : ['khoa']),
  ];
  const occupiedDesks = Math.max(2, 11 - month);
  const named = people.flatMap((id) => DESK_OF[id] ?? []);
  return {
    coffeeMachine: month < 2,
    fruit: fruitOf(month),
    plants: Math.max(0, 1 - (month - 1) * 0.2),
    people,
    occupiedDesks,
    litDesks: DESKS.map((_, index) => index).filter(
      (index) => index < occupiedDesks || named.includes(index),
    ),
    flicker: state.mood.stress >= 70,
    drain: drainOf(month),
    banner: campaignHasStarted(state),
  };
};
