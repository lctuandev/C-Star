'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const CoffeeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden className="size-4 fill-none stroke-current stroke-2">
    <path d="M4 9h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Z" />
    <path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H17" />
    <path d="M8 3c-.8 1 .8 2 0 3M12.5 3c-.8 1 .8 2 0 3" />
  </svg>
);

/** A small ask, under everything else: the game is free and stays complete without it. */
export const DonateButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-paycheck inline-flex min-h-11 items-center gap-1.5 text-sm font-bold"
      >
        <CoffeeIcon />
        Mời tác giả ly cà phê
      </button>
      {open && (
        <div
          role="dialog"
          aria-modal
          aria-label="Mời tác giả ly cà phê"
          className="bg-surface-950/90 animate-fade fixed inset-0 z-30 flex items-center justify-center overflow-y-auto p-4"
        >
          <div className="bg-surface-900 flex w-full max-w-sm flex-col gap-3 rounded-2xl border border-white/10 p-4">
            <h2 className="text-lg font-extrabold">Mời tác giả ly cà phê</h2>
            <p className="text-ink-secondary text-sm leading-6">
              Game miễn phí và sẽ luôn chơi đủ. Nếu bạn thấy vui, quét mã bằng ứng dụng ngân hàng,
              số tiền tùy bạn. Không mở thêm nội dung, không hoàn lại.
            </p>
            <img
              src="/donate/qr.png"
              width={828}
              height={785}
              alt="Mã VietQR ủng hộ tác giả, tài khoản LE CONG TUAN"
              className="w-full rounded-xl bg-white"
            />
            <p className="text-ink-muted text-sm">
              Xem thêm ở{' '}
              <Link href="/policy" className="underline">
                Chính sách
              </Link>
              .
            </p>
            <Button variant="quiet" onClick={() => setOpen(false)}>
              Đóng
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
