import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "One flat placement fee per hire. No retainers, no percentage of salary. Review and interview candidates free. Pay only when you hire.",
};

/* ─── Pricing tiers ─────────────────────────────────────────────────────── */
const TIERS = [
  {
    tier: "Junior Support",
    fee: "$560",
    feeNote: "one-time placement fee",
    highlight: false,
    description:
      "For teams hiring their first remote support person or adding capacity to an existing queue.",
    roles: [
      "Customer support representative",
      "Chat and email support agent",
      "Help desk associate",
      "Support team member",
    ],
  },
  {
    tier: "Experienced Associate",
    fee: "$1,050",
    feeNote: "one-time placement fee",
    highlight: true,
    description:
      "The most common hire. Candidates have a track record in customer-facing work and can operate independently.",
    roles: [
      "Customer support specialist",
      "Customer success associate",
      "Virtual assistant",
      "Account support specialist",
    ],
  },
  {
    tier: "Team Lead",
    fee: "$1,900",
    feeNote: "one-time placement fee",
    highlight: false,
    description:
      "Supervisors, senior associates, and team leads who own a queue, manage junior reps, or handle escalations.",
    roles: [
      "Customer support team lead",
      "Senior customer success manager",
      "Operations supervisor",
      "Executive assistant",
    ],
  },
  {
    tier: "Manager",
    fee: "$3,200",
    feeNote: "one-time placement fee",
    highlight: false,
    description:
      "Senior hires managing a function, building a team, or owning a customer operations strategy.",
    roles: [
      "Customer operations manager",
      "Head of customer support",
      "Customer success manager",
      "Senior operations lead",
    ],
  },
] as const;

/* ─── What's always included ────────────────────────────────────────────── */
const ALWAYS_INCLUDED = [
  "Shortlist of 3–5 assessed candidates",
  "Profile with written communication sample",
  "Customer judgment assessment result",
  "Tools and platform familiarity check",
  "Role fit summary and gap notes",
  "Review candidates before paying",
  "Interview candidates before paying",
  "60-day replacement guarantee",
  "No retainer. No percentage of salary.",
];

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default function PricingPage() {
  return (
    <>
      <Nav />

      <main>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="bg-forest text-cream">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-28 sm:pb-20">
            <div className="max-w-3xl">
              <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-6">
                One flat fee.{" "}
                <span className="text-amber">Paid once, on hire.</span>
              </h1>
              <p className="text-xl text-cream/70 leading-relaxed mb-6 max-w-2xl">
                Review the shortlist free. Interview candidates free. Pay only
                when you decide to hire. The fee is based on the role level —
                no retainers, no percentage of salary.
              </p>
              <div className="flex flex-wrap gap-6 text-sm font-mono text-cream/40">
                <span>Review free</span>
                <span className="text-cream/20">·</span>
                <span>Interview free</span>
                <span className="text-cream/20">·</span>
                <span>60-day replacement guarantee</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Pricing cards ─────────────────────────────────────────────── */}
        <section className="bg-forest text-cream pb-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {TIERS.map((plan) => (
                <div
                  key={plan.tier}
                  className={`rounded-2xl p-7 flex flex-col gap-5 ${
                    plan.highlight
                      ? "bg-amber text-forest"
                      : "bg-white/5 border border-white/10"
                  }`}
                >
                  {/* Tier name */}
                  <p
                    className={`text-xs font-medium ${
                      plan.highlight ? "text-forest/60" : "text-cream/50"
                    }`}
                  >
                    {plan.tier}
                  </p>

                  {/* Price */}
                  <div>
                    <p
                      className={`font-display font-bold text-5xl tracking-tight leading-none mb-1 ${
                        plan.highlight ? "text-forest" : "text-cream"
                      }`}
                    >
                      {plan.fee}
                    </p>
                    <p
                      className={`text-xs ${
                        plan.highlight ? "text-forest/40" : "text-cream/30"
                      }`}
                    >
                      {plan.feeNote}
                    </p>
                  </div>

                  {/* Description */}
                  <p
                    className={`text-sm leading-relaxed ${
                      plan.highlight ? "text-forest/70" : "text-cream/50"
                    }`}
                  >
                    {plan.description}
                  </p>

                  {/* Role examples */}
                  <div className="border-t pt-4 mt-auto flex flex-col gap-2"
                    style={{ borderColor: plan.highlight ? "rgba(26,38,32,0.12)" : "rgba(255,255,255,0.07)" }}
                  >
                    <p
                      className={`text-xs font-medium mb-1 ${
                        plan.highlight ? "text-forest/40" : "text-cream/30"
                      }`}
                    >
                      Example roles
                    </p>
                    {plan.roles.map((role) => (
                      <p
                        key={role}
                        className={`text-xs leading-snug ${
                          plan.highlight ? "text-forest/60" : "text-cream/40"
                        }`}
                      >
                        {role}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Always included ───────────────────────────────────────────── */}
        <section className="py-20 bg-cream">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-display font-bold text-4xl sm:text-5xl text-char leading-tight mb-5">
                  The same process, regardless of level.
                </h2>
                <p className="text-moss text-lg leading-relaxed mb-6">
                  The fee scales with role complexity. The quality of the
                  shortlist, the assessment rigor, and the guarantee do not.
                </p>
                <Link href="/employer#brief">
                  <Button variant="dark" size="lg">
                    Tell us the role
                    <ArrowRight size={18} />
                  </Button>
                </Link>
              </div>

              <div className="bg-white border border-mist rounded-2xl p-7">
                <p className="text-sm font-medium text-moss/60 mb-5">Included with every hire</p>
                <div className="space-y-3">
                  {ALWAYS_INCLUDED.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <Check size={15} className="text-amber mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-char leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Candidate pay context ─────────────────────────────────────── */}
        <section className="py-16 bg-mist/30 border-y border-mist">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div>
                <p className="text-xs font-medium text-moss/60 mb-2">
                  Placement fee
                </p>
                <p className="font-display font-bold text-3xl text-char mb-1">
                  $560–$3,200
                </p>
                <p className="text-sm text-moss leading-relaxed">
                  One-time. Based on role level. Paid once on hire, never again.
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-moss/60 mb-2">
                  Typical candidate pay
                </p>
                <p className="font-display font-bold text-3xl text-char mb-1">
                  $12k–$30k
                </p>
                <p className="text-sm text-moss leading-relaxed">
                  Annual salary range for remote customer operations roles from Kenya.
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-moss/60 mb-2">
                  Replacement window
                </p>
                <p className="font-display font-bold text-3xl text-char mb-1">
                  60 days
                </p>
                <p className="text-sm text-moss leading-relaxed">
                  If the hire leaves for performance-related reasons, Olera runs one replacement search free.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <section className="py-20 bg-cream">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-char mb-4 leading-tight">
              Ready to see who we have?
            </h2>
            <p className="text-moss text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              Send us the role. We review it and respond within 24 hours. If we
              have the right candidates, we build the shortlist and walk you through
              who fits and what to check.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/employer#brief">
                <Button variant="primary" size="lg">
                  Tell us the role
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/employer">
                <Button variant="outline" size="lg">
                  Back to employer overview
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
