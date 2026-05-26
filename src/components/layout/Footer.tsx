import React from "react";
import Link from "next/link";
import { OleraLockupH } from "@/components/brand/Mark";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-forest text-cream mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <OleraLockupH size={28} reversed className="mb-4" />
            <p className="text-sm text-cream/60 leading-relaxed max-w-xs">
              Customer operations talent — screened, assessed, and ready to perform from day one.
            </p>
          </div>

          {/* Candidates */}
          <div>
            <h4 className="text-xs font-mono font-medium text-cream/40 uppercase tracking-widest mb-3">
              Candidates
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Get started", href: "/join" },
                { label: "How it works", href: "/#how-it-works" },
                { label: "My profile", href: "/dashboard" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-cream/60 hover:text-cream transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h4 className="text-xs font-mono font-medium text-cream/40 uppercase tracking-widest mb-3">
              Employers
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Hire talent", href: "/employer" },
                { label: "Pricing", href: "/employer/pricing" },
                { label: "Post a role", href: "/employer#brief" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-cream/60 hover:text-cream transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-mono font-medium text-cream/40 uppercase tracking-widest mb-3">
              Company
            </h4>
            <ul className="space-y-2">
              {[
                { label: "About", href: "/about" },
                { label: "Privacy", href: "/privacy" },
                { label: "Terms", href: "/terms" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-cream/60 hover:text-cream transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-xs text-cream/40 font-mono">
            © {year} Olera. All rights reserved.
          </p>
          <p className="text-xs text-cream/30 font-mono">
            Nairobi, Kenya · Built for the world
          </p>
        </div>
      </div>
    </footer>
  );
}
