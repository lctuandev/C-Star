import type { GameState } from '../state/game-state.js';
import type { Condition, Stat } from './story-types.js';

export const readStat = (state: GameState, stat: Stat): number => {
  switch (stat) {
    case 'cash':
    case 'arrears':
    case 'companyDebt':
      return state.money[stat];
    case 'energy':
    case 'stress':
      return state.mood[stat];
    case 'month':
      return state.calendar.month;
  }
};

export const meets = (state: GameState, condition: Condition): boolean => {
  switch (condition.type) {
    case 'flag':
      return state.story.flags[condition.flag] === true;
    case 'stat': {
      const value = readStat(state, condition.stat);
      return value >= (condition.min ?? -Infinity) && value <= (condition.max ?? Infinity);
    }
    case 'not':
      return !meets(state, condition.condition);
    case 'all':
      return condition.conditions.every((item) => meets(state, item));
    case 'any':
      return condition.conditions.some((item) => meets(state, item));
  }
};
