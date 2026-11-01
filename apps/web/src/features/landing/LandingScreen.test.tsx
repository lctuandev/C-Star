import { gameInfo } from '@cstar/content';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LandingScreen } from './LandingScreen';

describe('LandingScreen', () => {
  it('shows the title and the fiction note', () => {
    render(<LandingScreen />);
    expect(screen.getByRole('heading', { name: gameInfo.title })).toBeInTheDocument();
    expect(screen.getByText(gameInfo.fictionNote)).toBeInTheDocument();
  });
});
