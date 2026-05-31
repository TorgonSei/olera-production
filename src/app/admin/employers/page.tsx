import React from "react";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { OleraLockupH } from "@/components/brand/Mark";
import type { EmployerRequestRow } from "@/lib/supabase/types";
import { Briefcase, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/cn";

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  new_request:          { label: "New",              cls: "bg-amber/15 text-amber font-semibold" },
  reviewing:            { label: "Reviewing",        cls: "bg-amber/10 text-amber" },
  can_support:          { label: "Can support",      cls: "bg-sage/10 text-sage" },
  cannot_support:       { label: "Cannot support",   cls: "bg-mist text-moss/60" },
  need_more_info:       { label: "Need info",        cls: "bg-amber/10 text-amber" },
  shortlist_in_progress:{ label: "Shortlisting",     cls: "bg-sage/10 text-sage" },
  shortlist_sent:       { label: "Shortlist sent",   cls: "bg-sage/20 text-sage font-semibold" },
  interview_stage:      { label: "Interviewing",     cls: "bg-forest/10 text-forest font-semibold" },
  offer_stage:          { label: "Offer stage",      cls: "bg-forest/15 text-forest font-semibold" },
  hired:                { label: "Hired",            cls: "bg-sage/30 text-sage font-semibold" },
  closed:               { label: "Closed",           cls: "bg-mist text-moss/50" },
};

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default async function AdminEmployersPage() {
  const supabase = createServiceClient();
  const { data: requests } = await supabase
    .from("employer_requests")
    .select("*")
    .order("created_at", { ascending: false });

  const all = (requests ?? []) as EmployerRequestRow[];
  const newCount      = all.filter((r) => r.status === "new_request").length;
  const activeCount   = all.filter((r) => ["reviewing", "can_support", "shortlist_in_progress", "shortlist_sent", "interview_stage", "offer_stage"].includes(r.status)).length;

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-10 bg-forest border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <OleraLockupH size={24} reversed />
          <nav className="hidden sm:flex items-center gap-4 text-sm">
            <Link href="/admin/candidates" className="text-cream/50 hover:text-cream transition-colors">Candidates</Link>
            <Link href="/admin/employers" className="text-cream font-medium">Employers</Link>
          </nav>
        </div>
        <span className="text-xs font-mono text-cream/40 bg-white/10 px-2 py-1 rounded-full">Admin</span>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl text-char">Employer requests</h1>
            <p className="text-moss text-sm mt-1">Manage incoming hiring briefs and shortlist progress.</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="bg-amber/10 text-amber px-3 py-1 rounded-full font-mono font-semibold">
              {newCount} new
            </span>
            <span className="bg-mist text-moss px-3 py-1 rounded-full font-mono">
              {activeCount} active
            </span>
          </div>
        </div>

        <div className="bg-white border border-mist rounded-2xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-mist bg-mist/30">
            <span className="text-xs font-mono text-moss">{all.length} request{all.length !== 1 ? "s" : ""}</span>
          </div>

          {all.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase size={32} className="text-mist mx-auto mb-3" />
              <p className="text-moss text-sm">No employer requests yet.</p>
            </div>
          ) : (
            <div>
              {all.map((r) => {
                const badge = STATUS_BADGE[r.status] ?? { label: r.status, cls: "bg-mist text-moss" };
                return (
                  <Link
                    key={r.id}
                    href={`/admin/employers/${r.id}`}
                    className="flex items-center gap-4 px-4 py-4 hover:bg-cream/50 transition-colors border-b border-mist last:border-0"
                  >
                    <div className="w-9 h-9 rounded-xl bg-forest/8 flex items-center justify-center flex-shrink-0 text-sm font-bold text-forest">
                      {r.company_name[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-char">{r.company_name}</span>
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-mono", badge.cls)}>
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-xs text-moss mt-0.5">
                        {r.role_title} · {r.headcount} {r.headcount === 1 ? "person" : "people"}
                        {r.work_arrangement?.length ? ` · ${r.work_arrangement.join(", ")}` : ""}
                      </p>
                      <p className="text-xs text-moss/60 mt-0.5 line-clamp-1">{r.role_description}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-moss/40 font-mono hidden sm:block">{timeAgo(r.created_at)}</span>
                      <ChevronRight size={14} className="text-moss/30" />
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
