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
        status: "assessment_invited",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const firstName = candidate.full_name?.split(" ")[0] ?? "there";
    const assessmentUrl = `${APP_URL}/assessment/${id}`;

    resend.emails.send({
      from: FROM,
      to: candidate.email,
      subject: "You've been invited to complete your Olera assessment",
      html: `
        <div style="font-family:sans-serif;max-width:560px;color:#1c1a16">
          <p style="font-size:12px;color:#888;font-family:monospace;text-transform:uppercase;letter-spacing:0.1em">Olera</p>
          <h2 style="font-size:22px;font-weight:700;margin:8px 0 16px">Hi ${firstName}, you've been selected for the next step.</h2>
          <p style="font-size:15px;line-height:1.6;color:#54625a">
            We've reviewed your profile and would like you to complete a short assessment. It takes about 20 minutes and covers a written scenario, some judgment questions, and a quick tool check.
          </p>
          <p style="font-size:15px;line-height:1.6;color:#54625a">
            There are no right or wrong styles — we're looking for clear thinking and practical judgment.
          </p>
          <div style="margin:28px 0">
            <a href="${assessmentUrl}" style="display:inline-block;background:#1a2620;color:#f4f1e8;text-decoration:none;padding:12px 24px;border-radius:10px;font-size:14px;font-weight:600">Start assessment →</a>
          </div>
          <p style="font-size:13px;color:#aaa;margin-top:28px">Olera · <a href="https://olera.africa" style="color:#c4823a">olera.africa</a></p>
        </div>
      `,
    }).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Invite assessment error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
