import { gameInfo } from '@cstar/content';
import { PwaPrompts } from '@/features/pwa/PwaPrompts';

/** A welcome screen until the menu exists (FEAT-002 puts the disclaimer in front of it). */
export const LandingScreen = () => (
  <main className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] text-center">
    <h1 className="text-fluorescent text-5xl font-extrabold">{gameInfo.title}</h1>
    <p className="text-ink-secondary text-lg">{gameInfo.tagline}</p>
    <p className="text-ink-muted max-w-sm text-sm">{gameInfo.fictionNote}</p>
    <PwaPrompts />
  </main>
);
