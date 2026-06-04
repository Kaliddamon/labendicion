import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Option {
  value: string;
  label: string;
  colorHint?: 'emerald' | 'amber' | 'slate' | 'blue';
}

interface AccessibleCardSelectorProps {
  label?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  columns?: 2 | 3;
}

export const AccessibleCardSelector: React.FC<AccessibleCardSelectorProps> = ({
  label,
  options,
  value,
  onChange,
  columns = 3,
}) => {
  const getSelectedColors = (hint?: string) => {
    switch (hint) {
      case 'emerald': return 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-[0_0_0_1px_rgba(22,163,74,0.3),0_2px_8px_rgba(22,163,74,0.12)]';
      case 'amber': return 'bg-amber-50 border-amber-500 text-amber-800 shadow-[0_0_0_1px_rgba(217,119,6,0.3),0_2px_8px_rgba(217,119,6,0.12)]';
      case 'blue': return 'bg-blue-50 border-blue-500 text-blue-800 shadow-[0_0_0_1px_rgba(37,99,235,0.3),0_2px_8px_rgba(37,99,235,0.12)]';
      default: return 'bg-[var(--accent-copper-glow)] border-[var(--accent-copper)] text-[var(--carbon)] shadow-[0_0_0_1px_rgba(196,139,63,0.3),0_2px_8px_rgba(196,139,63,0.12)]';
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <span
          className="font-medium text-sm text-[var(--indigo-deep)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {label}
        </span>
      )}

      <div className={cn(
        "grid gap-2.5",
        columns === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3"
      )}>
        {options.map((opt) => {
          const isSelected = value === opt.value;

          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                "min-h-[56px] px-4 py-3 rounded-xl border-2 font-semibold text-sm",
                "transition-all duration-200 active:scale-[0.97]",
                "flex items-center justify-center text-center leading-tight",
                isSelected
                  ? getSelectedColors(opt.colorHint)
                  : "bg-white border-[var(--border-fiber)] text-slate-500 hover:border-slate-300 hover:bg-[var(--surface-linen)] hover:text-[var(--carbon)]"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
