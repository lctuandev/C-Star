import { disclaimer, world } from '@cstar/content';
import type { GameState } from '@cstar/game-core';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useGameStore } from '@/features/play/game-store';
import { saveBackend } from '@/features/save/save-backend';
import { EndingScreen } from './EndingScreen';
import { EndingsList } from './EndingsList';
import { useProgressStore } from './progress-store';

vi.mock('@/features/save/save-backend', () => ({
  saveBackend: { read: vi.fn(), write: vi.fn(), remove: vi.fn() },
}));

const backend = vi.mocked(saveBackend);
const initial = useProgressStore.getState();

const ended = (ending: string): GameState => {
  useGameStore.getState().newRun(1);
  const state = useGameStore.getState().state as GameState;
  const over: GameState = {
    ...state,
    phase: 'ended',
    ending,
    story: { ...state.story, sceneId: null, nodeId: null },
    money: { ...state.money, companyDebt: 82_500_000, loans: 5_000_000 },
    evidence: ['contract'],
  };
  useGameStore.setState({ state: over });
  return over;
};

describe('EndingScreen (SCENARIO-047)', () => {
  it('says how the run ended, and what is left', () => {
    render(<EndingScreen state={ended('survivor')} />);
    expect(screen.getByRole('heading', { name: 'The Survivor' })).toBeInTheDocument();
    expect(screen.getByText('82.500.000 đ')).toBeInTheDocument();
    expect(screen.getByText('5.000.000 đ')).toBeInTheDocument();
    expect(screen.getByText(`1/${world.evidence.length}`)).toBeInTheDocument();
  });

  it('adds up what the months cost', () => {
    const state = ended('survivor');
    render(
      <EndingScreen
        state={{
          ...state,
          calendar: { ...state.calendar, month: 4 },
          paidByMonth: { '1': 15_000_000, '3': 5_000_000 },
          relations: { uyen: 20, khoa: 15, dan: 14 },
        }}
      />,
    );
    const row = (label: string) => screen.getByText(label).parentElement;
    expect(row('Số tháng đã làm')).toHaveTextContent('3');
    expect(row('Tổng đã nhận')).toHaveTextContent('24.500.000 đ');
    expect(row('KPI bị giữ')).toHaveTextContent('9.000.000 đ');
    expect(row('Số lần nghe hứa')).toHaveTextContent('2');
    expect(row('Người còn liên lạc')).toHaveTextContent('2');
  });

  it('repeats that this is fiction (contracts/content.md §5)', () => {
    render(<EndingScreen state={ended('good')} />);
    expect(screen.getByText(disclaimer.reminder)).toBeInTheDocument();
  });

  it('offers no way back after a real ending', () => {
    render(<EndingScreen state={ended('good')} />);
    expect(screen.queryByRole('button', { name: 'Tiếp tục cống hiến' })).not.toBeInTheDocument();
  });

  it('turns Ending 5 into the joke, and renews the contract (SCENARIO-048)', async () => {
    render(<EndingScreen state={ended('empty-promise')} />);
    expect(screen.getByRole('heading', { name: 'CONGRATULATIONS!' })).toBeInTheDocument();
    expect(screen.getByText('PAYMENT DELAYED AGAIN.')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục cống hiến' }));
    const state = useGameStore.getState().state as GameState;
    expect(state).toMatchObject({ phase: 'scene', loops: 1, calendar: { month: 1 } });
    expect(state.money.companyDebt).toBe(82_500_000);
  });
});

describe('the collection (SCENARIO-049)', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    backend.write.mockResolvedValue();
    useProgressStore.setState(initial, true);
  });

  it('shows hints for what is locked, and never the title', async () => {
    backend.read.mockResolvedValue({ survivor: 2 });
    render(<EndingsList />);

    expect(await screen.findByRole('heading', { name: 'Đã mở 1/6' })).toBeInTheDocument();
    expect(screen.getByText('The Survivor')).toBeInTheDocument();
    expect(screen.getByText('Đã đạt 2 lần')).toBeInTheDocument();
    expect(screen.queryByText('The Good Ending')).not.toBeInTheDocument();
    expect(screen.getByText(/gửi yêu cầu chính thức/)).toBeInTheDocument();
  });

  it('starts empty on a first visit, or if the stored value is damaged', async () => {
    backend.read.mockResolvedValue('junk');
    render(<EndingsList />);
    expect(await screen.findByRole('heading', { name: 'Đã mở 0/6' })).toBeInTheDocument();
  });

  it('adds up', async () => {
    backend.read.mockResolvedValue({ survivor: 1 });
    await useProgressStore.getState().record('survivor');
    expect(backend.write).toHaveBeenCalledWith('progress', { survivor: 2 });
  });

  it('counts a run when it ends, and only then', async () => {
    backend.read.mockResolvedValue(undefined);
    const over = ended('good');
    const before: GameState = {
      ...over,
      phase: 'scene',
      story: {
        ...over.story,
        sceneId: 'ending-good',
        nodeId: 'year-end',
        flags: { runOver: true },
        seenScenes: ['ending-good'],
      },
    };
    useGameStore.setState({ state: before });
    useGameStore.getState().dispatch({ type: 'advance' });
    await waitFor(() => expect(backend.write).toHaveBeenCalledWith('progress', { good: 1 }));
  });

  it('shrugs off a storage that fails', async () => {
    backend.read.mockRejectedValue(new Error('blocked'));
    await expect(useProgressStore.getState().record('good')).resolves.toBeUndefined();
  });
});
