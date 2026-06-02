import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Option {
  value: string;
  label: string;
  colorHint?: 'emerald' | 'amber' | 'slate' | 'blue'; // optional color theming
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
      case 'emerald': return 'bg-emerald-100 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500 ring-offset-1';
      case 'amber': return 'bg-amber-100 border-amber-500 text-amber-800 ring-2 ring-amber-500 ring-offset-1';
      case 'blue': return 'bg-blue-100 border-blue-500 text-blue-800 ring-2 ring-blue-500 ring-offset-1';
      default: return 'bg-teal-100 border-teal-500 text-teal-800 ring-2 ring-teal-500 ring-offset-1';
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <span className="font-semibold text-slate-700 text-base">{label}</span>}
      
      <div className={cn(
        "grid gap-3",
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
                "min-h-[64px] px-4 py-3 rounded-xl border-2 font-bold text-base transition-all active:scale-95 flex items-center justify-center text-center leading-tight",
                isSelected 
                  ? getSelectedColors(opt.colorHint)
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
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
