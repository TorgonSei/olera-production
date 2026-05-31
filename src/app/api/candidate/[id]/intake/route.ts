import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supabaseAuth = await createClient();
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const supabase = createServiceClient();

    const { data: candidate } = await supabase
      .from("candidates")
      .select("id, user_id")
      .eq("id", id)
      .single();

    if (!candidate || candidate.user_id !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await req.json();

    // Infer primary track from role interests
    const interests: string[] = body.role_interests ?? [];
    const trackMap: Record<string, string> = {
      support: "support", success: "success", assistant: "assistant", operations: "operations",
    };
    const primaryTrack = interests
      .map((i) => trackMap[i])
      .find(Boolean) ?? "support";

    const { error: updateError } = await supabase
      .from("candidates")
      .update({
        phone:            body.phone,
        role_interests:   interests,
        work_preferences: body.work_preferences ?? [],
        linkedin_url:     body.linkedin_url ?? null,
        intake_note:      body.intake_note ?? null,
        track:            primaryTrack as "support" | "success" | "assistant" | "operations",
        status:           "submitted",
        profile_completeness: 80,
        updated_at:       new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      console.error("Intake update error:", updateError);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Intake patch unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
