import { disclaimer } from '@cstar/content';
import { shouldShowDisclaimer } from '@cstar/game-core';
import { create } from 'zustand';
import { readAcceptedVersion, writeAcceptedVersion } from './accepted-version';

/** `unknown`: the static HTML cannot know, so nothing of the game shows until the browser checks. */
type Gate = 'unknown' | 'asking' | 'open';

interface DisclaimerState {
  gate: Gate;
  afterAccept: (() => void) | null;

  /** Checks this device, once the app runs in the browser. */
  open: () => void;
  /** Asks before a new game, then carries on. */
  askForNewGame: (then: () => void) => void;
  accept: () => void;
}

const check = (entering: 'app' | 'new-game') =>
  shouldShowDisclaimer({
    acceptedVersion: readAcceptedVersion(),
    currentVersion: disclaimer.version,
    entering,
  });

export const useDisclaimerStore = create<DisclaimerState>((set, get) => ({
  gate: 'unknown',
  afterAccept: null,

  open: () => set({ gate: check('app') ? 'asking' : 'open' }),
  askForNewGame: (then) => set({ gate: check('new-game') ? 'asking' : 'open', afterAccept: then }),
  accept: () => {
    const { afterAccept } = get();
    writeAcceptedVersion(disclaimer.version);
    set({ gate: 'open', afterAccept: null });
    afterAccept?.();
  },
}));
