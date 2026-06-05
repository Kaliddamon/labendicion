import React, { ButtonHTMLAttributes } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AccessibleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className,
  ...props
}) => {
  const baseStyles = [
    "min-h-[52px] px-6 py-3 rounded-xl font-semibold text-sm",
    "transition-all duration-200 ease-out",
    "active:scale-[0.97] flex items-center justify-center gap-2",
    "disabled:opacity-50 disabled:pointer-events-none",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  ].join(' ');

  const variants = {
    primary: [
      "bg-[var(--accent-copper)] hover:bg-[var(--accent-copper-bright)] text-[#1a1a2e]",
      "shadow-[0_2px_8px_rgba(212,160,18,0.3)]",
      "hover:shadow-[0_4px_16px_rgba(212,160,18,0.35)]",
      "focus-visible:ring-[var(--accent-copper)]",
    ].join(' '),
    secondary: [
      "bg-white hover:bg-[var(--surface-linen)] text-[var(--carbon)]",
      "border border-[var(--border-fiber)] hover:border-[var(--accent-copper)]/30",
      "shadow-[var(--shadow-sm)]",
      "focus-visible:ring-[var(--accent-copper)]",
    ].join(' '),
    danger: [
      "bg-rose-50 hover:bg-rose-100 text-rose-700",
      "border border-rose-200 hover:border-rose-300",
      "focus-visible:ring-rose-400",
    ].join(' '),
    ghost: [
      "bg-transparent hover:bg-[var(--surface-linen)] text-[var(--indigo-deep)]",
      "shadow-none",
      "focus-visible:ring-[var(--accent-copper)]",
    ].join(' '),
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        fullWidth ? "w-full" : "",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
