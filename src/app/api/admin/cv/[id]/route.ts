import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServiceClient();

    // Auth — admin only
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

    const isAdmin = user.user_metadata?.role === "admin";
    if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Get candidate record
    const { data: candidate } = await supabase
      .from("candidates")
      .select("cv_file_path, full_name")
      .eq("id", id)
      .single();

    if (!candidate?.cv_file_path) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    // Create signed URL (valid 60 seconds — enough to stream to browser)
    const { data: signedData, error: signedError } = await supabase.storage
      .from("candidate-docs")
      .createSignedUrl(candidate.cv_file_path, 60);

    if (signedError || !signedData?.signedUrl) {
      console.error("Signed URL error:", signedError);
      return NextResponse.json({ error: "Could not generate download link" }, { status: 500 });
    }

    // Redirect to the signed URL — browser downloads the PDF
    return NextResponse.redirect(signedData.signedUrl);
  } catch (err) {
    console.error("Admin CV download error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
