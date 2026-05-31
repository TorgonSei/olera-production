import React from "react";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { OleraLockupH } from "@/components/brand/Mark";
import type { CandidateRow } from "@/lib/supabase/types";
import { Users, CheckCircle, Clock, AlertCircle, FileText } from "lucide-react";
import { CandidateListRow } from "./CandidateListRow";

/* ─── Stats card ────────────────────────────────────────────────────────── */
function StatCard({ icon, value, label, sub }: {
  icon: React.ReactNode;
  value: number;
  label: string;
  sub?: string;
}) {
  return (
    <div className="bg-white border border-mist rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3 text-moss">{icon}</div>
      <div className="font-display font-bold text-3xl text-char">{value}</div>
      <div className="text-sm font-medium text-char mt-0.5">{label}</div>
      {sub && <div className="text-xs text-moss mt-1">{sub}</div>}
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default async function AdminCandidatesPage({
  searchParams,
}: {
  searchParams: Promise<{ show?: string }>;
}) {
  const { show } = await searchParams;
  const showDiscarded = show === "discarded";

  // Service client bypasses RLS — admin sees all candidates
  const supabase = createServiceClient();

  const { data: candidates } = await supabase
    .from("candidates")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  const all = (candidates ?? []) as CandidateRow[];
  const active    = all.filter((c) => c.status !== "withdrawn");
  const discarded = all.filter((c) => c.status === "withdrawn");
  const rows      = showDiscarded ? discarded : active;

  const stats = {
    total:      active.length,
    cvUploaded: active.filter((c) => c.cv_file_path).length,
    pending:    active.filter((c) => ["cv_uploaded", "gaps_filled"].includes(c.status)).length,
    active:     active.filter((c) => c.readiness === "ready").length,
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
          </nav>
        </div>
        <span className="text-xs font-mono text-cream/40 bg-white/10 px-2 py-1 rounded-full">Admin</span>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl text-char">Candidate pool</h1>
            <p className="text-moss text-sm mt-1">Review CVs, triage quickly, build shortlists.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Users size={16} />}
            value={stats.total}
            label="Total candidates"
          />
          <StatCard
            icon={<FileText size={16} className="text-amber" />}
            value={stats.cvUploaded}
            label="CVs uploaded"
          />
          <StatCard
            icon={<Clock size={16} className="text-amber" />}
            value={stats.pending}
            label="Awaiting review"
            sub="CV uploaded, not yet actioned"
          />
          <StatCard
            icon={<CheckCircle size={16} className="text-sage" />}
            value={stats.active}
            label="Active in pool"
            sub="Approved for shortlisting"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-3 mb-4 text-sm">
          <Link
            href="/admin/candidates"
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              !showDiscarded
                ? "bg-forest text-cream"
                : "text-moss hover:text-char"
            }`}
          >
            Active ({active.length})
          </Link>
          <Link
            href="/admin/candidates?show=discarded"
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              showDiscarded
                ? "bg-forest text-cream"
                : "text-moss hover:text-char"
            }`}
          >
            Discarded ({discarded.length})
          </Link>
        </div>

        {/* Candidate list */}
        <div className="bg-white border border-mist rounded-2xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-mist bg-mist/30 flex items-center gap-2">
            <span className="text-xs font-mono text-moss">
              {rows.length} {showDiscarded ? "discarded" : "active"} candidates
            </span>
            <span className="text-xs text-moss/40 ml-auto hidden sm:block">
              Click name to review · ✕ to discard
            </span>
          </div>

          {rows.length === 0 ? (
            <div className="text-center py-16">
              <Users size={32} className="text-mist mx-auto mb-3" />
              <p className="text-moss text-sm">
                {showDiscarded ? "No discarded candidates." : "No candidates yet."}
              </p>
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
