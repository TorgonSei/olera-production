"use client";

import React from "react";
import { cn } from "@/lib/cn";

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> & {
  label?: string;
  hint?: string;
  error?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  fullWidth?: boolean;
};

export function Input({
  label,
  hint,
  error,
  prefix,
  suffix,
  fullWidth = true,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-char"
        >
          {label}
          {props.required && <span className="ml-1 text-terra" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {prefix && (
          <div className="absolute left-3 flex items-center pointer-events-none text-moss">
            {prefix}
          </div>
        )}

        <input
          id={inputId}
          className={cn(
            "flex h-11 w-full rounded-xl border border-mist bg-white px-4 py-2.5",
            "text-sm text-char placeholder:text-moss/60",
            "transition-colors duration-150",
            "focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-mist",
            error && "border-terra focus:border-terra focus:ring-terra/20",
            prefix && "pl-10",
            suffix && "pr-10",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />

        {suffix && (
          <div className="absolute right-3 flex items-center pointer-events-none text-moss">
            {suffix}
          </div>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="text-xs text-terra flex items-center gap-1" role="alert">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
            <path d="M6 4v2.5M6 8h.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          {error}
        </p>
      )}

      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-xs text-moss">
          {hint}
        </p>
      )}
    </div>
  );
}
