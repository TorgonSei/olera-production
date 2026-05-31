import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { OleraLockupH } from "@/components/brand/Mark";
import { Button } from "@/components/ui/Button";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, CheckCircle, Circle, Upload, ClipboardList, Eye } from "lucide-react";
import Link from "next/link";

/* ─── Pathway steps ─────────────────────────────────────────────────────── */
const PATHWAY = [
  { key: "profile",  n: "01", label: "Profile Built" },
  { key: "review",   n: "02", label: "Under Review" },
  { key: "matched",  n: "03", label: "Matched" },
  { key: "placed",   n: "04", label: "Hired" },
];

function getPathwayIndex(status: string, readiness: string) {
  if (status === "placed")                                                  return 3;
  if (readiness === "ready" || readiness === "remote_ready")                return 2;
  if (status === "gaps_filled"        || status === "assessment_invited" ||
      status === "assessment_complete"|| status === "interview_invited"  ||
      status === "assessed"           || status === "review_pending"     ||
      status === "active")                                                  return 1;
  return 0;
}

/* ─── Next action config ────────────────────────────────────────────────── */
interface NextAction {
  icon: React.ReactNode;
  heading: string;
  body: string;
  cta: string;
  href: string;
}

function getNextAction(
  status: string,
  readiness: string,
  candidateId: string,
  profileSlug?: string | null,
): NextAction {
  if (status === "registered" || !status) {
    return {
      icon: <Upload size={22} className="text-amber" />,
      heading: "Upload your CV",
      body: "We'll extract your experience and build your profile automatically. Takes less than a minute.",
      cta: "Upload CV",
      href: "/upload",
    };
  }
  if (status === "cv_uploaded") {
    return {
      icon: <ClipboardList size={22} className="text-amber" />,
      heading: "Complete your profile",
      body: "Review what we extracted and fill in a few quick details so employers get the full picture.",
      cta: "Complete profile",
      href: `/profile/${candidateId}/gaps`,
    };
  }
  if (status === "gaps_filled" || status === "review_pending") {
    return {
      icon: <CheckCircle size={22} className="text-sage" />,
      heading: "Profile received",
      body: "We're reviewing your profile and will be in touch if there's a match. This usually takes a few days.",
      cta: profileSlug ? "View public profile" : "View your profile",
      href: profileSlug ? `/p/${profileSlug}` : `/profile/${candidateId}/review`,
    };
  }
  if (status === "assessment_invited") {
    return {
      icon: <ClipboardList size={22} className="text-amber" />,
      heading: "Complete your assessment",
      body: "We'd like to see how you think and communicate. The assessment takes about 20 minutes.",
      cta: "Start assessment",
      href: `/assessment/${candidateId}`,
    };
  }
  if (status === "assessment_complete") {
    return {
      icon: <CheckCircle size={22} className="text-sage" />,
      heading: "Assessment received",
      body: "Thanks for completing the assessment. We're reviewing your submission and will be in touch about next steps.",
      cta: profileSlug ? "View public profile" : "View your profile",
      href: profileSlug ? `/p/${profileSlug}` : `/profile/${candidateId}/review`,
    };
  }
  if (status === "interview_invited") {
    return {
      icon: <Circle size={22} className="text-amber" />,
      heading: "Interview stage",
      body: "You've been invited to interview with Olera. We'll send details on timing and format to your email shortly.",
      cta: profileSlug ? "View public profile" : "View your profile",
      href: profileSlug ? `/p/${profileSlug}` : `/profile/${candidateId}/review`,
    };
  }
  if (status === "assessed" && readiness === "developing") {
    return {
      icon: <ClipboardList size={22} className="text-moss" />,
      heading: "Keep building",
      body: "Review your feedback below and strengthen your profile before reapplying.",
      cta: "View feedback",
      href: `/profile/${candidateId}/review`,
    };
  }
  if (status === "assessed" || readiness === "near_ready") {
    return {
      icon: <Circle size={22} className="text-amber" />,
      heading: "Under review",
      body: "Our team is reviewing your profile. We may reach out with a few questions before activating it.",
      cta: "View your profile",
      href: `/profile/${candidateId}/review`,
    };
  }
  if (readiness === "ready" || readiness === "remote_ready") {
    return {
      icon: <Eye size={22} className="text-sage" />,
      heading: "You're visible to employers",
      body: "Your profile is active and being matched to live roles. We'll be in touch when there's a fit.",
      cta: profileSlug ? "View public profile" : "View your profile",
      href: profileSlug ? `/p/${profileSlug}` : `/profile/${candidateId}/review`,
    };
  }
  return {
    icon: <Upload size={22} className="text-amber" />,
    heading: "Upload your CV",
    body: "We'll extract your experience and build your profile automatically.",
    cta: "Upload CV",
    href: "/upload",
  };
}

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default async function DashboardPage() {
  const supabaseAuth = await createClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();

  if (!user) redirect("/join");

  // Fetch candidate — use service client so RLS doesn't block
  const supabase = createServiceClient();
  const { data: candidate } = await supabase
    .from("candidates")
    .select("id, full_name, email, track, status, readiness, profile_completeness, profile_slug, assessment_score, assessment_tier")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!candidate) redirect("/join");

  const firstName = (candidate.full_name || user.user_metadata?.full_name || "there")
    .split(" ")[0];

  const status    = candidate.status    ?? "joined";
  const readiness = candidate.readiness ?? "unscreened";
  const pathwayIndex = getPathwayIndex(status, readiness);
  const nextAction = getNextAction(status, readiness, candidate.id, candidate.profile_slug);

  const TRACK_LABELS: Record<string, string> = {
    support:   "Customer Support",
    success:   "Customer Success",
    assistant: "Virtual / Executive Assistant",
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-mist/60 bg-cream/90 backdrop-blur-sm sticky top-0 z-10">
        <OleraLockupH size={26} />
        <Link href={`/profile/${candidate.id}/review`} className="text-xs text-moss hover:text-char transition-colors font-mono">
          My profile →
        </Link>
      </header>

      <div className="max-w-lg mx-auto px-4 py-10 sm:py-14">

        {/* Greeting */}
        <div className="mb-10">
          <p className="text-sm font-mono text-moss/70 mb-1">
            {TRACK_LABELS[candidate.track] ?? "Candidate"}
          </p>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-char leading-tight">
            Hi {firstName} 👋
          </h1>
          <p className="text-moss mt-2 text-base">
            Here&apos;s where you are on your pathway.
          </p>
        </div>

        {/* Pathway stepper */}
        <div className="mb-10">
          <div className="flex items-start gap-0">
            {PATHWAY.map((step, i) => {
              const done    = i < pathwayIndex;
              const current = i === pathwayIndex;
              const isLast  = i === PATHWAY.length - 1;

              return (
                <div key={step.key} className="flex-1 min-w-0 flex flex-col items-center">
                  {/* Connector line + dot row */}
                  <div className="flex items-center w-full">
                    {/* Left line */}
                    <div className={[
                      "flex-1 h-0.5",
                      i === 0 ? "invisible" : done || current ? "bg-sage" : "bg-mist",
                    ].join(" ")} />
                    {/* Dot */}
                    <div className={[
                      "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
                      done    ? "bg-sage text-cream"   : "",
                      current ? "bg-amber text-cream ring-4 ring-amber/20" : "",
                      !done && !current ? "bg-mist text-moss/40" : "",
                    ].join(" ")}>
                      {done
                        ? <CheckCircle size={14} strokeWidth={2.5} />
                        : <span className="text-[10px] font-mono font-bold">{step.n}</span>
                      }
                    </div>
                    {/* Right line */}
                    <div className={[
                      "flex-1 h-0.5",
                      isLast ? "invisible" : done ? "bg-sage" : "bg-mist",
                    ].join(" ")} />
                  </div>
                  {/* Label */}
                  <p className={[
                    "text-[10px] font-medium text-center mt-1.5 leading-tight px-1",
                    done    ? "text-sage"         : "",
                    current ? "text-char font-semibold" : "",
                    !done && !current ? "text-moss/40" : "",
                  ].join(" ")}>
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* What's next card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm mb-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              {nextAction.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-char text-lg mb-1.5 leading-snug">
                {nextAction.heading}
              </h2>
              <p className="text-sm text-moss leading-relaxed mb-5">
                {nextAction.body}
              </p>
              <Button
                variant="primary"
                size="md"
                as="a"
                href={nextAction.href}
              >
                {nextAction.cta}
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Assessment feedback — only if assessed and has score */}
        {candidate.assessment_score !== null && candidate.assessment_score !== undefined && (
          <div className="bg-white/60 rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-4">
              <div>
                <p className="font-display font-bold text-3xl text-char">
                  {candidate.assessment_score}
                  <span className="text-moss font-normal text-base">/100</span>
                </p>
                <p className="text-xs text-moss mt-0.5 capitalize">
                  {candidate.assessment_tier === "pass" ? "Strong result"
                    : candidate.assessment_tier === "borderline" ? "Under review"
                    : "Keep building"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quiet links */}
        <div className="flex items-center gap-4 text-sm text-moss/60">
          <Link href={`/profile/${candidate.id}/review`} className="hover:text-moss transition-colors">
            Full profile
          </Link>
          <span>·</span>
          <Link href="/contact" className="hover:text-moss transition-colors">
            Get help
          </Link>
        </div>

      </div>

      <Footer />
    </div>
  );
}
