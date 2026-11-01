'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/features/play/game-store';
import { useSettingsStore } from '@/features/settings/settings-store';
import { audioEngine } from './audio-engine';
import { cueFor } from './sound-cues';

/** Listens to the run and the settings. The rules know nothing about sound. */
export const AudioBoot = () => {
  useEffect(() => {
    const settings = useSettingsStore.getState();
    settings.load();
    const applySettings = ({ volume, ambience }: { volume: number; ambience: boolean }) => {
      audioEngine.setVolume(volume);
      audioEngine.setAmbience(ambience);
    };
    applySettings(useSettingsStore.getState());

    const unlock = () => audioEngine.unlock();
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);

    const stopSettings = useSettingsStore.subscribe(applySettings);
    const stopGame = useGameStore.subscribe((store, previous) => {
      if (store.state && store.state !== previous.state) {
        const cue = cueFor(previous.state, store.state);
        if (cue) {
          audioEngine.play(cue);
        }
      }
    });

    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      stopSettings();
      stopGame();
    };
  }, []);

  return null;
};
