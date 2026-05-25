import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { OleraLockupH, OleraFitCategory, OleraCompleteness } from "@/components/brand/Mark";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import type { CandidateRow, ReadinessLevel, TrackType } from "@/lib/supabase/types";
import { Search, Filter, Users, CheckCircle, Clock, AlertCircle } from "lucide-react";

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const READINESS_BADGE: Record<ReadinessLevel, { variant: "sage" | "amber" | "moss" | "sand"; label: string }> = {
  ready:      { variant: "sage",  label: "Ready" },
  near_ready: { variant: "amber", label: "Near ready" },
  developing: { variant: "moss",  label: "Developing" },
  unscreened: { variant: "sand",  label: "Pending" },
};

const TRACK_LABELS: Record<TrackType, string> = {
  support:   "Support",
  success:   "Success",
  assistant: "Assistant",
};

const TRACK_BADGE_VARIANT: Record<TrackType, "amber" | "sage" | "terra"> = {
  support:   "amber",
  success:   "sage",
  assistant: "terra",
};

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/* ─── Stats card ────────────────────────────────────────────────────────── */
function StatCard({ icon, value, label, sub }: { icon: React.ReactNode; value: number; label: string; sub?: string }) {
  return (
    <div className="bg-white border border-mist rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3 text-moss">{icon}</div>
      <div className="font-display font-bold text-3xl text-char">{value}</div>
      <div className="text-sm font-medium text-char mt-0.5">{label}</div>
      {sub && <div className="text-xs text-moss mt-1">{sub}</div>}
    </div>
  );
}

/* ─── Page (Server Component) ───────────────────────────────────────────── */
export default async function AdminCandidatesPage() {
  const supabase = await createClient();

  const { data: candidates } = await supabase
    .from("candidates")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  const rows = (candidates ?? []) as CandidateRow[];

  // Aggregate stats
  const stats = {
    total:      rows.length,
    ready:      rows.filter((c) => c.readiness === "ready").length,
    pending:    rows.filter((c) => c.status === "assessed" || c.status === "gaps_filled").length,
    unscreened: rows.filter((c) => c.readiness === "unscreened").length,
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Admin nav */}
      <header className="sticky top-0 z-10 bg-forest border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <OleraLockupH size={24} reversed />
          <nav className="hidden sm:flex items-center gap-4 text-sm">
            <Link href="/admin/candidates" className="text-cream font-medium">Candidates</Link>
            <Link href="/admin/employers" className="text-cream/50 hover:text-cream transition-colors">Employers</Link>
            <Link href="/admin/roles" className="text-cream/50 hover:text-cream transition-colors">Roles</Link>
            <Link href="/admin/placements" className="text-cream/50 hover:text-cream transition-colors">Placements</Link>
          </nav>
        </div>
        <span className="text-xs font-mono text-cream/40 bg-white/10 px-2 py-1 rounded-full">Admin</span>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl text-char">Candidate pool</h1>
          <p className="text-moss text-sm mt-1">Review, approve and activate candidates for employer matching.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Users size={16} />} value={stats.total} label="Total candidates" />
          <StatCard
            icon={<CheckCircle size={16} className="text-sage" />}
            value={stats.ready}
            label="Active in pool"
            sub="Matching live roles"
          />
          <StatCard
            icon={<Clock size={16} className="text-amber" />}
            value={stats.pending}
            label="Awaiting review"
            sub="Assessed, not yet approved"
          />
          <StatCard
            icon={<AlertCircle size={16} className="text-terra" />}
            value={stats.unscreened}
            label="Incomplete"
            sub="Haven't finished onboarding"
          />
        </div>

        {/* Table */}
        <div className="bg-white border border-mist rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="px-4 py-3 border-b border-mist flex items-center gap-3 bg-mist/30">
            <Search size={14} className="text-moss flex-shrink-0" />
            <span className="text-xs font-mono text-moss">{rows.length} candidates</span>
            <div className="ml-auto flex items-center gap-2">
              <Filter size={13} className="text-moss" />
              <span className="text-xs text-moss font-mono">Filter</span>
            </div>
          </div>

          {rows.length === 0 ? (
            <div className="text-center py-16">
              <Users size={32} className="text-mist mx-auto mb-3" />
              <p className="text-moss text-sm">No candidates yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-mist">
              {rows.map((c) => {
                const readinessCfg = READINESS_BADGE[c.readiness];
                const fitLevel =
                  (c.assessment_score ?? 0) >= 75 ? "strong" :
                  (c.assessment_score ?? 0) >= 55 ? "possible" :
                  (c.assessment_score ?? 0) >= 40 ? "stretch" : "poor";

                return (
                  <Link
                    key={c.id}
                    href={`/admin/candidates/${c.id}`}
                    className="flex items-center gap-4 px-4 py-3.5 hover:bg-cream/60 transition-colors group"
                  >
                    {/* Avatar initial */}
                    <div className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-forest">
                        {c.full_name?.[0]?.toUpperCase() ?? "?"}
                      </span>
                    </div>

                    {/* Name + location */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-char truncate">
                          {c.full_name || "—"}
                        </span>
                        <Badge variant={TRACK_BADGE_VARIANT[c.track]} className="hidden sm:inline-flex flex-shrink-0">
                          {TRACK_LABELS[c.track]}
                        </Badge>
                      </div>
                      <div className="text-xs text-moss mt-0.5">
                        {c.location_city ? `${c.location_city}, ${c.location_country}` : c.phone}
                      </div>
                    </div>

                    {/* Completeness */}
                    <div className="hidden md:block flex-shrink-0">
                      <OleraCompleteness value={c.profile_completeness} size={32} />
                    </div>

                    {/* Fit (from assessment) */}
                    <div className="hidden lg:block flex-shrink-0">
                      {c.assessment_score !== null ? (
                        <OleraFitCategory level={fitLevel} size={16} showLabel />
                      ) : (
                        <span className="text-xs text-moss/50 font-mono">No score</span>
                      )}
                    </div>

                    {/* Score */}
                    <div className="hidden sm:block w-10 text-right flex-shrink-0">
                      {c.assessment_score !== null ? (
                        <span className="font-mono text-sm font-medium text-char">
                          {c.assessment_score}
                        </span>
                      ) : (
                        <span className="text-xs text-moss/40">—</span>
                      )}
                    </div>

                    {/* Readiness badge */}
                    <div className="flex-shrink-0">
                      <Badge variant={readinessCfg.variant} dot>
                        {readinessCfg.label}
                      </Badge>
                    </div>

                    {/* Time */}
                    <div className="hidden md:block text-xs text-moss/50 font-mono flex-shrink-0 w-16 text-right">
                      {timeAgo(c.created_at)}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
