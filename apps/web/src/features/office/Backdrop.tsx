import type { GameState, Place } from '@cstar/game-core';
import { drainOf, officeStageOf } from './office-mood';

/** The places that visibly change as the company empties. The others only lose their colour. */
const STAGED: ReadonlySet<Place> = new Set(['office', 'desk', 'hallway']);

/**
 * The same room, rendered in Blender (ADR-005), at the stage of the story the player has reached:
 * what the 2D screens show, and what shows while the 3D scene loads. A plain image, so nothing
 * about it can fail on a weak device.
 */
export const Backdrop = ({ place, state }: { place: Place; state: GameState }) => {
  const name = STAGED.has(place) ? `${place}-${officeStageOf(state)}` : place;
  const drain = drainOf(state.calendar.month) * (place === 'home' ? 0.45 : 1);

  return (
    <img
      key={name}
      src={`/art/places/${name}.webp`}
      alt=""
      aria-hidden
      style={{ filter: `saturate(${1 - drain}) brightness(${1 - drain * 0.2})` }}
      className="animate-fade absolute inset-0 size-full object-cover"
    />
  );
};
