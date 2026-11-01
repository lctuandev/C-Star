const PATHS: Record<string, string> = {
  work: 'M4 5h16v11H4zM2 19h20M9 19l1-3h4l1 3',
  'side-gig': 'M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM11 18h2',
  rest: 'M4 12V9a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v3M2 13a2 2 0 0 1 4 0v2h12v-2a2 2 0 0 1 4 0v5H2zM5 18v2M19 18v2',
  chat: 'M4 5h16v10H10l-4 4v-4H4z',
  investigate: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
};

/** Line icons drawn here: nothing to load, and they take the colour of the button. */
export const ActionIcon = ({ id }: { id: string }) => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    className="size-5 shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={PATHS[id] ?? ''} />
  </svg>
);
