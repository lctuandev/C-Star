import type { CharacterInfo } from '@cstar/content';

const TONES: Record<CharacterInfo['tone'], string> = {
  player: 'bg-fluorescent text-surface-950',
  power: 'bg-paycheck text-surface-950',
  paper: 'bg-surface-600 text-ink-primary',
  ally: 'bg-ally text-surface-950',
};

/** A stand-in until the art pass: colour says which side someone is on. */
export const Portrait = ({ character }: { character: CharacterInfo }) => (
  <span
    aria-hidden
    className={`flex size-10 shrink-0 items-center justify-center rounded-xl font-extrabold ${TONES[character.tone]}`}
  >
    {character.initial}
  </span>
);
