"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User, FileText, ExternalLink, LogOut, ChevronDown } from "lucide-react";

interface Props {
  firstName: string;
  candidateId: string;
  profileSlug?: string | null;
}

export function CandidateMenu({ firstName, candidateId, profileSlug }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const signOut = async () => {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/join");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-sm font-medium text-char hover:text-moss transition-colors py-1 px-2 rounded-lg hover:bg-mist/60"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span className="w-7 h-7 rounded-full bg-amber/15 text-amber flex items-center justify-center text-xs font-bold flex-shrink-0">
          {firstName[0]?.toUpperCase()}
        </span>
        <span className="hidden sm:block">{firstName}</span>
        <ChevronDown size={14} className={`text-moss/60 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-52 bg-white border border-mist rounded-2xl shadow-lg py-1.5 z-50">
          <div className="px-4 py-2.5 border-b border-mist mb-1">
            <p className="text-xs font-mono text-moss/60">Signed in as</p>
            <p className="text-sm font-medium text-char truncate">{firstName}</p>
          </div>

          <MenuItem
            icon={<FileText size={14} />}
            label="My profile"
            onClick={() => { setOpen(false); router.push(`/profile/${candidateId}/review`); }}
          />

          {profileSlug && (
            <MenuItem
              icon={<ExternalLink size={14} />}
              label="Public profile"
              onClick={() => { setOpen(false); window.open(`/p/${profileSlug}`, "_blank"); }}
            />
          )}

          <div className="border-t border-mist mt-1 pt-1">
            <button
              disabled={signingOut}
              onClick={signOut}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-terra hover:bg-terra/5 transition-colors disabled:opacity-50"
            >
              <LogOut size={14} />
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-char hover:bg-mist/50 transition-colors"
    >
      <span className="text-moss">{icon}</span>
      {label}
    </button>
  );
}
