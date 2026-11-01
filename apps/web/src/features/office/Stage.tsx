'use client';

import type { GameState, Place } from '@cstar/game-core';
import dynamic from 'next/dynamic';
import { Component, useState, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import { useSettingsStore } from '@/features/settings/settings-store';
import { supportsWebGl } from './graphics';

const OfficeCanvas = dynamic(() => import('./OfficeCanvas'), { ssr: false });

const noSubscription = () => () => {};

/** A file that will not load or a shader that will not compile: the 2D screens take over. */
class OfficeBoundary extends Component<{ onFail: () => void; children: ReactNode }> {
  override state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  override componentDidCatch() {
    this.props.onFail();
  }

  override render() {
    return this.state.failed ? null : this.props.children;
  }
}

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
  const stepAside = () => setTooSlow(true);
  return (
    <div className="absolute inset-0 overflow-hidden" data-testid="office-3d">
      <OfficeBoundary onFail={stepAside}>
        <OfficeCanvas state={state} place={place} onTooSlow={stepAside} />
      </OfficeBoundary>
    </div>
  );
};
