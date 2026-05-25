"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import type { ReadinessLevel } from "@/lib/supabase/types";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface Props {
  candidateId: string;
  currentReadiness: ReadinessLevel;
}

export function AdminActionButtons({ candidateId, currentReadiness }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const update = async (readiness: ReadinessLevel, status?: string) => {
    setLoading(readiness);
    try {
      await fetch(`/api/admin/candidates/${candidateId}/readiness`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readiness, status }),
      });
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  if (currentReadiness === "ready") {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-sage font-medium flex items-center gap-1.5">
          <CheckCircle size={14} />
          Active in pool
        </span>
        <Button
          variant="ghost"
          size="sm"
          loading={loading === "developing"}
          onClick={() => update("developing", "review_pending")}
        >
          Deactivate
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button
        variant="primary"
        size="sm"
        loading={loading === "ready"}
        onClick={() => update("ready", "active")}
      >
        <CheckCircle size={14} />
        Approve & activate
      </Button>
      <Button
        variant="outline"
        size="sm"
        loading={loading === "near_ready"}
        onClick={() => update("near_ready")}
      >
        <Clock size={14} />
        Mark near-ready
      </Button>
      <Button
        variant="ghost"
        size="sm"
        loading={loading === "developing"}
        onClick={() => update("developing")}
      >
        <XCircle size={14} className="text-terra" />
        Developing
      </Button>
    </div>
  );
}
