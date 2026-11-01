import { gameInfo } from '@cstar/content';
import type { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import type { ReactNode } from 'react';
import { AudioBoot } from '@/features/audio/AudioBoot';
import { DisclaimerGate } from '@/features/disclaimer/DisclaimerGate';
import { PwaBoot } from '@/features/pwa/PwaBoot';
import { SettingsApplier } from '@/features/settings/SettingsApplier';
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
  appleWebApp: {
    capable: true,
    title: gameInfo.title,
    statusBarStyle: 'black-translucent',
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0d1220',
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="vi" className={beVietnamPro.variable}>
    <body>
      <PwaBoot />
      <AudioBoot />
      <SettingsApplier />
      <DisclaimerGate>{children}</DisclaimerGate>
    </body>
  </html>
);

export default RootLayout;
