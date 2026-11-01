'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { DisclaimerScreen } from './DisclaimerScreen';
import { useDisclaimerStore } from './disclaimer-store';

/**
 * Wraps the whole app in the root layout, so every route is behind it, with no redirect to forget:
 * a direct link, an old save or an offline start all land here first (ADR-003).
 */
export const DisclaimerGate = ({ children }: { children: ReactNode }) => {
  const gate = useDisclaimerStore((state) => state.gate);
  const open = useDisclaimerStore((state) => state.open);
  const accept = useDisclaimerStore((state) => state.accept);

  useEffect(() => {
    open();
  }, [open]);

  if (gate === 'unknown') {
    return null;
  }
  return gate === 'asking' ? <DisclaimerScreen onAccept={accept} /> : children;
};
