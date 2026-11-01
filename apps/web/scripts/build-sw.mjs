/**
 * Writes out/sw.js after `next build`: the worker from src/features/pwa/sw.template.js with the
 * list of the whole build on top, so no file can be forgotten (ADR-002).
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { buildVersion, precacheUrls } from './precache.mjs';

const webRoot = path.resolve(import.meta.dirname, '..');
const outDir = path.join(webRoot, 'out');

const listFiles = async () => {
  const entries = await readdir(outDir, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.relative(outDir, path.join(entry.parentPath, entry.name)))
    .map((file) => file.split(path.sep).join('/'));
};

const files = (await listFiles()).filter((file) => file !== 'sw.js');
const entries = await Promise.all(
  files.map(async (file) => ({ file, content: await readFile(path.join(outDir, file)) })),
);

const build = { version: buildVersion(entries), urls: precacheUrls(files) };
const template = await readFile(path.join(webRoot, 'src/features/pwa/sw.template.js'), 'utf8');
await writeFile(
  path.join(outDir, 'sw.js'),
  `self.__CSTAR_BUILD__ = ${JSON.stringify(build)};\n${template}`,
);

const bytes = entries.reduce((sum, entry) => sum + entry.content.length, 0);
console.log(
  `sw.js: ${build.urls.length} files, ${(bytes / 1024 / 1024).toFixed(2)} MB, version ${build.version}`,
);
