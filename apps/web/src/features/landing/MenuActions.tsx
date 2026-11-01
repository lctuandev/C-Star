'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useDisclaimerStore } from '@/features/disclaimer/disclaimer-store';

export const MenuActions = () => {
  const router = useRouter();
  const askForNewGame = useDisclaimerStore((state) => state.askForNewGame);

  return (
    <nav className="mt-4 flex w-full max-w-xs flex-col gap-3">
      <Button onClick={() => askForNewGame(() => router.push('/play'))}>Game mới</Button>
      <Link
        href="/about"
        className="bg-surface-700 flex min-h-11 items-center justify-center rounded-xl px-4 font-bold"
      >
        Về game
      </Link>
    </nav>
  );
};
