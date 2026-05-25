"use client";

import React, { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OleraLockupH, Olera3A, COLORS } from "@/components/brand/Mark";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";
import { ArrowRight, Upload, FileText, Phone, ShieldCheck } from "lucide-react";

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
type Step = "track" | "phone" | "otp" | "cv";

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default function JoinPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTrack = (searchParams.get("track") as Track) ?? null;

  const [step, setStep] = useState<Step>(initialTrack ? "phone" : "track");
  const [track, setTrack] = useState<Track | null>(initialTrack);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvDragging, setCvDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ── Step 1: select track ─────────────────────────────────────────────── */
  const handleTrackSelect = (t: Track) => {
    setTrack(t);
    setStep("phone");
  };

  /* ── Step 2: send OTP ─────────────────────────────────────────────────── */
  const handleSendOtp = async () => {
    setError("");
    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed to send OTP");
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
    if (otp.length < 6) {
      setError("Enter the 6-digit code we sent you.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, token: otp }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Invalid code");
      setStep("cv");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 4: upload CV ────────────────────────────────────────────────── */
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setCvDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setCvFile(file);
    } else {
      setError("Please drop a PDF file.");
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCvFile(file);
  };

  const handleCvUpload = async () => {
    if (!cvFile) {
      setError("Please select your CV first.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const form = new FormData();
      form.append("cv", cvFile);
      form.append("track", track!);

      const res = await fetch("/api/candidate/cv-upload", {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Upload failed");
      const { candidateId } = await res.json();
      router.push(`/profile/${candidateId}/gaps`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ── Progress indicator ───────────────────────────────────────────────── */
  const STEP_ORDER: Step[] = ["track", "phone", "otp", "cv"];
  const stepIndex = STEP_ORDER.indexOf(step);

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Minimal header */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-mist">
        <OleraLockupH size={26} />
        <span className="text-xs text-moss font-mono">Free for candidates</span>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Progress dots */}
        <div className="flex items-center gap-2 mb-10" aria-label="Onboarding progress">
          {STEP_ORDER.map((s, i) => (
            <div
              key={s}
              className={cn(
                "rounded-full transition-all duration-300",
                i === stepIndex
                  ? "w-6 h-2 bg-amber"
                  : i < stepIndex
                  ? "w-2 h-2 bg-sage"
                  : "w-2 h-2 bg-mist"
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
                  Choose the track that best matches your experience. You can always update it later.
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
                      <ArrowRight
                        size={16}
                        className="text-mist group-hover:text-amber transition-colors"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP: Phone ─────────────────────────────────────────────── */}
          {step === "phone" && (
            <div>
              <div className="mb-8">
                <div className="w-12 h-12 rounded-full bg-forest/10 flex items-center justify-center mb-4">
                  <Phone size={20} className="text-forest" />
                </div>
                <h1 className="font-display font-bold text-3xl text-char mb-2">
                  What's your number?
                </h1>
                <p className="text-moss">
                  We'll send you a 6-digit code via SMS to verify it's you. No password needed.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Phone number"
                  type="tel"
                  placeholder="+254 700 000 000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                  hint="Include your country code, e.g. +254 for Kenya"
                  error={error}
                  required
                  autoFocus
                />

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  onClick={handleSendOtp}
                >
                  Send verification code
                </Button>

                <button
                  className="text-sm text-moss hover:text-char transition-colors w-full text-center"
                  onClick={() => { setStep("track"); setError(""); }}
                >
                  ← Back
                </button>
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
                  Enter the code
                </h1>
                <p className="text-moss">
                  We sent a 6-digit code to <span className="font-medium text-char">{phone}</span>.
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
                    onClick={() => { setStep("phone"); setError(""); setOtp(""); }}
                  >
                    ← Wrong number?
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

          {/* ── STEP: CV Upload ─────────────────────────────────────────── */}
          {step === "cv" && (
            <div>
              <div className="mb-8">
                <div className="w-12 h-12 rounded-full bg-amber/10 flex items-center justify-center mb-4">
                  <Upload size={20} className="text-amber" />
                </div>
                <h1 className="font-display font-bold text-3xl text-char mb-2">
                  Upload your CV
                </h1>
                <p className="text-moss">
                  We'll extract your experience automatically. Takes less than 60 seconds.
                </p>
              </div>

              <div className="space-y-4">
                {/* Drop zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setCvDragging(true); }}
                  onDragLeave={() => setCvDragging(false)}
                  onDrop={handleDrop}
                  className={cn(
                    "border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-150 cursor-pointer",
                    "hover:border-amber hover:bg-amber/5",
                    cvDragging ? "border-amber bg-amber/10 scale-[1.01]" : "border-mist bg-white",
                    cvFile && "border-sage bg-sage/5"
                  )}
                  onClick={() => document.getElementById("cv-input")?.click()}
                  role="button"
                  tabIndex={0}
                  aria-label="Upload CV — click or drag a PDF"
                  onKeyDown={(e) => e.key === "Enter" && document.getElementById("cv-input")?.click()}
                >
                  <input
                    id="cv-input"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  {cvFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <FileText size={36} className="text-sage" />
                      <p className="font-medium text-char">{cvFile.name}</p>
                      <p className="text-xs text-moss">
                        {(cvFile.size / 1024 / 1024).toFixed(1)} MB · PDF
                      </p>
                      <button
                        className="text-xs text-terra hover:text-terra/80 transition-colors"
                        onClick={(e) => { e.stopPropagation(); setCvFile(null); }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-2xl bg-cream flex items-center justify-center">
                        <Upload size={28} className="text-moss" />
                      </div>
                      <div>
                        <p className="font-medium text-char">
                          Drop your CV here
                        </p>
                        <p className="text-sm text-moss mt-1">
                          or click to browse — PDF only, max 10MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-terra text-center">{error}</p>
                )}

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  disabled={!cvFile}
                  onClick={handleCvUpload}
                >
                  Build my profile
                  <ArrowRight size={18} />
                </Button>

                <p className="text-xs text-center text-moss/70">
                  Your CV is stored securely and only shared with employers you approve.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar — brand accent */}
      <div className="h-1 bg-gradient-to-r from-forest via-amber to-terra" aria-hidden="true" />
    </div>
  );
}