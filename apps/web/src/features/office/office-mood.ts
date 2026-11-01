import type { GameState } from '@cstar/game-core';

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
  flicker: boolean;
}

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
  return {
    coffeeMachine: month < 2,
    fruit: fruitOf(month),
    plants: Math.max(0, 1 - (month - 1) * 0.2),
    people: ['boss', 'hr', 'accountant', 'dan', 'uyen', ...(khoaLeft ? [] : ['khoa'])],
    occupiedDesks: Math.max(2, 11 - month),
    flicker: state.mood.stress >= 70,
  };
};
