/** What an unpaid payslip comes with instead of money. They repeat, as they do in real life. */
export const promises: readonly string[] = [
  'This week nhé em.',
  'Next week chắc chắn.',
  'Anh hứa, this week.',
  'Next week. Lần này khác thật.',
  'Ráng ở lại, sau IPO có cổ phiếu nội bộ.',
  'Đầu next week, muộn nhất cuối this week.',
  'This week hoặc next week, tùy next week.',
];

/** The first unpaid month is month 2. */
export const promiseFor = (month: number): string =>
  promises[Math.max(0, month - 2) % promises.length] as string;

/** Friday's weekly sync with the head of department: from the month after `ch3-weekly-sync`. */
export const syncLines: readonly string[] = [
  'Next week, hopefully.',
  'Hopefully next week nhé em.',
  'Anh nghe nói next week.',
  'Next week. Mình phải có niềm tin.',
  'Hopefully. Tuần sau sync tiếp.',
];

const FIRST_SYNC_MONTH = 4;

export const syncLineFor = (month: number, week: number): string | null =>
  month < FIRST_SYNC_MONTH
    ? null
    : (syncLines[((month - FIRST_SYNC_MONTH) * 4 + week - 1) % syncLines.length] as string);

export const KPI_SHARE = 0.3;

/** Paid once, in the first month: what the contract promised, and never seen again. */
export const kpiWasPaid = (month: number): boolean => month === 1;

/** Some months no payslip comes at all, and the player keeps their own figures. */
const MONTHS_WITHOUT_A_SLIP: readonly number[] = [5, 7];

export const slipIsMissing = (month: number): boolean => MONTHS_WITHOUT_A_SLIP.includes(month);
