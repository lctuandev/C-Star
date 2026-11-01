import { disclaimer, gameInfo } from '@cstar/content';
import { MenuActions } from '@/features/landing/MenuActions';
import { PwaPrompts } from '@/features/pwa/PwaPrompts';

/** The cover, then the menu: under the thumb on a phone, down the left on a large screen. */
export const LandingScreen = () => (
  <main className="relative flex min-h-dvh flex-col justify-end overflow-hidden lg:justify-center">
    <img
      src="/art/cover.webp"
      alt=""
      aria-hidden
      className="absolute inset-0 size-full object-cover object-[55%_40%]"
    />
    <div className="from-surface-950 via-surface-950/80 absolute inset-0 bg-gradient-to-t via-45% to-transparent lg:bg-gradient-to-r lg:via-35% lg:to-70%" />
    <div className="relative flex w-full flex-col items-center gap-2 px-6 pt-[calc(env(safe-area-inset-top)+6rem)] pb-[calc(env(safe-area-inset-bottom)+1.5rem)] text-center lg:max-w-xl lg:items-start lg:px-16 lg:text-left">
      <img src="/art/mark.svg" alt="" aria-hidden className="size-20 lg:size-24" />
      <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl">{gameInfo.title}</h1>
      <p className="text-paycheck text-lg font-bold">{gameInfo.tagline}</p>
      <MenuActions />
      <p className="text-ink-muted mt-3 max-w-sm text-sm">{disclaimer.reminder}</p>
    </div>
    <PwaPrompts />
  </main>
);
