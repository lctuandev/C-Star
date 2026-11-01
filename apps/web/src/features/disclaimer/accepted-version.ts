const ACCEPTED_KEY = 'cstar.disclaimer-accepted-version';

/** Unreadable or missing means "never accepted", so the player is asked. */
export const readAcceptedVersion = (): number | null => {
  try {
    const stored = Number(localStorage.getItem(ACCEPTED_KEY) ?? Number.NaN);
    return Number.isInteger(stored) ? stored : null;
  } catch {
    return null;
  }
};

/** Without storage the player gets in now and is asked again next time. */
export const writeAcceptedVersion = (version: number): void => {
  try {
    localStorage.setItem(ACCEPTED_KEY, String(version));
  } catch {
    // Nothing to tell the player: being asked again costs one tap.
  }
};
