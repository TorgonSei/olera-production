import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_ADDRESS ?? "hello@olera.co";

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

    // If activating, bump completeness to 100
    if (readiness === "ready") {
      updateData.profile_completeness = 100;
    }

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

    // If activating, email the candidate to let them know
    if (readiness === "ready") {
      const { data: c } = await supabase
        .from("candidates")
        .select("full_name, email, track, profile_slug")
        .eq("id", id)
        .single();

      if (c?.email) {
        const firstName = c.full_name?.split(" ")[0] ?? "there";
        const TRACK_LABELS: Record<string, string> = {
          support: "Customer Support",
          success: "Customer Success",
          assistant: "Virtual / Executive Assistant",
        };
        const trackLabel = TRACK_LABELS[c.track] ?? c.track;
        const profileUrl = c.profile_slug
          ? `https://olera.co/p/${c.profile_slug}`
          : `https://olera.co/dashboard`;

        resend.emails.send({
          from: FROM,
          to: c.email,
          subject: "Your Olera profile is now active",
          html: `
            <div style="font-family:sans-serif;max-width:600px;color:#1c1a16">
              <p style="font-size:12px;color:#888;font-family:monospace;text-transform:uppercase;letter-spacing:0.1em">Olera</p>
              <h2 style="font-size:24px;font-weight:700;margin:8px 0 16px">You're Employer Ready, ${firstName}.</h2>
              <p style="font-size:15px;line-height:1.6;color:#54625a">
                Your profile has been reviewed and activated. You are now in the Olera talent pool for <strong style="color:#1c1a16">${trackLabel}</strong> roles.
              </p>
              <p style="font-size:15px;line-height:1.6;color:#54625a">
                When a role matches your profile, we'll reach out directly — you won't need to apply anywhere.
              </p>
              <div style="margin:28px 0;padding:16px 20px;background:#f4f1e8;border-radius:10px;border-left:3px solid #c4823a">
                <p style="margin:0;font-size:13px;color:#54625a">
                  <strong style="color:#1c1a16">What to do now:</strong> Make sure we have an email address or phone number we can reach you on. If anything about your availability or salary range changes, reply to this email.
                </p>
              </div>
              <a href="${profileUrl}" style="display:inline-block;background:#1a2620;color:#f4f1e8;text-decoration:none;padding:12px 24px;border-radius:10px;font-size:14px;font-weight:600">View my profile →</a>
              <p style="font-size:13px;color:#aaa;margin-top:28px">Olera · Nairobi, Kenya · <a href="https://olera.co" style="color:#c4823a">olera.co</a></p>
            </div>
          `,
        }).catch(console.error);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin readiness patch error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
