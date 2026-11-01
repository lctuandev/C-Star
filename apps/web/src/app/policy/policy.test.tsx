import { issuesUrl, policySections } from '@cstar/content';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PolicyPage from './page';

describe('the policy page', () => {
  it('states every section, and says how to reach the author', () => {
    render(<PolicyPage />);
    for (const { title } of policySections) {
      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
    }
    expect(screen.getByRole('link', { name: 'Trang GitHub của dự án' })).toHaveAttribute(
      'href',
      issuesUrl,
    );
  });

  it('covers what the game does with data and donations', () => {
    const titles = policySections.map(({ title }) => title);
    expect(titles).toEqual(expect.arrayContaining(['Dữ liệu của bạn', 'Ủng hộ tác giả']));
  });
});
