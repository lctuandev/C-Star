import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import type { GameState } from '@cstar/game-core';
import { useGameStore, world } from '@/features/play/game-store';
import { TicketScreen } from '@/features/tickets/TicketScreen';
import { DossierSheet } from './DossierSheet';
import { relationLabel } from './relation-label';

const run = (): GameState => {
  useGameStore.getState().newRun(1);
  const state = useGameStore.getState().state as GameState;
  return {
    ...state,
    phase: 'week',
    // The first week's scene has played: the calendar would run it otherwise.
    story: { ...state.story, sceneId: null, nodeId: null, seenScenes: ['ch1-first-day'] },
  };
};

describe('relationLabel (SCENARIO-037)', () => {
  it.each([
    [80, 'Thân thiết'],
    [40, 'Thân thiết'],
    [39, 'Tin bạn'],
    [15, 'Tin bạn'],
    [14, 'Bình thường'],
    [0, 'Bình thường'],
    [-14, 'Bình thường'],
    [-15, 'Dè chừng'],
    [-39, 'Dè chừng'],
    [-40, 'Khó xử'],
  ])('%i reads as %s', (value, label) => {
    expect(relationLabel(value)).toBe(label);
  });
});

describe('DossierSheet (SCENARIO-037, 039)', () => {
  it('says so when there is nothing yet', () => {
    render(<DossierSheet state={run()} onClose={() => {}} />);
    expect(screen.getByText('Giấy tờ (0/5)')).toBeInTheDocument();
  });

  it('shows the papers kept and where people stand', () => {
    const state: GameState = { ...run(), evidence: ['contract'], relations: { uyen: 20 } };
    render(<DossierSheet state={state} onClose={() => {}} />);
    expect(screen.getByText('Hợp đồng lao động')).toBeInTheDocument();
    expect(screen.getByText('Uyên').parentElement).toHaveTextContent('Tin bạn');
    expect(screen.getByText('Sếp').parentElement).toHaveTextContent('Bình thường');
  });
});

describe('TicketScreen (SCENARIO-038)', () => {
  beforeEach(() => {
    const state = run();
    useGameStore.setState({ state });
    useGameStore.getState().dispatch({ type: 'takeAction', actionId: 'work' });
  });

  const current = () => useGameStore.getState().state as GameState;

  it('walks through a round, says how each answer went, and goes back to the week', async () => {
    const { rerender } = render(<TicketScreen state={current()} />);
    expect(screen.getByText(/Ticket 1\/4/)).toBeInTheDocument();

    for (let index = 0; index < world.rules.ticketsPerRound; index += 1) {
      await userEvent.click(screen.getByRole('button', { name: 'Làm ngay' }));
      rerender(<TicketScreen state={current()} />);
      expect(screen.getByRole('status')).toHaveTextContent(/việc\./);
    }

    await userEvent.click(screen.getByRole('button', { name: 'Xong việc' }));
    expect(current().phase).toBe('week');
    expect(current().calendar.actionsLeft).toBe(2);
  });

  it('can be skipped', async () => {
    render(<TicketScreen state={current()} />);
    await userEvent.click(screen.getByRole('button', { name: 'Làm cho có' }));
    expect(current()).toMatchObject({ phase: 'week', kpi: world.rules.quickTaskPoints });
  });
});
