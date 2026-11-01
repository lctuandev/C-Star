import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'quiet';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-fluorescent text-surface-950 disabled:opacity-60',
  quiet: 'bg-surface-700 text-ink-primary disabled:opacity-60',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

/** At least 44 px high: thumbs first (ux-direction §1). No shadow, by the owner's rule. */
export const Button = ({ variant = 'primary', className = '', ...props }: ButtonProps) => (
  <button
    type="button"
    className={`min-h-11 rounded-xl px-4 font-bold transition active:scale-95 ${VARIANTS[variant]} ${className}`}
    {...props}
  />
);
