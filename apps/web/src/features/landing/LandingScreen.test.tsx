import { disclaimer, gameInfo } from '@cstar/content';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { useDisclaimerStore } from '@/features/disclaimer/disclaimer-store';
import { LandingScreen } from './LandingScreen';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

describe('LandingScreen', () => {
  it('shows the title and the short reminder', () => {
    render(<LandingScreen />);
    expect(screen.getByRole('heading', { name: gameInfo.title })).toBeInTheDocument();
    expect(screen.getByText(disclaimer.reminder)).toBeInTheDocument();
  });

  it('goes to the game only after the disclaimer', async () => {
    render(<LandingScreen />);
    await userEvent.click(screen.getByRole('button', { name: 'Game mới' }));
    expect(useDisclaimerStore.getState().gate).toBe('asking');
    expect(push).not.toHaveBeenCalled();

    useDisclaimerStore.getState().accept();
    expect(push).toHaveBeenCalledWith('/play');
  });

  it('links to the full text', () => {
    render(<LandingScreen />);
    expect(screen.getByRole('link', { name: 'Về game' })).toHaveAttribute('href', '/about');
  });
});
