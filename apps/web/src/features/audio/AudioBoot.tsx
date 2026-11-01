'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useGameStore } from '@/features/play/game-store';
import { officeMood } from '@/features/office/office-mood';
import { useSettingsStore } from '@/features/settings/settings-store';
import type { Settings } from '@/features/settings/settings-store';
import { audioEngine } from './audio-engine';
import { trackFor } from './score';
import { cueFor } from './sound-cues';

const FULL_OFFICE = 10;

/** Listens to the run and the settings. The rules know nothing about sound. */
export const AudioBoot = () => {
  const pathname = usePathname();
  const onPlay = pathname === '/play';

  useEffect(() => {
    const settings = useSettingsStore.getState();
    settings.load();
    const applySettings = ({ volume, ambience, music, typing }: Settings) => {
      audioEngine.setVolume(volume);
      audioEngine.setAmbience(ambience);
      audioEngine.setMusic(music);
      audioEngine.setTyping(typing);
    };
    applySettings(useSettingsStore.getState());

    const press = (event: Event) => {
      audioEngine.unlock();
      const control = (event.target as Element | null)?.closest?.('button, a, label');
      if (control) {
        audioEngine.play(control.matches(':disabled') ? 'denied' : 'tap');
      }
    };
    const unlock = () => audioEngine.unlock();
    const hide = () => audioEngine.setHidden(document.hidden);
    window.addEventListener('pointerdown', press);
    window.addEventListener('keydown', unlock);
    document.addEventListener('visibilitychange', hide);

    const stopSettings = useSettingsStore.subscribe(applySettings);
    const stopGame = useGameStore.subscribe((store, previous) => {
      if (store.state && store.state !== previous.state) {
        const cue = cueFor(previous.state, store.state, store.lastAction);
        if (cue) {
          audioEngine.play(cue);
        }
      }
    });

    return () => {
      window.removeEventListener('pointerdown', press);
      window.removeEventListener('keydown', unlock);
      document.removeEventListener('visibilitychange', hide);
      stopSettings();
      stopGame();
    };
  }, []);

  // The music and the sound of the room follow where the player is.
  useEffect(() => {
    const follow = (state: ReturnType<typeof useGameStore.getState>['state']) => {
      const track = onPlay ? trackFor(state) : 'menu';
      audioEngine.setTrack(track);
      audioEngine.setRoomBusy(
        onPlay && state && track !== 'home' && track !== 'homeLate' && track !== 'menu'
          ? (officeMood(state).occupiedDesks / FULL_OFFICE) * 0.5
          : 0,
      );
    };
    follow(useGameStore.getState().state);
    return useGameStore.subscribe((store) => follow(store.state));
  }, [onPlay]);

  return null;
};
