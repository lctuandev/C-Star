'use client';

import { useEffect, useState } from 'react';

const MS_PER_CHARACTER = 16;

const prefersStillText = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Reveals a line. Give the component a new `key` per line: the count starts over with it. */
export const useTypewriter = (text: string) => {
  const [count, setCount] = useState(() => (prefersStillText() ? text.length : 0));

  useEffect(() => {
    if (count >= text.length) {
      return;
    }
    const timer = setInterval(() => setCount((shown) => shown + 1), MS_PER_CHARACTER);
    return () => clearInterval(timer);
  }, [count, text.length]);

  return {
    shown: text.slice(0, count),
    done: count >= text.length,
    finish: () => setCount(text.length),
  };
};
