import React from "react";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { OleraLockupH } from "@/components/brand/Mark";
import type { CandidateRow } from "@/lib/supabase/types";
import { Users, Clock, Star, CheckCircle } from "lucide-react";
import { CandidateListRow } from "./CandidateListRow";

/* ─── Pipeline stages ───────────────────────────────────────────────────── */
type Stage = "new" | "screening" | "assessed" | "active" | "placed" | "rejected";

const STAGES: { key: Stage; label: string }[] = [
  { key: "new",       label: "New" },
  { key: "screening", label: "Screening" },
  { key: "assessed",  label: "Assessed" },
  { key: "active",    label: "Active" },
  { key: "placed",    label: "Placed" },
  { key: "rejected",  label: "Rejected" },
];

function getStage(c: CandidateRow): Stage {
  const s = c.status;
  if (s === "placed")                                               return "placed";
  if (s === "rejected" || s === "archived" || s === "withdrawn")   return "rejected";
  if (s === "employer_ready" || s === "shortlisted" ||
      s === "interview_requested" || s === "active")               return "active";
  if (s === "assessed")                                             return "assessed";
  if (s === "screening_needed" || s === "screening_scheduled" ||
      s === "screened" || s === "keep_in_pool")                    return "screening";
  return "new";
}

/* ─── Stat card ─────────────────────────────────────────────────────────── */
function StatCard({ icon, value, label, urgent }: {
  icon: React.ReactNode; value: number; label: string; urgent?: boolean;
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
  searchParams: Promise<{ stage?: string; track?: string }>;
}) {
  const { stage, track } = await searchParams;
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
    new:       byStageFn("new").length,
    screening: byStageFn("screening").length,
    assessed:  byStageFn("assessed").length,
    active:    byStageFn("active").length,
    placed:    byStageFn("placed").length,
    rejected:  byStageFn("rejected").length,
  };

  let rows = byStageFn(activeStage);
  if (track) rows = rows.filter((c) => c.track === track);

  const needsReview    = all.filter((c) => c.status === "submitted" || c.status === "gaps_filled" || c.status === "needs_review").length;
  const needsScreening = all.filter((c) => c.status === "screening_needed").length;
  const readyToActive  = all.filter((c) => c.status === "assessed").length;
  const newToday       = all.filter((c) => {
    const d = new Date(c.created_at);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  }).length;

  const TRACKS = ["support", "success", "assistant", "operations"];

  return (
    <div className="min-h-screen bg-cream">
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
          <p className="text-moss text-sm mt-1">Review, screen, and manage candidates through each stage.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Users size={16} />}     value={needsReview}    label="Needs review"    urgent />
          <StatCard icon={<Clock size={16} />}     value={needsScreening} label="Screening needed" urgent />
          <StatCard icon={<Star size={16} />}      value={readyToActive}  label="Assessed"        urgent />
          <StatCard icon={<CheckCircle size={16} />} value={newToday}     label="Submitted today"  />
        </div>

        {/* Stage tabs */}
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          {STAGES.map(({ key, label }) => (
            <Link
              key={key}
              href={`/admin/candidates?stage=${key}${track ? `&track=${track}` : ""}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeStage === key
                  ? "bg-forest text-cream"
                  : "text-moss hover:text-char hover:bg-mist/60"
              }`}
            >
              {label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-mono ${
                activeStage === key ? "bg-white/15 text-cream" : "bg-mist text-moss"
              }`}>
                {counts[key]}
              </span>
            </Link>
          ))}
        </div>

        {/* Track filter */}
        <div className="flex items-center gap-1.5 mb-4">
          <span className="text-xs text-moss/50 font-mono mr-1">Track:</span>
          <Link
            href={`/admin/candidates?stage=${activeStage}`}
            className={`text-xs px-2.5 py-1 rounded-full font-mono transition-colors ${!track ? "bg-forest text-cream" : "bg-mist text-moss hover:bg-mist/70"}`}
          >
            All
          </Link>
          {TRACKS.map((t) => (
            <Link
              key={t}
              href={`/admin/candidates?stage=${activeStage}&track=${t}`}
              className={`text-xs px-2.5 py-1 rounded-full font-mono capitalize transition-colors ${track === t ? "bg-forest text-cream" : "bg-mist text-moss hover:bg-mist/70"}`}
            >
              {t}
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
              Click name to open · manage status inside
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
