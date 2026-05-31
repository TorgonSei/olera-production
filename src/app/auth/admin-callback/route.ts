import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/admin/login?error=missing_code`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/admin/login?error=auth_failed`);
  }

  if (data.user.user_metadata?.role !== "admin") {
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/admin/login?error=not_admin`);
  }

  return NextResponse.redirect(`${origin}/admin/candidates`);
}
