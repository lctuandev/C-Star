import { disclaimer, gameInfo } from '@cstar/content';
import { MenuActions } from '@/features/landing/MenuActions';
import { PwaPrompts } from '@/features/pwa/PwaPrompts';

export const LandingScreen = () => (
  <main className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] text-center">
    <h1 className="text-fluorescent text-5xl font-extrabold">{gameInfo.title}</h1>
    <p className="text-ink-secondary text-lg">{gameInfo.tagline}</p>
    <MenuActions />
    <p className="text-ink-muted mt-4 max-w-sm text-sm">{disclaimer.reminder}</p>
    <PwaPrompts />
  </main>
);
