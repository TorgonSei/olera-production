import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { email, name, track } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email address required" }, { status: 400 });
    }

    const supabase = await createClient();

    const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://olera.africa";
    const params  = new URLSearchParams({
      track: track ?? "support",
      name:  (name ?? "").trim(),
    });
    const emailRedirectTo = `${siteUrl}/auth/callback?${params.toString()}`;

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        shouldCreateUser: true,
        emailRedirectTo,
        data: { full_name: (name ?? "").trim() },
      },
    });

    if (error) {
      console.error("OTP send error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("OTP send unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
