import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GameState, Payslip } from '@cstar/game-core';
import { Hud } from '@/features/hud/Hud';
import { PayslipScreen } from '@/features/payslip/PayslipScreen';
import { WeekScreen } from '@/features/week/WeekScreen';
import { useGameStore } from './game-store';

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const week = (): GameState => {
  useGameStore.getState().newRun(1);
  const state = useGameStore.getState().state as GameState;
  return { ...state, phase: 'week', story: { ...state.story, sceneId: null, nodeId: null } };
};

const slip: Payslip = {
  month: 2,
  salaryDue: 15_000_000,
  salaryPaid: 0,
  bills: [{ label: 'Tiền nhà', amount: 4_500_000 }],
  arrears: 0,
  cash: 7_000_000,
  companyDebt: 15_000_000,
};

describe('Hud', () => {
  it('shows the time, the money and what the company owes (SCENARIO-029)', () => {
    const state = week();
    render(
      <Hud state={{ ...state, money: { cash: 7_400_000, arrears: 0, companyDebt: 15_000_000 } }} />,
    );
    expect(screen.getByText('Tháng 1 · Tuần 1')).toBeInTheDocument();
    expect(screen.getByText('7,4 tr')).toBeInTheDocument();
    expect(screen.getByText('15 tr')).toBeInTheDocument();
    expect(screen.getByRole('meter', { name: 'Sức' })).toHaveAttribute('aria-valuenow', '80');
  });
});

describe('WeekScreen', () => {
  beforeEach(() => {
    useGameStore.setState({ state: null, history: [] });
  });

  it('offers the week’s actions and sends the one picked (SCENARIO-024)', async () => {
    const state = week();
    useGameStore.setState({ state });
    render(<WeekScreen state={state} />);
    expect(screen.getByText('Tuần này còn 3 lượt')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Nghỉ ngơi/ }));
    expect(useGameStore.getState().state?.calendar.actionsLeft).toBe(2);
    expect(useGameStore.getState().state?.lastOutcome).toBeTruthy();
  });

  it('shows why an action is locked', () => {
    render(<WeekScreen state={week()} />);
    expect(screen.getByRole('button', { name: /Nhận việc ngoài/ })).toBeDisabled();
    expect(screen.getByText(/còn tin vào lương/)).toBeInTheDocument();
  });

  it('says what the last action did', () => {
    render(<WeekScreen state={{ ...week(), lastOutcome: 'Ngủ ngon.' }} />);
    expect(screen.getByRole('status')).toHaveTextContent('Ngủ ngon.');
  });
});

describe('PayslipScreen (SCENARIO-026)', () => {
  it('lays out what came in, what went out and what is owed', () => {
    render(<PayslipScreen payslip={slip} />);
    expect(screen.getByText('PHIẾU LƯƠNG THÁNG 2')).toBeInTheDocument();
    expect(screen.getByText('0 đ')).toBeInTheDocument();
    expect(screen.getByText('− 4.500.000 đ')).toBeInTheDocument();
    expect(screen.getByText('Công ty đang nợ bạn')).toBeInTheDocument();
  });

  it('asks for sympathy when nothing came', () => {
    render(<PayslipScreen payslip={slip} />);
    expect(screen.getByRole('button', { name: 'Cố gắng thông cảm' })).toBeInTheDocument();
  });

  it('just pays when it pays', () => {
    render(<PayslipScreen payslip={{ ...slip, salaryPaid: slip.salaryDue }} />);
    expect(screen.getByRole('button', { name: 'Nhận lương' })).toBeInTheDocument();
  });

  it('shows what is missing only when something is', () => {
    const { rerender } = render(<PayslipScreen payslip={slip} />);
    expect(screen.queryByText('Còn thiếu')).not.toBeInTheDocument();
    rerender(<PayslipScreen payslip={{ ...slip, arrears: 500_000 }} />);
    expect(screen.getByText('Còn thiếu')).toBeInTheDocument();
  });
});
