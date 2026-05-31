import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Auth check — cookie-aware client
    const supabaseAuth = await createClient();
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    // Service client — bypasses RLS for DB writes
    const supabase = createServiceClient();

    // Ensure candidate belongs to this user
    const { data: candidate } = await supabase
      .from("candidates")
      .select("id, user_id")
      .eq("id", id)
      .single();

    if (!candidate || candidate.user_id !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await req.json();

    const { error: updateError } = await supabase
      .from("candidates")
      .update({
        full_name: body.full_name,
        gap_target_role: body.gap_target_role,
        gap_english_level: body.gap_english_level,
        gap_availability_weeks: body.gap_availability_weeks,
        gap_contract_pref: body.gap_contract_pref,
        status: "gaps_filled",
        profile_completeness: body.profile_completeness ?? 60,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      console.error("Gap update error:", updateError);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Gap patch unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
