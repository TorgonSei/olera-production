"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OleraLockupH, COLORS } from "@/components/brand/Mark";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";

/* ─── Track config ──────────────────────────────────────────────────────── */
const TRACKS = [
  {
    id: "support" as const,
    label: "Customer Support",
    icon: "🎧",
    description: "Support specialist, tech support, chat lead",
  },
  {
    id: "success" as const,
    label: "Customer Success",
    icon: "📈",
    description: "CSM, onboarding, renewals, account management",
  },
  {
    id: "assistant" as const,
    label: "Virtual / Executive Assistant",
    icon: "⚡",
    description: "EA, ops coordinator, project VA",
  },
];

type Track = (typeof TRACKS)[number]["id"];
type Step = "track" | "details" | "otp";

export default function JoinPage() {
  return (
    <Suspense>
      <JoinPageInner />
    </Suspense>
  );
}

function JoinPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTrack = (searchParams.get("track") as Track) ?? null;

  const [step, setStep] = useState<Step>(initialTrack ? "details" : "track");
  const [track, setTrack] = useState<Track | null>(initialTrack);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ── Step 1: select track ─────────────────────────────────────────────── */
  const handleTrackSelect = (t: Track) => {
    setTrack(t);
    setStep("details");
  };

  /* ── Step 2: send email OTP ───────────────────────────────────────────── */
  const handleSendOtp = async () => {
    setError("");
    if (!name.trim()) { setError("Please enter your name."); return; }
    if (!email.trim() || !email.includes("@")) { setError("Please enter a valid email address."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), name: name.trim() }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed to send code");
      setStep("otp");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 3: verify OTP ───────────────────────────────────────────────── */
  const handleVerifyOtp = async () => {
    setError("");
    if (otp.length < 6) { setError("Enter the 6-digit code we sent you."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), token: otp }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Invalid code");
      router.push("/dashboard");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ── Progress ─────────────────────────────────────────────────────────── */
  const STEP_ORDER: Step[] = ["track", "details", "otp"];
  const stepIndex = STEP_ORDER.indexOf(step);

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="px-6 py-5 flex items-center justify-between border-b border-mist">
        <OleraLockupH size={26} />
        <span className="text-xs text-moss font-mono">Free for candidates</span>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Progress dots */}
        <div className="flex items-center gap-2 mb-8" aria-label="Onboarding progress">
          {STEP_ORDER.map((s, i) => (
            <div
              key={s}
              className={cn(
                "rounded-full transition-all duration-300",
                i === stepIndex ? "w-8 h-2.5 bg-amber"
                  : i < stepIndex ? "w-2.5 h-2.5 bg-sage"
                  : "w-2.5 h-2.5 bg-mist"
              )}
              aria-current={i === stepIndex ? "step" : undefined}
            />
          ))}
        </div>

        <div className="w-full max-w-md">
          {/* ── STEP: Track ─────────────────────────────────────────────── */}
          {step === "track" && (
            <div>
              <div className="mb-8">
                <h1 className="font-display font-bold text-3xl text-char mb-2">
                  What's your area?
                </h1>
                <p className="text-moss">
                  Choose the track that best matches your experience.
                </p>
              </div>
              <div className="space-y-3">
                {TRACKS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleTrackSelect(t.id)}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl border-2 transition-all duration-150",
                      "hover:border-amber hover:bg-amber/5",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/40",
                      "group"
                    )}
                    style={{
                      borderColor: track === t.id ? COLORS.amber : COLORS.mist,
                      backgroundColor: track === t.id ? "#fef5ec" : "white",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{t.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-char">{t.label}</div>
                        <div className="text-xs text-moss mt-0.5">{t.description}</div>
                      </div>
                      <ArrowRight size={16} className="text-mist group-hover:text-amber transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP: Details ────────────────────────────────────────────── */}
          {step === "details" && (
            <div>
              <div className="mb-8">
                <div className="w-12 h-12 rounded-full bg-amber/10 flex items-center justify-center mb-4">
                  <Mail size={20} className="text-amber" />
                </div>
                <h1 className="font-display font-bold text-3xl text-char mb-2">
                  Let's get you in
                </h1>
                <p className="text-moss">
                  We'll send a code to your email. No password needed.
                </p>
              </div>

              <div className="space-y-3">
                <Input
                  label="Your name"
                  type="text"
                  placeholder="Ada Okonkwo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                  required
                  autoFocus
                />
                <Input
                  label="Email address"
                  type="email"
                  placeholder="ada@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                  error={error}
                  required
                />
                <Button variant="primary" size="lg" fullWidth loading={loading} onClick={handleSendOtp}>
                  Send verification code
                </Button>
                {track && (
                  <button
                    className="text-sm text-moss hover:text-char transition-colors w-full text-center"
                    onClick={() => { setStep("track"); setError(""); }}
                  >
                    ← Back
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── STEP: OTP ───────────────────────────────────────────────── */}
          {step === "otp" && (
            <div>
              <div className="mb-8">
                <div className="w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center mb-4">
                  <ShieldCheck size={20} className="text-sage" />
                </div>
                <h1 className="font-display font-bold text-3xl text-char mb-2">
                  Check your email
                </h1>
                <p className="text-moss">
                  We sent a code to <span className="font-medium text-char">{email}</span>.
                  It may take a minute.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Verification code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
                  error={error}
                  autoFocus
                  className="text-center text-2xl font-mono tracking-widest"
                />
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  onClick={handleVerifyOtp}
                  disabled={otp.length < 6}
                >
                  Verify and continue
                </Button>
                <div className="flex items-center justify-between text-sm">
                  <button
                    className="text-moss hover:text-char transition-colors"
                    onClick={() => { setStep("details"); setError(""); setOtp(""); }}
                  >
                    ← Wrong email?
                  </button>
                  <button
                    className="text-amber hover:text-terra transition-colors font-medium"
                    onClick={handleSendOtp}
                  >
                    Resend code
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-forest via-amber to-terra" aria-hidden="true" />
    </div>
  );
}
