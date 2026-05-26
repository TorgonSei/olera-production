import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const NOTIFY_TO = "hello@olera.co";
const FROM = process.env.RESEND_FROM_ADDRESS ?? "hello@olera.co";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const SCORING_PROMPT = (track: string, prompt: string, response: string, scenarioScore: number) => `
You are a talent assessor for a customer operations platform. Score a candidate's written assessment.

Track: ${track}
Scenario prompt: "${prompt}"
Candidate's response: "${response}"

Score the written response 0-100 on these dimensions:
- Clarity (20pts): Is the response clear and well-structured?
- Empathy/Judgment (30pts): Does it show the right instincts for ${track}?
- Specificity (25pts): Are they concrete about what they'd actually do?
- Professionalism (25pts): Appropriate tone and language?

Also: The candidate scored ${scenarioScore}/3 on multiple choice scenarios.

Return ONLY valid JSON:
{
  "written_score": number (0-100),
  "total_score": number (0-100, weighted: 60% written + 40% scenarios),
  "tier": "pass" | "borderline" | "fail",
  "feedback": "2-3 sentence honest feedback for the candidate (positive and constructive)",
  "strengths": ["up to 2 specific strengths from their response"],
  "gaps": ["up to 2 specific gaps to work on"]
}

Tier rules:
- pass: total_score >= 65
- borderline: total_score 45-64
- fail: total_score < 45

Return ONLY the JSON object.`;

interface ScenarioResult {
  prompt: string;
  selected_index: number;
  correct: boolean;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Auth check — cookie-aware client
    const supabaseAuth = await createClient();
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    // Service client — bypasses RLS for all DB writes
    const supabase = createServiceClient();

    // Ownership check
    const { data: candidate } = await supabase
      .from("candidates")
      .select("id, user_id")
      .eq("id", id)
      .single();

    if (!candidate || candidate.user_id !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await req.json();
    const { track, written_prompt, written_response, scenarios, tool_ratings } = body as {
      track: string;
      written_prompt: string;
      written_response: string;
      scenarios: ScenarioResult[];
      tool_ratings: Record<string, number>;
    };

    // Score multiple choice
    const scenarioScore = scenarios.filter((s) => s.correct).length;

    // Score written with Claude
    let scoring = {
      written_score: 50,
      total_score: 50,
      tier: "borderline" as "pass" | "borderline" | "fail",
      feedback: "Your assessment has been received and will be reviewed.",
      strengths: [] as string[],
      gaps: [] as string[],
    };

    try {
      const message = await anthropic.messages.create({
        model: "claude-opus-4-5",
        max_tokens: 512,
        messages: [
          {
            role: "user",
            content: SCORING_PROMPT(track, written_prompt, written_response, scenarioScore),
          },
        ],
      });
      const raw = message.content[0].type === "text" ? message.content[0].text : "{}";
      scoring = { ...scoring, ...JSON.parse(raw) };
    } catch (scoreErr) {
      console.error("Assessment scoring error:", scoreErr);
      // Fallback: calculate basic score from scenarios
      scoring.total_score = Math.round((scenarioScore / 3) * 70) + 30;
      scoring.tier = scoring.total_score >= 65 ? "pass" : scoring.total_score >= 45 ? "borderline" : "fail";
    }

    // Build scenario fields for DB
    const s = scenarios;

    // Insert assessment record
    const { error: assessmentError } = await supabase.from("assessments").insert({
      candidate_id: id,
      track,
      written_prompt,
      written_response,
      written_score: scoring.written_score,
      scenario_1_prompt: s[0]?.prompt ?? "",
      scenario_1_response: String(s[0]?.selected_index ?? 0),
      scenario_1_score: s[0]?.correct ? 33 : 0,
      scenario_2_prompt: s[1]?.prompt ?? "",
      scenario_2_response: String(s[1]?.selected_index ?? 0),
      scenario_2_score: s[1]?.correct ? 33 : 0,
      scenario_3_prompt: s[2]?.prompt ?? "",
      scenario_3_response: String(s[2]?.selected_index ?? 0),
      scenario_3_score: s[2]?.correct ? 34 : 0,
      tool_ratings,
      total_score: scoring.total_score,
      tier: scoring.tier,
      ai_feedback: scoring.feedback,
    });

    if (assessmentError) {
      console.error("Assessment insert error:", assessmentError);
    }

    // Update candidate status and readiness.
    // "pass" → near_ready (pending team review, not auto-activated).
    // Only admin can promote to "ready".
    const readiness =
      scoring.tier === "fail" ? "developing" : "near_ready";

    await supabase
      .from("candidates")
      .update({
        status: "assessed",
        assessment_completed_at: new Date().toISOString(),
        assessment_score: scoring.total_score,
        assessment_tier: scoring.tier,
        readiness,
        profile_completeness: 85,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    // Notify the Olera team that a new assessment is ready to review
    const candidateName = candidate
      ? (await supabase.from("candidates").select("full_name, email, track").eq("id", id).single())?.data
      : null;
    const name = candidateName?.full_name ?? "A candidate";
    const candidateEmail = candidateName?.email ?? null;
    const trackLabel = { support: "Customer Support", success: "Customer Success", assistant: "Virtual / Executive Assistant" }[track] ?? track;
    const tierLabel = scoring.tier === "pass" ? "Pass" : scoring.tier === "borderline" ? "Borderline" : "Needs work";

    resend.emails.send({
      from: FROM,
      to: NOTIFY_TO,
      subject: `Assessment ready for review — ${name} (${tierLabel})`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;color:#1c1a16">
          <p style="font-size:12px;color:#888;font-family:monospace;text-transform:uppercase;letter-spacing:0.1em">Assessment complete</p>
          <h2 style="font-size:22px;font-weight:700;margin:8px 0 20px">${name} · ${trackLabel}</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #e3e3d8;color:#54625a;font-size:13px;width:140px">Score</td>
              <td style="padding:8px 0;border-bottom:1px solid #e3e3d8;font-size:13px;font-weight:600">${scoring.total_score}/100</td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #e3e3d8;color:#54625a;font-size:13px">Tier</td>
              <td style="padding:8px 0;border-bottom:1px solid #e3e3d8;font-size:13px">${tierLabel}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#54625a;font-size:13px">Scenarios correct</td>
              <td style="padding:8px 0;font-size:13px">${scenarioScore}/3</td>
            </tr>
          </table>
          ${scoring.feedback ? `<div style="background:#f4f1e8;border-radius:10px;padding:16px;margin-bottom:20px"><p style="font-size:13px;margin:0;color:#1c1a16">${scoring.feedback}</p></div>` : ""}
          <a href="https://olera.co/admin/candidates/${id}" style="display:inline-block;background:#1a2620;color:#f4f1e8;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600">Review candidate →</a>
          <p style="font-size:12px;color:#aaa;margin-top:24px">Olera · Nairobi</p>
        </div>
      `,
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      tier: scoring.tier,
      feedback: scoring.feedback,
      strengths: scoring.strengths,
      gaps: scoring.gaps,
    });
  } catch (err) {
    console.error("Assessment submit error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
