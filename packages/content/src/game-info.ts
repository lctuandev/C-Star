import { z } from 'zod';

export const gameInfoSchema = z.strictObject({
  title: z.string().min(1),
  tagline: z.string().min(1),
  fictionNote: z.string().min(1),
});

export type GameInfo = z.infer<typeof gameInfoSchema>;

/** "Công ty C*" is a working title, to be settled before release (ADR-003). */
export const gameInfo: GameInfo = gameInfoSchema.parse({
  title: 'Công ty C*',
  tagline: 'Welcome to the unpaid workforce.',
  fictionNote:
    'Tác phẩm hư cấu. Không phải thông tin thật, không nhắm vào cá nhân hay tổ chức nào.',
});
