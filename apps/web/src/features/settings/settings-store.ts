import { z } from 'zod';
import { create } from 'zustand';

const settingsSchema = z.strictObject({
  textSize: z.enum(['normal', 'large']),
  textSpeed: z.enum(['slow', 'normal', 'instant']),
  /** 0 to 1. */
  volume: z.number().min(0).max(1),
  ambience: z.boolean(),
  /** Older settings have neither of these two. */
  music: z.boolean().default(true),
  typing: z.boolean().default(true),
  /**
   * `auto`: the 3D office, until the device turns out too slow for it. `3d` keeps it regardless.
   * Older settings have no value here.
   */
  graphics: z.enum(['auto', '3d', '2d']).default('auto'),
});

export type Settings = z.infer<typeof settingsSchema>;

export const DEFAULT_SETTINGS: Settings = {
  textSize: 'normal',
  textSpeed: 'normal',
  volume: 0.7,
  ambience: true,
  music: true,
  typing: true,
  graphics: 'auto',
};

const KEY = 'cstar.settings';

/** A convenience (contracts/save.md §1): unreadable means defaults. */
const readSettings = (): Settings => {
  try {
    const parsed = settingsSchema.safeParse(JSON.parse(localStorage.getItem(KEY) ?? 'null'));
    return parsed.success ? parsed.data : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

const writeSettings = (settings: Settings) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    // They last for this visit.
  }
};

interface SettingsStore extends Settings {
  load: () => void;
  change: (change: Partial<Settings>) => void;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  ...DEFAULT_SETTINGS,

  load: () => set(readSettings()),

  change: (change) => {
    const { textSize, textSpeed, volume, ambience, music, typing, graphics } = get();
    const next = { textSize, textSpeed, volume, ambience, music, typing, graphics, ...change };
    writeSettings(next);
    set(next);
  },
}));
