'use client';

import { promiseFor, slipIsMissing } from '@cstar/content';
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

interface PayslipScreenProps {
  payslip: Payslip;
  playerName?: string;
}

/** Paper in a cold office: the one thing here that looks official, and it says zero. */
export const PayslipScreen = ({ payslip, playerName = '' }: PayslipScreenProps) => {
  const dispatch = useGameStore((store) => store.dispatch);
  const paidInFull = payslip.salaryPaid >= payslip.salaryDue;
  const missing = slipIsMissing(payslip.month);

  return (
    <section className="bg-surface-950/80 animate-fade absolute inset-0 z-20 flex flex-col items-center gap-4 overflow-y-auto p-4 pt-[calc(env(safe-area-inset-top)+1rem)] pb-[calc(env(safe-area-inset-bottom)+1rem)]">
      <div className="bg-paper text-ink-paper receipt-edge animate-rise relative mt-auto flex w-full max-w-md shrink-0 flex-col gap-3 rounded-t-xl p-6 pb-9">
        {!paidInFull && !missing && (
          <span
            aria-hidden
            className="border-alarm text-alarm absolute top-[5.1rem] left-[38%] -rotate-6 rounded-lg border-[3px] px-2 text-base font-extrabold tracking-wide opacity-85"
          >
            TẠM HOÃN
          </span>
        )}
        <h2 className="text-center text-lg font-extrabold tracking-wide">
          {missing ? 'KHÔNG CÓ PHIẾU' : 'PHIẾU'} LƯƠNG THÁNG {payslip.month}
        </h2>
        {missing && (
          <p className="text-center text-sm">
            Kế toán: đang chuẩn hóa. Các con số dưới đây là bạn tự ghi lại.
          </p>
        )}
        {playerName && !missing && <p className="text-center text-sm">Người nhận: {playerName}</p>}
        <dl className="flex flex-col gap-1">
          <Row label="Lương theo hợp đồng" amount={formatMoney(payslip.salaryDue)} />
          <Row label="Thực nhận" amount={formatMoney(payslip.salaryPaid)} strong />
          {payslip.kpi && (
            <Row label="KPI tháng" amount={`${payslip.kpi.points} / ${payslip.kpi.target}`} />
          )}
          {payslip.kpi && <Row label="Tiền KPI theo hợp đồng" amount="Đang giữ" />}
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
          {payslip.loans > 0 && <Row label="Đang vay" amount={formatMoney(payslip.loans)} />}
          {payslip.companyDebt > 0 && (
            <Row label="Công ty đang nợ bạn" amount={formatMoney(payslip.companyDebt)} strong />
          )}
        </dl>
      </div>
      {!paidInFull && (
        <p className="bg-paycheck text-surface-950 w-full max-w-md shrink-0 -rotate-1 rounded-sm px-4 py-2 font-bold">
          Ghi chú của Phó giám đốc: {promiseFor(payslip.month)}
        </p>
      )}
      <Button
        className="mb-auto w-full max-w-md shrink-0"
        onClick={() => dispatch({ type: 'closePayslip' })}
      >
        {paidInFull ? 'Nhận lương' : 'Cố gắng thông cảm'}
      </Button>
    </section>
  );
};
