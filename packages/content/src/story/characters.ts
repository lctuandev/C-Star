export interface CharacterInfo {
  /** What the dialogue box shows. Roles rather than names for the management: symbols, not people. */
  name: string;
  /** One letter for the placeholder portrait. */
  initial: string;
  /** A token name for the portrait's colour. */
  tone: 'player' | 'power' | 'paper' | 'ally';
}

/** All invented (contracts/content.md §1). The coworkers each stand for one way of waiting. */
export const characterInfo = {
  player: { name: 'Bạn', initial: 'B', tone: 'player' },
  boss: { name: 'Sếp', initial: 'S', tone: 'power' },
  hr: { name: 'Chị HR', initial: 'H', tone: 'paper' },
  accountant: { name: 'Cô Kế toán', initial: 'K', tone: 'paper' },
  dan: { name: 'Dân', initial: 'D', tone: 'ally' },
  uyen: { name: 'Uyên', initial: 'U', tone: 'ally' },
  khoa: { name: 'Khoa', initial: 'K', tone: 'ally' },
} as const satisfies Record<string, CharacterInfo>;

export type CharacterId = keyof typeof characterInfo;

export const characters = Object.keys(characterInfo) as CharacterId[];
