"use client";

import React, { useState } from "react";
import Link from "next/link";
import { OleraLockupH } from "@/components/brand/Mark";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";
import { ArrowRight, Check, CheckCircle } from "lucide-react";

/* ─── Options ────────────────────────────────────────────────────────────── */
const ROLE_TRACKS = [
  { id: "support",    label: "Customer Support",                     sub: "Support reps, chat agents, helpdesk" },
  { id: "success",    label: "Customer Success / Account Support",   sub: "CSMs, onboarding, renewals" },
  { id: "assistant",  label: "Virtual / Executive Assistant",        sub: "EAs, ops coordinators, project VAs" },
  { id: "operations", label: "Operations / Admin Support",           sub: "Back-office, admin, scheduling" },
];

const WORK_ARRANGEMENTS = ["Full-time", "Part-time", "Contract"];
const LOCATION_TYPES     = ["Remote", "Hybrid", "Onsite"];

function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all",
        selected ? "border-amber bg-amber/10 text-char" : "border-mist bg-white text-moss hover:border-amber/40"
      )}
    >
      {selected && <Check size={13} className="text-amber flex-shrink-0" />}
      {label}
    </button>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default function HirePage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  // Contact
  const [companyName, setCompanyName]   = useState("");
  const [contactName, setContactName]   = useState("");
  const [workEmail, setWorkEmail]       = useState("");
  const [website, setWebsite]           = useState("");

  // Role
  const [track, setTrack]               = useState("");
  const [roleTitle, setRoleTitle]       = useState("");
  const [headcount, setHeadcount]       = useState("1");
  const [arrangements, setArrangements] = useState<string[]>([]);
  const [locations, setLocations]       = useState<string[]>([]);
  const [timezone, setTimezone]         = useState("");
  const [startDate, setStartDate]       = useState("");

  // Details
  const [description, setDescription]   = useState("");
  const [dailyTasks, setDailyTasks]     = useState("");
  const [mustHaves, setMustHaves]       = useState("");
  const [niceToHaves, setNiceToHaves]   = useState("");
  const [salaryRange, setSalaryRange]   = useState("");
  const [dealBreakers, setDealBreakers] = useState("");

  const toggle = (val: string, arr: string[], set: (v: string[]) => void) =>
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const handleSubmit = async () => {
    setError("");
    if (!companyName.trim()) { setError("Company name is required."); return; }
    if (!contactName.trim()) { setError("Contact name is required."); return; }
    if (!workEmail.trim() || !workEmail.includes("@")) { setError("A valid work email is required."); return; }
    if (!track)              { setError("Please select a role track."); return; }
    if (!roleTitle.trim())   { setError("Role title is required."); return; }
    if (!description.trim()) { setError("Please describe the role."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/employer/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name:     companyName.trim(),
          contact_name:     contactName.trim(),
          work_email:       workEmail.trim(),
          company_website:  website.trim() || null,
          role_track:       track,
          role_title:       roleTitle.trim(),
          headcount:        parseInt(headcount) || 1,
          work_arrangement: arrangements,
          location_type:    locations,
          timezone:         timezone.trim() || null,
          start_date:       startDate.trim() || null,
          role_description: description.trim(),
          daily_tasks:      dailyTasks.trim() || null,
          must_haves:       mustHaves.trim() || null,
          nice_to_haves:    niceToHaves.trim() || null,
          salary_range:     salaryRange.trim() || null,
          deal_breakers:    dealBreakers.trim() || null,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Submission failed");
      setSubmitted(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <header className="px-6 py-5 border-b border-mist">
          <OleraLockupH size={26} />
        </header>
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
          <div className="w-full max-w-md">
            <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} className="text-sage" />
            </div>
            <h1 className="font-display font-bold text-3xl text-char mb-4">Request received</h1>
            <p className="text-moss leading-relaxed mb-8">
              Your role request has been received. Olera will review the brief and respond within 24 hours. If we can support the role, we will prepare a small shortlist of candidates for your review.
            </p>
            <Link href="/" className="text-sm text-amber hover:text-terra transition-colors font-medium">
              Back to Olera →
            </Link>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-forest via-amber to-terra" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="px-6 py-5 flex items-center justify-between border-b border-mist">
        <OleraLockupH size={26} />
        <Link href="/" className="text-xs text-moss hover:text-char transition-colors">← Back</Link>
      </header>

      <div className="flex-1 flex flex-col items-center px-4 py-10 pb-24 sm:pb-12">
        <div className="w-full max-w-2xl">
          <div className="mb-8">
            <h1 className="font-display font-bold text-3xl text-char mb-2">Submit a hiring request</h1>
            <p className="text-moss">
              Tell us about the role. We'll review the brief and come back to you within 24 hours.
            </p>
          </div>

          <div className="space-y-10">
            {/* Section 1: Contact */}
            <div>
              <p className="text-xs font-mono text-moss/60 uppercase tracking-widest mb-4">Your details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Company name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                <Input label="Your name" value={contactName} onChange={(e) => setContactName(e.target.value)} required />
                <Input label="Work email" type="email" value={workEmail} onChange={(e) => setWorkEmail(e.target.value)} required />
                <Input label="Company website" type="url" placeholder="https://..." value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>
            </div>

            {/* Section 2: Role type */}
            <div>
              <p className="text-xs font-mono text-moss/60 uppercase tracking-widest mb-4">Role type <span className="text-terra normal-case font-sans">*</span></p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ROLE_TRACKS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTrack(t.id)}
                    className={cn(
                      "text-left px-4 py-3 rounded-xl border-2 transition-all",
                      track === t.id ? "border-amber bg-amber/8" : "border-mist bg-white hover:border-amber/40"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-4 h-4 rounded-full flex-shrink-0 border-2 transition-colors",
                        track === t.id ? "border-amber bg-amber" : "border-mist"
                      )} />
                      <div>
                        <div className="text-sm font-medium text-char">{t.label}</div>
                        <div className="text-xs text-moss">{t.sub}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 3: Role details */}
            <div>
              <p className="text-xs font-mono text-moss/60 uppercase tracking-widest mb-4">Role details</p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Role title" placeholder="e.g. Customer Support Specialist" value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} required />
                  <Input label="Number of people needed" type="number" min="1" value={headcount} onChange={(e) => setHeadcount(e.target.value)} />
                </div>

                <div>
                  <p className="text-sm font-medium text-char mb-2">Work arrangement</p>
                  <div className="flex flex-wrap gap-2">
                    {WORK_ARRANGEMENTS.map((a) => (
                      <Chip key={a} label={a} selected={arrangements.includes(a)} onClick={() => toggle(a, arrangements, setArrangements)} />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-char mb-2">Location</p>
                  <div className="flex flex-wrap gap-2">
                    {LOCATION_TYPES.map((l) => (
                      <Chip key={l} label={l} selected={locations.includes(l)} onClick={() => toggle(l, locations, setLocations)} />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Timezone / working hours" placeholder="e.g. UTC+1, 9am–5pm" value={timezone} onChange={(e) => setTimezone(e.target.value)} />
                  <Input label="Expected start date" placeholder="e.g. ASAP, Q3 2025" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Section 4: Role description */}
            <div>
              <p className="text-xs font-mono text-moss/60 uppercase tracking-widest mb-4">About the role</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-char mb-1.5">
                    Role description <span className="text-terra">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Give us an overview of the role, the team, and what success looks like..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-mist bg-white text-char placeholder:text-moss/40 text-sm focus:outline-none focus:border-amber/60 focus:ring-2 focus:ring-amber/10 resize-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-char mb-1.5">
                    What will this person actually do day-to-day?
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Handle inbound support tickets via Zendesk, run weekly check-in calls with clients, maintain account records in HubSpot..."
                    value={dailyTasks}
                    onChange={(e) => setDailyTasks(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-mist bg-white text-char placeholder:text-moss/40 text-sm focus:outline-none focus:border-amber/60 focus:ring-2 focus:ring-amber/10 resize-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Section 5: Requirements */}
            <div>
              <p className="text-xs font-mono text-moss/60 uppercase tracking-widest mb-4">Requirements</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-char mb-1.5">Must-haves</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. 2+ years customer support, strong written English, experience with Zendesk..."
                    value={mustHaves}
                    onChange={(e) => setMustHaves(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-mist bg-white text-char placeholder:text-moss/40 text-sm focus:outline-none focus:border-amber/60 focus:ring-2 focus:ring-amber/10 resize-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-char mb-1.5">Nice-to-haves</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. SaaS experience, HubSpot knowledge, German language..."
                    value={niceToHaves}
                    onChange={(e) => setNiceToHaves(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-mist bg-white text-char placeholder:text-moss/40 text-sm focus:outline-none focus:border-amber/60 focus:ring-2 focus:ring-amber/10 resize-none transition"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-char mb-1.5">Salary / rate range <span className="text-moss font-normal">(optional)</span></label>
                    <input
                      type="text"
                      placeholder="e.g. $800–1,200/month"
                      value={salaryRange}
                      onChange={(e) => setSalaryRange(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-mist bg-white text-char placeholder:text-moss/40 text-sm focus:outline-none focus:border-amber/60 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-char mb-1.5">Deal-breakers <span className="text-moss font-normal">(optional)</span></label>
                    <input
                      type="text"
                      placeholder="e.g. Must be available GMT+0..."
                      value={dealBreakers}
                      onChange={(e) => setDealBreakers(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-mist bg-white text-char placeholder:text-moss/40 text-sm focus:outline-none focus:border-amber/60 transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {error && <p className="text-sm text-terra">{error}</p>}

            <Button variant="primary" size="lg" fullWidth loading={loading} onClick={handleSubmit}>
              Submit hiring request
              {!loading && <ArrowRight size={18} />}
            </Button>

            <p className="text-xs text-center text-moss/50">
              Review free · Interview free · You only pay when you hire
            </p>
          </div>
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-forest via-amber to-terra" aria-hidden="true" />
    </div>
  );
}
