"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ChevronDown } from "lucide-react";

const ADMIN_STATUSES: { value: string; label: string; group: string }[] = [
  { value: "needs_review",        label: "Needs review",         group: "Intake" },
  { value: "keep_in_pool",        label: "Keep in pool",         group: "Intake" },
  { value: "rejected",            label: "Rejected",             group: "Intake" },
  { value: "screening_needed",    label: "Screening needed",     group: "Screening" },
  { value: "screening_scheduled", label: "Screening scheduled",  group: "Screening" },
  { value: "screened",            label: "Screened",             group: "Screening" },
  { value: "assessed",            label: "Assessed",             group: "Advanced" },
  { value: "employer_ready",      label: "Employer ready",       group: "Advanced" },
  { value: "shortlisted",         label: "Shortlisted",          group: "Advanced" },
  { value: "interview_requested", label: "Interview requested",  group: "Advanced" },
  { value: "placed",              label: "Placed",               group: "Advanced" },
  { value: "archived",            label: "Archived",             group: "Advanced" },
];

interface Props {
  candidateId: string;
  currentStatus: string;
  currentReadiness: string;
}

export function AdminActionButtons({ candidateId, currentStatus }: Props) {
  const router  = useRouter();
  const [status, setStatus]   = useState(currentStatus);
  const [saving, setSaving]   = useState(false);
  const [changed, setChanged] = useState(false);

  const handleChange = (val: string) => {
    setStatus(val);
    setChanged(val !== currentStatus);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/candidates/${candidateId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed");
      setChanged(false);
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="relative">
        <select
          value={status}
          onChange={(e) => handleChange(e.target.value)}
          className="appearance-none pl-3 pr-8 py-1.5 rounded-xl border border-mist bg-white text-sm text-char focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber/60 cursor-pointer"
        >
          {/* Current status if not in list */}
          {!ADMIN_STATUSES.find((s) => s.value === currentStatus) && (
            <option value={currentStatus}>{currentStatus.replace(/_/g, " ")}</option>
          )}
          {/* Grouped options */}
          {["Intake", "Screening", "Advanced"].map((group) => (
            <optgroup key={group} label={group}>
              {ADMIN_STATUSES.filter((s) => s.group === group).map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </optgroup>
          ))}
        </select>
        <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-moss pointer-events-none" />
      </div>

      {changed && (
        <Button variant="primary" size="sm" loading={saving} onClick={handleSave}>
          Save
        </Button>
      )}
    </div>
  );
}
