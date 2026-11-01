'use client';

import { world } from '@cstar/content';
import Link from 'next/link';
import { useEffect } from 'react';
import { useProgressStore } from './progress-store';

/** Why anyone plays again: what is still locked says how to reach it, not what is in it. */
export const EndingsList = () => {
  const counts = useProgressStore((store) => store.counts);
  const load = useProgressStore((store) => store.load);

  useEffect(() => {
    void load();
  }, [load]);

  const reached = world.endings.filter(({ id }) => counts[id]).length;

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col gap-4 px-6 pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-[calc(env(safe-area-inset-bottom)+1rem)]">
      <h1 className="text-2xl font-extrabold">
        Đã mở {reached}/{world.endings.length}
      </h1>
      <ul className="flex flex-1 flex-col gap-3">
        {world.endings.map(({ id, title, summary, hint }) => {
          const count = counts[id];
          return (
            <li key={id} className="bg-surface-800 rounded-xl p-4">
              {count ? (
                <>
                  <p className="font-bold">{title}</p>
                  <p className="text-ink-secondary text-sm">{summary}</p>
                  <p className="text-ink-muted mt-1 text-xs">Đã đạt {count} lần</p>
                </>
              ) : (
                <>
                  <p className="text-ink-muted font-bold">Chưa mở</p>
                  <p className="text-ink-secondary text-sm">{hint}</p>
                </>
              )}
            </li>
          );
        })}
      </ul>
      <Link
        href="/"
        className="bg-surface-700 flex min-h-11 items-center justify-center rounded-xl px-4 font-bold"
      >
        Quay lại
      </Link>
    </main>
  );
};
