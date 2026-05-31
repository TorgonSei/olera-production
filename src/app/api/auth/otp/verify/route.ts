import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { email, token, track, name } = await req.json();

    if (!email || !token) {
      return NextResponse.json({ error: "Email and token required" }, { status: 400 });
    }

    // Verify the OTP — cookie-aware client writes the session cookie
    const supabaseAuth = await createClient();
    const { data, error } = await supabaseAuth.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token,
      type: "email",
    });

    if (error || !data.user) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
    }

    const user = data.user;

    // Create initial candidate record for new users (service client bypasses RLS)
    const supabase = createServiceClient();
    const { data: existing } = await supabase
      .from("candidates")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!existing) {
      const { error: insertError } = await supabase.from("candidates").insert({
        user_id: user.id,
        email: user.email ?? email,
        full_name: user.user_metadata?.full_name ?? name ?? "",
        phone: "",
        track: track ?? "support",
        status: "registered",
        readiness: "unscreened",
        profile_completeness: 10,
      });
      if (insertError) {
        console.error("Candidate insert error:", insertError);
        return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      isNew: !existing,
    });
  } catch (err) {
    console.error("OTP verify unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
