export type InstallHint = 'none' | 'native' | 'ios-steps';

export interface InstallSituation {
  /** Already running as the installed app. */
  standalone: boolean;
  dismissed: boolean;
  /** The browser offered its install prompt (Chrome, Edge, Samsung Internet on Android). */
  canPrompt: boolean;
  ios: boolean;
}

/** iOS has no install prompt: the player has to be told where Add to Home Screen is. */
export const installHintFor = ({
  standalone,
  dismissed,
  canPrompt,
  ios,
}: InstallSituation): InstallHint => {
  if (standalone || dismissed) {
    return 'none';
  }
  if (canPrompt) {
    return 'native';
  }
  return ios ? 'ios-steps' : 'none';
};

/** iPadOS presents itself as a Mac, so touch points tell them apart. */
export const isIos = (userAgent: string, maxTouchPoints: number): boolean =>
  /iPhone|iPad|iPod/.test(userAgent) || (/Macintosh/.test(userAgent) && maxTouchPoints > 1);

const DISMISSED_KEY = 'cstar.install-hint-dismissed';

/** A convenience only: without storage the hint just comes back next time. */
export const readHintDismissed = (): boolean => {
  try {
    return localStorage.getItem(DISMISSED_KEY) === '1';
  } catch {
    return false;
  }
};

export const writeHintDismissed = (): void => {
  try {
    localStorage.setItem(DISMISSED_KEY, '1');
  } catch {
    // Dismissed for this visit only; the store keeps that.
  }
};
