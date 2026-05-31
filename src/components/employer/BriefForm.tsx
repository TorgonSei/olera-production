"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowRight, CheckCircle, AlertCircle } from "lucide-react";

type FormState = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-mist bg-white text-char placeholder:text-moss/40 focus:outline-none focus:border-amber transition-colors text-sm";

export function BriefForm() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [company, setCompany] = useState("");
  const [track, setTrack] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim() || !description.trim()) return;

    setState("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/employer/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, track, description, email }),
      });

      if (res.ok) {
        setState("success");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setState("error");
      }
    } catch {
      setErrorMsg("Could not reach the server. Please email us at hello@olera.co");
      setState("error");
    }
  }

  /* ── Success state ────────────────────────────────────────────────────── */
  if (state === "success") {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-5">
          <CheckCircle size={48} className="text-amber" strokeWidth={1.5} />
        </div>
        <h3 className="font-display font-bold text-2xl text-char mb-3">
          Brief received.
        </h3>
        <p className="text-moss leading-relaxed max-w-sm mx-auto">
          We will review it and get back to you within 24 hours. Check your
          inbox — we just sent a confirmation to{" "}
          <span className="text-char font-medium">{email}</span>.
        </p>
      </div>
    );
  }

  /* ── Form ─────────────────────────────────────────────────────────────── */
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-moss/70 mb-1.5">
            Company name
          </label>
          <input
            type="text"
            placeholder="Acme Corp"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-moss/70 mb-1.5">
            Role track
          </label>
          <select
            value={track}
            onChange={(e) => setTrack(e.target.value)}
            className={`${inputClass} appearance-none`}
          >
            <option value="">Select a track</option>
            <option value="support">Customer Support</option>
            <option value="success">Customer Success</option>
            <option value="assistant">Virtual / Executive Assistant</option>
            <option value="unsure">Not sure yet</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-moss/70 mb-1.5">
          What will this person actually be doing?{" "}
          <span className="text-amber">*</span>
        </label>
        <textarea
          required
          rows={4}
          placeholder="E.g. handling inbound support tickets by email and chat, updating Zendesk, escalating technical issues, and sending weekly customer follow-up notes. We are a team of 8 across Europe."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${inputClass} resize-none leading-relaxed`}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-moss/70 mb-1.5">
          Your email <span className="text-amber">*</span>
        </label>
        <input
          type="email"
          required
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </div>

      {state === "error" && (
        <div className="flex items-start gap-3 bg-terra/10 border border-terra/20 rounded-xl px-4 py-3">
          <AlertCircle size={16} className="text-terra flex-shrink-0 mt-0.5" />
          <p className="text-sm text-terra">{errorMsg}</p>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={state === "submitting"}
        className="mt-2"
      >
        {state === "submitting" ? "Sending…" : "Send the role"}
        {state !== "submitting" && <ArrowRight size={18} />}
      </Button>

      <p className="text-center text-xs text-moss/50 font-mono pt-1">
        No commitment. We confirm receipt and respond within 24 hours.
      </p>
    </form>
  );
}
