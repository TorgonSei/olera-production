import React from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OleraLockupH, OleraCompleteness, OleraFitCategory, COLORS } from "@/components/brand/Mark";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle, Clock, Globe, Briefcase, Star, Wrench } from "lucide-react";
import { Footer } from "@/components/layout/Footer";

/* ─── Status config ─────────────────────────────────────────────────────── */
function getStatusConfig(status: string, readiness: string) {
  if (readiness === "ready" || readiness === "remote_ready") {
    return {
      label: "Active",
      color: "sage" as const,
      description: "Your profile is live and being matched to roles. We'll reach out when there's a fit.",
      icon: <CheckCircle size={16} />,
    };
  }
  if (status === "assessment_invited") {
    return {
      label: "Assessment invited",
      color: "amber" as const,
      description: "Check your email — we've sent you a link to complete your assessment.",
      icon: <Clock size={16} />,
    };
  }
  if (status === "assessment_complete") {
    return {
      label: "Assessment received",
      color: "amber" as const,
      description: "Thanks for completing the assessment. We're reviewing your submission.",
      icon: <Clock size={16} />,
    };
  }
  if (status === "interview_invited") {
    return {
      label: "Interview stage",
      color: "amber" as const,
      description: "You've been invited to interview. Check your email for details.",
      icon: <Clock size={16} />,
    };
  }
  if (status === "assessed" || readiness === "near_ready") {
    return {
      label: "Under review",
      color: "amber" as const,
      description: "Our team is reviewing your profile. We'll be in touch about next steps.",
      icon: <Clock size={16} />,
    };
  }
  return {
    label: "Profile received",
    color: "sand" as const,
    description: "We've received your profile and will be in touch if there's a match.",
    icon: <Clock size={16} />,
  };
}

const TRACK_LABELS: Record<string, string> = {
  support:   "Customer Support",
  success:   "Customer Success",
  assistant: "Virtual / Executive Assistant",
};

/* ─── Page (Server Component) ───────────────────────────────────────────── */
export default async function ProfileReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: candidate } = await supabase
    .from("candidates")
    .select("*")
    .eq("id", id)
    .single();

  if (!candidate) notFound();

  const status = (candidate.status ?? "registered") as string;
  const readiness = (candidate.readiness ?? "unscreened") as string;
  const config = getStatusConfig(status, readiness);
  const trackLabel = TRACK_LABELS[candidate.track] ?? candidate.track;

  const completeness = candidate.profile_completeness ?? 0;

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between border-b border-mist bg-white">
        <OleraLockupH size={26} />
        <div className="flex items-center gap-3">
          <Badge variant={config.color} dot>
            {config.label}
          </Badge>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Pathway progress */}
        {(() => {
          const PATHWAY = [
            { n: "01", label: "Profile Built" },
            { n: "02", label: "Under Review" },
            { n: "03", label: "Matched" },
            { n: "04", label: "Hired" },
          ];
          const activeIndex =
            status === "placed" ? 3 :
            readiness === "ready" || readiness === "remote_ready" ? 2 :
            status === "gaps_filled" || status === "assessment_invited" ||
            status === "assessment_complete" || status === "interview_invited" ||
            status === "assessed" || status === "review_pending" || status === "active" ? 1 :
            0;

          return (
            <div className="flex items-start gap-3 mb-8">
              {PATHWAY.map((step, i) => {
                const done = i < activeIndex;
                const current = i === activeIndex;
                return (
                  <div key={step.n} className="flex-1 min-w-0">
                    <div className={[
                      "h-1 rounded-full mb-2",
                      done ? "bg-sage" : current ? "bg-amber" : "bg-mist",
                    ].join(" ")} />
                    <p className={[
                      "text-xs font-mono",
                      done ? "text-sage" : current ? "text-amber font-semibold" : "text-moss/40",
                    ].join(" ")}>
                      {step.n}
                    </p>
                    <p className={[
                      "text-xs font-medium leading-tight mt-0.5",
                      done || current ? "text-char" : "text-moss/40",
                    ].join(" ")}>
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          );
        })()}

        {/* Status banner */}
        <div
          className="rounded-2xl p-5 mb-8 border flex items-start gap-4"
          style={{
            backgroundColor:
              readiness === "ready" ? "#f0f4f0" :
              readiness === "near_ready" ? "#fef5ec" : "#f5f5f5",
            borderColor:
              readiness === "ready" ? COLORS.sage + "40" :
              readiness === "near_ready" ? COLORS.amber + "40" : COLORS.mist,
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: COLORS.forest }}
          >
            <span className="text-cream">{config.icon}</span>
          </div>
          <div>
            <h2 className="font-semibold text-char mb-1">Profile status: {config.label}</h2>
            <p className="text-sm text-moss">{config.description}</p>
          </div>
        </div>

        {/* Profile card */}
        <Card variant="elevated" className="mb-6">
          <div className="flex items-start justify-between mb-6">
            {/* Identity */}
            <div>
              <h1 className="font-display font-bold text-2xl text-char">
                {candidate.full_name || "Your Profile"}
              </h1>
              <p className="text-moss mt-1">{trackLabel}</p>
              {candidate.location_city && (
                <p className="text-sm text-moss flex items-center gap-1.5 mt-1">
                  <Globe size={13} />
                  {candidate.location_city}, {candidate.location_country}
                </p>
              )}
            </div>
            {/* Completeness */}
            <OleraCompleteness value={completeness} size={56} showLabel />
          </div>

          {/* Summary */}
          {candidate.summary && (
            <div className="mb-6">
              <h3 className="text-xs font-medium text-moss/60 mb-2">
                Summary
              </h3>
              <p className="text-sm text-char leading-relaxed">{candidate.summary}</p>
            </div>
          )}

          {/* Key details */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 py-4 border-t border-mist">
            {candidate.years_experience !== null && (
              <div>
                <p className="text-xs font-medium text-moss/60 mb-1">Experience</p>
                <p className="font-semibold text-char flex items-center gap-1.5">
                  <Briefcase size={14} className="text-amber" />
                  {candidate.years_experience} year{candidate.years_experience !== 1 ? "s" : ""}
                </p>
              </div>
            )}
            {candidate.gap_contract_pref && (
              <div>
                <p className="text-xs font-medium text-moss/60 mb-1">Contract</p>
                <p className="font-semibold text-char">
                  {candidate.gap_contract_pref === "full_time" ? "Full-time"
                    : candidate.gap_contract_pref === "part_time" ? "Part-time"
                    : "Contract"}
                </p>
              </div>
            )}
            {candidate.gap_english_level && (
              <div>
                <p className="text-xs font-medium text-moss/60 mb-1">English</p>
                <p className="font-semibold text-char capitalize">{candidate.gap_english_level}</p>
              </div>
            )}
            {candidate.gap_availability_weeks !== null && (
              <div>
                <p className="text-xs font-medium text-moss/60 mb-1">Availability</p>
                <p className="font-semibold text-char">
                  {candidate.gap_availability_weeks === 0
                    ? "Immediately"
                    : `${candidate.gap_availability_weeks} weeks`}
                </p>
              </div>
            )}
          </div>

          {/* Tools */}
          {(candidate.tools ?? []).length > 0 && (
            <div className="mt-4 pt-4 border-t border-mist">
              <h3 className="text-xs font-medium text-moss/60 mb-3 flex items-center gap-1.5">
                <Wrench size={12} />
                Tools
              </h3>
              <div className="flex flex-wrap gap-2">
                {(candidate.tools as string[]).map((tool) => (
                  <span
                    key={tool}
                    className="text-xs px-2.5 py-1 rounded-full bg-mist text-char font-mono"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Specialisations */}
          {(candidate.specialisations ?? []).length > 0 && (
            <div className="mt-4 pt-4 border-t border-mist">
              <h3 className="text-xs font-medium text-moss/60 mb-3 flex items-center gap-1.5">
                <Star size={12} />
                Specialisations
              </h3>
              <div className="flex flex-wrap gap-2">
                {(candidate.specialisations as string[]).map((spec) => (
                  <span
                    key={spec}
                    className="text-xs px-2.5 py-1 rounded-full bg-amber/10 text-amber font-medium"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Assessment result */}
        {candidate.assessment_score !== null && (
          <Card variant="elevated" className="mb-6">
            <h3 className="text-xs font-medium text-moss/60 mb-4 flex items-center gap-1.5">
              <Star size={12} />
              Your results
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display font-bold text-3xl text-char">
                  {candidate.assessment_score}
                  <span className="text-moss font-normal text-lg">/100</span>
                </p>
                <Badge
                  variant={
                    candidate.assessment_tier === "pass" ? "sage" :
                    candidate.assessment_tier === "borderline" ? "amber" : "moss"
                  }
                  className="mt-2"
                  dot
                >
                  {candidate.assessment_tier === "pass" ? "Strong result"
                    : candidate.assessment_tier === "borderline" ? "Under review"
                    : "Keep building"}
                </Badge>
              </div>
              <OleraFitCategory
                level={
                  (candidate.assessment_score ?? 0) >= 75 ? "strong" :
                  (candidate.assessment_score ?? 0) >= 55 ? "possible" :
                  (candidate.assessment_score ?? 0) >= 40 ? "stretch" : "poor"
                }
                size={32}
                showLabel
              />
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" size="lg" as="a" href="/dashboard" fullWidth>
            Back to dashboard
          </Button>
          {candidate.profile_slug && (
            <Button variant="outline" size="lg" as="a" href={`/p/${candidate.profile_slug}`} fullWidth>
              View public profile
            </Button>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
