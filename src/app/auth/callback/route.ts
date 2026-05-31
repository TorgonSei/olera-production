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
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!existing) {
    const { error: insertError } = await service.from("candidates").insert({
      user_id: user.id,
      email: user.email ?? "",
      full_name: user.user_metadata?.full_name ?? name,
      phone: "",
      track: track as "support" | "success" | "assistant",
      status: "registered",
      readiness: "unscreened",
      profile_completeness: 10,
    });

    if (insertError) {
      console.error("Candidate insert error:", insertError);
      // Still redirect — user is authenticated even if record creation failed
    }
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}
