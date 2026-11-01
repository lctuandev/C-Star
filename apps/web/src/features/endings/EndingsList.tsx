'use client';

import { world } from '@cstar/content';
import Link from 'next/link';
import { useEffect } from 'react';
import { buttonClass } from '@/components/ui/Button';
import { PageFrame } from '@/components/ui/PageFrame';
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
    <PageFrame title={`Đã mở ${reached}/${world.endings.length}`} wide>
      <ul className="grid gap-3 lg:grid-cols-2">
        {world.endings.map(({ id, title, summary, hint }) => {
          const count = counts[id];
          return (
            <li key={id} className="bg-surface-800/90 rounded-2xl p-4">
              {count ? (
                <>
                  <p className="text-paycheck font-bold">{title}</p>
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
      <Link href="/" className={buttonClass('quiet')}>
        Quay lại
      </Link>
    </PageFrame>
  );
};
