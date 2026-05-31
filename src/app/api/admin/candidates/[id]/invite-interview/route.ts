import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_ADDRESS ?? "hello@olera.co";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://olera.africa";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceClient();

    const { data: candidate, error: fetchError } = await supabase
      .from("candidates")
      .select("full_name, email, track")
      .eq("id", id)
      .single();

    if (fetchError || !candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    const { error } = await supabase
      .from("candidates")
      .update({
        status: "interview_invited",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const firstName = candidate.full_name?.split(" ")[0] ?? "there";
    const dashboardUrl = `${APP_URL}/dashboard`;

    resend.emails.send({
      from: FROM,
      to: candidate.email,
      subject: "Next step: interview with Olera",
      html: `
        <div style="font-family:sans-serif;max-width:560px;color:#1c1a16">
          <p style="font-size:12px;color:#888;font-family:monospace;text-transform:uppercase;letter-spacing:0.1em">Olera</p>
          <h2 style="font-size:22px;font-weight:700;margin:8px 0 16px">Hi ${firstName}, you're through to the interview stage.</h2>
          <p style="font-size:15px;line-height:1.6;color:#54625a">
            Your assessment went well and we'd like to schedule a short interview. This is a 20–30 minute conversation with a member of the Olera team to learn more about your background and what you're looking for.
          </p>
          <p style="font-size:15px;line-height:1.6;color:#54625a">
            We'll be in touch with a calendar link or time options shortly. Keep an eye on your inbox.
          </p>
          <div style="margin:28px 0">
            <a href="${dashboardUrl}" style="display:inline-block;background:#1a2620;color:#f4f1e8;text-decoration:none;padding:12px 24px;border-radius:10px;font-size:14px;font-weight:600">View my dashboard →</a>
          </div>
          <p style="font-size:13px;color:#aaa;margin-top:28px">Olera · <a href="https://olera.africa" style="color:#c4823a">olera.africa</a></p>
        </div>
      `,
    }).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Invite interview error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
