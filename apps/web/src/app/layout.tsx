import { gameInfo } from '@cstar/content';
import type { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-be-vietnam-pro',
  display: 'swap',
});

export const metadata: Metadata = {
  title: gameInfo.title,
  description: gameInfo.tagline,
  applicationName: gameInfo.title,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0c1113',
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="vi" className={beVietnamPro.variable}>
    <body>{children}</body>
  </html>
);

export default RootLayout;
