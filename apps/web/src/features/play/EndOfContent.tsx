import Link from 'next/link';

/** Where the content stops for now. */
export const EndOfContent = () => (
  <section className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
    <h2 className="text-2xl font-extrabold">Kỳ lương tiếp theo: Coming Soon™</h2>
    <p className="text-ink-secondary">Bản chơi thử dừng ở đây. Cảm ơn sự cống hiến của bạn.</p>
    <Link
      href="/"
      className="bg-surface-700 flex min-h-11 items-center justify-center rounded-xl px-6 font-bold"
    >
      Về menu
    </Link>
  </section>
);
