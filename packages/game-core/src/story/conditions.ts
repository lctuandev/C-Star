import type { GameState } from '../state/game-state.js';
import type { Condition, Stat } from './story-types.js';

export const readStat = (state: GameState, stat: Stat): number => {
  switch (stat) {
    case 'cash':
    case 'arrears':
    case 'loans':
    case 'companyDebt':
      return state.money[stat];
    case 'energy':
    case 'stress':
      return state.mood[stat];
    case 'trust':
    case 'awareness':
      return state.outlook[stat];
    case 'month':
      return state.calendar.month;
    case 'kpi':
      return state.kpi;
    case 'evidenceCount':
      return state.evidence.length;
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
    case 'relation': {
      const value = state.relations[condition.npc] ?? 0;
      return value >= (condition.min ?? -Infinity) && value <= (condition.max ?? Infinity);
    }
    case 'evidence':
      return state.evidence.includes(condition.evidence);
    case 'crisisCount':
      return (state.crises[condition.crisis]?.count ?? 0) >= condition.min;
    case 'not':
      return !meets(state, condition.condition);
    case 'all':
      return condition.conditions.every((item) => meets(state, item));
    case 'any':
      return condition.conditions.some((item) => meets(state, item));
  }
};
