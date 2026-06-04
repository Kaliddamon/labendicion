import React, { InputHTMLAttributes } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AccessibleInputProps extends InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> {
  label: string;
  helperText?: string;
  error?: string;
  isSelect?: boolean;
  options?: { value: string; label: string }[];
}

export const AccessibleInput: React.FC<AccessibleInputProps> = ({
  label,
  helperText,
  error,
  isSelect,
  options,
  className,
  id,
  ...props
}) => {
  const inputId = id || `input-${label.replace(/\s+/g, '-').toLowerCase()}`;

  const baseInputStyles = cn(
    "w-full min-h-[48px] px-4 py-3 text-base rounded-xl",
    "bg-[var(--surface-linen)] border border-[var(--border-fiber)]",
    "transition-all duration-200",
    "placeholder:text-slate-400",
    "focus:outline-none focus:bg-white focus:border-[var(--accent-copper)] focus:ring-2 focus:ring-[var(--accent-copper-glow)]",
    error
      ? "border-rose-400 focus:border-rose-500 text-rose-900 bg-rose-50/50"
      : "text-[var(--carbon)]",
    className
  );

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label
        htmlFor={inputId}
        className="font-medium text-sm text-[var(--indigo-deep)]"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {label}
      </label>

      {isSelect ? (
        <select id={inputId} className={baseInputStyles} {...(props as any)}>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <input id={inputId} className={baseInputStyles} {...(props as any)} />
      )}

      {(helperText || error) && (
        <p className={cn(
          "text-xs mt-0.5",
          error ? "text-rose-600 font-medium" : "text-slate-500"
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};
