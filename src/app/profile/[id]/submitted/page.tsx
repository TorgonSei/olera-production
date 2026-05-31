import React from "react";
import Link from "next/link";
import { OleraLockupH } from "@/components/brand/Mark";
import { CheckCircle } from "lucide-react";

export default function SubmittedPage() {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="px-6 py-5 border-b border-mist">
        <OleraLockupH size={26} />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
        <div className="w-full max-w-md">
          <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-sage" />
          </div>

          <h1 className="font-display font-bold text-3xl text-char mb-4">
            Profile received
          </h1>

          <p className="text-moss leading-relaxed mb-3">
            Our team will review your CV and contact you if your profile fits current or upcoming customer operations roles.
          </p>
          <p className="text-moss leading-relaxed mb-8">
            If we need more information, we may reach out by email, phone, or WhatsApp.
          </p>

          <div className="bg-white border border-mist rounded-2xl p-5 text-left space-y-3 mb-8">
            <p className="text-xs font-mono text-moss/60 uppercase tracking-widest">What happens next</p>
            {[
              "Our team reviews your CV — usually within a few days.",
              "If there is a fit, we may contact you for a short screening call.",
              "If we have a role match, we prepare an introduction to the employer.",
              "You only hear from us when there is something relevant.",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-moss">
                <span className="font-mono text-amber text-xs mt-0.5 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>

          <Link
            href="/dashboard"
            className="text-sm text-amber hover:text-terra transition-colors font-medium"
          >
            View your profile status →
          </Link>
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-forest via-amber to-terra" aria-hidden="true" />
    </div>
  );
}
