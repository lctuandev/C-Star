'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useDisclaimerStore } from '@/features/disclaimer/disclaimer-store';
import { useGameStore } from '@/features/play/game-store';
import { downloadSave, useSaveStore } from '@/features/save/save-store';

export const MenuActions = () => {
  const router = useRouter();
  const askForNewGame = useDisclaimerStore((state) => state.askForNewGame);
  const status = useSaveStore((store) => store.status);
  const file = useSaveStore((store) => store.file);
  const refresh = useSaveStore((store) => store.refresh);
  const setAsideBroken = useSaveStore((store) => store.setAsideBroken);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const hasRun = status === 'found' && file !== null && file.state.phase !== 'ended';

  const startNewGame = () =>
    askForNewGame(() => {
      void setAsideBroken()
        .catch(() => undefined)
        .then(() => {
          useGameStore.getState().newRun(Date.now());
          router.push('/play');
        });
    });

  if (confirming) {
    return (
      <nav className="mt-4 flex w-full max-w-xs flex-col gap-3">
        <p className="text-ink-secondary">Lượt đang chơi sẽ bị thay thế, không lấy lại được.</p>
        <Button onClick={startNewGame}>Chơi lại từ đầu</Button>
        <Button variant="quiet" onClick={() => setConfirming(false)}>
          Để sau
        </Button>
      </nav>
    );
  }

  return (
    <nav className="mt-4 flex w-full max-w-xs flex-col gap-3">
      {status === 'broken' && (
        <div className="bg-surface-800 flex flex-col gap-2 rounded-xl p-3 text-left text-sm">
          <p>Không đọc được save của bạn. Game không xóa nó: lưu file ra để giữ lại.</p>
          <Button variant="quiet" onClick={downloadSave}>
            Lưu file save
          </Button>
        </div>
      )}
      {hasRun && (
        <Button
          onClick={() => {
            useGameStore.getState().resume(file.state);
            router.push('/play');
          }}
        >
          Tiếp tục
        </Button>
      )}
      <Button
        variant={hasRun ? 'quiet' : 'primary'}
        onClick={() => (hasRun ? setConfirming(true) : startNewGame())}
      >
        Game mới
      </Button>
      <Link
        href="/about"
        className="bg-surface-700 flex min-h-11 items-center justify-center rounded-xl px-4 font-bold"
      >
        Về game
      </Link>
    </nav>
  );
};
