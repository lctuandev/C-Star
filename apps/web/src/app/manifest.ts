import { gameInfo } from '@cstar/content';
import type { MetadataRoute } from 'next';

// `output: 'export'` needs it: the file is written at build time.
export const dynamic = 'force-static';

/** Installable app (ADR-002). Colors mirror the surface-950 token; any orientation, for tablets and desktops. */
const manifest = (): MetadataRoute.Manifest => ({
  id: '/',
  name: gameInfo.title,
  short_name: gameInfo.title,
  description: gameInfo.tagline,
  lang: 'vi',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  orientation: 'any',
  background_color: '#0d1220',
  theme_color: '#0d1220',
  categories: ['games', 'entertainment'],
  icons: [
    { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    {
      src: '/icons/icon-maskable-512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],
});

export default manifest;
