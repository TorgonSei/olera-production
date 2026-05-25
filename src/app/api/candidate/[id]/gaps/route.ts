import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServiceClient();

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

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

    // Validate salary range
    if (body.gap_salary_min_usd && body.gap_salary_max_usd) {
      if (Number(body.gap_salary_min_usd) > Number(body.gap_salary_max_usd)) {
        return NextResponse.json(
          { error: "Minimum salary cannot exceed maximum" },
          { status: 400 }
        );
      }
    }

    const { error: updateError } = await supabase
      .from("candidates")
      .update({
        full_name: body.full_name,
        gap_target_role: body.gap_target_role,
        gap_english_level: body.gap_english_level,
        gap_salary_min_usd: body.gap_salary_min_usd,
        gap_salary_max_usd: body.gap_salary_max_usd,
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
