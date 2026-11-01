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
  loans: 0,
  companyDebt: 15_000_000,
  kpi: null,
};

describe('Hud', () => {
  it('shows the time, the money and what the company owes (SCENARIO-029)', () => {
    const state = week();
    render(
      <Hud
        kpiTarget={0}
        state={{
          ...state,
          money: { cash: 7_400_000, arrears: 0, loans: 0, companyDebt: 15_000_000 },
        }}
      />,
    );
    expect(screen.getByText('Tháng 1 · Tuần 1')).toBeInTheDocument();
    expect(screen.getByText('7,4 tr')).toBeInTheDocument();
    expect(screen.getByText('15 tr')).toBeInTheDocument();
    expect(screen.getByRole('meter', { name: 'Sức khỏe' })).toHaveAttribute('aria-valuenow', '80');
  });
});

describe('WeekScreen', () => {
  beforeEach(() => {
    useGameStore.setState({ state: null, history: [] });
  });

  it('offers the week’s actions and sends the one picked (SCENARIO-024)', async () => {
    const state = week();
    useGameStore.setState({ state });
    render(<WeekScreen state={state} onOpenDossier={vi.fn()} />);
    expect(screen.getByText('Tuần này còn 3 lượt')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Nghỉ ngơi/ }));
    expect(useGameStore.getState().state?.calendar.actionsLeft).toBe(2);
    expect(useGameStore.getState().state?.lastOutcome).toBeTruthy();
  });

  it('offers nothing that assumes the salary is late before it is (SCENARIO-086)', () => {
    render(<WeekScreen state={week()} onOpenDossier={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /Nhận việc ngoài/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Lưu giấy tờ/ })).not.toBeInTheDocument();
  });

  it('shows why an action is locked', () => {
    const owed = week();
    render(
      <WeekScreen
        state={{
          ...owed,
          money: { ...owed.money, companyDebt: 15_000_000 },
          mood: { ...owed.mood, energy: 5 },
        }}
        onOpenDossier={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: /Nhận việc ngoài/ })).toBeDisabled();
    expect(screen.getByText('Không còn sức để làm thêm')).toBeInTheDocument();
  });

  it('says what the last action did', () => {
    render(<WeekScreen state={{ ...week(), lastOutcome: 'Ngủ ngon.' }} onOpenDossier={vi.fn()} />);
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

  it('shows the KPI and the loans only when there are some', () => {
    const { rerender } = render(<PayslipScreen payslip={slip} />);
    expect(screen.queryByText('KPI tháng')).not.toBeInTheDocument();
    expect(screen.queryByText('Đang vay')).not.toBeInTheDocument();
    rerender(
      <PayslipScreen payslip={{ ...slip, loans: 5_000_000, kpi: { points: 6, target: 8 } }} />,
    );
    expect(screen.getByText('6 / 8')).toBeInTheDocument();
    expect(screen.getByText('5.000.000 đ')).toBeInTheDocument();
  });

  it('shows what is missing only when something is', () => {
    const { rerender } = render(<PayslipScreen payslip={slip} />);
    expect(screen.queryByText('Còn thiếu')).not.toBeInTheDocument();
    rerender(<PayslipScreen payslip={{ ...slip, arrears: 500_000 }} />);
    expect(screen.getByText('Còn thiếu')).toBeInTheDocument();
  });

  it('pays the KPI money in the first month, and only then (SCENARIO-089)', () => {
    render(<PayslipScreen payslip={{ ...slip, month: 1, salaryPaid: 15_000_000 }} />);
    expect(screen.getByText('4.500.000 đ')).toBeInTheDocument();
    expect(screen.queryByText('Đang giữ')).not.toBeInTheDocument();
  });

  it('holds the KPI money back, whatever the points say (SCENARIO-082)', () => {
    render(<PayslipScreen payslip={{ ...slip, kpi: { points: 8, target: 8 } }} />);
    expect(screen.getByText('Đang giữ')).toBeInTheDocument();
  });

  it("comes with this month's promise when it is not paid (SCENARIO-077)", () => {
    render(<PayslipScreen payslip={{ ...slip, month: 2, salaryPaid: 0 }} />);
    expect(screen.getByText(/this week nhé em/i)).toBeInTheDocument();
  });

  it("some months there is no slip, and the figures are the player's own (SCENARIO-083)", () => {
    render(<PayslipScreen payslip={{ ...slip, month: 5, salaryPaid: 0 }} playerName="Hoa" />);
    expect(screen.getByRole('heading')).toHaveTextContent('KHÔNG CÓ PHIẾU LƯƠNG THÁNG 5');
    expect(screen.queryByText(/Người nhận/)).not.toBeInTheDocument();
    expect(screen.getByText('Công ty đang nợ bạn')).toBeInTheDocument();
  });
});
