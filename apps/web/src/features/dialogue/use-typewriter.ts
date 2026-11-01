'use client';

import { useEffect, useState } from 'react';
import { useSettingsStore } from '@/features/settings/settings-store';
import type { Settings } from '@/features/settings/settings-store';

const MS_PER_CHARACTER: Record<Settings['textSpeed'], number> = {
  slow: 32,
  normal: 16,
  instant: 0,
};

const prefersStillText = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Reveals a line. Give the component a new `key` per line: the count starts over with it. */
export const useTypewriter = (text: string) => {
  const speed = useSettingsStore((settings) => settings.textSpeed);
  const [count, setCount] = useState(() =>
    speed === 'instant' || prefersStillText() ? text.length : 0,
  );

  useEffect(() => {
    if (count >= text.length) {
      return;
    }
    const timer = setInterval(() => setCount((shown) => shown + 1), MS_PER_CHARACTER[speed]);
    return () => clearInterval(timer);
  }, [count, speed, text.length]);

  return {
    shown: text.slice(0, count),
    done: count >= text.length,
    finish: () => setCount(text.length),
  };
};
