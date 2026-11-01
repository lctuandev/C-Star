'use client';

import type { GameState, Place } from '@cstar/game-core';
import dynamic from 'next/dynamic';
import { useState, useSyncExternalStore } from 'react';
import { useSettingsStore } from '@/features/settings/settings-store';
import { supportsWebGl } from './graphics';

const OfficeCanvas = dynamic(() => import('./OfficeCanvas'), { ssr: false });

const noSubscription = () => () => {};

interface StageProps {
  state: GameState;
  place: Place;
}

/** The 3D office when the device can carry it. Without it the game loses nothing but the view. */
export const Stage = ({ state, place }: StageProps) => {
  const graphics = useSettingsStore((settings) => settings.graphics);
  const canRender = useSyncExternalStore(noSubscription, supportsWebGl, () => false);
  const [tooSlow, setTooSlow] = useState(false);

  if (graphics === '2d' || !canRender || tooSlow) {
    return null;
  }
  return (
    <div className="absolute inset-0 overflow-hidden" data-testid="office-3d">
      <OfficeCanvas state={state} place={place} onTooSlow={() => setTooSlow(true)} />
    </div>
  );
};
