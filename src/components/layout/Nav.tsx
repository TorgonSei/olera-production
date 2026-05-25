import React from "react";
import Link from "next/link";
import { OleraLockupH } from "@/components/brand/Mark";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

interface NavProps {
  variant?: "light" | "dark" | "transparent";
  className?: string;
}

export function Nav({ variant = "light", className }: NavProps) {
  const isDark = variant === "dark";

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8",
        "h-16 flex items-center justify-between",
        "border-b",
        isDark
          ? "bg-forest border-white/10 text-cream"
          : "bg-cream/95 border-mist backdrop-blur-sm text-char",
        className
      )}
      aria-label="Main navigation"
    >
      <Link href="/" aria-label="Olera home">
        <OleraLockupH size={28} reversed={isDark} />
      </Link>

      <div className="flex items-center gap-4">
        <Link
          href="/employer"
          className={cn(
            "text-sm font-medium hidden sm:block transition-colors",
            isDark
              ? "text-cream/70 hover:text-cream"
              : "text-moss hover:text-char"
          )}
        >
          Hire talent
        </Link>
        <Button variant={isDark ? "primary" : "dark"} size="sm" as="a" href="/join">
          Get started
        </Button>
      </div>
    </nav>
  );
}

export function EmployerNav({ className }: { className?: string }) {
  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8",
        "h-16 flex items-center justify-between",
        "bg-forest border-b border-white/10",
        className
      )}
      aria-label="Employer navigation"
    >
      <Link href="/employer" aria-label="Olera home">
        <OleraLockupH size={28} reversed />
      </Link>

      <div className="flex items-center gap-6">
        <Link href="/employer/roles" className="text-sm text-cream/70 hover:text-cream transition-colors">
          Roles
        </Link>
        <Link href="/employer/shortlist" className="text-sm text-cream/70 hover:text-cream transition-colors">
          Shortlists
        </Link>
        <Button variant="primary" size="sm">
          Post a role
        </Button>
      </div>
    </nav>
  );
}
