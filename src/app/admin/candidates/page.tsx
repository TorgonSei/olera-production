import React from "react";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { OleraLockupH } from "@/components/brand/Mark";
import type { CandidateRow } from "@/lib/supabase/types";
import { Users, CheckCircle, Clock, Zap, Star } from "lucide-react";
import { CandidateListRow } from "./CandidateListRow";

/* ─── Pipeline stages ───────────────────────────────────────────────────── */
type Stage = "new" | "assessment" | "interview" | "assessed" | "active" | "discarded";

const STAGES: { key: Stage; label: string }[] = [
  { key: "new",        label: "New" },
  { key: "assessment", label: "Assessment" },
  { key: "interview",  label: "Interview" },
  { key: "assessed",   label: "Assessed" },
  { key: "active",     label: "Active" },
  { key: "discarded",  label: "Discarded" },
];

function getStage(c: CandidateRow): Stage {
  if (c.status === "withdrawn")                                  return "discarded";
  if (c.readiness === "ready" || c.readiness === "remote_ready") return "active";
  if (c.status === "assessed")                                   return "assessed";
  if (c.status === "interview_invited")                          return "interview";
  if (c.status === "assessment_invited" ||
      c.status === "assessment_complete")                        return "assessment";
  return "new";
}

/* ─── Stat card ─────────────────────────────────────────────────────────── */
function StatCard({
  icon, value, label, urgent,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  urgent?: boolean;
}) {
  return (
    <div className={`rounded-2xl p-5 border ${urgent && value > 0
      ? "bg-amber/5 border-amber/30"
      : "bg-white border-mist"}`}
    >
      <div className={`flex items-center gap-2 mb-3 ${urgent && value > 0 ? "text-amber" : "text-moss"}`}>
        {icon}
      </div>
      <div className={`font-display font-bold text-3xl ${urgent && value > 0 ? "text-amber" : "text-char"}`}>
        {value}
      </div>
      <div className="text-sm font-medium text-char mt-0.5">{label}</div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default async function AdminCandidatesPage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string }>;
}) {
  const { stage } = await searchParams;
  const activeStage = (stage ?? "new") as Stage;

  const supabase = createServiceClient();

  const { data: candidates } = await supabase
    .from("candidates")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  const all = (candidates ?? []) as CandidateRow[];

  const byStageFn = (s: Stage) => all.filter((c) => getStage(c) === s);
  const counts: Record<Stage, number> = {
    new:        byStageFn("new").length,
    assessment: byStageFn("assessment").length,
    interview:  byStageFn("interview").length,
    assessed:   byStageFn("assessed").length,
    active:     byStageFn("active").length,
    discarded:  byStageFn("discarded").length,
  };

  const rows = byStageFn(activeStage);

  // "Action needed" = profile submitted but not yet invited, or assessment done but not interview invited
  const needsInvite     = all.filter((c) => c.status === "gaps_filled").length;
  const needsInterview  = all.filter((c) => c.status === "assessment_complete").length;
  const needsDecision   = all.filter((c) => c.status === "assessed").length;

  return (
    <div className="min-h-screen bg-cream">
      {/* Admin nav */}
      <header className="sticky top-0 z-10 bg-forest border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <OleraLockupH size={24} reversed />
          <nav className="hidden sm:flex items-center gap-4 text-sm">
            <Link href="/admin/candidates" className="text-cream font-medium">Candidates</Link>
            <Link href="/admin/employers" className="text-cream/50 hover:text-cream transition-colors">Employers</Link>
          </nav>
        </div>
        <span className="text-xs font-mono text-cream/40 bg-white/10 px-2 py-1 rounded-full">Admin</span>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl text-char">Candidate pipeline</h1>
          <p className="text-moss text-sm mt-1">Triage, invite, and activate candidates through each stage.</p>
        </div>

        {/* Action-needed stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Users size={16} />}
            value={counts.new}
            label="Awaiting review"
            urgent
          />
          <StatCard
            icon={<Zap size={16} />}
            value={needsInvite}
            label="Invite to assessment"
            urgent
          />
          <StatCard
            icon={<Clock size={16} />}
            value={needsInterview}
            label="Invite to interview"
            urgent
          />
          <StatCard
            icon={<Star size={16} />}
            value={needsDecision}
            label="Needs activation decision"
            urgent
          />
        </div>

        {/* Pipeline stage tabs */}
        <div className="flex items-center gap-1.5 mb-4 flex-wrap">
          {STAGES.map(({ key, label }) => (
            <Link
              key={key}
              href={`/admin/candidates?stage=${key}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeStage === key
                  ? "bg-forest text-cream"
                  : "text-moss hover:text-char hover:bg-mist/60"
              }`}
            >
              {label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-mono ${
                activeStage === key
                  ? "bg-white/15 text-cream"
                  : "bg-mist text-moss"
              }`}>
                {counts[key]}
              </span>
            </Link>
          ))}
        </div>

        {/* Candidate list */}
        <div className="bg-white border border-mist rounded-2xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-mist bg-mist/30 flex items-center gap-2">
            <span className="text-xs font-mono text-moss">
              {rows.length} candidate{rows.length !== 1 ? "s" : ""}
            </span>
            <span className="text-xs text-moss/40 ml-auto hidden sm:block">
              Click name to open · quick actions inline
            </span>
          </div>

          {rows.length === 0 ? (
            <div className="text-center py-16">
              <CheckCircle size={32} className="text-mist mx-auto mb-3" />
              <p className="text-moss text-sm">No candidates at this stage.</p>
            </div>
          ) : (
            <div>
              {rows.map((c) => (
                <CandidateListRow key={c.id} c={c} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
