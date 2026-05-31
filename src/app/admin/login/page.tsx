"use client";

import React, { useState } from "react";
import { OleraLockupH } from "@/components/brand/Mark";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    setError("");
    if (!email.trim()) { setError("Enter your email address."); return; }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/admin-callback`,
          shouldCreateUser: false,
        },
      });
      if (err) throw err;
      setSent(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-forest flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-10">
          <OleraLockupH size={28} reversed />
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-sage text-xl">✓</span>
              </div>
              <h2 className="font-display font-bold text-xl text-cream mb-2">Check your inbox</h2>
              <p className="text-cream/60 text-sm">
                We sent a sign-in link to <strong className="text-cream">{email}</strong>.
                Click it to access the admin panel.
              </p>
            </div>
          ) : (
            <>
              <h2 className="font-display font-bold text-xl text-cream mb-1">Admin access</h2>
              <p className="text-cream/50 text-sm mb-6">Sign in with your admin email address.</p>

              <div className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@olera.co"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="bg-white/5 border-white/20 text-cream placeholder:text-cream/30 focus:border-amber/60"
                />

                {error && (
                  <p className="text-sm text-terra">{error}</p>
                )}

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  onClick={handleSend}
                >
                  Send sign-in link
                </Button>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-xs text-cream/20 mt-6 font-mono">
          Admin access only · Olera
        </p>
      </div>
    </div>
  );
}
