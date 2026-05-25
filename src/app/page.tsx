import React from "react";
import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Olera3A, Olera3AGraduated, OleraFitCategory, COLORS } from "@/components/brand/Mark";
import { ArrowRight, Upload, Star, Globe, CheckCircle } from "lucide-react";

/* ─── Track definitions ─────────────────────────────────────────────────── */
const TRACKS = [
  {
    id: "support",
    title: "Customer Support",
    icon: "🎧",
    roles: ["Support Specialist", "Technical Support", "Chat Support Lead"],
    description: "Frontline resolution experts. Fast, empathetic, precise.",
    color: COLORS.amber,
    bg: "#fef5ec",
  },
  {
    id: "success",
    title: "Customer Success",
    icon: "📈",
    roles: ["CSM", "Onboarding Specialist", "Renewals Manager"],
    description: "Retention architects. They grow accounts and reduce churn.",
    color: COLORS.sage,
    bg: "#f0f4f0",
  },
  {
    id: "assistant",
    title: "Virtual & Executive Assistant",
    icon: "⚡",
    roles: ["Executive Assistant", "Operations Coordinator", "Project VA"],
    description: "High-leverage operators. Multiply leadership capacity.",
    color: COLORS.terra,
    bg: "#fdf1ee",
  },
] as const;

/* ─── Social proof numbers ──────────────────────────────────────────────── */
const STATS = [
  { value: "48h", label: "Avg. time to shortlist" },
  { value: "94%", label: "Employer satisfaction" },
  { value: "0", label: "Candidate fee — ever" },
  { value: "3", label: "Role tracks, one platform" },
];

/* ─── How it works steps ────────────────────────────────────────────────── */
const STEPS = [
  {
    n: "01",
    title: "Upload your CV",
    body: "Drop your PDF. Our system reads it, extracts your experience, and builds your profile in under a minute.",
    icon: <Upload size={20} />,
  },
  {
    n: "02",
    title: "Complete your signal",
    body: "Fill six quick gaps — salary range, availability, contract preference. Then take a 20-minute assessment.",
    icon: <Star size={20} />,
  },
  {
    n: "03",
    title: "Get matched",
    body: "We match you to live roles at international employers. When there's a fit, we handle the introduction — you just show up.",
    icon: <CheckCircle size={20} />,
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
          {/* Background mark — large, ghost */}
          <div
            className="absolute top-0 right-0 opacity-5 pointer-events-none select-none"
            aria-hidden="true"
          >
            <Olera3AGraduated size={480} color={COLORS.char} />
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-28 sm:pb-24">
            <div className="max-w-2xl">
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-6">
                <Badge variant="sage" dot>
                  Now matching international roles
                </Badge>
                <Badge variant="sand">
                  <Globe size={11} className="mr-1" />
                  Nairobi · Remote
                </Badge>
              </div>

              {/* Headline */}
              <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-char leading-[1.05] tracking-tight mb-6">
                Your customer ops career{" "}
                <span className="text-amber">starts here.</span>
              </h1>

              <p className="text-lg sm:text-xl text-moss leading-relaxed mb-10 max-w-xl">
                Olera connects exceptional customer support, success, and operations talent with the international teams that need them most. Free for candidates — always.
              </p>

              {/* Primary CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="xl" variant="primary" as="a" href="/join">
                  Upload your CV
                  <ArrowRight size={20} />
                </Button>
                <Button size="xl" variant="ghost" as="a" href="#how-it-works">
                  See how it works
                </Button>
              </div>

              {/* Trust signal */}
              <p className="mt-6 text-sm text-moss/70 flex items-center gap-2">
                <CheckCircle size={14} className="text-sage" />
                Free to join · No recruiter spam · You control your profile
              </p>
            </div>
          </div>
        </section>

        {/* ── Stats bar ─────────────────────────────────────────────────── */}
        <section className="bg-forest text-cream py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-white/10">
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col items-center text-center px-4">
                  <span className="font-display font-bold text-3xl text-amber mb-1">
                    {s.value}
                  </span>
                  <span className="text-xs text-cream/50 font-mono">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Tracks ────────────────────────────────────────────────────── */}
        <section className="py-20 bg-cream">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <p className="text-xs font-mono text-moss/60 uppercase tracking-widest mb-3">
                Three specialisations
              </p>
              <h2 className="font-display font-bold text-4xl sm:text-5xl text-char leading-tight">
                We go deep on customer operations.
              </h2>
              <p className="mt-4 text-moss text-lg max-w-xl">
                Not generalist staffing. Not a job board. One segment, done properly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TRACKS.map((track) => (
                <Card
                  key={track.id}
                  variant="elevated"
                  className="group hover:shadow-md transition-shadow cursor-pointer"
                >
                  <Link href={`/join?track=${track.id}`} className="block">
                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                      style={{ backgroundColor: track.bg }}
                    >
                      {track.icon}
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-semibold text-xl text-char mb-2">
                      {track.title}
                    </h3>

                    <p className="text-sm text-moss mb-4">{track.description}</p>

                    {/* Role examples */}
                    <div className="flex flex-wrap gap-1.5">
                      {track.roles.map((role) => (
                        <span
                          key={role}
                          className="text-xs px-2 py-0.5 rounded-full font-mono"
                          style={{ backgroundColor: track.bg, color: track.color }}
                        >
                          {role}
                        </span>
                      ))}
                    </div>

                    {/* Fit preview */}
                    <div className="mt-5 pt-4 border-t border-mist flex items-center justify-between">
                      <span className="text-xs text-moss font-mono">Example fit</span>
                      <OleraFitCategory level="strong" size={16} showLabel />
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ──────────────────────────────────────────────── */}
        <section id="how-it-works" className="py-20 bg-mist/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <p className="text-xs font-mono text-moss/60 uppercase tracking-widest mb-3">
                Three steps
              </p>
              <h2 className="font-display font-bold text-4xl sm:text-5xl text-char">
                From CV to shortlisted in 24 hours.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {STEPS.map((step, i) => (
                <div key={step.n} className="relative">
                  {i < STEPS.length - 1 && (
                    <div
                      className="hidden md:block absolute top-6 left-full w-8 border-t-2 border-dashed border-mist z-0"
                      aria-hidden="true"
                    />
                  )}

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-forest text-cream flex items-center justify-center">
                        {step.icon}
                      </div>
                      <span className="font-mono text-sm text-moss/50">{step.n}</span>
                    </div>

                    <h3 className="font-display font-semibold text-xl text-char mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-moss leading-relaxed">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-14 text-center">
              <Button size="lg" variant="primary" as="a" href="/join">
                Start your profile
                <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </section>

        {/* ── For employers teaser ──────────────────────────────────────── */}
        <section className="py-20 bg-forest text-cream">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="amber" className="mb-6">For employers</Badge>
                <h2 className="font-display font-bold text-4xl sm:text-5xl leading-tight mb-6">
                  Hire customer ops talent that{" "}
                  <span className="text-amber">actually performs.</span>
                </h2>
                <p className="text-cream/70 text-lg leading-relaxed mb-8">
                  Every candidate in our pool has been CV-screened, gap-assessed, and scored on a judgment test specific to their track. You get a curated shortlist — not a keyword dump.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="primary" size="lg" as="a" href="/employer">
                    See how we hire
                    <ArrowRight size={18} />
                  </Button>
                  <Button variant="ghost" size="lg" as="a" href="/employer/pricing" className="text-cream hover:text-cream hover:bg-white/10">
                    View pricing
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: "Shortlists within 48 hours",
                    body: "We send you 3-5 pre-screened candidates matched to your exact role spec.",
                    icon: "⚡",
                  },
                  {
                    title: "One flat fee on hire",
                    body: "No retainers, no subscription. Pay only when you place someone.",
                    icon: "💳",
                  },
                  {
                    title: "Remote-confirmed talent",
                    body: "Setup photos and internet speed tests — we verify before you ever speak to them.",
                    icon: "🌍",
                  },
                  {
                    title: "Replacement guarantee",
                    body: "If it doesn't work out in the first 90 days, we find a replacement at no extra cost.",
                    icon: "🔄",
                  },
                ].map((f) => (
                  <div key={f.title} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-2xl flex-shrink-0">{f.icon}</span>
                    <div>
                      <h4 className="font-semibold text-cream mb-1">{f.title}</h4>
                      <p className="text-sm text-cream/60">{f.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Final CTA ─────────────────────────────────────────────────── */}
        <section className="py-20 bg-cream">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="flex justify-center mb-6" aria-hidden="true">
              <Olera3A size={48} color={COLORS.amber} />
            </div>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-char mb-4">
              Ready to be found?
            </h2>
            <p className="text-moss text-lg mb-8">
              Upload your CV and let us do the rest. No signup fees, no recruiter gatekeeping, no spam.
            </p>
            <Button size="xl" variant="primary" as="a" href="/join" fullWidth className="max-w-sm mx-auto">
              Upload your CV — it&apos;s free
              <ArrowRight size={20} />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
