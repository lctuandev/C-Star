import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useGameStore } from '@/features/play/game-store';
import { ApplicationForm } from './ApplicationForm';

const push = vi.fn();
const replace = vi.fn();

vi.mock('next/navigation', () => ({ useRouter: () => ({ push, replace }) }));

describe('ApplicationForm (SCENARIO-075)', () => {
  beforeEach(() => {
    push.mockClear();
    replace.mockClear();
    useGameStore.setState({ state: null, startingNewGame: true });
  });

  it('starts the run under the name given', async () => {
    render(<ApplicationForm />);
    await userEvent.type(screen.getByLabelText('Tên của bạn'), '  Hoa  ');
    await userEvent.click(screen.getByRole('button', { name: 'Nộp hồ sơ' }));
    await waitFor(() => expect(push).toHaveBeenCalledWith('/play'));
    expect(useGameStore.getState().state?.playerName).toBe('Hoa');
    // Regression: the run clearing the flag sent the player back to the menu.
    expect(replace).not.toHaveBeenCalled();
  });

  it('asks for nothing: the name is optional', async () => {
    render(<ApplicationForm />);
    await userEvent.click(screen.getByRole('button', { name: 'Nộp hồ sơ' }));
    await waitFor(() => expect(push).toHaveBeenCalledWith('/play'));
    expect(useGameStore.getState().state?.playerName).toBe('');
  });

  it('cannot be reached by a stray link, which would replace a saved run', async () => {
    useGameStore.setState({ startingNewGame: false });
    render(<ApplicationForm />);
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/'));
    expect(screen.queryByRole('button', { name: 'Nộp hồ sơ' })).toBeNull();
  });
});
