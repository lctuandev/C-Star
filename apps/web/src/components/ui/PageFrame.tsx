import type { ReactNode } from 'react';

interface PageFrameProps {
  title: string;
  /** Lists that use the width of a large screen. */
  wide?: boolean;
  children: ReactNode;
}

/** Everything around the game itself: the office behind, kept dark enough to read over. */
export const PageFrame = ({ title, wide = false, children }: PageFrameProps) => (
  <main className="relative min-h-dvh">
    <img
      src="/art/cover.webp"
      alt=""
      aria-hidden
      className="fixed inset-0 size-full object-cover opacity-25"
    />
    <div
      className={`relative mx-auto flex min-h-dvh flex-col justify-center gap-6 px-6 pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-[calc(env(safe-area-inset-bottom)+1.5rem)] ${
        wide ? 'max-w-4xl' : 'max-w-lg'
      }`}
    >
      <h1 className="text-3xl font-extrabold">{title}</h1>
      {children}
    </div>
  </main>
);
