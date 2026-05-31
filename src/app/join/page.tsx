"use client";

import React, { useState, Suspense } from "react";
import { OleraLockupH } from "@/components/brand/Mark";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowRight, Mail, CheckCircle } from "lucide-react";

export default function JoinPage() {
  return (
    <Suspense>
      <JoinPageInner />
    </Suspense>
  );
}

function JoinPageInner() {
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [sent, setSent]       = useState(false);

  const handleSend = async () => {
    setError("");
    if (!name.trim())  { setError("Please enter your name."); return; }
    if (!email.trim() || !email.includes("@")) { setError("Please enter a valid email address."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), name: name.trim() }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed to send link");
      setSent(true);
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
        <span className="text-xs text-moss font-mono">Free for candidates</span>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 pb-20 sm:pb-12">
        <div className="w-full max-w-md">
          {sent ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-sage/10 flex items-center justify-center mb-6 mx-auto">
                <CheckCircle size={28} className="text-sage" />
              </div>
              <h1 className="font-display font-bold text-3xl text-char mb-3">Check your inbox</h1>
              <p className="text-moss mb-2">We sent a sign-in link to</p>
              <p className="font-semibold text-char mb-6">{email}</p>
              <p className="text-sm text-moss/70 mb-8">
                Click the link to access your profile. It expires in 1 hour.
              </p>
              <button
                className="text-sm text-amber hover:text-terra transition-colors font-medium"
                onClick={() => { setSent(false); setError(""); }}
              >
                Wrong email? Go back
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-8">
                <div className="w-12 h-12 rounded-full bg-amber/10 flex items-center justify-center mb-4">
                  <Mail size={20} className="text-amber" />
                </div>
                <h1 className="font-display font-bold text-3xl text-char mb-2">
                  Sign in or get started
                </h1>
                <p className="text-moss">
                  Enter your name and email. We&apos;ll send you a secure link — no password needed.
                </p>
                <p className="text-sm text-moss/60 mt-2">
                  Already submitted your CV? Just enter your email and you&apos;ll go straight to your profile.
                </p>
              </div>

              <div className="space-y-3">
                <Input
                  label="Your name"
                  type="text"
                  placeholder="Ada Okonkwo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  required
                  autoFocus
                />
                <Input
                  label="Email address"
                  type="email"
                  placeholder="ada@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  error={error}
                  required
                />
                <Button variant="primary" size="lg" fullWidth loading={loading} onClick={handleSend}>
                  Continue
                  {!loading && <ArrowRight size={16} />}
                </Button>
              </div>

              <p className="text-xs text-center text-moss/60 mt-5">
                No password needed. We&apos;ll email you a secure sign-in link.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-forest via-amber to-terra" aria-hidden="true" />
    </div>
  );
}
