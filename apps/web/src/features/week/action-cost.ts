import type { Effect } from '@cstar/game-core';
import { formatMoneyShort } from '@/lib/format-money';

const signed = (amount: number) => (amount > 0 ? `+${String(amount)}` : `−${String(-amount)}`);

/** The numbers behind a weekly action, in the player's words. Relations and papers stay a surprise. */
export const costLine = (effects: readonly Effect[]): string =>
  effects
    .flatMap((effect) => {
      switch (effect.type) {
        case 'addCash':
          return [`+${formatMoneyShort(effect.amount)}`];
        case 'addEnergy':
          return [`${signed(effect.amount)} sức khỏe`];
        case 'addStress':
          return [`${signed(effect.amount)} căng thẳng`];
        default:
          return [];
      }
    })
    .join(' · ');
