import type { GameState } from '@cstar/game-core';
import { create } from 'zustand';
import { saveBackend } from './save-backend';
import { createSaveFile, readSaveFile } from './save-format';
import type { SaveFile } from './save-format';

/** `broken`: something is stored and cannot be read. It must not be overwritten unasked. */
type SaveStatus = 'unknown' | 'none' | 'found' | 'broken';

interface SaveStore {
  status: SaveStatus;
  file: SaveFile | null;
  /** Exactly what is stored, so a broken save can still be taken out. */
  raw: unknown;
  /** The last write failed: the player should know progress is not being kept. */
  writeFailed: boolean;

  refresh: () => Promise<void>;
  autosave: (state: GameState) => void;
  /** Keeps a broken save aside before a new run takes its slot. */
  setAsideBroken: () => Promise<void>;
  /** False if the text is not a save. */
  importText: (text: string) => Promise<boolean>;
}

let pending: SaveFile | null = null;
let writing = false;

const parseJson = (text: string): unknown => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

export const useSaveStore = create<SaveStore>((set, get) => {
  /** One write at a time, newest first: a fast player must not race older saves to the disk. */
  const flush = async () => {
    if (writing) {
      return;
    }
    writing = true;
    while (pending) {
      const file = pending;
      pending = null;
      try {
        await saveBackend.write('auto', file);
        set({ writeFailed: false, status: 'found', file, raw: file });
      } catch {
        set({ writeFailed: true });
      }
    }
    writing = false;
  };

  return {
    status: 'unknown',
    file: null,
    raw: undefined,
    writeFailed: false,

    refresh: async () => {
      try {
        const raw = await saveBackend.read('auto');
        if (raw === undefined) {
          set({ status: 'none', file: null, raw });
          return;
        }
        const file = readSaveFile(raw);
        set({ status: file ? 'found' : 'broken', file, raw });
      } catch {
        // Unreadable storage is not a broken save: there may be none, and nothing to protect.
        set({ status: 'none', file: null, raw: undefined });
      }
    },

    autosave: (state) => {
      pending = createSaveFile(state, new Date().toISOString());
      void flush();
    },

    setAsideBroken: async () => {
      const { status, raw } = get();
      if (status !== 'broken') {
        return;
      }
      await saveBackend.write('broken', raw);
      await saveBackend.remove('auto');
      set({ status: 'none', file: null, raw: undefined });
    },

    importText: async (text) => {
      const file = readSaveFile(parseJson(text));
      if (!file) {
        return false;
      }
      await saveBackend.write('auto', file);
      set({ status: 'found', file, raw: file });
      return true;
    },
  };
});

/** Hands the player's save over as a file; a broken one too, as it is stored. */
export const downloadSave = (): void => {
  const { raw } = useSaveStore.getState();
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(raw, null, 2)], { type: 'application/json' }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = 'cong-ty-c-save.json';
  link.click();
  URL.revokeObjectURL(url);
};
