import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import type { Server } from 'node:http';
import path from 'node:path';

export const WEB_OUT = path.resolve(import.meta.dirname, '../../web/out');

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
};

export interface ReleaseServer {
  url: string;
  /** Makes the next check find a new version: the same files under another build version. */
  publishNextRelease: () => void;
  /** What a page sent to `/__report`: the only way to hear from a Chrome without DevTools. */
  nextReport: () => Promise<string>;
  close: () => Promise<void>;
}

/**
 * Serves the static build the way a host does, and can pretend a new version was released.
 * `pageScript` goes into the home page, for tests that cannot drive the browser from outside.
 */
export const startReleaseServer = async (port: number, pageScript = ''): Promise<ReleaseServer> => {
  let release = 1;
  const reports: string[] = [];
  const waiting: ((report: string) => void)[] = [];

  const server: Server = createServer((request, response) => {
    void (async () => {
      const url = new URL(request.url ?? '/', 'http://localhost');
      const { pathname } = url;
      if (pathname === '/__next-release') {
        release += 1;
        response.end();
        return;
      }
      if (pathname === '/__report') {
        const report = url.searchParams.get('message') ?? '';
        const next = waiting.shift();
        if (next) {
          next(report);
        } else {
          reports.push(report);
        }
        response.end();
        return;
      }
      const file = path.join(WEB_OUT, pathname === '/' ? 'index.html' : pathname);
      try {
        let body: Buffer | string = await readFile(file);
        if (pathname === '/sw.js') {
          body = body.toString().replace(/"version":"(\w+)"/, `"version":"$1-r${release}"`);
        }
        if (pathname === '/') {
          body = body.toString().replace('</body>', `<script>${pageScript}</script></body>`);
        }
        const type = TYPES[path.extname(file)] ?? 'application/octet-stream';
        response.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
        response.end(body);
      } catch {
        response.writeHead(404);
        response.end();
      }
    })();
  });

  await new Promise<void>((resolve) => server.listen(port, resolve));
  return {
    url: `http://localhost:${port}`,
    publishNextRelease: () => {
      release += 1;
    },
    nextReport: () => {
      const report = reports.shift();
      return report === undefined
        ? new Promise((resolve) => waiting.push(resolve))
        : Promise.resolve(report);
    },
    close: () =>
      new Promise((resolve) => {
        server.closeAllConnections();
        server.close(() => resolve());
      }),
  };
};
