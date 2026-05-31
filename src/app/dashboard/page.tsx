import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { OleraLockupH } from "@/components/brand/Mark";
import Link from "next/link";
import { Clock, CheckCircle, Upload, ArrowRight } from "lucide-react";
import { CandidateMenu } from "@/components/candidate/CandidateMenu";

/* ─── Status messaging ──────────────────────────────────────────────────── */
function getStatusMessage(status: string) {
  switch (status) {
    case "registered":
      return {
        icon: <Upload size={24} className="text-amber" />,
        heading: "Upload your CV to get started",
        body: "We need your CV to review your profile. Upload a PDF and we'll extract your experience automatically.",
        cta: { label: "Upload CV", href: "/upload" },
      };
    case "submitted":
    case "gaps_filled":
    case "needs_review":
    case "assessment_invited":
    case "assessment_complete":
    case "interview_invited":
    case "review_pending":
      return {
        icon: <Clock size={24} className="text-amber" />,
        heading: "Your profile is under review",
        body: "Our team will review your CV and contact you if your profile fits current or upcoming roles. This usually takes a few days.",
        cta: null,
      };
    case "keep_in_pool":
      return {
        icon: <Clock size={24} className="text-amber" />,
        heading: "Profile on file",
        body: "We have your profile on file and will reach out when a suitable role comes up.",
        cta: null,
      };
    case "screening_needed":
    case "screening_scheduled":
      return {
        icon: <Clock size={24} className="text-amber" />,
        heading: "We'll be in touch shortly",
        body: "Our team would like to have a short call with you. Check your email or phone for details.",
        cta: null,
      };
    case "screened":
    case "assessed":
    case "active":
      return {
        icon: <CheckCircle size={24} className="text-sage" />,
        heading: "Profile assessed",
        body: "You've been reviewed by our team. We'll reach out when there's a matching role opportunity.",
        cta: null,
      };
    case "employer_ready":
    case "shortlisted":
      return {
        icon: <CheckCircle size={24} className="text-sage" />,
        heading: "Active in our talent pool",
        body: "Your profile is being matched to employer roles. We'll contact you directly when there's an introduction to make.",
        cta: null,
      };
    case "interview_requested":
      return {
        icon: <CheckCircle size={24} className="text-sage" />,
        heading: "Interview stage",
        body: "An employer would like to interview you. Check your email for details from the Olera team.",
        cta: null,
      };
    case "placed":
      return {
        icon: <CheckCircle size={24} className="text-sage" />,
        heading: "Placement confirmed",
        body: "Congratulations — your placement has been confirmed. We'll be in touch with next steps.",
        cta: null,
      };
    default:
      return {
        icon: <Clock size={24} className="text-moss" />,
        heading: "Profile received",
        body: "Our team will be in touch if there's a relevant opportunity.",
        cta: null,
      };
  }
}

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/join");

  const service = createServiceClient();
  const { data: candidate } = await service
    .from("candidates")
    .select("id, full_name, status, cv_file_path, role_interests, work_preferences")
    .eq("user_id", user.id)
    .single();

  if (!candidate) redirect("/join");

  // Route incomplete profiles to the right step
  if (candidate.status === "cv_uploaded" || candidate.status === "profile_parsed") {
    redirect(`/profile/${candidate.id}/intake`);
  }

  const msg = getStatusMessage(candidate.status);
  const firstName = (candidate.full_name as string)?.split(" ")[0] || "there";
  const isRejected = ["rejected", "archived", "withdrawn"].includes(candidate.status);
  const roleInterests = (candidate.role_interests as string[] | null) ?? [];

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between border-b border-mist">
        <OleraLockupH size={24} />
        <CandidateMenu candidateId={candidate.id as string} firstName={firstName} profileSlug={null} />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">

          {/* Status card */}
          <div className="bg-white border border-mist rounded-2xl p-8 mb-5">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex-shrink-0">{msg.icon}</div>
              <div className="flex-1">
                <h2 className="font-display font-bold text-xl text-char mb-2">{msg.heading}</h2>
                <p className="text-moss text-sm leading-relaxed">{msg.body}</p>
                {msg.cta && (
                  <Link
                    href={msg.cta.href}
                    className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-amber hover:text-terra transition-colors"
                  >
                    {msg.cta.label} <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Role interests */}
          {roleInterests.length > 0 && (
            <div className="bg-white border border-mist rounded-2xl p-5 mb-4">
              <p className="text-xs font-mono text-moss/60 uppercase tracking-widest mb-3">Your interests</p>
              <div className="flex flex-wrap gap-2">
                {roleInterests.map((i: string) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-amber/10 text-amber font-medium">
                    {i === "open" ? "Open to guidance" : i.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Rejected */}
          {isRejected && (
            <div className="bg-mist/50 border border-mist rounded-2xl p-5 text-center">
              <p className="text-sm text-moss">
                We&apos;re not able to move your profile forward at this time. Thank you for applying to Olera.
              </p>
            </div>
          )}

          {/* Update CV */}
          {(candidate.cv_file_path as string | null) && !isRejected && (
            <p className="text-center text-xs text-moss/50 mt-4">
              Need to update your CV?{" "}
              <Link href="/upload" className="text-amber hover:text-terra transition-colors">
                Upload a new version
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
