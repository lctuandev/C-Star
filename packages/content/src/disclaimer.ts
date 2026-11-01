import { z } from 'zod';

export const disclaimerSchema = z.strictObject({
  /** Raise it when the text changes: everyone who accepted an older text is asked again. */
  version: z.number().int().positive(),
  title: z.string().min(1),
  body: z.string().min(1),
  confirmLabel: z.string().min(1),
  /** The short line on the menu. */
  reminder: z.string().min(1),
});

export type Disclaimer = z.infer<typeof disclaimerSchema>;

/** The only place this text lives (ADR-003, contracts/content.md §5). */
export const disclaimer: Disclaimer = disclaimerSchema.parse({
  version: 1,
  title: 'Trước khi vào game',
  body: 'Đây là tác phẩm giải trí hư cấu. Mọi công ty, nhân vật, số liệu và sự kiện trong game đều do tác giả tưởng tượng, không phải thông tin thật và không nhắm vào bất kỳ cá nhân hay tổ chức nào. Nếu có sự trùng hợp, đó chỉ là ngẫu nhiên. Game không phải là tư vấn pháp lý.',
  confirmLabel: 'Tôi đã hiểu, vào game',
  reminder: 'Tác phẩm hư cấu. Không phải thông tin thật, không nhắm vào cá nhân hay tổ chức nào.',
});
