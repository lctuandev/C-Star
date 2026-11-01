import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'quiet';

const BASE =
  'flex min-h-11 items-center justify-center rounded-xl border-b-[3px] px-4 py-2 font-bold transition-[transform,border-width] active:translate-y-px active:border-b disabled:opacity-60';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-paycheck border-paycheck-deep text-surface-950',
  quiet: 'bg-surface-700 border-surface-950/60 text-ink-primary',
};

/** For links that look like buttons. */
export const buttonClass = (variant: ButtonVariant) => `${BASE} ${VARIANTS[variant]}`;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

/**
 * At least 44 px high: thumbs first. The thick lower edge makes it a key to press, and it is a
 * border, not a shadow (ux-direction §1).
 */
export const Button = ({ variant = 'primary', className = '', ...props }: ButtonProps) => (
  <button type="button" className={`${buttonClass(variant)} ${className}`} {...props} />
);
