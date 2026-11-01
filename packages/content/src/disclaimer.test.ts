import { describe, expect, it } from 'vitest';
import { disclaimer, disclaimerSchema } from './disclaimer.js';

describe('disclaimer', () => {
  it('says everything the owner asked for', () => {
    expect(disclaimer.body).toContain('hư cấu');
    expect(disclaimer.body).toContain('không phải thông tin thật');
    expect(disclaimer.body).toContain('không nhắm vào');
  });

  it('says it is not legal advice', () => {
    expect(disclaimer.body).toContain('không phải là tư vấn pháp lý');
  });

  it('can be read in under ten seconds (ux-direction §5)', () => {
    expect(disclaimer.body.split(/\s+/).length).toBeLessThan(70);
  });

  it('refuses a missing version', () => {
    expect(disclaimerSchema.safeParse({ ...disclaimer, version: undefined }).success).toBe(false);
  });

  it('refuses a version that is not a positive whole number', () => {
    expect(disclaimerSchema.safeParse({ ...disclaimer, version: 0 }).success).toBe(false);
    expect(disclaimerSchema.safeParse({ ...disclaimer, version: 1.5 }).success).toBe(false);
  });
});
