import { disclaimer } from '@cstar/content';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DisclaimerGate } from './DisclaimerGate';
import { useDisclaimerStore } from './disclaimer-store';

const KEY = 'cstar.disclaimer-accepted-version';
const initial = useDisclaimerStore.getState();
const game = <p>Trong game</p>;
const confirm = () => screen.getByRole('button', { name: disclaimer.confirmLabel });

describe('DisclaimerGate', () => {
  beforeEach(() => {
    localStorage.clear();
    useDisclaimerStore.setState(initial, true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('keeps the game hidden until the player accepts', async () => {
    render(<DisclaimerGate>{game}</DisclaimerGate>);
    expect(screen.getByText(disclaimer.body)).toBeInTheDocument();
    expect(screen.queryByText('Trong game')).not.toBeInTheDocument();

    await userEvent.click(confirm());
    expect(screen.getByText('Trong game')).toBeInTheDocument();
    expect(localStorage.getItem(KEY)).toBe(String(disclaimer.version));
  });

  it('shows no game while the device is unknown', () => {
    useDisclaimerStore.setState({ open: () => undefined });
    const { container } = render(<DisclaimerGate>{game}</DisclaimerGate>);
    expect(container).toBeEmptyDOMElement();
  });

  it('lets someone who accepted this text straight in', () => {
    localStorage.setItem(KEY, String(disclaimer.version));
    render(<DisclaimerGate>{game}</DisclaimerGate>);
    expect(screen.getByText('Trong game')).toBeInTheDocument();
  });

  it('asks again after the text changed', () => {
    localStorage.setItem(KEY, String(disclaimer.version - 1));
    render(<DisclaimerGate>{game}</DisclaimerGate>);
    expect(screen.getByText(disclaimer.body)).toBeInTheDocument();
  });

  it('treats a damaged value as never accepted', () => {
    localStorage.setItem(KEY, 'đã đọc');
    render(<DisclaimerGate>{game}</DisclaimerGate>);
    expect(screen.getByText(disclaimer.body)).toBeInTheDocument();
  });

  it('asks on a new game, then carries on', async () => {
    localStorage.setItem(KEY, String(disclaimer.version));
    const then = vi.fn();
    render(<DisclaimerGate>{game}</DisclaimerGate>);

    useDisclaimerStore.getState().askForNewGame(then);
    await waitFor(() => expect(screen.getByText(disclaimer.body)).toBeInTheDocument());
    expect(then).not.toHaveBeenCalled();

    await userEvent.click(confirm());
    expect(then).toHaveBeenCalledOnce();
  });

  it('still lets the player in when the browser blocks storage', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError');
    });
    render(<DisclaimerGate>{game}</DisclaimerGate>);
    await userEvent.click(confirm());
    expect(screen.getByText('Trong game')).toBeInTheDocument();
  });
});
