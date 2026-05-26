import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceClient();

    const { data } = await supabase
      .from("candidates")
      .select("track")
      .eq("id", id)
      .single();

    return NextResponse.json({ track: data?.track ?? "support" });
  } catch {
    return NextResponse.json({ track: "support" });
  }
}
