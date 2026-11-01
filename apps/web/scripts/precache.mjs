import { createHash } from 'node:crypto';

/**
 * Next's not-found pages: static hosts redirect `/404.html` or answer it with a 404, and one bad
 * response fails the whole install. An unknown address offline gets the game instead.
 */
const isSkipped = (file) =>
  file === 'sw.js' || file === '404.html' || file.startsWith('_not-found');

/** The address a file of the static build is served at. */
const urlOf = (file) => {
  if (file === 'index.html') {
    return '/';
  }
  if (file.endsWith('/index.html')) {
    return `/${file.slice(0, -'index.html'.length)}`;
  }
  return `/${file.endsWith('.html') ? file.slice(0, -'.html'.length) : file}`;
};

/** Every address to precache, from the build's relative file paths. */
export const precacheUrls = (files) =>
  files
    .filter((file) => !isSkipped(file))
    .map(urlOf)
    .sort();

/** Changes when any file changes, so every release gets its own cache. */
export const buildVersion = (entries) => {
  const hash = createHash('sha256');
  for (const { file, content } of [...entries].sort((a, b) => a.file.localeCompare(b.file))) {
    hash.update(file).update(content);
  }
  return hash.digest('hex').slice(0, 12);
};
