'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { installHintFor } from './install-hint';
import { usePwaStore } from './pwa-store';
import { applyUpdate } from './service-worker-client';

const Card = ({ children }: { children: React.ReactNode }) => (
  <aside className="bg-surface-800 fixed z-40 inset-x-4 bottom-[calc(env(safe-area-inset-bottom)+1rem)] mx-auto flex max-w-sm flex-col gap-3 rounded-2xl border border-white/10 p-4 text-left">
    {children}
  </aside>
);

const UpdateCard = ({ worker }: { worker: ServiceWorker }) => {
  const [updating, setUpdating] = useState(false);

  return (
    <Card>
      <div>
        <p className="font-bold">Có bản mới rồi</p>
        <p className="text-ink-secondary text-sm">Bản này được trả đúng hạn, không như lương.</p>
      </div>
      <Button
        disabled={updating}
        onClick={() => {
          setUpdating(true);
          applyUpdate(worker);
        }}
      >
        {updating ? 'Đang cập nhật…' : 'Cập nhật'}
      </Button>
    </Card>
  );
};

const NativeInstallCard = () => {
  const dismissHint = usePwaStore((state) => state.dismissHint);
  const installPrompt = usePwaStore((state) => state.installPrompt);

  return (
    <Card>
      <div>
        <p className="font-bold">Cài game lên máy</p>
        <p className="text-ink-secondary text-sm">Chơi toàn màn hình, không cần mạng.</p>
      </div>
      <div className="flex gap-3">
        <Button variant="quiet" className="flex-1" onClick={dismissHint}>
          Để sau
        </Button>
        <Button
          className="flex-1"
          onClick={() => {
            dismissHint();
            void installPrompt?.prompt();
          }}
        >
          Cài đặt
        </Button>
      </div>
    </Card>
  );
};

const IosStepsCard = () => {
  const dismissHint = usePwaStore((state) => state.dismissHint);

  return (
    <Card>
      <div>
        <p className="font-bold">Cài game lên iPhone</p>
        <p className="text-ink-secondary text-sm">
          Bấm nút Chia sẻ của trình duyệt, rồi chọn Thêm vào Màn hình chính.
        </p>
      </div>
      <Button variant="quiet" onClick={dismissHint}>
        Đã hiểu
      </Button>
    </Card>
  );
};

/** One card at a time: an update matters more than an install hint. */
export const PwaPrompts = () => {
  const updateWorker = usePwaStore((state) => state.updateWorker);
  const environmentKnown = usePwaStore((state) => state.environmentKnown);
  const hint = usePwaStore((state) =>
    installHintFor({
      standalone: state.standalone,
      dismissed: state.hintDismissed,
      canPrompt: state.installPrompt !== null,
      ios: state.ios,
    }),
  );

  if (updateWorker) {
    return <UpdateCard worker={updateWorker} />;
  }
  if (!environmentKnown) {
    return null;
  }
  if (hint === 'native') {
    return <NativeInstallCard />;
  }
  return hint === 'ios-steps' ? <IosStepsCard /> : null;
};
