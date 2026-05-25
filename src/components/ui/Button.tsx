"use client";

import React from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "dark" | "outline";
type Size = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  as?: "button" | "a";
  href?: string;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-amber text-cream hover:bg-amber/90 active:bg-amber/80 focus-visible:ring-amber/40",
  secondary:
    "bg-terra text-cream hover:bg-terra/90 active:bg-terra/80 focus-visible:ring-terra/40",
  dark:
    "bg-forest text-cream hover:bg-deep active:bg-deep/90 focus-visible:ring-forest/40",
  ghost:
    "bg-transparent text-char hover:bg-mist active:bg-mist/70 focus-visible:ring-char/20",
  outline:
    "bg-transparent border border-char/20 text-char hover:bg-mist active:bg-mist/70 focus-visible:ring-char/20",
};

const sizeStyles: Record<Size, string> = {
  sm:  "h-8  px-3  text-sm  gap-1.5 rounded-md",
  md:  "h-10 px-4  text-sm  gap-2   rounded-lg",
  lg:  "h-12 px-6  text-base gap-2   rounded-xl",
  xl:  "h-14 px-8  text-lg  gap-3   rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-semibold",
        "transition-all duration-150 ease-in-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "select-none cursor-pointer",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-0.5 w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
