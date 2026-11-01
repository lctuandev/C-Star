import type { NextConfig } from 'next';

/**
 * The game ships as a static site with no server (ADR-001, ADR-002): `next build` writes `out/`.
 * Server features such as rewrites, proxy and on-demand image optimization are not available.
 */
const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: true,
  devIndicators: false,
  images: { unoptimized: true },
};

export default nextConfig;
