// @vitest-environment node
import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import manifest from './manifest';

describe('manifest', () => {
  it('opens in any orientation, in Vietnamese', () => {
    expect(manifest()).toMatchObject({
      lang: 'vi',
      display: 'standalone',
      orientation: 'any',
      start_url: '/',
    });
  });

  it('has the icons browsers ask for, and they exist', () => {
    const icons = manifest().icons ?? [];
    expect(icons.map((icon) => [icon.sizes, icon.purpose])).toEqual([
      ['192x192', 'any'],
      ['512x512', 'any'],
      ['512x512', 'maskable'],
    ]);
    for (const icon of icons) {
      expect(existsSync(path.resolve(import.meta.dirname, '../../public', `.${icon.src}`))).toBe(
        true,
      );
    }
  });
});
