import type { EvidenceItem } from '../calendar/world-types.js';
import { drawRandom } from '../rng/seeded-rng.js';
import type { GameState, Money, Mood, Outlook } from '../state/game-state.js';
import { meets } from './conditions.js';
import type { Effect } from './story-types.js';

const MOOD_MAX = 100;
const RELATION_LIMIT = 100;

const clampMood = (value: number) => Math.min(MOOD_MAX, Math.max(0, value));

export const withMood = (state: GameState, change: Partial<Mood>): GameState => ({
  ...state,
  mood: {
    energy: clampMood(state.mood.energy + (change.energy ?? 0)),
    stress: clampMood(state.mood.stress + (change.stress ?? 0)),
  },
});

/** A company that pays something still buys a little faith with it. */
const TRUST_PER_PAYMENT = 4;

export const withOutlook = (state: GameState, change: Partial<Outlook>): GameState => ({
  ...state,
  outlook: {
    trust: clampMood(state.outlook.trust + (change.trust ?? 0)),
    awareness: clampMood(state.outlook.awareness + (change.awareness ?? 0)),
  },
});

/** Writes a payment into the record the Dossier shows, under the month it came. */
export const withPayment = (state: GameState, amount: number): GameState => {
  const month = String(state.calendar.month);
  return {
    ...state,
    paidByMonth: { ...state.paidByMonth, [month]: (state.paidByMonth[month] ?? 0) + amount },
  };
};

const changeCash = (money: Money, amount: number): Money => {
  const cash = money.cash + amount;
  return cash >= 0 ? { ...money, cash } : { ...money, cash: 0, arrears: money.arrears - cash };
};

const companyPays = (money: Money, amount: number): Money => {
  const paid = Math.min(amount, money.companyDebt);
  return { ...money, cash: money.cash + paid, companyDebt: money.companyDebt - paid };
};

export const withRelation = (state: GameState, npc: string, amount: number): GameState => {
  const value = (state.relations[npc] ?? 0) + amount;
  const clamped = Math.min(RELATION_LIMIT, Math.max(-RELATION_LIMIT, value));
  return { ...state, relations: { ...state.relations, [npc]: clamped } };
};

const withEvidence = (state: GameState, id: string): GameState =>
  state.evidence.includes(id) ? state : { ...state, evidence: [...state.evidence, id] };

/** What the catalogue allows now: some papers can only be had at the right moment (GDD §5.3). */
export const nextEvidence = (
  state: GameState,
  catalogue: readonly EvidenceItem[],
): EvidenceItem | undefined =>
  catalogue.find(
    (item) =>
      !state.evidence.includes(item.id) &&
      state.calendar.month >= (item.fromMonth ?? 1) &&
      state.calendar.month <= (item.toMonth ?? Infinity) &&
      (item.requires === undefined || meets(state, item.requires)),
  );

const applyEffect = (
  state: GameState,
  effect: Effect,
  catalogue: readonly EvidenceItem[],
): GameState => {
  switch (effect.type) {
    case 'setFlag':
      return {
        ...state,
        story: {
          ...state.story,
          flags: { ...state.story.flags, [effect.flag]: effect.value ?? true },
        },
      };
    case 'addCash':
      return { ...state, money: changeCash(state.money, effect.amount) };
    case 'companyPays': {
      const paid = Math.min(effect.amount, state.money.companyDebt);
      return withOutlook(
        { ...withPayment(state, paid), money: companyPays(state.money, effect.amount) },
        { trust: TRUST_PER_PAYMENT },
      );
    }
    case 'addTrust':
      return withOutlook(state, { trust: effect.amount });
    case 'addAwareness':
      return withOutlook(state, { awareness: effect.amount });
    case 'addEnergy':
      return withMood(state, { energy: effect.amount });
    case 'addStress':
      return withMood(state, { stress: effect.amount });
    case 'addRelation':
      return withRelation(state, effect.npc, effect.amount);
    case 'addEvidence':
      return withEvidence(state, effect.evidence);
    case 'findEvidence': {
      const item = nextEvidence(state, catalogue);
      return item ? withEvidence(state, item.id) : state;
    }
    case 'takeLoan':
      return {
        ...state,
        money: {
          ...state.money,
          cash: state.money.cash + effect.amount,
          loans: state.money.loans + effect.amount,
        },
      };
    case 'payArrears': {
      const paid = Math.min(state.money.cash, state.money.arrears);
      return {
        ...state,
        money: {
          ...state.money,
          cash: state.money.cash - paid,
          arrears: state.money.arrears - paid,
        },
      };
    }
    case 'loseWeek':
      return { ...state, calendar: { ...state.calendar, actionsLeft: 0 } };
    case 'chance': {
      const { value, next } = drawRandom(state.rng);
      return applyEffects(
        { ...state, rng: next },
        value < effect.chance ? effect.then : effect.otherwise,
        catalogue,
      );
    }
  }
};

export const applyEffects = (
  state: GameState,
  effects: readonly Effect[] = [],
  catalogue: readonly EvidenceItem[] = [],
): GameState => effects.reduce((current, effect) => applyEffect(current, effect, catalogue), state);
