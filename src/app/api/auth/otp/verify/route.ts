import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { phone, token } = await req.json();

    if (!phone || !token) {
      return NextResponse.json({ error: "Phone and token required" }, { status: 400 });
    }

    const supabase = await createServiceClient();

    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: "sms",
    });

    if (error || !data.user) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
    }

    // Check if candidate record exists, create if not
    const { data: existing } = await supabase
      .from("candidates")
      .select("id")
      .eq("user_id", data.user.id)
      .single();

    return NextResponse.json({
      success: true,
      userId: data.user.id,
      isNew: !existing,
    });
  } catch (err) {
    console.error("OTP verify unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
