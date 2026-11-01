import { disclaimer } from '@cstar/content';
import { Button } from '@/components/ui/Button';

/** Plain and serious, the one screen that does not joke (ux-direction §5). No timer, no way around. */
export const DisclaimerScreen = ({ onAccept }: { onAccept: () => void }) => (
  <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center gap-6 px-6 pt-[env(safe-area-inset-top)] pb-[calc(env(safe-area-inset-bottom)+1rem)]">
    <img src="/art/mark.svg" alt="" aria-hidden className="size-16" />
    <h1 className="text-2xl font-extrabold">{disclaimer.title}</h1>
    <p className="text-ink-secondary text-base leading-7 lg:text-lg lg:leading-8">
      {disclaimer.body}
    </p>
    <Button autoFocus onClick={onAccept}>
      {disclaimer.confirmLabel}
    </Button>
  </main>
);
