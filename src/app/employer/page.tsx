import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Olera3A, COLORS } from "@/components/brand/Mark";
import { BriefForm } from "@/components/employer/BriefForm";
import { ArrowRight, ChevronDown } from "lucide-react";

export const metadata: Metadata = {
  title: "Hire Kenyan Customer Operations Talent",
  description:
    "Assessed customer support, success, and operations talent from Kenya. Small shortlists, 48-hour turnaround. Review and interview free. Pay only when you hire.",
};

/* ─── Why Kenya — 6 evidence-backed cards ───────────────────────────────── */
const WHY_KENYA = [
  {
    label: "A real customer operations base",
    body: "Kenya already has BPO, contact-centre, telecoms, banking, hospitality, startup, and NGO operations experience. Olera draws from that base and tests candidates before introduction.",
  },
  {
    label: "Strong digital foundations",
    body: "Kenya is recognized as a leading East African technology hub, with mature mobile money, growing ICT infrastructure, and a workforce increasingly used to digital work tools.",
  },
  {
    label: "Timezone that works",
    body: "Nairobi is UTC+3. That gives strong overlap with Europe, the Middle East, and African regional teams without forcing candidates into permanent night-shift work.",
  },
  {
    label: "English for business",
    body: "English is widely used in education, business, professional services, customer support, and formal communication. For written support, account follow-up, and assistant work, that matters.",
  },
  {
    label: "Service-sector training ground",
    body: "Many strong candidates come from banks, telcos, hospitality, logistics, startups, NGOs, and BPO firms — environments where communication, patience, follow-through, and customer handling are daily requirements.",
  },
  {
    label: "Quality still needs proof",
    body: "Kenya has the talent, but employers still need signal. Olera adds the missing layer: assessment, role fit, availability, tools, and shortlist judgment before an employer spends time interviewing.",
  },
] as const;

/* ─── What employers see ─────────────────────────────────────────────────── */
const PROFILE_ITEMS = [
  "Role fit summary",
  "Written response sample",
  "Customer judgment signal",
  "Tools and platforms used",
  "Availability",
  "Salary or rate expectation",
  "Remote-work preference",
  "Strengths",
  "Gaps to check in the interview",
];

/* ─── FAQ ────────────────────────────────────────────────────────────────── */
const FAQ = [
  {
    q: "Can I speak to candidates before committing?",
    a: "Yes. You can review the shortlist and interview candidates before paying. Olera only charges when you decide to hire.",
  },
  {
    q: "What does it cost?",
    a: "One flat placement fee, based on role level. Junior Support is $560, Experienced Associate is $1,050, Team Lead or Supervisor is $1,900, and Manager roles are $3,200. No retainer. No percentage of salary. We tell you the fee upfront when you send the brief.",
  },
  {
    q: "What if the hire does not work out?",
    a: "Olera provides a 60-day replacement guarantee. If the hire leaves or is released for performance-related reasons within that window, we run one replacement search at no extra placement fee.",
  },
  {
    q: "How long does the process take?",
    a: "For clear, well-described roles, Olera aims to send a shortlist within 48 hours. Some specialist or senior roles may take longer. We will tell you early if the role is outside our current pool.",
  },
  {
    q: "Do you handle contracts, payroll, or compliance?",
    a: "Not by default. Olera handles assessment, matching, shortlist, and placement. The employment or contract relationship sits between you and the candidate. For larger hiring partnerships, we can discuss support arrangements.",
  },
  {
    q: "What if I need someone with specific tool knowledge?",
    a: "Tell us the tools in the role brief. We check tool familiarity before shortlisting and flag gaps clearly so you know what to test in the interview.",
  },
  {
    q: "What roles do you fill?",
    a: "Customer support, customer success, virtual assistant, executive assistant, account support, client service, and customer operations roles. That is all we do.",
  },
  {
    q: "Do you only hire in Kenya?",
    a: "Phase one focuses on Nairobi and Kenya-based talent. That focus lets us assess candidates carefully and build a reliable pipeline before expanding to other markets.",
  },
] as const;

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default function EmployerPage() {
  return (
    <>
      <Nav />

      <main>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="bg-forest text-cream">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-28 sm:pb-24">
            <div className="max-w-3xl">
              <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-7xl leading-[1.05] tracking-tight mb-6">
                Hire assessed customer operations talent from Kenya.
              </h1>
              <p className="text-base sm:text-xl text-cream/70 leading-relaxed mb-6 max-w-2xl">
                Olera sends small, focused shortlists for customer support,
                customer success, and virtual assistant roles. Each candidate
                has completed a profile and practical assessment before
                introduction.
              </p>
              <p className="text-sm font-mono text-cream/40 mb-10">
                Review free · Interview free · Pay only when you hire
              </p>
              <Link
                href="#brief"
                className="inline-flex items-center gap-2 bg-amber text-cream font-semibold px-8 py-4 rounded-xl hover:bg-amber/90 transition-colors text-base"
              >
                Tell us the role
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Employer value cards ──────────────────────────────────────── */}
        <section className="py-16 bg-mist/40 border-y border-mist">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display font-bold text-2xl text-char mb-8">
              What employers get.
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  title: "Assessed before interview",
                  body: "Candidates complete customer operations scenarios, tool checks, and a full profile review before they are presented to you.",
                },
                {
                  title: "Small, focused shortlists",
                  body: "We do not send a pile of CVs. We send 3–5 candidates matched to the specific role you described.",
                },
                {
                  title: "Remote-readiness checked",
                  body: "We check availability, work setup, communication quality, and remote preference before matching candidates to remote roles.",
                },
                {
                  title: "One flat fee on hire",
                  body: "No retainers, no subscription, no percentage of salary. Pay once, only when you make a hire.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="bg-white border border-mist rounded-2xl p-6"
                >
                  <h3 className="font-semibold text-char mb-2">{card.title}</h3>
                  <p className="text-sm text-moss leading-relaxed">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why Kenya ─────────────────────────────────────────────────── */}
        <section className="py-24 bg-cream">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Centered intro */}
            <div className="max-w-2xl mx-auto text-center mb-14">
              <h2 className="font-display font-bold text-4xl sm:text-5xl text-char leading-tight mb-6">
                Why Kenya works for customer operations.
              </h2>
              <div className="space-y-4 text-moss text-base leading-relaxed">
                <p>
                  Kenya is not an untested remote-work market. It is one of
                  East Africa&apos;s strongest digital economies, with a growing
                  BPO sector, deep mobile-money adoption, strong English-language
                  business culture, and a timezone that fits Europe and the
                  Middle East.
                </p>
                <p>
                  Olera focuses that market into one assessed pipeline: people
                  who can write clearly, handle customers, stay organized, use
                  digital tools, and work reliably with global teams.
                </p>
              </div>
            </div>

            {/* Kicker — heading for the evidence cards */}
            <h3 className="font-display font-bold text-2xl text-char mb-8">
              Kenya has the talent. Olera adds the signal.
            </h3>

            {/* Evidence cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {WHY_KENYA.map((point) => (
                <div
                  key={point.label}
                  className="bg-white border border-mist rounded-2xl p-6"
                >
                  <h3 className="font-semibold text-char mb-2">{point.label}</h3>
                  <p className="text-sm text-moss leading-relaxed">{point.body}</p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── What you pay candidates ───────────────────────────────────── */}
        <section className="bg-deep text-cream py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="font-display font-bold text-5xl sm:text-6xl text-amber mb-3">
                  $12,000–$30,000
                </p>
                <p className="text-cream/50 font-mono text-sm mb-6">per year</p>
                <p className="text-cream/60 text-base leading-relaxed mb-6 max-w-sm">
                  A practical annual compensation range for remote customer
                  support, customer success, virtual assistant, and customer
                  operations roles, depending on level and experience.
                </p>
                <p className="text-cream/40 text-sm leading-relaxed max-w-sm">
                  Olera does not position Kenya as cheap labour. The value is
                  strong communication, useful timezone overlap, competitive
                  compensation, and assessed candidates before interview.
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-cream/50 mb-4">Assessed before introduction</p>
                <div className="space-y-3">
                  {[
                    "Communication",
                    "Judgment",
                    "Tools",
                    "Availability",
                    "Role fit",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber flex-shrink-0" />
                      <span className="text-cream/70">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── What employers see ────────────────────────────────────────── */}
        <section className="py-20 bg-mist/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div>
                <h2 className="font-display font-bold text-4xl sm:text-5xl text-char mb-5 leading-tight">
                  What employers see before they interview.
                </h2>
                <p className="text-moss text-lg leading-relaxed mb-6">
                  A normal CV tells you where someone worked. Olera shows how
                  they think and communicate.
                </p>
                <p className="text-moss leading-relaxed">
                  You are not hiring from a database. You are reviewing people
                  who have already shown useful work signals.
                </p>
              </div>

              <div className="bg-white border border-mist rounded-2xl p-6">
                <p className="text-sm font-medium text-moss/60 mb-5">Each shortlist includes</p>
                <div className="space-y-3">
                  {PROFILE_ITEMS.map((item, i) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-forest text-cream flex items-center justify-center text-xs font-mono font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      <span className="text-sm text-char">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────────────── */}
        <section className="py-20 bg-cream">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="font-display font-bold text-4xl sm:text-5xl text-char">
                Three steps.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  n: "01",
                  title: "Send us the brief",
                  body: "Tell us the role, what the work actually involves day-to-day, and what would make someone wrong for it. The more specific, the better the shortlist.",
                },
                {
                  n: "02",
                  title: "We shortlist within 48 hours",
                  body: "We go through our assessed pool, match to your spec, and send you 3–5 candidates with their profiles, assessment scores, and fit notes. No unread CVs.",
                },
                {
                  n: "03",
                  title: "You interview and decide",
                  body: "Interview who you want. Take your time. Nothing is charged until you make an offer and it is accepted. The employment relationship is yours to structure.",
                },
              ].map((step, i, arr) => (
                <div key={step.n} className="relative">
                  {i < arr.length - 1 && (
                    <div
                      className="hidden md:block absolute top-6 left-full w-8 border-t-2 border-dashed border-mist z-0"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative z-10">
                    <span className="font-mono text-xs text-moss/40 block mb-3">
                      {step.n}
                    </span>
                    <h3 className="font-display font-semibold text-xl text-char mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-moss leading-relaxed">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ──────────────────────────────────────────────────── */}
        <section className="py-20 bg-forest text-cream">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4">
                One flat fee. Paid once, on hire.
              </h2>
              <p className="text-cream/50 text-base font-mono">
                Review free · Interview free · 60-day replacement guarantee
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  tier: "Junior Support",
                  fee: "$560",
                  desc: "Entry-level customer support and chat roles.",
                  highlight: false,
                },
                {
                  tier: "Experienced Associate",
                  fee: "$1,050",
                  desc: "Customer support and success with track record.",
                  highlight: true,
                },
                {
                  tier: "Team Lead",
                  fee: "$1,900",
                  desc: "Supervisors managing a small team or queue.",
                  highlight: false,
                },
                {
                  tier: "Manager",
                  fee: "$3,200",
                  desc: "Senior customer operations and success roles.",
                  highlight: false,
                },
              ].map((plan) => (
                <div
                  key={plan.tier}
                  className={`rounded-2xl p-7 flex flex-col gap-4 ${
                    plan.highlight
                      ? "bg-amber text-forest"
                      : "bg-white/5 border border-white/10"
                  }`}
                >
                  <p
                    className={`text-xs font-medium ${
                      plan.highlight ? "text-forest/60" : "text-cream/50"
                    }`}
                  >
                    {plan.tier}
                  </p>
                  <p
                    className={`font-display font-bold text-5xl tracking-tight ${
                      plan.highlight ? "text-forest" : "text-cream"
                    }`}
                  >
                    {plan.fee}
                  </p>
                  <p
                    className={`text-sm leading-relaxed ${
                      plan.highlight ? "text-forest/70" : "text-cream/50"
                    }`}
                  >
                    {plan.desc}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-xs text-cream/25 font-mono">
              One-time placement fee per hire. No recurring charges.
            </p>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section className="py-20 bg-cream">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="font-display font-bold text-4xl sm:text-5xl text-char">
                The things people ask before they commit.
              </h2>
            </div>

            <div className="divide-y divide-mist">
              {FAQ.map(({ q, a }) => (
                <details key={q} className="group py-6">
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
                    <span className="font-semibold text-char text-lg leading-snug">
                      {q}
                    </span>
                    <ChevronDown
                      size={18}
                      className="flex-shrink-0 text-moss/40 transition-transform group-open:rotate-180"
                    />
                  </summary>
                  <p className="mt-4 text-moss leading-relaxed text-base max-w-2xl">
                    {a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Brief form ────────────────────────────────────────────────── */}
        <section id="brief" className="py-20 bg-mist/30">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center mb-8" aria-hidden="true">
              <Olera3A size={40} color={COLORS.amber} />
            </div>
            <div className="text-center mb-10">
              <h2 className="font-display font-bold text-4xl sm:text-5xl text-char mb-4">
                Tell us the role.
              </h2>
              <p className="text-moss text-lg max-w-xl mx-auto">
                Describe the work clearly. We will review it and tell you within
                24 hours whether Olera has the right candidate pool for it. If
                we can help, we will build a small shortlist and explain what
                each candidate fits — and what to check before you interview.
              </p>
            </div>

            <BriefForm />
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
