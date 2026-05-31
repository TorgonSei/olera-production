"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CheckCircle, XCircle, Clock, Send, Star } from "lucide-react";

interface Props {
  candidateId: string;
  currentStatus: string;
  currentReadiness: string;
}

export function AdminActionButtons({ candidateId, currentStatus, currentReadiness }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [showAssessForm, setShowAssessForm] = useState(false);
  const [assessScore, setAssessScore] = useState("");
  const [assessTier, setAssessTier] = useState<"pass" | "borderline" | "fail">("borderline");

  const call = async (key: string, endpoint: string, method: string, body?: object) => {
    setLoading(key);
    try {
      const res = await fetch(`/api/admin/candidates/${candidateId}/${endpoint}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Request failed");
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  // ── Active in pool ──────────────────────────────────────────────────────
  if (currentReadiness === "ready" || currentReadiness === "remote_ready") {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-sage font-medium flex items-center gap-1.5">
          <CheckCircle size={14} />
          Active in pool
        </span>
        <Button
          variant="ghost"
          size="sm"
          loading={loading === "deactivate"}
          onClick={() => call("deactivate", "readiness", "PATCH", { readiness: "developing", status: "review_pending" })}
        >
          Deactivate
        </Button>
      </div>
    );
  }

  // ── Assessment invited — awaiting candidate ─────────────────────────────
  if (currentStatus === "assessment_invited") {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-amber font-medium flex items-center gap-1.5">
          <Clock size={14} />
          Assessment invited
        </span>
        <Button
          variant="ghost"
          size="sm"
          loading={loading === "discard"}
          onClick={() => call("discard", "discard", "POST")}
        >
          <XCircle size={14} className="text-terra" />
          Discard
        </Button>
      </div>
    );
  }

  // ── Assessment complete — invite to interview ────────────────────────────
  if (currentStatus === "assessment_complete") {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="primary"
          size="sm"
          loading={loading === "invite-interview"}
          onClick={() => call("invite-interview", "invite-interview", "POST")}
        >
          <Send size={14} />
          Invite to interview
        </Button>
        <Button
          variant="ghost"
          size="sm"
          loading={loading === "discard"}
          onClick={() => call("discard", "discard", "POST")}
        >
          <XCircle size={14} className="text-terra" />
          Discard
        </Button>
      </div>
    );
  }

  // ── Interview invited — mark as assessed ────────────────────────────────
  if (currentStatus === "interview_invited") {
    if (showAssessForm) {
      return (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={100}
              placeholder="Score 0–100"
              value={assessScore}
              onChange={(e) => setAssessScore(e.target.value)}
              className="border border-mist rounded-xl px-3 py-1.5 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-amber/40 bg-white"
            />
            <select
              value={assessTier}
              onChange={(e) => setAssessTier(e.target.value as "pass" | "borderline" | "fail")}
              className="border border-mist rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber/40 bg-white"
            >
              <option value="pass">Pass</option>
              <option value="borderline">Borderline</option>
              <option value="fail">Fail</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              loading={loading === "assess"}
              onClick={() => call("assess", "assess", "PATCH", {
                assessment_score: Number(assessScore),
                assessment_tier: assessTier,
              })}
            >
              <Star size={14} />
              Confirm
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowAssessForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-amber font-medium flex items-center gap-1.5">
          <Clock size={14} />
          Interview sent
        </span>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowAssessForm(true)}
        >
          <Star size={14} />
          Mark as assessed
        </Button>
        <Button
          variant="ghost"
          size="sm"
          loading={loading === "discard"}
          onClick={() => call("discard", "discard", "POST")}
        >
          <XCircle size={14} className="text-terra" />
          Discard
        </Button>
      </div>
    );
  }

  // ── Assessed — activate or adjust ──────────────────────────────────────
  if (currentStatus === "assessed") {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="primary"
          size="sm"
          loading={loading === "activate"}
          onClick={() => call("activate", "readiness", "PATCH", { readiness: "ready", status: "active" })}
        >
          <CheckCircle size={14} />
          Activate
        </Button>
        <Button
          variant="outline"
          size="sm"
          loading={loading === "near_ready"}
          onClick={() => call("near_ready", "readiness", "PATCH", { readiness: "near_ready" })}
        >
          Near ready
        </Button>
        <Button
          variant="ghost"
          size="sm"
          loading={loading === "discard"}
          onClick={() => call("discard", "discard", "POST")}
        >
          <XCircle size={14} className="text-terra" />
          Discard
        </Button>
      </div>
    );
  }

  // ── Default: profile submitted, waiting for admin review ───────────────
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="primary"
        size="sm"
        loading={loading === "invite-assessment"}
        onClick={() => call("invite-assessment", "invite-assessment", "POST")}
      >
        <Send size={14} />
        Invite to assessment
      </Button>
      <Button
        variant="ghost"
        size="sm"
        loading={loading === "discard"}
        onClick={() => call("discard", "discard", "POST")}
      >
        <XCircle size={14} className="text-terra" />
        Discard
      </Button>
    </div>
  );
}
