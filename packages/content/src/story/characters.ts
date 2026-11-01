export interface CharacterInfo {
  /** What the dialogue box shows. Roles rather than names for the management: symbols, not people. */
  name: string;
}

/**
 * All invented (contracts/content.md §1): the owner confirmed the names of the management are
 * fiction (FEAT-034). The coworkers each stand for one way of waiting.
 */
export const characterInfo = {
  player: { name: 'Bạn' },
  chairman: { name: 'Chủ tịch Jeon Kim-jung' },
  boss: { name: 'Phó GĐ Jeon Gwang-hoe' },
  manager: { name: 'Anh Roger' },
  deputy: { name: 'Anh Huấn' },
  hr: { name: 'Chị HR' },
  accountant: { name: 'Cô Kế toán' },
  dan: { name: 'Dân' },
  uyen: { name: 'Uyên' },
  khoa: { name: 'Khoa' },
} as const satisfies Record<string, CharacterInfo>;

export type CharacterId = keyof typeof characterInfo;

export const characters = Object.keys(characterInfo) as CharacterId[];
