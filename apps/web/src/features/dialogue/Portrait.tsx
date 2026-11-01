import { characterInfo } from '@cstar/content';
import type { CharacterId } from '@cstar/content';

const SIZES = { small: 'size-10 rounded-xl', large: 'size-16 rounded-2xl lg:size-20' };

interface PortraitProps {
  id: CharacterId;
  size?: keyof typeof SIZES;
}

/** Who is talking, in the label above a line. The player goes by what they typed in the form. */
export const speakerLabel = (id: CharacterId, playerName: string) =>
  id === 'player' && playerName ? playerName : characterInfo[id].name;

/** Rendered from the same model that walks the office (ADR-005). */
export const Portrait = ({ id, size = 'large' }: PortraitProps) => (
  <img
    src={`/art/portraits/${id}.webp`}
    alt=""
    aria-hidden
    className={`bg-surface-700 shrink-0 object-cover ${SIZES[size]}`}
  />
);
