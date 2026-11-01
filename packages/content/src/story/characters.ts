export interface CharacterInfo {
  /** What the dialogue box shows. Roles rather than names for the management: symbols, not people. */
  name: string;
}

/**
 * All invented (contracts/content.md §1). The people at the top go by their titles. Anh Tín believes
 * and Anh Minh sees clearly, and their names say so; the coworkers each stand for one way of waiting.
 */
export const characterInfo = {
  player: { name: 'Bạn' },
  chairman: { name: 'Chủ tịch' },
  boss: { name: 'Phó giám đốc' },
  manager: { name: 'Anh Tín' },
  deputy: { name: 'Anh Minh' },
  hr: { name: 'Chị HR' },
  accountant: { name: 'Cô Kế toán' },
  dan: { name: 'Dân' },
  uyen: { name: 'Uyên' },
  khoa: { name: 'Khoa' },
} as const satisfies Record<string, CharacterInfo>;

export type CharacterId = keyof typeof characterInfo;

export const characters = Object.keys(characterInfo) as CharacterId[];
