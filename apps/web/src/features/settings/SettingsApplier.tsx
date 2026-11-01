'use client';

import { useEffect } from 'react';
import { useSettingsStore } from './settings-store';

/** Text size reaches every screen through one attribute on <html> (see globals.css). */
export const SettingsApplier = () => {
  const textSize = useSettingsStore((settings) => settings.textSize);

  useEffect(() => {
    document.documentElement.dataset.textSize = textSize;
  }, [textSize]);

  return null;
};
