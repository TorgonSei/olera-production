import React from "react";
import type { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Olera. For employers, candidates, partnerships, and general questions.",
};

export default function ContactPage() {
  return (
    <>
      <Nav />

      <main>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="bg-cream py-20 sm:py-28 border-b border-mist">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-display font-bold text-5xl sm:text-6xl leading-[1.05] tracking-tight text-char mb-6">
              Get in touch.
            </h1>
            <p className="text-xl text-moss leading-relaxed max-w-xl">
              We are based in Nairobi and respond within one business day. Use
              the right address for the right reason — we read everything.
            </p>
          </div>
        </section>

        {/* ── Contact cards ─────────────────────────────────────────────── */}
        <section className="py-20 bg-cream">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* Employers */}
              <div className="bg-forest text-cream rounded-2xl p-8">
                <p className="text-xs font-semibold text-cream/50 mb-3">
                  Employers
                </p>
                <h2 className="font-display font-semibold text-2xl mb-3 leading-snug">
                  Hiring Kenyan talent
                </h2>
                <p className="text-cream/60 text-sm leading-relaxed mb-6">
                  To hire, send us a role brief directly on the employer page.
                  For general questions about how Olera works, email us.
                </p>
                <div className="space-y-2 mb-6">
                  <a
                    href="mailto:hello@olera.co"
                    className="block font-mono text-amber text-sm hover:text-amber/80 transition-colors"
                  >
                    hello@olera.co
                  </a>
                </div>
                <a href="/employer">
                  <Button variant="primary" size="sm">
                    Employer overview
                    <ArrowRight size={15} />
                  </Button>
                </a>
              </div>

              {/* Candidates */}
              <div className="bg-white border border-mist rounded-2xl p-8">
                <p className="text-xs font-semibold text-moss/50 mb-3">
                  Candidates
                </p>
                <h2 className="font-display font-semibold text-2xl text-char mb-3 leading-snug">
                  Applying to Olera
                </h2>
                <p className="text-moss text-sm leading-relaxed mb-6">
                  The best way to apply is through the candidate portal — upload
                  your CV, complete your profile, and we will match you to
                  relevant roles. For questions, email us.
                </p>
                <div className="space-y-2 mb-6">
                  <a
                    href="mailto:hello@olera.co"
                    className="block font-mono text-amber text-sm hover:text-amber/80 transition-colors"
                  >
                    hello@olera.co
                  </a>
                </div>
                <a href="/join">
                  <Button variant="dark" size="sm">
                    Apply now
                    <ArrowRight size={15} />
                  </Button>
                </a>
              </div>

              {/* Press / partnerships */}
              <div className="bg-white border border-mist rounded-2xl p-8">
                <p className="text-xs font-semibold text-moss/50 mb-3">
                  Press &amp; partnerships
                </p>
                <h2 className="font-display font-semibold text-2xl text-char mb-3 leading-snug">
                  Media and collaboration
                </h2>
                <p className="text-moss text-sm leading-relaxed mb-6">
                  For press inquiries, partnership proposals, or media requests,
                  reach us at the address below. We will respond within two
                  business days.
                </p>
                <a
                  href="mailto:hello@olera.co"
                  className="font-mono text-amber text-sm hover:text-amber/80 transition-colors"
                >
                  hello@olera.co
                </a>
              </div>

              {/* General */}
              <div className="bg-mist/40 border border-mist rounded-2xl p-8">
                <p className="text-xs font-semibold text-moss/50 mb-3">
                  General
                </p>
                <h2 className="font-display font-semibold text-2xl text-char mb-3 leading-snug">
                  Everything else
                </h2>
                <p className="text-moss text-sm leading-relaxed mb-6">
                  One inbox for everything. If you are not sure which category
                  you fall into, just send us a message and we will route it.
                </p>
                <div className="space-y-1">
                  <a
                    href="mailto:hello@olera.co"
                    className="block font-mono text-amber text-sm hover:text-amber/80 transition-colors"
                  >
                    hello@olera.co
                  </a>
                  <p className="font-mono text-xs text-moss/50">
                    Nairobi, Kenya
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
