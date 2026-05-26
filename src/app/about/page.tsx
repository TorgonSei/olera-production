import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Olera is a Nairobi-based talent platform connecting assessed Kenyan customer operations professionals with global teams.",
};

export default function AboutPage() {
  return (
    <>
      <Nav />

      <main>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="bg-cream py-20 sm:py-28 border-b border-mist">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-xs font-mono text-moss/60 uppercase tracking-widest mb-6">
                About
              </p>
              <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-char mb-8">
                Built in Nairobi. Built for the world.
              </h1>
              <p className="text-xl text-moss leading-relaxed mb-6 max-w-2xl">
                Olera is a talent platform focused entirely on customer
                operations roles. We work with professionals in Kenya who have
                the skills, the work ethic, and the communication to support
                global customers well — and we connect them with companies who
                need exactly that.
              </p>
              <p className="text-lg text-moss leading-relaxed max-w-2xl">
                The platform is built on one conviction: Kenya already has a
                generation of people doing customer operations work for
                international organisations — informally, freelance, through
                BPOs, or directly. Olera makes that visible, adds a layer of
                assessment, and brings it to global employers who want to hire
                directly.
              </p>
            </div>
          </div>
        </section>

        {/* ── What we do ────────────────────────────────────────────────── */}
        <section className="py-20 bg-cream">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-char mb-5 leading-tight">
                  What we do
                </h2>
                <div className="space-y-4 text-moss leading-relaxed">
                  <p>
                    Olera is a placement platform. Candidates complete a profile
                    and a short assessment before we introduce them to employers.
                    Employers send us a role brief and receive a shortlist of 3–5
                    assessed candidates within 48 hours.
                  </p>
                  <p>
                    We focus on customer support, customer success, virtual
                    assistant, and customer operations roles. That is all we do.
                    The narrow focus lets us assess candidates carefully and give
                    employers a shortlist that is actually worth reading.
                  </p>
                  <p>
                    Employers review and interview free. They pay a one-time flat
                    placement fee only when they decide to hire. There are no
                    retainers and no percentage-of-salary fees.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-char mb-5 leading-tight">
                  What we do not do
                </h2>
                <div className="space-y-4 text-moss leading-relaxed">
                  <p>
                    We are not a staffing agency or employer of record. We do not
                    manage payroll, contracts, or compliance. The employment
                    relationship sits between the employer and the candidate.
                  </p>
                  <p>
                    We do not charge candidates. The platform is free for anyone
                    applying. We are paid by employers, only on a successful hire.
                  </p>
                  <p>
                    We do not send unread piles of CVs. The shortlist is short by
                    design — three to five people who fit the role, with enough
                    information for an employer to decide who to interview.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Values strip ──────────────────────────────────────────────── */}
        <section className="py-16 bg-mist/30 border-y border-mist">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              {[
                {
                  label: "Honest about fit",
                  body: "We tell employers when a role is outside our current pool. We tell candidates when a role is not a match. We do not oversell.",
                },
                {
                  label: "Signal over volume",
                  body: "A small, assessed shortlist is more useful than a large, unfiltered one. Every person we introduce has cleared the same bar.",
                },
                {
                  label: "Kenya is the starting point",
                  body: "We start with Nairobi. That focus lets us understand the candidate pool deeply before expanding to other markets.",
                },
              ].map((v) => (
                <div key={v.label}>
                  <h3 className="font-semibold text-char mb-2">{v.label}</h3>
                  <p className="text-sm text-moss leading-relaxed">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contact CTA ───────────────────────────────────────────────── */}
        <section className="py-20 bg-cream">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-char mb-4 leading-tight">
              Questions or partnerships?
            </h2>
            <p className="text-moss text-lg mb-8 max-w-lg mx-auto leading-relaxed">
              Reach us at{" "}
              <a
                href="mailto:hello@olera.co"
                className="text-amber hover:text-amber/80 transition-colors font-medium"
              >
                hello@olera.co
              </a>
              . We are based in Nairobi and respond within one business day.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/employer">
                <Button variant="dark" size="lg">
                  Hire talent
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/join">
                <Button variant="outline" size="lg">
                  Apply as a candidate
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
