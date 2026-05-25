import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { OleraLockupH, OleraCompleteness, OleraFitCategory } from "@/components/brand/Mark";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { CandidateRow, AssessmentRow } from "@/lib/supabase/types";
import {
  ArrowLeft, Globe, Briefcase, Star, Wrench,
  CheckCircle, XCircle, Clock, Phone, Mail,
} from "lucide-react";
import { AdminActionButtons } from "./AdminActionButtons";

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default async function AdminCandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: candidateRaw }, { data: assessmentRaw }] = await Promise.all([
    supabase.from("candidates").select("*").eq("id", id).single(),
    supabase.from("assessments").select("*").eq("candidate_id", id).order("created_at", { ascending: false }).limit(1).single(),
  ]);

  if (!candidateRaw) notFound();

  const c = candidateRaw as CandidateRow;
  const assessment = assessmentRaw as AssessmentRow | null;

  const fitLevel =
    (c.assessment_score ?? 0) >= 75 ? "strong" :
    (c.assessment_score ?? 0) >= 55 ? "possible" :
    (c.assessment_score ?? 0) >= 40 ? "stretch" : "poor";

  const TRACK_LABELS: Record<string, string> = {
    support: "Customer Support",
    success: "Customer Success",
    assistant: "Virtual / Executive Assistant",
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Admin nav */}
      <header className="sticky top-0 z-10 bg-forest border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <OleraLockupH size={24} reversed />
          <Link href="/admin/candidates" className="text-cream/50 hover:text-cream transition-colors text-sm flex items-center gap-1.5">
            <ArrowLeft size={14} />
            All candidates
          </Link>
        </div>
        <span className="text-xs font-mono text-cream/40 bg-white/10 px-2 py-1 rounded-full">Admin</span>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Top bar: name + actions */}
        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h1 className="font-display font-bold text-2xl text-char">
              {c.full_name || "Unnamed candidate"}
            </h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant={c.readiness === "ready" ? "sage" : c.readiness === "near_ready" ? "amber" : "moss"} dot>
                {c.readiness === "ready" ? "Active" : c.readiness === "near_ready" ? "Near ready" : c.readiness === "developing" ? "Developing" : "Pending"}
              </Badge>
              <Badge variant="sand">{TRACK_LABELS[c.track] ?? c.track}</Badge>
              {c.assessment_tier && (
                <Badge variant={c.assessment_tier === "pass" ? "sage" : c.assessment_tier === "borderline" ? "amber" : "moss"}>
                  Assessment: {c.assessment_tier}
                </Badge>
              )}
            </div>
          </div>

          {/* Action buttons (client component) */}
          <AdminActionButtons candidateId={c.id} currentReadiness={c.readiness} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: profile */}
          <div className="lg:col-span-2 space-y-5">

            {/* Identity card */}
            <Card variant="elevated">
              <h2 className="text-xs font-mono text-moss/60 uppercase tracking-widest mb-4">Identity</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {c.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-moss" />
                    <span className="text-char font-mono">{c.phone}</span>
                  </div>
                )}
                {c.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-moss" />
                    <span className="text-char">{c.email}</span>
                  </div>
                )}
                {c.location_city && (
                  <div className="flex items-center gap-2">
                    <Globe size={13} className="text-moss" />
                    <span className="text-char">{c.location_city}, {c.location_country}</span>
                  </div>
                )}
                {c.years_experience !== null && (
                  <div className="flex items-center gap-2">
                    <Briefcase size={13} className="text-moss" />
                    <span className="text-char">{c.years_experience} years experience</span>
                  </div>
                )}
              </div>

              {c.summary && (
                <div className="mt-4 pt-4 border-t border-mist">
                  <p className="text-sm text-char leading-relaxed">{c.summary}</p>
                </div>
              )}
            </Card>

            {/* Gap fields */}
            <Card variant="elevated">
              <h2 className="text-xs font-mono text-moss/60 uppercase tracking-widest mb-4">Profile signals</h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                {[
                  { label: "Target role",    value: c.gap_target_role },
                  { label: "English",        value: c.gap_english_level },
                  { label: "Contract",       value: c.gap_contract_pref?.replace("_", "-") },
                  { label: "Available",      value: c.gap_availability_weeks === 0 ? "Immediately" : c.gap_availability_weeks ? `${c.gap_availability_weeks}w` : null },
                  { label: "Salary min",     value: c.gap_salary_min_usd ? `$${c.gap_salary_min_usd?.toLocaleString()}` : null },
                  { label: "Salary max",     value: c.gap_salary_max_usd ? `$${c.gap_salary_max_usd?.toLocaleString()}` : null },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <span className="text-xs text-moss/60 font-mono block mb-0.5">{label}</span>
                    <span className={value ? "font-medium text-char" : "text-moss/40"}>
                      {value ?? "—"}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Tools + specialisations */}
            {((c.tools ?? []).length > 0 || (c.specialisations ?? []).length > 0) && (
              <Card variant="elevated">
                <h2 className="text-xs font-mono text-moss/60 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                  <Wrench size={12} />
                  Skills
                </h2>
                {(c.tools ?? []).length > 0 && (
                  <div className="mb-3">
                    <span className="text-xs text-moss/60 font-mono block mb-2">Tools</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(c.tools as string[]).map((t) => (
                        <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-mist text-char font-mono">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
                {(c.specialisations ?? []).length > 0 && (
                  <div>
                    <span className="text-xs text-moss/60 font-mono block mb-2">Specialisations</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(c.specialisations as string[]).map((s) => (
                        <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-amber/10 text-amber font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* Assessment detail */}
            {assessment && (
              <Card variant="elevated">
                <h2 className="text-xs font-mono text-moss/60 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                  <Star size={12} />
                  Assessment detail
                </h2>

                {/* Written response */}
                <div className="mb-5">
                  <p className="text-xs font-mono text-moss/60 mb-2">Written prompt</p>
                  <p className="text-sm text-moss italic border-l-2 border-amber/40 pl-3">{assessment.written_prompt}</p>
                  <p className="text-xs font-mono text-moss/60 mt-3 mb-2">Candidate response</p>
                  <p className="text-sm text-char leading-relaxed bg-mist/30 rounded-xl p-3">{assessment.written_response}</p>
                  {assessment.written_score !== null && (
                    <p className="text-xs font-mono text-moss mt-2">Written score: <strong>{assessment.written_score}/100</strong></p>
                  )}
                </div>

                {/* Scenarios */}
                <div className="mb-5 space-y-3">
                  <p className="text-xs font-mono text-moss/60">Judgment scenarios</p>
                  {[1, 2, 3].map((n) => {
                    const score = assessment[`scenario_${n}_score` as keyof AssessmentRow] as number | null;
                    return (
                      <div key={n} className="flex items-center gap-3 text-sm">
                        <span className="font-mono text-xs text-moss/50 w-6">S{n}</span>
                        {score !== null && score > 0 ? (
                          <CheckCircle size={14} className="text-sage flex-shrink-0" />
                        ) : (
                          <XCircle size={14} className="text-terra flex-shrink-0" />
                        )}
                        <span className="text-xs text-moss truncate">
                          {String(assessment[`scenario_${n}_prompt` as keyof AssessmentRow] ?? "").substring(0, 80)}…
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* AI feedback */}
                {assessment.ai_feedback && (
                  <div className="bg-forest/5 border border-forest/10 rounded-xl p-3">
                    <p className="text-xs font-mono text-moss/60 mb-1.5">AI feedback</p>
                    <p className="text-sm text-char">{assessment.ai_feedback}</p>
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Right: sidebar */}
          <div className="space-y-5">
            {/* Score + completeness */}
            <Card variant="elevated" className="text-center">
              <OleraCompleteness value={c.profile_completeness} size={64} showLabel className="mb-4" />
              {c.assessment_score !== null && (
                <div>
                  <div className="font-display font-bold text-3xl text-char">
                    {c.assessment_score}
                    <span className="text-moss text-lg font-normal">/100</span>
                  </div>
                  <div className="mt-2">
                    <OleraFitCategory level={fitLevel} size={20} showLabel className="justify-center" />
                  </div>
                </div>
              )}
            </Card>

            {/* Timeline */}
            <Card variant="elevated">
              <h3 className="text-xs font-mono text-moss/60 uppercase tracking-widest mb-3">Timeline</h3>
              <div className="space-y-2.5">
                {[
                  { label: "Registered",  date: c.created_at },
                  { label: "CV uploaded", date: c.cv_parsed_at },
                  { label: "Assessed",    date: c.assessment_completed_at },
                ].map(({ label, date }) => (
                  date && (
                    <div key={label} className="flex items-center justify-between text-xs">
                      <span className="text-moss">{label}</span>
                      <span className="font-mono text-char">
                        {new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                  )
                ))}
              </div>
            </Card>

            {/* CV link */}
            {c.cv_file_path && (
              <Card variant="elevated">
                <h3 className="text-xs font-mono text-moss/60 uppercase tracking-widest mb-3">CV</h3>
                <a
                  href={`/api/admin/cv/${c.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-amber hover:text-terra transition-colors font-medium"
                >
                  Download CV →
                </a>
              </Card>
            )}

            {/* Public profile link */}
            {c.profile_slug && (
              <Card variant="elevated">
                <h3 className="text-xs font-mono text-moss/60 uppercase tracking-widest mb-3">Shareable profile</h3>
                <a
                  href={`/p/${c.profile_slug}`}
                  target="_blank"
                  className="text-sm text-amber hover:text-terra transition-colors font-medium"
                >
                  /p/{c.profile_slug} →
                </a>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
