"use client";

import React from "react";
import Link from "next/link";
import type { CandidateRow } from "@/lib/supabase/types";
import { MapPin, Briefcase, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  registered:           { label: "Registered",          cls: "bg-mist text-moss" },
  cv_uploaded:          { label: "CV uploaded",          cls: "bg-amber/10 text-amber" },
  profile_parsed:       { label: "CV parsed",            cls: "bg-amber/10 text-amber" },
  gaps_filled:          { label: "Submitted",            cls: "bg-amber/15 text-amber font-semibold" },
  submitted:            { label: "Submitted",            cls: "bg-amber/15 text-amber font-semibold" },
  needs_review:         { label: "Needs review",         cls: "bg-amber/10 text-amber" },
  keep_in_pool:         { label: "In pool",              cls: "bg-mist text-moss" },
  screening_needed:     { label: "Screening needed",     cls: "bg-amber/20 text-amber font-semibold" },
  screening_scheduled:  { label: "Call scheduled",       cls: "bg-amber/10 text-amber" },
  screened:             { label: "Screened",             cls: "bg-sage/10 text-sage" },
  assessed:             { label: "Assessed",             cls: "bg-sage/15 text-sage font-semibold" },
  employer_ready:       { label: "Employer ready",       cls: "bg-sage/20 text-sage font-semibold" },
  shortlisted:          { label: "Shortlisted",          cls: "bg-forest/10 text-forest font-semibold" },
  interview_requested:  { label: "Interview",            cls: "bg-forest/15 text-forest font-semibold" },
  placed:               { label: "Placed",               cls: "bg-sage/30 text-sage font-semibold" },
  rejected:             { label: "Rejected",             cls: "bg-mist text-moss/60" },
  archived:             { label: "Archived",             cls: "bg-mist text-moss/50" },
  // legacy
  assessment_invited:   { label: "Assessment sent",      cls: "bg-mist text-moss" },
  assessment_complete:  { label: "Assessment done",      cls: "bg-amber/15 text-amber" },
  interview_invited:    { label: "Interview sent",       cls: "bg-mist text-moss" },
  active:               { label: "Active",               cls: "bg-sage/10 text-sage font-semibold" },
  withdrawn:            { label: "Withdrawn",            cls: "bg-mist text-moss/60" },
};

const TRACK_COLORS: Record<string, string> = {
  support:    "bg-amber/10 text-amber",
  success:    "bg-sage/10 text-sage",
  assistant:  "bg-terra/10 text-terra",
  operations: "bg-forest/10 text-forest",
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
  const isRejected  = c.status === "rejected" || c.status === "archived" || c.status === "withdrawn";
  const statusBadge = STATUS_BADGE[c.status] ?? { label: c.status, cls: "bg-mist text-moss" };
  const interests   = (c.role_interests as string[] | null) ?? [];

  return (
    <div className={cn(
      "flex items-start gap-3 px-4 py-3.5 hover:bg-cream/50 transition-colors border-b border-mist last:border-0",
      isRejected && "opacity-40"
    )}>
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-forest/8 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-forest">
        {(c.full_name as string)?.[0]?.toUpperCase() ?? "?"}
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={`/admin/candidates/${c.id}`}
            className="font-semibold text-sm text-char hover:text-amber transition-colors"
          >
            {c.full_name || "Unnamed"}
          </Link>
          <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-mono capitalize", TRACK_COLORS[c.track] ?? "bg-mist text-moss")}>
            {c.track}
          </span>
          <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-mono", statusBadge.cls)}>
            {statusBadge.label}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-moss mt-0.5">
          {(c.location_city as string | null) && (
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

        {(c.summary as string | null) && (
          <p className="text-xs text-moss/70 mt-1 leading-relaxed line-clamp-1 max-w-xl">
            {c.summary}
          </p>
        )}

        {interests.length > 0 && (
          <div className="flex items-center gap-1 mt-1.5 flex-wrap">
            {interests.slice(0, 3).map((i: string) => (
              <span key={i} className="text-[10px] px-1.5 py-0.5 bg-amber/8 rounded text-amber font-mono capitalize">
                {i === "open" ? "open" : i}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Right: time + open */}
      <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
        <span className="text-xs text-moss/40 font-mono hidden md:block w-14 text-right">
          {timeAgo(c.created_at)}
        </span>
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
