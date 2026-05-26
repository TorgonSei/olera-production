import React from "react";
import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import {
  Olera3A,
  Olera3AGraduated,
  OleraFitCategory,
  COLORS,
} from "@/components/brand/Mark";
import {
  ArrowRight,
  Upload,
  FileText,
  ClipboardList,
  Users,
  CheckCircle,
} from "lucide-react";

/* ─── Candidate FAQ ──────────────────────────────────────────────────────── */
const CANDIDATE_FAQ = [
  {
    q: "Do I need experience?",
    a: "Depends on the role. The practical tasks show what you can do — not just what your CV says.",
  },
  {
    q: "Is it free?",
    a: "Yes. Candidates do not pay to join, apply, or be matched. Ever.",
  },
  {
    q: "What happens after I upload my CV?",
    a: "We build your profile, ask a few questions, then you do short practical tasks. Most candidates finish in a few days.",
  },
  {
    q: "Will employers see my contact details?",
    a: "No. Contact details stay private until you're in an active process and have approved it.",
  },
  {
    q: "What if I am not ready yet?",
    a: "You get a profile and clear feedback on what to improve. Not everyone reaches Employer Ready first time — that's expected.",
  },
];

/* ─── Role tracks ────────────────────────────────────────────────────────── */
const TRACKS = [
  {
    id: "support",
    title: "Customer Support",
    icon: "🎧",
    roles: ["Email Support", "Chat Support", "Contact Centre Agent", "Client Service Officer"],
    description:
      "For people who can respond clearly, stay calm, and help customers solve problems.",
    color: COLORS.amber,
    bg: "#fef5ec",
  },
  {
    id: "success",
    title: "Customer Success",
    icon: "📈",
    roles: ["Customer Success Associate", "Account Support", "Onboarding Support", "Retention Support"],
    description:
      "For people who can follow up with customers, support accounts, and help clients get value from a product or service.",
    color: COLORS.sage,
    bg: "#f0f4f0",
  },
  {
    id: "assistant",
    title: "Virtual & Executive Assistant",
    icon: "⚡",
    roles: ["Virtual Assistant", "Executive Assistant", "Remote Admin Support", "Operations Assistant"],
    description:
      "For people who can organize information, manage tasks, communicate well, and help busy teams move faster.",
    color: COLORS.terra,
    bg: "#fdf1ee",
  },
] as const;

/* ─── Stats bar ──────────────────────────────────────────────────────────── */
const STATS = [
  { value: "48h", label: "Shortlist delivered" },
  { value: "3–5", label: "Candidates per shortlist" },
  { value: "0", label: "Candidate fees. Ever." },
  { value: "60-day", label: "Replacement guarantee" },
];

/* ─── 4-step process ─────────────────────────────────────────────────────── */
const STEPS = [
  {
    n: "01",
    title: "Upload your CV",
    body: "We read your CV and build your profile automatically.",
    icon: <Upload size={20} />,
  },
  {
    n: "02",
    title: "Complete your profile",
    body: "Availability, salary, tools, and remote preferences. About 5 minutes.",
    icon: <FileText size={20} />,
  },
  {
    n: "03",
    title: "Show your work",
    body: "Write a customer reply, handle a judgment scenario. We see what you can actually do.",
    icon: <ClipboardList size={20} />,
  },
  {
    n: "04",
    title: "Get matched",
    body: "When you fit a live role, Olera introduces you. No random applications.",
    icon: <Users size={20} />,
  },
];

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      <Nav />

      <main>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-cream">
          <div
            className="absolute top-0 right-0 opacity-5 pointer-events-none select-none"
            aria-hidden="true"
          >
            <Olera3AGraduated size={480} color={COLORS.char} />
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 sm:pt-16 sm:pb-14">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              {/* Left — copy */}
              <div>
                {/* Eyebrow */}
                <div className="flex items-center gap-3 mb-5">
                  <Badge variant="sage" dot>
                    Remote roles · International employers
                  </Badge>
                </div>

                {/* Headline */}
                <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-char leading-[1.08] tracking-tight mb-5">
                  Kenyan customer operations talent{" "}
                  <span className="text-amber">for global teams.</span>
                </h1>

                {/* Sub-hero */}
                <p className="text-base sm:text-lg text-moss leading-relaxed mb-8">
                  Upload your CV. We build your profile and match you to roles where you fit.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" variant="primary" as="a" href="/join">
                    Upload your CV
                    <ArrowRight size={18} />
                  </Button>
                  <Button size="lg" variant="ghost" as="a" href="/employer">
                    Hiring talent?
                  </Button>
                </div>

                {/* Trust line */}
                <p className="mt-5 text-sm text-moss/70 flex items-center gap-2">
                  <CheckCircle size={14} className="text-sage flex-shrink-0" />
                  Free for candidates · No spam · You control your profile
                </p>
              </div>

              {/* Right — stats 2×2 */}
              <div className="grid grid-cols-2 gap-4">
                {STATS.map((s) => {
                  const isGreen = s.label === "Candidate fees. Ever.";
                  const isDeep  = s.label === "Replacement guarantee";
                  return (
                    <div
                      key={s.label}
                      className={[
                        "rounded-2xl p-4 sm:p-6 flex flex-col gap-1",
                        isGreen
                          ? "bg-forest border border-forest"
                          : isDeep
                          ? "bg-deep border border-deep"
                          : "bg-white border border-mist",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "font-display font-bold text-3xl sm:text-4xl tracking-tight",
                          isGreen || isDeep ? "text-cream" : "text-char",
                        ].join(" ")}
                      >
                        {s.value}
                      </span>
                      <span
                        className={[
                          "text-xs font-mono leading-snug",
                          isGreen || isDeep ? "text-cream/55" : "text-moss/60",
                        ].join(" ")}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </section>

        {/* ── Can I apply? — candidate FAQ ──────────────────────────────── */}
        <section className="py-20 bg-cream">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <p className="text-xs font-mono text-moss/60 uppercase tracking-widest mb-3">
                For candidates
              </p>
              <h2 className="font-display font-bold text-4xl sm:text-5xl text-char">
                Can I apply?
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CANDIDATE_FAQ.map(({ q, a }) => (
                <div
                  key={q}
                  className="bg-white border border-mist rounded-2xl p-6"
                >
                  <p className="font-semibold text-char mb-2">{q}</p>
                  <p className="text-sm text-moss leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Role tracks ───────────────────────────────────────────────── */}
        <section className="py-20 bg-mist/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <p className="text-xs font-mono text-moss/60 uppercase tracking-widest mb-3">
                Three role tracks
              </p>
              <h2 className="font-display font-bold text-4xl sm:text-5xl text-char leading-tight">
                One clear focus.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TRACKS.map((track) => (
                <Card
                  key={track.id}
                  variant="elevated"
                  className="group hover:shadow-md transition-shadow cursor-pointer"
                >
                  <Link href={`/join?track=${track.id}`} className="block">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                      style={{ backgroundColor: track.bg }}
                    >
                      {track.icon}
                    </div>

                    <h3 className="font-display font-semibold text-xl text-char mb-2">
                      {track.title}
                    </h3>

                    <p className="text-sm text-moss mb-5 leading-relaxed">
                      {track.description}
                    </p>

                    <div className="space-y-1.5 mb-5">
                      <p className="text-xs font-mono text-moss/50 uppercase tracking-wider mb-2">
                        Typical roles
                      </p>
                      {track.roles.map((role) => (
                        <div
                          key={role}
                          className="flex items-center gap-2 text-sm text-char"
                        >
                          <span
                            className="w-1 h-1 rounded-full flex-shrink-0"
                            style={{ backgroundColor: track.color }}
                          />
                          {role}
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-mist flex items-center justify-between">
                      <span className="text-xs text-moss font-mono">
                        Example fit
                      </span>
                      <OleraFitCategory level="strong" size={16} showLabel />
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works — 4 steps ────────────────────────────────────── */}
        <section id="how-it-works" className="py-14 sm:py-20 bg-cream">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 sm:mb-12">
              <p className="text-xs font-mono text-moss/60 uppercase tracking-widest mb-3">
                How it works
              </p>
              <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-char">
                Start with your CV.{" "}
                <span className="text-amber">We ask for the rest.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {STEPS.map((step, i) => (
                <div key={step.n} className="relative">
                  {i < STEPS.length - 1 && (
                    <div
                      className="hidden lg:block absolute top-6 left-full w-8 border-t-2 border-dashed border-mist z-0"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-forest text-cream flex items-center justify-center flex-shrink-0">
                        {step.icon}
                      </div>
                      <span className="font-mono text-sm text-moss/50">{step.n}</span>
                    </div>
                    <h3 className="font-display font-semibold text-lg text-char mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-moss leading-relaxed">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-14">
              <Button size="lg" variant="primary" as="a" href="/join">
                Start your profile
                <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </section>

        {/* ── Your Olera Path — 4 readiness levels ─────────────────────── */}
        <section className="py-16 bg-mist/30 border-y border-mist">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <p className="text-xs font-mono text-moss/60 uppercase tracking-widest mb-3">
                Your Olera path
              </p>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-char leading-tight">
                Four levels. Progress at your own pace.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  n: "01",
                  status: "Profile Built",
                  body: "CV uploaded, profile built. Not yet visible to employers.",
                  dark: false,
                  accent: false,
                },
                {
                  n: "02",
                  status: "Assessed",
                  body: "Practical tasks done. We understand how you write, think, and handle customers.",
                  dark: false,
                  accent: false,
                },
                {
                  n: "03",
                  status: "Employer Ready",
                  body: "Meets the threshold. Visible to employers and open for matching.",
                  dark: false,
                  accent: true,
                },
                {
                  n: "04",
                  status: "Remote Ready",
                  body: "Strong comms, verified remote setup, AI-ready habits. Highest signal for international roles.",
                  dark: true,
                  accent: false,
                },
              ].map((level) => (
                <div
                  key={level.status}
                  className={[
                    "rounded-2xl p-6 flex flex-col gap-3",
                    level.dark
                      ? "bg-forest border border-forest"
                      : level.accent
                      ? "bg-white border-2 border-amber/30"
                      : "bg-white border border-mist",
                  ].join(" ")}
                >
                  <p
                    className={`text-xs font-mono ${
                      level.dark ? "text-cream/30" : "text-moss/40"
                    }`}
                  >
                    {level.n}
                  </p>
                  <div
                    className={`inline-flex items-center gap-2 self-start px-2.5 py-1 rounded-full text-xs font-semibold ${
                      level.dark
                        ? "bg-amber text-forest"
                        : level.accent
                        ? "bg-amber/10 text-amber"
                        : "bg-sage/10 text-forest"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        level.dark
                          ? "bg-forest"
                          : level.accent
                          ? "bg-amber"
                          : "bg-sage"
                      }`}
                    />
                    {level.status}
                  </div>
                  <p
                    className={`text-sm leading-relaxed ${
                      level.dark ? "text-cream/60" : "text-moss"
                    }`}
                  >
                    {level.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Employer pointer ──────────────────────────────────────────── */}
        <section className="py-20 bg-forest text-cream">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <p className="text-xs font-mono text-cream/40 uppercase tracking-widest mb-4">
                  For employers
                </p>
                <h2 className="font-display font-bold text-4xl sm:text-5xl leading-tight mb-5">
                  Hire Kenyan customer operations talent without sorting through
                  hundreds of CVs.
                </h2>
                <p className="text-cream/70 text-lg leading-relaxed mb-8 max-w-lg">
                  A small shortlist of candidates already through our readiness pathway. You see the signal, not just the CV.
                </p>
                <p className="text-cream/50 text-sm mb-8 font-mono">
                  Review free · Interview free · Pay only when you hire
                </p>
                <Link
                  href="/employer"
                  className="inline-flex items-center gap-2 text-amber font-medium hover:gap-3 transition-all"
                >
                  Why companies hire from Kenya
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    title: "Assessed before interview",
                    body: "Scenarios, tool checks, and a profile review — before they're presented.",
                  },
                  {
                    title: "Small shortlists",
                    body: "A focused shortlist matched to your role. Not a pile of CVs.",
                  },
                  {
                    title: "Remote-readiness checked",
                    body: "Availability, work setup, comms quality, and remote preference — verified before matching.",
                  },
                  {
                    title: "One flat fee on hire",
                    body: "No retainers, no percentage of salary. Pay once, only when you hire.",
                  },
                ].map((card) => (
                  <div
                    key={card.title}
                    className="p-5 rounded-2xl bg-white/5 border border-white/10"
                  >
                    <h4 className="font-semibold text-cream text-sm mb-2">
                      {card.title}
                    </h4>
                    <p className="text-sm text-cream/60 leading-relaxed">{card.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Final CTA — split candidate / employer ────────────────────── */}
        <section className="py-20 bg-cream">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Candidate CTA */}
              <div className="bg-white border border-mist rounded-3xl p-8 sm:p-10 flex flex-col">
                <div className="mb-6" aria-hidden="true">
                  <Olera3A size={36} color={COLORS.amber} />
                </div>
                <h2 className="font-display font-bold text-3xl text-char mb-8 flex-1">
                  Start with your CV.
                </h2>
                <Button size="lg" variant="primary" as="a" href="/join" fullWidth>
                  Upload your CV — it&apos;s free
                  <ArrowRight size={18} />
                </Button>
              </div>

              {/* Employer CTA */}
              <div className="bg-forest text-cream rounded-3xl p-8 sm:p-10 flex flex-col">
                <div className="mb-6" aria-hidden="true">
                  <Olera3A size={36} color={COLORS.cream} />
                </div>
                <h2 className="font-display font-bold text-3xl mb-3">
                  Hiring customer operations talent?
                </h2>
                <p className="text-cream/70 leading-relaxed mb-8 flex-1">
                  Tell us the role. We will send a small assessed shortlist when
                  we find the right fit.
                </p>
                <Link
                  href="/employer"
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-amber text-cream font-semibold hover:bg-amber/90 transition-colors"
                >
                  Hire talent
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
