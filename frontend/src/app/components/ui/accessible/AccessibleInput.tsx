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
    "w-full min-h-[56px] px-4 py-3 text-lg rounded-xl border-2 bg-slate-50 transition-colors focus:outline-none focus:bg-white focus:ring-0",
    error 
      ? "border-red-400 focus:border-red-500 text-red-900" 
      : "border-slate-200 focus:border-teal-500 text-slate-800",
    className
  );

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={inputId} className="font-semibold text-slate-700 text-base">
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
        <p className={cn("text-sm mt-0.5", error ? "text-red-600 font-medium" : "text-slate-500")}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};
