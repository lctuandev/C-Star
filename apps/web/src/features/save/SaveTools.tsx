'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { downloadSave, useSaveStore } from './save-store';

/** A save lives on one device only (ADR-001): this is how it leaves, and how it comes back. */
export const SaveTools = () => {
  const status = useSaveStore((store) => store.status);
  const refresh = useSaveStore((store) => store.refresh);
  const importText = useSaveStore((store) => store.importText);
  const input = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const onFile = async (file: File | undefined) => {
    if (!file) {
      return;
    }
    const imported = await importText(await file.text()).catch(() => false);
    setMessage(
      imported
        ? 'Đã nhập save. Về menu để chơi tiếp.'
        : 'File này không phải save của game, hoặc đã hỏng.',
    );
  };

  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-bold">Sao lưu</h2>
      <div className="flex gap-3">
        <Button
          variant="quiet"
          className="flex-1"
          disabled={status !== 'found' && status !== 'broken'}
          onClick={downloadSave}
        >
          Xuất save
        </Button>
        <Button variant="quiet" className="flex-1" onClick={() => input.current?.click()}>
          Nhập save
        </Button>
      </div>
      <input
        ref={input}
        type="file"
        accept="application/json,.json"
        aria-label="Chọn file save"
        className="hidden"
        onChange={(event) => void onFile(event.target.files?.[0])}
      />
      {message && (
        <p role="status" className="text-ink-secondary text-sm">
          {message}
        </p>
      )}
    </section>
  );
};
