export const MAX_PLAYER_NAME = 24;

const UNNAMED_IN_A_LINE = 'bạn';

/** What a form hands over, made safe to keep and to show: one line, no markup of ours, not too long. */
export const cleanPlayerName = (raw: string): string =>
  raw
    .replace(/[\p{Cc}{}]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_PLAYER_NAME)
    .trim();

/** Story lines say `{name}`. A player who gave none is simply "bạn", as in the rest of the text. */
export const withPlayerName = (text: string, playerName: string): string =>
  text.replaceAll('{name}', playerName || UNNAMED_IN_A_LINE);
