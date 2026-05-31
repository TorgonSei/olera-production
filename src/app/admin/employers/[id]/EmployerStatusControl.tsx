"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";

const STATUSES = [
  { value: "new_request",           label: "New request" },
  { value: "reviewing",             label: "Reviewing" },
  { value: "can_support",           label: "Can support" },
  { value: "cannot_support",        label: "Cannot support" },
  { value: "need_more_info",        label: "Need more info" },
  { value: "shortlist_in_progress", label: "Shortlist in progress" },
  { value: "shortlist_sent",        label: "Shortlist sent" },
  { value: "interview_stage",       label: "Interview stage" },
  { value: "offer_stage",           label: "Offer stage" },
  { value: "hired",                 label: "Hired" },
  { value: "closed",                label: "Closed" },
];

export function EmployerStatusControl({ requestId, currentStatus }: { requestId: string; currentStatus: string }) {
  const router  = useRouter();
  const [status, setStatus]   = useState(currentStatus);
  const [saving, setSaving]   = useState(false);
  const [changed, setChanged] = useState(false);

  const handleChange = (val: string) => { setStatus(val); setChanged(val !== currentStatus); };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`/api/admin/employers/${requestId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setChanged(false);
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <select
          value={status}
          onChange={(e) => handleChange(e.target.value)}
          className="appearance-none pl-3 pr-8 py-1.5 rounded-xl border border-mist bg-white text-sm text-char focus:outline-none focus:ring-2 focus:ring-amber/40 cursor-pointer"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-moss pointer-events-none" />
      </div>
      {changed && (
        <Button variant="primary" size="sm" loading={saving} onClick={handleSave}>Save</Button>
      )}
    </div>
  );
}
