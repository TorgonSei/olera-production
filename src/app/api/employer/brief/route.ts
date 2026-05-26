import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const NOTIFY_TO = "hello@olera.co";
const FROM = process.env.RESEND_FROM_ADDRESS ?? "hello@olera.co";

const TRACK_LABELS: Record<string, string> = {
  support: "Customer Support",
  success: "Customer Success",
  assistant: "Virtual / Executive Assistant",
  unsure: "Not sure yet",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { company, track, description, email } = body as {
      company?: string;
      track?: string;
      description?: string;
      email?: string;
    };

    // Basic validation
    if (!email || !description) {
      return NextResponse.json(
        { error: "Email and role description are required." },
        { status: 400 }
      );
    }

    const trackLabel = TRACK_LABELS[track ?? ""] ?? track ?? "Not specified";
    const companyName = company?.trim() || "Not provided";
    const submittedAt = new Date().toLocaleString("en-GB", {
      timeZone: "Africa/Nairobi",
      dateStyle: "long",
      timeStyle: "short",
    });

    // ── 1. Notify Olera team ───────────────────────────────────────────────
    await resend.emails.send({
      from: FROM,
      to: NOTIFY_TO,
      replyTo: email,
      subject: `New role brief — ${companyName} (${trackLabel})`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; color: #1c1a16;">
          <p style="font-size: 12px; color: #888; font-family: monospace; text-transform: uppercase; letter-spacing: 0.1em;">
            New role brief · ${submittedAt} EAT
          </p>
          <h2 style="font-size: 24px; font-weight: 700; margin: 8px 0 24px;">
            ${companyName}
          </h2>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e3e3d8; color: #54625a; font-size: 13px; width: 140px;">Company</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e3e3d8; font-size: 13px;">${companyName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e3e3d8; color: #54625a; font-size: 13px;">Track</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e3e3d8; font-size: 13px;">${trackLabel}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #54625a; font-size: 13px;">Contact email</td>
              <td style="padding: 8px 0; font-size: 13px;">
                <a href="mailto:${email}" style="color: #c4823a;">${email}</a>
              </td>
            </tr>
          </table>

          <div style="background: #f4f1e8; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <p style="font-size: 12px; color: #888; font-family: monospace; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px;">
              Role description
            </p>
            <p style="font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${description.trim()}</p>
          </div>

          <p style="font-size: 12px; color: #aaa;">
            Submitted via olera.co/employer — reply to this email to respond to the employer.
          </p>
        </div>
      `,
    });

    // ── 2. Confirm receipt to employer ─────────────────────────────────────
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "We have your brief — Olera",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; color: #1c1a16;">
          <p style="font-size: 12px; color: #888; font-family: monospace; text-transform: uppercase; letter-spacing: 0.1em;">
            Olera
          </p>
          <h2 style="font-size: 24px; font-weight: 700; margin: 8px 0 16px;">
            We have your brief.
          </h2>
          <p style="font-size: 15px; line-height: 1.6; color: #54625a;">
            Thank you for sending the role brief. We will review it and get back to you within
            24 hours to let you know whether we have the right candidates — and if so,
            what the shortlist process looks like.
          </p>
          <p style="font-size: 15px; line-height: 1.6; color: #54625a;">
            If you have more to add or want to clarify something, reply to this email and it
            will reach us directly.
          </p>
          <div style="margin: 32px 0; padding: 16px 20px; background: #f4f1e8; border-radius: 10px; border-left: 3px solid #c4823a;">
            <p style="margin: 0; font-size: 13px; color: #54625a;">
              <strong style="color: #1c1a16;">Track:</strong> ${trackLabel}<br>
              <strong style="color: #1c1a16;">Company:</strong> ${companyName}
            </p>
          </div>
          <p style="font-size: 13px; color: #aaa;">
            Olera · Nairobi, Kenya · <a href="https://olera.co" style="color: #c4823a;">olera.co</a>
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Employer brief submission error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please email us directly at hello@olera.co" },
      { status: 500 }
    );
  }
}
