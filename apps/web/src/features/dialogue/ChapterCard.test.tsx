import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ChapterCard } from './ChapterCard';

describe('ChapterCard (SCENARIO-074)', () => {
  it('names the chapter of the scene', () => {
    render(<ChapterCard sceneId="ch2-payday" />);
    expect(screen.getByText('Payment Delay')).toBeInTheDocument();
    expect(screen.getByText('CHƯƠNG 2')).toBeInTheDocument();
  });

  it('stays out of the way of taps and screen readers', () => {
    const { container } = render(<ChapterCard sceneId="ch2-payday" />);
    expect(container.firstElementChild).toHaveClass('pointer-events-none');
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('shows nothing outside the chapters', () => {
    const { container } = render(<ChapterCard sceneId="crisis-broke" />);
    expect(container).toBeEmptyDOMElement();
  });
});
