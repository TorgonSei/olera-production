"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import type { CandidateRow, TrackType } from "@/lib/supabase/types";
import { CheckCircle, XCircle, ChevronRight, Wrench } from "lucide-react";
import { cn } from "@/lib/cn";

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

export function CandidateListRow({ c }: { c: CandidateRow }) {
  const router = useRouter();
  const [discarding, setDiscarding] = useState(false);
  const [discarded, setDiscarded] = useState(false);

  const isDiscarded = discarded || c.status === "withdrawn";

  const handleDiscard = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Discard ${c.full_name || "this candidate"}?`)) return;
    setDiscarding(true);
    try {
      await fetch(`/api/admin/candidates/${c.id}/discard`, { method: "POST" });
      setDiscarded(true);
      router.refresh();
    } catch {
      // ignore
    } finally {
      setDiscarding(false);
    }
  };

  const tools = (c.tools as string[] | null) ?? [];

  return (
    <div className={cn(
      "flex items-start gap-3 px-4 py-3.5 hover:bg-cream/60 transition-colors group border-b border-mist last:border-0",
      isDiscarded && "opacity-40"
    )}>
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-xs font-semibold text-forest">
          {c.full_name?.[0]?.toUpperCase() ?? "?"}
        </span>
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={`/admin/candidates/${c.id}`}
            className="font-semibold text-sm text-char hover:text-amber transition-colors"
          >
            {c.full_name || "—"}
          </Link>
          <Badge variant={TRACK_BADGE_VARIANT[c.track]}>
            {TRACK_LABELS[c.track]}
          </Badge>
          {c.status === "cv_uploaded" || c.status === "gaps_filled" ? (
            <Badge variant="amber" dot>CV uploaded</Badge>
          ) : c.status === "registered" ? (
            <Badge variant="sand" dot>No CV yet</Badge>
          ) : c.status === "withdrawn" ? (
            <Badge variant="moss">Discarded</Badge>
          ) : null}
        </div>

        {/* Location + experience */}
        <div className="text-xs text-moss mt-0.5">
          {[
            c.location_city ? `${c.location_city}` : null,
            c.years_experience ? `${c.years_experience}y exp` : null,
          ].filter(Boolean).join(" · ")}
        </div>

        {/* AI summary snippet */}
        {c.summary && (
          <p className="text-xs text-moss/70 mt-1 leading-relaxed line-clamp-2 max-w-xl">
            {c.summary}
          </p>
        )}

        {/* Tools */}
        {tools.length > 0 && (
          <div className="flex items-center gap-1 mt-1.5 flex-wrap">
            <Wrench size={10} className="text-moss/40" />
            {tools.slice(0, 4).map((t) => (
              <span key={t} className="text-[10px] px-1.5 py-0.5 bg-mist rounded text-moss font-mono">
                {t}
              </span>
            ))}
            {tools.length > 4 && (
              <span className="text-[10px] text-moss/50">+{tools.length - 4}</span>
            )}
          </div>
        )}
      </div>

      {/* Right: time + actions */}
      <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
        <span className="text-xs text-moss/40 font-mono hidden md:block w-14 text-right">
          {timeAgo(c.created_at)}
        </span>

        {!isDiscarded && (
          <button
            onClick={handleDiscard}
            disabled={discarding}
            className="p-1.5 rounded-lg text-moss/40 hover:text-terra hover:bg-terra/10 transition-colors"
            title="Discard"
          >
            <XCircle size={15} />
          </button>
        )}

        <Link
          href={`/admin/candidates/${c.id}`}
          className="p-1.5 rounded-lg text-moss/40 hover:text-amber hover:bg-amber/10 transition-colors"
          title="Review"
        >
          <ChevronRight size={15} />
        </Link>
      </div>
    </div>
  );
}
