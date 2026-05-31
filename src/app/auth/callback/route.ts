import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code  = searchParams.get("code");
  const track = searchParams.get("track") ?? "support";
  const name  = searchParams.get("name") ?? "";

  if (!code) {
    return NextResponse.redirect(`${origin}/join?error=missing_code`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(`${origin}/join?error=auth_failed`);
  }

  const user = data.user;

  // Create candidate record for new users
  const service = createServiceClient();
  const { data: existing } = await service
    .from("candidates")
    .select("id, status")
    .eq("user_id", user.id)
    .single();

  if (!existing) {
    const { error: insertError } = await service.from("candidates").insert({
      user_id: user.id,
      email: user.email ?? "",
      full_name: user.user_metadata?.full_name ?? name,
      phone: "",
      track: "support",
      status: "registered",
      readiness: "unscreened",
      profile_completeness: 10,
    });

    if (insertError) {
      console.error("Candidate insert error:", insertError);
    }
    return NextResponse.redirect(`${origin}/upload`);
  }

  // Returning user: if they haven't submitted yet, send them to the right step
  const status = existing.status;
  if (status === "registered") return NextResponse.redirect(`${origin}/upload`);
  if (status === "cv_uploaded" || status === "profile_parsed") {
    return NextResponse.redirect(`${origin}/profile/${existing.id}/intake`);
  }
  return NextResponse.redirect(`${origin}/dashboard`);
}
