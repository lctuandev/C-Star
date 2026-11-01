import { create } from 'zustand';
import { readHintDismissed, writeHintDismissed } from './install-hint';

/** Chromium's install prompt; not in the DOM types. */
export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<unknown>;
}

interface PwaState {
  /** A new version waiting for the player's yes. */
  updateWorker: ServiceWorker | null;
  installPrompt: BeforeInstallPromptEvent | null;
  standalone: boolean;
  ios: boolean;
  hintDismissed: boolean;
  /** Read once in the browser: the static HTML must not depend on the device. */
  environmentKnown: boolean;

  setUpdateWorker: (worker: ServiceWorker) => void;
  setInstallPrompt: (prompt: BeforeInstallPromptEvent | null) => void;
  setEnvironment: (environment: { standalone: boolean; ios: boolean }) => void;
  dismissHint: () => void;
}

export const usePwaStore = create<PwaState>((set) => ({
  updateWorker: null,
  installPrompt: null,
  standalone: false,
  ios: false,
  hintDismissed: false,
  environmentKnown: false,

  setUpdateWorker: (updateWorker) => set({ updateWorker }),
  setInstallPrompt: (installPrompt) => set({ installPrompt }),
  setEnvironment: ({ standalone, ios }) =>
    set({ standalone, ios, hintDismissed: readHintDismissed(), environmentKnown: true }),
  dismissHint: () => {
    writeHintDismissed();
    set({ hintDismissed: true });
  },
}));
