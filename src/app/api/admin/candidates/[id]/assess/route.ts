import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceClient();

    const { assessment_score, assessment_tier } = await req.json() as {
      assessment_score: number;
      assessment_tier: "pass" | "borderline" | "fail";
    };

    if (typeof assessment_score !== "number" || !assessment_tier) {
      return NextResponse.json({ error: "assessment_score and assessment_tier are required" }, { status: 400 });
    }

    const readiness = assessment_tier === "fail" ? "developing" : "near_ready";

    const { error } = await supabase
      .from("candidates")
      .update({
        status: "assessed",
        assessment_score,
        assessment_tier,
        readiness,
        assessment_completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin assess error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
