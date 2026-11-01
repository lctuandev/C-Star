'use client';

import type { Payslip } from '@cstar/game-core';
import { Button } from '@/components/ui/Button';
import { useGameStore } from '@/features/play/game-store';
import { formatMoney } from '@/lib/format-money';

const Row = ({ label, amount, strong }: { label: string; amount: string; strong?: boolean }) => (
  <div className={`flex justify-between gap-4 ${strong ? 'font-extrabold' : ''}`}>
    <dt>{label}</dt>
    <dd className="whitespace-nowrap tabular-nums">{amount}</dd>
  </div>
);

/** Paper in a cold office: the one thing here that looks official, and it says zero. */
export const PayslipScreen = ({ payslip }: { payslip: Payslip }) => {
  const dispatch = useGameStore((store) => store.dispatch);
  const paidInFull = payslip.salaryPaid >= payslip.salaryDue;

  return (
    <section className="flex flex-1 flex-col justify-center gap-4 p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
      <div className="bg-paper text-ink-paper flex flex-col gap-3 rounded-xl p-5">
        <h2 className="text-center text-lg font-extrabold tracking-wide">
          PHIẾU LƯƠNG THÁNG {payslip.month}
        </h2>
        <dl className="flex flex-col gap-1">
          <Row label="Lương theo hợp đồng" amount={formatMoney(payslip.salaryDue)} />
          <Row label="Thực nhận" amount={formatMoney(payslip.salaryPaid)} strong />
        </dl>
        <hr className="border-dashed border-current opacity-40" />
        <dl className="flex flex-col gap-1">
          {payslip.bills.map((bill) => (
            <Row key={bill.label} label={bill.label} amount={`− ${formatMoney(bill.amount)}`} />
          ))}
        </dl>
        <hr className="border-dashed border-current opacity-40" />
        <dl className="flex flex-col gap-1">
          <Row label="Còn lại trong ví" amount={formatMoney(payslip.cash)} strong />
          {payslip.arrears > 0 && (
            <Row label="Còn thiếu" amount={formatMoney(payslip.arrears)} strong />
          )}
          <Row label="Công ty đang nợ bạn" amount={formatMoney(payslip.companyDebt)} strong />
        </dl>
      </div>
      <Button onClick={() => dispatch({ type: 'closePayslip' })}>
        {paidInFull ? 'Nhận lương' : 'Cố gắng thông cảm'}
      </Button>
    </section>
  );
};
