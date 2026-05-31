"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CandidateRow, TrackType } from "@/lib/supabase/types";
import { XCircle, ChevronRight, Send, Star, Wrench, MapPin, Briefcase } from "lucide-react";
import { cn } from "@/lib/cn";

const TRACK_COLORS: Record<TrackType, string> = {
  support:   "bg-amber/10 text-amber",
  success:   "bg-sage/10 text-sage",
  assistant: "bg-terra/10 text-terra",
};

const TRACK_LABELS: Record<TrackType, string> = {
  support:   "Support",
  success:   "Success",
  assistant: "Assistant",
};

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  registered:          { label: "No CV",              cls: "bg-mist text-moss" },
  cv_uploaded:         { label: "CV uploaded",        cls: "bg-amber/10 text-amber" },
  profile_parsed:      { label: "CV parsed",          cls: "bg-amber/10 text-amber" },
  gaps_filled:         { label: "Profile complete",   cls: "bg-amber/15 text-amber font-semibold" },
  assessment_invited:  { label: "Assessment sent",    cls: "bg-mist text-moss" },
  assessment_complete: { label: "Assessment done",    cls: "bg-amber/15 text-amber font-semibold" },
  interview_invited:   { label: "Interview sent",     cls: "bg-mist text-moss" },
  assessed:            { label: "Assessed",           cls: "bg-forest/10 text-forest font-semibold" },
  review_pending:      { label: "Pending review",     cls: "bg-mist text-moss" },
  active:              { label: "Active",             cls: "bg-sage/10 text-sage font-semibold" },
  placed:              { label: "Placed",             cls: "bg-sage/20 text-sage font-semibold" },
  withdrawn:           { label: "Discarded",          cls: "bg-mist text-moss/60" },
};

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function CandidateListRow({ c }: { c: CandidateRow }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const call = async (key: string, url: string, method = "POST") => {
    if (!confirm(`${key} for ${c.full_name || "this candidate"}?`)) return;
    setLoading(key);
    try {
      await fetch(url, { method });
      setDone(key);
      router.refresh();
    } catch {
      // ignore
    } finally {
      setLoading(null);
    }
  };

  const isDiscarded = c.status === "withdrawn";
  const tools = (c.tools as string[] | null) ?? [];
  const statusBadge = STATUS_BADGE[c.status] ?? { label: c.status, cls: "bg-mist text-moss" };

  return (
    <div className={cn(
      "flex items-start gap-3 px-4 py-3.5 hover:bg-cream/50 transition-colors border-b border-mist last:border-0",
      isDiscarded && "opacity-40"
    )}>
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-forest/8 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-forest">
        {c.full_name?.[0]?.toUpperCase() ?? "?"}
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        {/* Name + badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={`/admin/candidates/${c.id}`}
            className="font-semibold text-sm text-char hover:text-amber transition-colors"
          >
            {c.full_name || "Unnamed"}
          </Link>
          <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-mono", TRACK_COLORS[c.track])}>
            {TRACK_LABELS[c.track]}
          </span>
          <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-mono", statusBadge.cls)}>
            {statusBadge.label}
          </span>
          {c.assessment_score !== null && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-forest/8 text-forest font-mono">
              {c.assessment_score}/100 · {c.assessment_tier}
            </span>
          )}
        </div>

        {/* Location + experience */}
        <div className="flex items-center gap-3 text-xs text-moss mt-0.5">
          {c.location_city && (
            <span className="flex items-center gap-1">
              <MapPin size={9} />
              {c.location_city}
            </span>
          )}
          {c.years_experience !== null && (
            <span className="flex items-center gap-1">
              <Briefcase size={9} />
              {c.years_experience}y
            </span>
          )}
        </div>

        {/* AI summary */}
        {c.summary && (
          <p className="text-xs text-moss/70 mt-1 leading-relaxed line-clamp-2 max-w-xl">
            {c.summary}
          </p>
        )}

        {/* Tools */}
        {tools.length > 0 && (
          <div className="flex items-center gap-1 mt-1.5 flex-wrap">
            <Wrench size={9} className="text-moss/40" />
            {tools.slice(0, 5).map((t) => (
              <span key={t} className="text-[10px] px-1.5 py-0.5 bg-mist rounded text-moss font-mono">
                {t}
              </span>
            ))}
            {tools.length > 5 && (
              <span className="text-[10px] text-moss/50">+{tools.length - 5}</span>
            )}
          </div>
        )}
      </div>

      {/* Right: time + inline actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
        <span className="text-xs text-moss/40 font-mono hidden md:block w-14 text-right">
          {timeAgo(c.created_at)}
        </span>

        {/* Stage-specific quick action */}
        {done ? (
          <span className="text-[10px] font-mono text-sage px-2">Sent</span>
        ) : c.status === "gaps_filled" ? (
          <button
            disabled={loading === "invite-assessment"}
            onClick={() => call("invite-assessment", `/api/admin/candidates/${c.id}/invite-assessment`)}
            className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-lg bg-amber/10 text-amber hover:bg-amber/20 transition-colors disabled:opacity-50"
            title="Invite to assessment"
          >
            <Send size={10} />
            {loading === "invite-assessment" ? "…" : "Invite"}
          </button>
        ) : c.status === "assessment_complete" ? (
          <button
            disabled={loading === "invite-interview"}
            onClick={() => call("invite-interview", `/api/admin/candidates/${c.id}/invite-interview`)}
            className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-lg bg-amber/10 text-amber hover:bg-amber/20 transition-colors disabled:opacity-50"
            title="Invite to interview"
          >
            <Send size={10} />
            {loading === "invite-interview" ? "…" : "Interview"}
          </button>
        ) : c.status === "assessed" ? (
          <Link
            href={`/admin/candidates/${c.id}`}
            className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-lg bg-forest/8 text-forest hover:bg-forest/15 transition-colors"
            title="Review and activate"
          >
            <Star size={10} />
            Decide
          </Link>
        ) : null}

        {/* Discard */}
        {!isDiscarded && (
          <button
            onClick={() => call("discard", `/api/admin/candidates/${c.id}/discard`)}
            disabled={loading === "discard"}
            className="p-1.5 rounded-lg text-moss/30 hover:text-terra hover:bg-terra/10 transition-colors"
            title="Discard"
          >
            <XCircle size={14} />
          </button>
        )}

        {/* Open */}
        <Link
          href={`/admin/candidates/${c.id}`}
          className="p-1.5 rounded-lg text-moss/30 hover:text-amber hover:bg-amber/10 transition-colors"
        >
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
