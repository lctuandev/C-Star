// @vitest-environment node
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const SRC = path.resolve(import.meta.dirname, '../..');

describe('the disclaimer text', () => {
  it('lives only in packages/content (ADR-003)', () => {
    const copies = readdirSync(SRC, { recursive: true, encoding: 'utf8' })
      .filter((file) => /\.tsx?$/.test(file) && !file.endsWith('one-source.test.ts'))
      .filter((file) =>
        /không nhắm vào|tác phẩm (giải trí )?hư cấu/i.test(
          readFileSync(path.join(SRC, file), 'utf8'),
        ),
      );
    expect(copies).toEqual([]);
  });
});
