'use client';

import { gameInfo } from '@cstar/content';
import { MAX_PLAYER_NAME } from '@cstar/game-core';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { useGameStore } from '@/features/play/game-store';
import { useSaveStore } from '@/features/save/save-store';

/** The first paper the player signs: a name, or none. It stays on this device (contracts/save.md). */
export const ApplicationForm = () => {
  const router = useRouter();
  // Asked once, on arrival: starting the run clears it, and that must not count as a stray link.
  const [sentByMenu] = useState(() => useGameStore.getState().startingNewGame);
  const [name, setName] = useState('');

  // Only the menu sends anyone here: a stray link must not write over a saved run.
  useEffect(() => {
    if (!sentByMenu) {
      router.replace('/');
    }
  }, [sentByMenu, router]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void useSaveStore
      .getState()
      .setAsideBroken()
      .catch(() => undefined)
      .then(() => {
        useGameStore.getState().newRun(Date.now(), name);
        router.push('/play');
      });
  };

  if (!sentByMenu) {
    return null;
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center p-4">
      <img
        src="/art/cover.webp"
        alt=""
        aria-hidden
        className="fixed inset-0 size-full object-cover opacity-30"
      />
      <form
        onSubmit={submit}
        className="paper-card animate-rise relative flex w-full max-w-md flex-col gap-4 rounded-2xl p-6"
      >
        <p className="text-xs font-extrabold tracking-[0.2em] opacity-60">
          {gameInfo.title.toUpperCase()} · PHÒNG NHÂN SỰ
        </p>
        <h1 className="text-2xl font-extrabold">Đơn ứng tuyển</h1>
        <label className="flex flex-col gap-1 font-bold">
          Tên của bạn
          <input
            autoFocus
            value={name}
            maxLength={MAX_PLAYER_NAME}
            onChange={(event) => setName(event.target.value)}
            autoComplete="off"
            className="border-ink-paper/40 focus:border-ink-paper min-h-11 border-b-2 bg-transparent text-lg outline-none"
          />
        </label>
        <p className="text-sm opacity-70">
          Không điền cũng được: Phó giám đốc đằng nào cũng không nhớ. Tên chỉ nằm trên máy này.
        </p>
        <Button type="submit">Nộp hồ sơ</Button>
      </form>
    </main>
  );
};
