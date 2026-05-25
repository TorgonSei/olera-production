import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: "Phone number required" }, { status: 400 });
    }

    // Normalize to E.164
    const normalized = phone.replace(/\s+/g, "").replace(/^0/, "+254");

    const supabase = await createServiceClient();

    // Supabase phone OTP — requires Africa's Talking or Twilio SMS provider
    const { error } = await supabase.auth.signInWithOtp({
      phone: normalized,
    });

    if (error) {
      console.error("OTP send error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, phone: normalized });
  } catch (err) {
    console.error("OTP send unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
