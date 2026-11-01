import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PwaPrompts } from './PwaPrompts';
import { usePwaStore } from './pwa-store';
import type { BeforeInstallPromptEvent } from './pwa-store';

vi.mock('./service-worker-client', () => ({ applyUpdate: vi.fn() }));
const { applyUpdate } = await import('./service-worker-client');

const initial = usePwaStore.getState();
const fakePrompt = () => {
  const prompt = vi.fn(() => Promise.resolve());
  return { event: { prompt } as unknown as BeforeInstallPromptEvent, prompt };
};

describe('PwaPrompts', () => {
  beforeEach(() => {
    localStorage.clear();
    usePwaStore.setState(initial, true);
    vi.mocked(applyUpdate).mockClear();
  });

  it('shows nothing before the device is known', () => {
    usePwaStore.getState().setInstallPrompt(fakePrompt().event);
    const { container } = render(<PwaPrompts />);
    expect(container).toBeEmptyDOMElement();
  });

  it('offers the install and opens the browser’s prompt', async () => {
    const { event, prompt } = fakePrompt();
    usePwaStore.getState().setEnvironment({ standalone: false, ios: false });
    usePwaStore.getState().setInstallPrompt(event);
    render(<PwaPrompts />);

    await userEvent.click(screen.getByRole('button', { name: 'Cài đặt' }));
    expect(prompt).toHaveBeenCalledOnce();
    expect(screen.queryByRole('button', { name: 'Cài đặt' })).not.toBeInTheDocument();
  });

  it('does not bring the hint back after “Để sau”', async () => {
    usePwaStore.getState().setEnvironment({ standalone: false, ios: false });
    usePwaStore.getState().setInstallPrompt(fakePrompt().event);
    const { unmount } = render(<PwaPrompts />);
    await userEvent.click(screen.getByRole('button', { name: 'Để sau' }));
    expect(screen.queryByText('Cài game lên điện thoại')).not.toBeInTheDocument();
    unmount();

    usePwaStore.setState(initial, true);
    usePwaStore.getState().setEnvironment({ standalone: false, ios: false });
    usePwaStore.getState().setInstallPrompt(fakePrompt().event);
    render(<PwaPrompts />);
    expect(screen.queryByText('Cài game lên điện thoại')).not.toBeInTheDocument();
  });

  it('tells iPhone players where to find it', async () => {
    usePwaStore.getState().setEnvironment({ standalone: false, ios: true });
    render(<PwaPrompts />);
    expect(screen.getByText(/Thêm vào Màn hình chính/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Đã hiểu' }));
    expect(screen.queryByText(/Thêm vào Màn hình chính/)).not.toBeInTheDocument();
  });

  it('shows the update first, and applies it once', async () => {
    const worker = {} as ServiceWorker;
    usePwaStore.getState().setEnvironment({ standalone: false, ios: true });
    usePwaStore.getState().setUpdateWorker(worker);
    render(<PwaPrompts />);
    expect(screen.queryByText(/Thêm vào Màn hình chính/)).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Cập nhật' }));
    expect(applyUpdate).toHaveBeenCalledWith(worker);
    expect(screen.getByRole('button', { name: 'Đang cập nhật…' })).toBeDisabled();
  });
});
