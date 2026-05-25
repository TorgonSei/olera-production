import React from "react";
import { cn } from "@/lib/cn";

type BadgeVariant = "sage" | "amber" | "terra" | "moss" | "sand" | "dark";

const variants: Record<BadgeVariant, string> = {
  sage:  "bg-sage/10  text-sage  border-sage/20",
  amber: "bg-amber/10 text-amber border-amber/20",
  terra: "bg-terra/10 text-terra border-terra/20",
  moss:  "bg-moss/10  text-moss  border-moss/20",
  sand:  "bg-sand/20  text-char  border-sand/40",
  dark:  "bg-forest   text-cream border-transparent",
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

export function Badge({ variant = "sand", dot = false, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5",
        "text-xs font-medium font-mono rounded-full border",
        "whitespace-nowrap",
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0"
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
