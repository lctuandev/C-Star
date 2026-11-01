export interface DisclaimerCheck {
  /** The version on this device, or null if the player never accepted one. */
  acceptedVersion: number | null;
  currentVersion: number;
  entering: 'app' | 'new-game';
}

/** Asked again on every new game and whenever the text changed (contracts/content.md §5). */
export const shouldShowDisclaimer = ({
  acceptedVersion,
  currentVersion,
  entering,
}: DisclaimerCheck): boolean => entering === 'new-game' || acceptedVersion !== currentVersion;
