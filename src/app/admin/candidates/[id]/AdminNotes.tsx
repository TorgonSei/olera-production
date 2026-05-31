"use client";

import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/cn";
import { Send } from "lucide-react";

interface Note {
  id: string;
  created_at: string;
  admin_email: string | null;
  note: string;
  note_type: string;
}

const NOTE_TYPES = [
  { value: "general",      label: "General" },
  { value: "screening",    label: "Screening call" },
  { value: "fit",          label: "Role fit" },
  { value: "salary",       label: "Salary / rate" },
  { value: "availability", label: "Availability" },
];

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function AdminNotes({ candidateId }: { candidateId: string }) {
  const [notes, setNotes]     = useState<Note[]>([]);
  const [note, setNote]       = useState("");
  const [type, setType]       = useState("general");
  const [saving, setSaving]   = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/candidates/${candidateId}/notes`);
      if (res.ok) setNotes(await res.json());
    } finally {
      setLoading(false);
    }
  }, [candidateId]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const handleAdd = async () => {
    if (!note.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/candidates/${candidateId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note, note_type: type }),
      });
      if (res.ok) {
        setNote("");
        await fetchNotes();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h3 className="text-xs font-mono text-moss/60 uppercase tracking-widest mb-3">Admin notes</h3>

      {/* Add note */}
      <div className="mb-4">
        <div className="flex gap-2 mb-2">
          {NOTE_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setType(t.value)}
              className={cn(
                "text-[10px] px-2 py-1 rounded-full font-mono transition-colors",
                type === t.value ? "bg-forest text-cream" : "bg-mist text-moss hover:bg-mist/80"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note..."
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAdd(); }}
            className="flex-1 px-3 py-2 rounded-xl border border-mist bg-white text-sm text-char placeholder:text-moss/40 focus:outline-none focus:border-amber/60 focus:ring-2 focus:ring-amber/10 resize-none transition"
          />
          <button
            onClick={handleAdd}
            disabled={saving || !note.trim()}
            className="p-2 rounded-xl bg-forest text-cream hover:bg-forest/90 disabled:opacity-40 transition self-end"
          >
            <Send size={14} />
          </button>
        </div>
      </div>

      {/* Notes list */}
      {loading ? (
        <p className="text-xs text-moss/40 font-mono">Loading...</p>
      ) : notes.length === 0 ? (
        <p className="text-xs text-moss/40 font-mono">No notes yet.</p>
      ) : (
        <div className="space-y-3">
          {notes.map((n) => (
            <div key={n.id} className="bg-mist/30 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-mist text-moss">
                  {NOTE_TYPES.find((t) => t.value === n.note_type)?.label ?? n.note_type}
                </span>
                <span className="text-[10px] text-moss/50 font-mono ml-auto">
                  {timeAgo(n.created_at)}
                </span>
              </div>
              <p className="text-sm text-char leading-relaxed">{n.note}</p>
              {n.admin_email && (
                <p className="text-[10px] text-moss/40 mt-1 font-mono">{n.admin_email}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
