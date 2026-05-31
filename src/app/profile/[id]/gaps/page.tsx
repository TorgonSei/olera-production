"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { OleraLockupH, OleraCompleteness, COLORS } from "@/components/brand/Mark";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";
import { ArrowRight, Check } from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────────── */
type ContractPref = "full_time" | "part_time" | "contract";
type EnglishLevel = "native" | "fluent" | "professional" | "conversational";

interface GapForm {
  full_name: string;
  target_role: string;
  english_level: EnglishLevel | "";
  salary_min_usd: string;
  salary_max_usd: string;
  availability_weeks: string;
  contract_pref: ContractPref | "";
}

/* ─── Options ────────────────────────────────────────────────────────────── */
const ENGLISH_LEVELS: { value: EnglishLevel; label: string; sub: string }[] = [
  { value: "native",         label: "Native / Mother tongue",    sub: "English is my first language" },
  { value: "fluent",         label: "Fluent",                     sub: "Fully comfortable, near-native" },
  { value: "professional",   label: "Professional working",       sub: "Can handle complex business communication" },
  { value: "conversational", label: "Conversational",             sub: "Can handle day-to-day conversation" },
];

const CONTRACT_PREFS: { value: ContractPref; label: string; sub: string }[] = [
  { value: "full_time", label: "Full-time",   sub: "40 hrs / week, permanent" },
  { value: "part_time", label: "Part-time",   sub: "Less than 30 hrs / week" },
  { value: "contract",  label: "Contract",    sub: "Fixed-term or project-based" },
];

const AVAILABILITY_OPTIONS = [
  { value: "0",  label: "Immediately" },
  { value: "2",  label: "2 weeks" },
  { value: "4",  label: "4 weeks" },
  { value: "8",  label: "8 weeks" },
  { value: "12", label: "3 months+" },
];

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default function GapsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [completeness, setCompleteness] = useState(25);

  const [form, setForm] = useState<GapForm>({
    full_name: "",
    target_role: "",
    english_level: "",
    salary_min_usd: "",
    salary_max_usd: "",
    availability_weeks: "",
    contract_pref: "",
  });

  // Calculate completeness as fields fill in
  useEffect(() => {
    const fields = Object.values(form);
    const filled = fields.filter((v) => v !== "").length;
    setCompleteness(25 + Math.round((filled / fields.length) * 35)); // 25→60
  }, [form]);

  const set = (key: keyof GapForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    setError("");
    const required: (keyof GapForm)[] = [
      "full_name", "english_level", "salary_min_usd", "salary_max_usd",
      "availability_weeks", "contract_pref",
    ];
    const missing = required.filter((k) => !form[k]);
    if (missing.length > 0) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/candidate/${id}/gaps`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.full_name,
          gap_target_role: form.target_role || null,
          gap_english_level: form.english_level,
          gap_salary_min_usd: Number(form.salary_min_usd),
          gap_salary_max_usd: Number(form.salary_max_usd),
          gap_availability_weeks: Number(form.availability_weeks),
          gap_contract_pref: form.contract_pref,
          status: "gaps_filled",
          profile_completeness: completeness,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
      router.push(`/dashboard`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-mist bg-white">
        <OleraLockupH size={26} />
        <OleraCompleteness value={completeness} size={40} />
      </header>

      <div className="max-w-xl mx-auto px-4 py-10 pb-24 sm:pb-12">
        {/* Title */}
        <div className="mb-10">
          <h1 className="font-display font-bold text-3xl text-char mb-2">
            A few quick details
          </h1>
          <p className="text-moss">
            We extracted what we could from your CV. Fill in what&apos;s missing. Takes 2 minutes.
          </p>
        </div>

        <div className="space-y-8">
          {/* Full name */}
          <section>
            <Input
              label="Full name"
              placeholder="Your name as it appears professionally"
              value={form.full_name}
              onChange={(e) => set("full_name", e.target.value)}
              required
            />
          </section>

          {/* Target role */}
          <section>
            <Input
              label="Target role title"
              placeholder="e.g. Senior Customer Success Manager"
              value={form.target_role}
              onChange={(e) => set("target_role", e.target.value)}
              hint="Optional. Helps us match you more precisely."
            />
          </section>

          {/* English level */}
          <section>
            <label className="text-sm font-medium text-char block mb-2">
              English level <span className="text-terra ml-1" aria-hidden>*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ENGLISH_LEVELS.map((lvl) => (
                <button
                  key={lvl.value}
                  onClick={() => set("english_level", lvl.value)}
                  className={cn(
                    "text-left p-3 rounded-xl border-2 transition-all",
                    "hover:border-amber",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/40",
                    form.english_level === lvl.value
                      ? "border-amber bg-amber/5"
                      : "border-mist bg-white"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-sm text-char">{lvl.label}</div>
                      <div className="text-xs text-moss mt-0.5">{lvl.sub}</div>
                    </div>
                    {form.english_level === lvl.value && (
                      <Check size={14} className="text-sage flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Salary range */}
          <section>
            <label className="text-sm font-medium text-char block mb-2">
              Salary expectation (USD / month){" "}
              <span className="text-terra ml-1" aria-hidden>*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Min, e.g. 1200"
                type="number"
                min={0}
                value={form.salary_min_usd}
                onChange={(e) => set("salary_min_usd", e.target.value)}
                prefix={<span className="text-xs font-mono">$</span>}
                label=""
              />
              <Input
                placeholder="Max, e.g. 2000"
                type="number"
                min={0}
                value={form.salary_max_usd}
                onChange={(e) => set("salary_max_usd", e.target.value)}
                prefix={<span className="text-xs font-mono">$</span>}
                label=""
              />
            </div>
            <p className="text-xs text-moss mt-1.5">
              Only shared with employers after you approve. We match within ±15% of your range.
            </p>
          </section>

          {/* Availability */}
          <section>
            <label className="text-sm font-medium text-char block mb-2">
              Available to start <span className="text-terra ml-1" aria-hidden>*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABILITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => set("availability_weeks", opt.value)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium border-2 transition-all",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/40",
                    form.availability_weeks === opt.value
                      ? "border-amber bg-amber text-cream"
                      : "border-mist bg-white text-char hover:border-amber/50"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

          {/* Contract preference */}
          <section>
            <label className="text-sm font-medium text-char block mb-2">
              Contract preference <span className="text-terra ml-1" aria-hidden>*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {CONTRACT_PREFS.map((pref) => (
                <button
                  key={pref.value}
                  onClick={() => set("contract_pref", pref.value)}
                  className={cn(
                    "text-left p-3 rounded-xl border-2 transition-all",
                    "hover:border-amber",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/40",
                    form.contract_pref === pref.value
                      ? "border-amber bg-amber/5"
                      : "border-mist bg-white"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-sm text-char">{pref.label}</div>
                      <div className="text-xs text-moss mt-0.5">{pref.sub}</div>
                    </div>
                    {form.contract_pref === pref.value && (
                      <Check size={14} className="text-sage flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Error */}
          {error && (
            <p className="text-sm text-terra bg-terra/5 border border-terra/20 rounded-xl p-3">
              {error}
            </p>
          )}

          {/* Submit */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            onClick={handleSubmit}
          >
            Submit profile
            <ArrowRight size={18} />
          </Button>

          <p className="text-xs text-center text-moss/60">
            Olera will review your profile and be in touch if there's a match.
          </p>
        </div>
      </div>
    </div>
  );
}
