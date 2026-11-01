import { z } from 'zod';
import { create } from 'zustand';
import { saveBackend } from '@/features/save/save-backend';

const progressSchema = z.record(z.string(), z.number().int().positive());

/** How many times each ending was reached. Lives apart from the run: a new game keeps it. */
export type EndingCounts = z.infer<typeof progressSchema>;

interface ProgressStore {
  counts: EndingCounts;
  load: () => Promise<void>;
  record: (endingId: string) => Promise<void>;
}

const readCounts = async (): Promise<EndingCounts> => {
  const parsed = progressSchema.safeParse(await saveBackend.read('progress'));
  return parsed.success ? parsed.data : {};
};

export const useProgressStore = create<ProgressStore>((set) => ({
  counts: {},

  load: async () => {
    set({ counts: await readCounts().catch(() => ({})) });
  },

  /** Read before writing: another tab may have finished a run. */
  record: async (endingId) => {
    try {
      const counts = await readCounts();
      const next = { ...counts, [endingId]: (counts[endingId] ?? 0) + 1 };
      await saveBackend.write('progress', next);
      set({ counts: next });
    } catch {
      // The collection misses one entry; the run itself is safe.
    }
  },
}));
