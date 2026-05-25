import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import {
  OleraLockupH, Olera3A, OleraFitCategory, OleraCompleteness, COLORS,
} from "@/components/brand/Mark";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Footer } from "@/components/layout/Footer";
import type { CandidateRow } from "@/lib/supabase/types";
import { Globe, Briefcase, Star, Wrench, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";

/* ─── Metadata ──────────────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("candidates")
    .select("full_name, track, location_city, summary")
    .eq("profile_slug", slug)
    .eq("profile_public", true)
    .single();

  if (!data) return { title: "Profile not found" };

  const TRACK_LABELS: Record<string, string> = {
    support:   "Customer Support",
    success:   "Customer Success",
    assistant: "Virtual / Executive Assistant",
  };

  return {
    title: `${data.full_name} — ${TRACK_LABELS[data.track] ?? data.track}`,
    description: data.summary ?? `${data.full_name} is available for ${TRACK_LABELS[data.track] ?? data.track} roles.`,
    openGraph: {
      title: `${data.full_name} on Olera`,
      description: data.summary ?? "",
    },
  };
}

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: candidateRaw } = await supabase
    .from("candidates")
    .select("*")
    .eq("profile_slug", slug)
    .eq("profile_public", true)
    .single();

  if (!candidateRaw) notFound();

  const c = candidateRaw as CandidateRow;

  const TRACK_LABELS: Record<string, string> = {
    support:   "Customer Support",
    success:   "Customer Success",
    assistant: "Virtual / Executive Assistant",
  };

  const TRACK_COLORS: Record<string, string> = {
    support:   COLORS.amber,
    success:   COLORS.sage,
    assistant: COLORS.terra,
  };

  const trackColor = TRACK_COLORS[c.track] ?? COLORS.amber;
  const trackLabel = TRACK_LABELS[c.track] ?? c.track;

  const fitLevel =
    (c.assessment_score ?? 0) >= 75 ? "strong" :
    (c.assessment_score ?? 0) >= 55 ? "possible" :
    (c.assessment_score ?? 0) >= 40 ? "stretch" : "poor";

  const CONTRACT_LABELS: Record<string, string> = {
    full_time: "Full-time",
    part_time: "Part-time",
    contract:  "Contract",
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Minimal nav */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-mist">
        <Link href="/">
          <OleraLockupH size={24} />
        </Link>
        <Button variant="dark" size="sm" as="a" href="/employer">
          Hire on Olera
        </Button>
      </header>

      {/* Hero section */}
      <section className="bg-forest text-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1">
              {/* Track badge */}
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono mb-4"
                style={{ backgroundColor: `${trackColor}22`, color: trackColor }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden />
                {trackLabel}
              </div>

              {/* Name */}
              <h1 className="font-display font-bold text-4xl sm:text-5xl text-cream mb-3">
                {c.full_name}
              </h1>

              {/* Location + experience */}
              <div className="flex flex-wrap items-center gap-4 text-cream/60 text-sm mb-4">
                {c.location_city && (
                  <span className="flex items-center gap-1.5">
                    <Globe size={13} />
                    {c.location_city}, {c.location_country}
                  </span>
                )}
                {c.years_experience !== null && (
                  <span className="flex items-center gap-1.5">
                    <Briefcase size={13} />
                    {c.years_experience} years experience
                  </span>
                )}
                {c.gap_english_level && (
                  <span className="flex items-center gap-1.5">
                    <Star size={13} />
                    English: {c.gap_english_level}
                  </span>
                )}
              </div>

              {/* Summary */}
              {c.summary && (
                <p className="text-cream/80 text-lg leading-relaxed max-w-xl">{c.summary}</p>
              )}
            </div>

            {/* Completeness */}
            <div className="flex-shrink-0">
              <OleraCompleteness value={c.profile_completeness} size={72} />
            </div>
          </div>

          {/* Readiness + fit */}
          {c.assessment_score !== null && (
            <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-6 flex-wrap">
              <div>
                <p className="text-xs font-mono text-cream/40 mb-1">Assessment score</p>
                <div className="flex items-center gap-3">
                  <span className="font-display font-bold text-2xl text-cream">{c.assessment_score}</span>
                  <OleraFitCategory level={fitLevel} size={20} showLabel />
                </div>
              </div>
              <div>
                <p className="text-xs font-mono text-cream/40 mb-1">Readiness</p>
                <Badge
                  variant={c.readiness === "ready" ? "sage" : "amber"}
                  dot
                >
                  {c.readiness === "ready" ? "Active & available" : "Near ready"}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Profile body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        {/* Work preferences */}
        <section>
          <h2 className="text-xs font-mono text-moss/60 uppercase tracking-widest mb-4">Work preferences</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: "Availability",
                value: c.gap_availability_weeks === 0
                  ? "Immediately"
                  : c.gap_availability_weeks
                  ? `${c.gap_availability_weeks} weeks`
                  : null,
              },
              {
                label: "Contract",
                value: c.gap_contract_pref ? CONTRACT_LABELS[c.gap_contract_pref] : null,
              },
              {
                label: "Salary range",
                value: c.gap_salary_min_usd && c.gap_salary_max_usd
                  ? `$${c.gap_salary_min_usd.toLocaleString()}–$${c.gap_salary_max_usd.toLocaleString()}`
                  : null,
              },
              {
                label: "Remote",
                value: "Remote-ready",
              },
            ].map(({ label, value }) =>
              value ? (
                <div key={label} className="bg-white border border-mist rounded-xl p-4">
                  <p className="text-xs font-mono text-moss/60 mb-1">{label}</p>
                  <p className="font-semibold text-char text-sm">{value}</p>
                </div>
              ) : null
            )}
          </div>
        </section>

        {/* Tools */}
        {(c.tools ?? []).length > 0 && (
          <section>
            <h2 className="text-xs font-mono text-moss/60 uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <Wrench size={12} />
              Tools & platforms
            </h2>
            <div className="flex flex-wrap gap-2">
              {(c.tools as string[]).map((tool) => (
                <span
                  key={tool}
                  className="text-sm px-3 py-1.5 rounded-full bg-white border border-mist text-char font-mono"
                >
                  {tool}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Specialisations */}
        {(c.specialisations ?? []).length > 0 && (
          <section>
            <h2 className="text-xs font-mono text-moss/60 uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <Star size={12} />
              Specialisations
            </h2>
            <div className="flex flex-wrap gap-2">
              {(c.specialisations as string[]).map((s) => (
                <span
                  key={s}
                  className="text-sm px-3 py-1.5 rounded-full font-medium"
                  style={{ backgroundColor: `${trackColor}15`, color: trackColor }}
                >
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Remote verification */}
        <section className="bg-sage/10 border border-sage/20 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <Shield size={18} className="text-sage flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-char mb-1">
                Remote setup:{" "}
                <span className="text-sage">
                  {c.remote_verification === "verified" ? "Verified ✓" :
                   c.remote_verification === "confirmed" ? "Confirmed ✓" : "Self-reported"}
                </span>
              </h3>
              <p className="text-sm text-moss">
                {c.remote_verification === "verified"
                  ? "Internet speed and workspace photo have been manually reviewed by Olera."
                  : c.remote_verification === "confirmed"
                  ? "Candidate has submitted their internet speed test and workspace photo."
                  : "Candidate has indicated they have a suitable remote work setup."}
              </p>
              {c.internet_speed_mbps && (
                <p className="text-xs font-mono text-moss/60 mt-1.5">
                  Internet speed: {c.internet_speed_mbps} Mbps
                </p>
              )}
            </div>
          </div>
        </section>

        {/* CTA for employers */}
        <section className="bg-forest text-cream rounded-3xl p-8 text-center">
          <div className="flex justify-center mb-4" aria-hidden>
            <Olera3A size={36} color={COLORS.amber} />
          </div>
          <h2 className="font-display font-bold text-2xl mb-3">
            Interested in this candidate?
          </h2>
          <p className="text-cream/70 mb-6 max-w-sm mx-auto">
            Post your role on Olera and we'll match you with qualified candidates like{" "}
            {c.full_name?.split(" ")[0] ?? "them"} — shortlisted within 48 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" size="lg" as="a" href="/employer">
              Hire on Olera
              <ArrowRight size={18} />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              as="a"
              href="/employer/pricing"
              className="text-cream hover:text-cream hover:bg-white/10"
            >
              See pricing
            </Button>
          </div>
        </section>

        {/* Powered by */}
        <div className="text-center text-xs text-moss/50 font-mono">
          Profile verified and managed by Olera · <Link href="/" className="hover:text-moss transition-colors">olera.co</Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
