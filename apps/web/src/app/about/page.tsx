import { disclaimer, gameInfo } from '@cstar/content';
import Link from 'next/link';
import { SaveTools } from '@/features/save/SaveTools';

/** A first "Về game"; FEAT-027 builds on it. */
const AboutPage = () => (
  <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-6 px-6 pt-[env(safe-area-inset-top)] pb-[calc(env(safe-area-inset-bottom)+1rem)]">
    <h1 className="text-2xl font-extrabold">{gameInfo.title}</h1>
    <p className="text-ink-secondary text-base leading-7">{disclaimer.body}</p>
    <SaveTools />
    <Link
      href="/"
      className="bg-surface-700 flex min-h-11 items-center justify-center rounded-xl px-4 font-bold"
    >
      Quay lại
    </Link>
  </main>
);

export default AboutPage;
