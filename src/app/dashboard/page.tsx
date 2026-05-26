import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Candidate dashboard — smart re-entry point.
 *
 * Logged-in candidates land here and are redirected to the right
 * step in their pathway based on their current status.
 *
 * Not logged in → /join
 */
export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/join");
  }

  // Look up the candidate record for this user
  const { data: candidate } = await supabase
    .from("candidates")
    .select("id, status")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!candidate) {
    // No profile yet — send them to upload their CV
    redirect("/join");
  }

  const { id, status } = candidate;

  // Route to the right step
  switch (status) {
    case "cv_uploaded":
      // Profile built — fill in gaps
      redirect(`/profile/${id}/gaps`);

    case "gaps_filled":
      // Gaps done — complete the practical tasks
      redirect(`/assessment/${id}`);

    case "assessed":
    case "active":
    default:
      // Pathway complete — show their profile/status
      redirect(`/profile/${id}/review`);
  }
}
