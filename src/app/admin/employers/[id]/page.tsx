import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { OleraLockupH } from "@/components/brand/Mark";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, Building, Mail, Globe, Users, Clock, MapPin } from "lucide-react";
import type { EmployerRequestRow } from "@/lib/supabase/types";
import { EmployerStatusControl } from "./EmployerStatusControl";

export default async function AdminEmployerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServiceClient();
  const { data: raw } = await supabase
    .from("employer_requests")
    .select("*")
    .eq("id", id)
    .single();

  if (!raw) notFound();
  const r = raw as EmployerRequestRow;

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-10 bg-forest border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <OleraLockupH size={24} reversed />
          <Link href="/admin/employers" className="text-cream/50 hover:text-cream text-sm flex items-center gap-1.5 transition-colors">
            <ArrowLeft size={14} />
            All requests
          </Link>
        </div>
        <span className="text-xs font-mono text-cream/40 bg-white/10 px-2 py-1 rounded-full">Admin</span>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h1 className="font-display font-bold text-2xl text-char">{r.company_name}</h1>
            <p className="text-moss text-sm mt-1">{r.role_title}</p>
          </div>
          <EmployerStatusControl requestId={r.id} currentStatus={r.status} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">

            {/* Role description */}
            <Card variant="elevated">
              <h2 className="text-xs font-mono text-moss/60 uppercase tracking-widest mb-3">Role</h2>
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div>
                  <span className="text-xs text-moss/60 font-mono block mb-0.5">Track</span>
                  <span className="font-medium text-char capitalize">{r.role_track}</span>
                </div>
                <div>
                  <span className="text-xs text-moss/60 font-mono block mb-0.5">Headcount</span>
                  <span className="font-medium text-char">{r.headcount}</span>
                </div>
                {r.work_arrangement?.length ? (
                  <div>
                    <span className="text-xs text-moss/60 font-mono block mb-0.5">Arrangement</span>
                    <span className="font-medium text-char">{r.work_arrangement.join(", ")}</span>
                  </div>
                ) : null}
                {r.location_type?.length ? (
                  <div>
                    <span className="text-xs text-moss/60 font-mono block mb-0.5">Location</span>
                    <span className="font-medium text-char">{r.location_type.join(", ")}</span>
                  </div>
                ) : null}
                {r.timezone && (
                  <div>
                    <span className="text-xs text-moss/60 font-mono block mb-0.5">Timezone</span>
                    <span className="font-medium text-char">{r.timezone}</span>
                  </div>
                )}
                {r.start_date && (
                  <div>
                    <span className="text-xs text-moss/60 font-mono block mb-0.5">Start date</span>
                    <span className="font-medium text-char">{r.start_date}</span>
                  </div>
                )}
                {r.salary_range && (
                  <div>
                    <span className="text-xs text-moss/60 font-mono block mb-0.5">Salary / rate</span>
                    <span className="font-medium text-char">{r.salary_range}</span>
                  </div>
                )}
              </div>
              <div className="pt-4 border-t border-mist space-y-4">
                <div>
                  <p className="text-xs font-mono text-moss/60 mb-1.5">Description</p>
                  <p className="text-sm text-char leading-relaxed">{r.role_description}</p>
                </div>
                {r.daily_tasks && (
                  <div>
                    <p className="text-xs font-mono text-moss/60 mb-1.5">Day-to-day tasks</p>
                    <p className="text-sm text-char leading-relaxed">{r.daily_tasks}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Requirements */}
            {(r.must_haves || r.nice_to_haves || r.deal_breakers) && (
              <Card variant="elevated">
                <h2 className="text-xs font-mono text-moss/60 uppercase tracking-widest mb-3">Requirements</h2>
                <div className="space-y-4">
                  {r.must_haves && (
                    <div>
                      <p className="text-xs font-mono text-moss/60 mb-1.5">Must-haves</p>
                      <p className="text-sm text-char leading-relaxed">{r.must_haves}</p>
                    </div>
                  )}
                  {r.nice_to_haves && (
                    <div>
                      <p className="text-xs font-mono text-moss/60 mb-1.5">Nice-to-haves</p>
                      <p className="text-sm text-char leading-relaxed">{r.nice_to_haves}</p>
                    </div>
                  )}
                  {r.deal_breakers && (
                    <div>
                      <p className="text-xs font-mono text-moss/60 mb-1.5">Deal-breakers</p>
                      <p className="text-sm text-char leading-relaxed">{r.deal_breakers}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Admin notes */}
            {r.admin_notes && (
              <Card variant="elevated">
                <h2 className="text-xs font-mono text-moss/60 uppercase tracking-widest mb-3">Admin notes</h2>
                <p className="text-sm text-char leading-relaxed">{r.admin_notes}</p>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <Card variant="elevated">
              <h3 className="text-xs font-mono text-moss/60 uppercase tracking-widest mb-3">Contact</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-2">
                  <Users size={13} className="text-moss" />
                  <span className="text-char">{r.contact_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={13} className="text-moss" />
                  <a href={`mailto:${r.work_email}`} className="text-amber hover:text-terra transition-colors">
                    {r.work_email}
                  </a>
                </div>
                {r.company_website && (
                  <div className="flex items-center gap-2">
                    <Globe size={13} className="text-moss" />
                    <a href={r.company_website} target="_blank" rel="noopener noreferrer" className="text-amber hover:text-terra transition-colors text-xs">
                      {r.company_website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
              </div>
            </Card>

            <Card variant="elevated">
              <h3 className="text-xs font-mono text-moss/60 uppercase tracking-widest mb-3">Timeline</h3>
              <div className="flex items-center gap-2 text-xs">
                <Clock size={12} className="text-moss" />
                <span className="text-moss">
                  Received {new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            </Card>

            <Card variant="elevated">
              <h3 className="text-xs font-mono text-moss/60 uppercase tracking-widest mb-3">Find candidates</h3>
              <Link
                href={`/admin/candidates?stage=assessed`}
                className="text-sm text-amber hover:text-terra transition-colors font-medium"
              >
                Browse assessed pool →
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
