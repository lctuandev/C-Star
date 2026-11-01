import { disclaimer, gameInfo } from '@cstar/content';
import { render, screen, waitFor } from '@testing-library/react';
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

  it('goes to the application form only after the disclaimer', async () => {
    render(<LandingScreen />);
    await userEvent.click(screen.getByRole('button', { name: 'Game mới' }));
    expect(useDisclaimerStore.getState().gate).toBe('asking');
    expect(push).not.toHaveBeenCalled();

    useDisclaimerStore.getState().accept();
    await waitFor(() => expect(push).toHaveBeenCalledWith('/apply'));
  });

  it('links to the policy at the foot of the page', () => {
    render(<LandingScreen />);
    expect(screen.getByRole('link', { name: 'Chính sách' })).toHaveAttribute('href', '/policy');
  });

  it('asks for a coffee only when asked, with the QR and what it does not buy', async () => {
    render(<LandingScreen />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Mời tác giả ly cà phê' }));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveTextContent('Không mở thêm nội dung, không hoàn lại');
    expect(screen.getByRole('img', { name: /VietQR/ })).toHaveAttribute('src', '/donate/qr.png');

    await userEvent.click(screen.getByRole('button', { name: 'Đóng' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('links to the full text', () => {
    render(<LandingScreen />);
    expect(screen.getByRole('link', { name: 'Về game' })).toHaveAttribute('href', '/about');
  });
});
