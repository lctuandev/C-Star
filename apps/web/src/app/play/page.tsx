import Link from 'next/link';

/** Holds the place of the game until FEAT-005. */
const PlayPage = () => (
  <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
    <h1 className="text-2xl font-extrabold">Văn phòng đang được dọn dẹp</h1>
    <Link href="/" className="text-fluorescent font-bold">
      Về menu
    </Link>
  </main>
);

export default PlayPage;
