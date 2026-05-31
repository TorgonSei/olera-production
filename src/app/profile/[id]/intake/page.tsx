"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { OleraLockupH } from "@/components/brand/Mark";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";
import { ArrowRight, Check } from "lucide-react";

/* ─── Options ────────────────────────────────────────────────────────────── */
const ROLE_INTERESTS = [
  { id: "support",    label: "Customer Support",                       sub: "Support specialist, chat lead, helpdesk" },
  { id: "success",    label: "Customer Success / Account Support",     sub: "CSM, onboarding, renewals, account management" },
  { id: "assistant",  label: "Virtual / Executive Assistant",          sub: "EA, ops coordinator, project VA" },
  { id: "operations", label: "Operations Assistant / Admin Support",   sub: "Back-office, scheduling, admin coordination" },
  { id: "open",       label: "Not sure / Open to guidance",            sub: "Happy to be matched to the right area" },
];

const WORK_PREFERENCES = [
  { id: "full_time",     label: "Full-time" },
  { id: "part_time",     label: "Part-time" },
  { id: "contract",      label: "Contract" },
  { id: "remote",        label: "Remote" },
  { id: "hybrid",        label: "Hybrid" },
  { id: "international", label: "Open to international roles" },
];

/* ─── Multi-select chip ──────────────────────────────────────────────────── */
function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all duration-150",
        selected
          ? "border-amber bg-amber/10 text-char"
          : "border-mist bg-white text-moss hover:border-amber/50 hover:text-char"
      )}
    >
      {selected && <Check size={13} className="text-amber flex-shrink-0" />}
      {label}
    </button>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default function IntakePage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();

  const [phone, setPhone]           = useState("");
  const [interests, setInterests]   = useState<string[]>([]);
  const [workPrefs, setWorkPrefs]   = useState<string[]>([]);
  const [linkedin, setLinkedin]     = useState("");
  const [note, setNote]             = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

  const toggleInterest = (id: string) =>
    setInterests((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const toggleWorkPref = (id: string) =>
    setWorkPrefs((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const handleSubmit = async () => {
    setError("");
    if (!phone.trim())         { setError("Please enter your phone / WhatsApp number."); return; }
    if (interests.length === 0) { setError("Please select at least one area of interest."); return; }
    if (workPrefs.length === 0) { setError("Please select at least one work preference."); return; }

    setLoading(true);
    try {
      const res = await fetch(`/api/candidate/${id}/intake`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone:            phone.trim(),
          role_interests:   interests,
          work_preferences: workPrefs,
          linkedin_url:     linkedin.trim() || null,
          intake_note:      note.trim() || null,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
      router.push(`/profile/${id}/submitted`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="px-6 py-5 flex items-center justify-between border-b border-mist">
        <OleraLockupH size={26} />
        <span className="text-xs text-moss font-mono">Step 2 of 2</span>
      </header>

      <div className="flex-1 flex flex-col items-center px-4 py-10 pb-24 sm:pb-12">
        <div className="w-full max-w-lg">
          <div className="mb-8">
            <h1 className="font-display font-bold text-2xl text-char mb-2">
              A few quick questions
            </h1>
            <p className="text-moss text-sm">
              This takes less than two minutes. We use this to match you to the right roles.
            </p>
          </div>

          <div className="space-y-8">
            {/* Phone */}
            <div>
              <Input
                label="Phone / WhatsApp number"
                type="tel"
                placeholder="+254 700 000 000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            {/* Role interests */}
            <div>
              <p className="text-sm font-semibold text-char mb-1">
                Which type of role interests you? <span className="text-terra">*</span>
              </p>
              <p className="text-xs text-moss mb-3">Select all that apply.</p>
              <div className="space-y-2">
                {ROLE_INTERESTS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleInterest(opt.id)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-150",
                      interests.includes(opt.id)
                        ? "border-amber bg-amber/8 "
                        : "border-mist bg-white hover:border-amber/40"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border-2 transition-colors",
                        interests.includes(opt.id)
                          ? "border-amber bg-amber"
                          : "border-mist"
                      )}>
                        {interests.includes(opt.id) && <Check size={10} className="text-white" />}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-char">{opt.label}</div>
                        <div className="text-xs text-moss mt-0.5">{opt.sub}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Work preferences */}
            <div>
              <p className="text-sm font-semibold text-char mb-1">
                Work preferences <span className="text-terra">*</span>
              </p>
              <p className="text-xs text-moss mb-3">Select all that apply.</p>
              <div className="flex flex-wrap gap-2">
                {WORK_PREFERENCES.map((opt) => (
                  <Chip
                    key={opt.id}
                    label={opt.label}
                    selected={workPrefs.includes(opt.id)}
                    onClick={() => toggleWorkPref(opt.id)}
                  />
                ))}
              </div>
            </div>

            {/* Optional fields */}
            <div className="space-y-4 border-t border-mist pt-6">
              <p className="text-xs font-mono text-moss/60 uppercase tracking-widest">Optional</p>
              <Input
                label="LinkedIn profile URL"
                type="url"
                placeholder="https://linkedin.com/in/yourname"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
              />
              <div>
                <label className="block text-sm font-medium text-char mb-1.5">
                  Anything else we should know?
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. I'm particularly interested in SaaS companies, or I have experience with Zendesk and HubSpot..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-mist bg-white text-char placeholder:text-moss/40 text-sm focus:outline-none focus:border-amber/60 focus:ring-2 focus:ring-amber/10 resize-none transition"
                />
              </div>
            </div>

            {error && <p className="text-sm text-terra">{error}</p>}

            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              onClick={handleSubmit}
            >
              Submit my profile
              {!loading && <ArrowRight size={18} />}
            </Button>
          </div>
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-forest via-amber to-terra" aria-hidden="true" />
    </div>
  );
}
