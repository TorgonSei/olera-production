"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { OleraLockupH } from "@/components/brand/Mark";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { ArrowRight, Upload, FileText } from "lucide-react";

export default function UploadPage() {
  const router = useRouter();
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvDragging, setCvDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setCvDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setCvFile(file);
      setError("");
    } else {
      setError("Please drop a PDF file.");
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setCvFile(file); setError(""); }
  };

  const handleUpload = async () => {
    if (!cvFile) { setError("Please select your CV first."); return; }
    setError("");
    setLoading(true);
    try {
      const form = new FormData();
      form.append("cv", cvFile);
      form.append("track", "support"); // default; candidate can update later

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

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="px-6 py-5 flex items-center justify-between border-b border-mist">
        <OleraLockupH size={26} />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 pb-20 sm:pb-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="w-12 h-12 rounded-full bg-amber/10 flex items-center justify-center mb-4">
              <Upload size={20} className="text-amber" />
            </div>
            <h1 className="font-display font-bold text-3xl text-char mb-2">
              Upload your CV
            </h1>
            <p className="text-moss">
              We&apos;ll extract your experience automatically. Takes less than 60 seconds.
            </p>
          </div>

          <div className="space-y-4">
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
                    <p className="font-medium text-char">Drop your CV here</p>
                    <p className="text-sm text-moss mt-1">or click to browse — PDF only, max 10MB</p>
                  </div>
                </div>
              )}
            </div>

            {error && <p className="text-sm text-terra text-center">{error}</p>}

            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              disabled={!cvFile}
              onClick={handleUpload}
            >
              Build my profile
              <ArrowRight size={18} />
            </Button>

            <p className="text-xs text-center text-moss/70">
              Your CV is stored securely and only shared with employers you approve.
            </p>
          </div>
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-forest via-amber to-terra" aria-hidden="true" />
    </div>
  );
}
