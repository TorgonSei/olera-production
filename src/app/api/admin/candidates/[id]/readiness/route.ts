import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServiceClient();

    // Admin auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

    const isAdmin = user.user_metadata?.role === "admin";
    if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { readiness, status } = await req.json();

    const updateData: Record<string, unknown> = {
      readiness,
      updated_at: new Date().toISOString(),
    };

    if (status) updateData.status = status;

    // If activating, generate a slug if one doesn't exist
    if (readiness === "ready") {
      const { data: candidate } = await supabase
        .from("candidates")
        .select("profile_slug, full_name")
        .eq("id", id)
        .single();

      if (candidate && !candidate.profile_slug) {
        const base = (candidate.full_name ?? "candidate")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .slice(0, 20);
        const slug = `${base}-${Math.random().toString(36).slice(2, 7)}`;
        updateData.profile_slug = slug;
        updateData.profile_public = true;
      }
    }

    const { error } = await supabase
      .from("candidates")
      .update(updateData)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin readiness patch error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
