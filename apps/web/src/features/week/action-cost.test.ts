import { world } from '@cstar/content';
import { describe, expect, it } from 'vitest';
import { costLine } from './action-cost';

const lineOf = (id: string) =>
  costLine(world.actions.find((action) => action.id === id)?.effects ?? []);

describe('what a weekly action costs (FEAT-042)', () => {
  it('spells out the numbers', () => {
    expect(lineOf('work')).toBe('−15 sức khỏe · +3 căng thẳng');
    expect(lineOf('side-gig')).toBe('+1,2 tr · −20 sức khỏe · +4 căng thẳng');
    expect(lineOf('rest')).toBe('+25 sức khỏe · −10 căng thẳng');
  });

  it('keeps relations and papers out of it', () => {
    expect(lineOf('chat')).toBe('−5 sức khỏe · −8 căng thẳng');
    expect(lineOf('investigate')).toBe('−5 sức khỏe · +2 căng thẳng');
  });
});
