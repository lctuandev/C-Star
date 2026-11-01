import { describe, expect, it } from 'vitest';
import { buildVersion, precacheUrls } from '../../../scripts/precache.mjs';

describe('precacheUrls', () => {
  it('turns build files into the addresses they are served at', () => {
    expect(
      precacheUrls(['index.html', 'play.html', 'about/index.html', 'index.txt', 'icons/a.png']),
    ).toEqual(['/', '/about/', '/icons/a.png', '/index.txt', '/play']);
  });

  it('keeps every asset of the build', () => {
    const files = ['_next/static/chunks/a.js', '_next/static/media/f.woff2', '__next._tree.txt'];
    expect(precacheUrls(files)).toEqual(files.map((file) => `/${file}`).sort());
  });

  it('leaves out the worker and the not-found pages, which would fail the install', () => {
    expect(
      precacheUrls(['sw.js', '404.html', '_not-found.html', '_not-found/__next._full.txt']),
    ).toEqual([]);
  });
});

describe('buildVersion', () => {
  const entry = (file: string, content: string) => ({ file, content: Buffer.from(content) });

  it('is the same for the same files, in any order', () => {
    const a = entry('a.js', '1');
    const b = entry('b.js', '2');
    expect(buildVersion([a, b])).toBe(buildVersion([b, a]));
  });

  it('changes when a file changes', () => {
    expect(buildVersion([entry('a.js', '1')])).not.toBe(buildVersion([entry('a.js', '2')]));
  });
});
