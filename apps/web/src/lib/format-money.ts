const fullNumber = new Intl.NumberFormat('vi-VN');
const shortNumber = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 });

/** 15.000.000 đ, for the payslip. */
export const formatMoney = (amount: number): string => `${fullNumber.format(amount)} đ`;

/** 15 tr, for the HUD: it has to fit a 360 px phone. */
export const formatMoneyShort = (amount: number): string =>
  amount >= 1_000_000
    ? `${shortNumber.format(amount / 1_000_000)} tr`
    : amount >= 1_000
      ? `${shortNumber.format(amount / 1_000)} k`
      : `${amount} đ`;
