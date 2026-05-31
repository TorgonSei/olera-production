import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const CV_PARSE_PROMPT = `You are an expert CV parser for a customer operations talent platform.

Extract the following from this CV and return ONLY valid JSON (no markdown, no explanation):

{
  "full_name": "string",
  "email": "string | null",
  "location_city": "string",
  "location_country": "string",
  "years_experience": number,
  "summary": "2-3 sentences covering: years of experience, key tools, role type, and one honest signal about fit (e.g. strong, junior, no relevant ops experience). Useful for a recruiter scanning quickly.",
  "tools": ["array of software tools mentioned"],
  "specialisations": ["array of specialisations, e.g. 'B2B SaaS', 'Technical Support', 'Churn Prevention'"],
  "languages": ["array of languages spoken"],
  "education_level": "high_school | diploma | bachelor | master | phd | other",
  "track_signals": {
    "support": number,
    "success": number,
    "assistant": number
  }
}

Rules:
- track_signals: score 0-100 for how well the CV matches each track (support, success, assistant)
- tools: only include professional software (Zendesk, Salesforce, Intercom, HubSpot, Jira, Notion, etc.)
- years_experience: total relevant customer ops experience as a number
- If a field cannot be determined, use null
- Return ONLY the JSON object, nothing else`;

export async function POST(req: NextRequest) {
  try {
    // Auth check — use cookie-aware client so the session is read correctly
    const supabaseAuth = await createClient();
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();

    // Service client — plain supabase-js, no cookie injection, bypasses RLS
    const supabase = createServiceClient();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const form = await req.formData();
    const file = form.get("cv") as File | null;
    const track = (form.get("track") as string) ?? "support";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are accepted" }, { status: 400 });
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    // Upload to Supabase Storage
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = `cvs/${user.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    const { error: storageError } = await supabase.storage
      .from("candidate-docs")
      .upload(filePath, buffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (storageError) {
      console.error("Storage upload error:", storageError);
      return NextResponse.json({ error: "Failed to store CV" }, { status: 500 });
    }

    // Parse CV with Claude — send as base64 PDF
    const base64 = buffer.toString("base64");

    let parsed: Record<string, unknown> = {};
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfBlock: any = {
        type: "document",
        source: {
          type: "base64",
          media_type: "application/pdf",
          data: base64,
        },
      };

      const message = await anthropic.messages.create({
        model: "claude-opus-4-5",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [
              pdfBlock,
              {
                type: "text",
                text: CV_PARSE_PROMPT,
              },
            ],
          },
        ],
      });

      const raw = message.content[0].type === "text" ? message.content[0].text : "";
      parsed = JSON.parse(raw);
    } catch (parseErr) {
      console.error("CV parse error:", parseErr);
      // Continue with empty parsed — candidate fills gaps manually
    }

    // Determine best track from signals if not explicitly chosen
    const signals = (parsed.track_signals as Record<string, number>) ?? {};
    const inferredTrack =
      track !== "support" && track !== "success" && track !== "assistant"
        ? Object.entries(signals).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "support"
        : track;

    // Upsert candidate record
    const candidateData = {
      user_id: user.id,
      phone: user.phone ?? "",
      full_name: (parsed.full_name as string) ?? "",
      email: (parsed.email as string) ?? null,
      location_city: (parsed.location_city as string) ?? "",
      location_country: (parsed.location_country as string) ?? "",
      track: inferredTrack as "support" | "success" | "assistant",
      status: "cv_uploaded" as const,
      cv_file_path: filePath,
      cv_parsed_at: new Date().toISOString(),
      summary: (parsed.summary as string) ?? null,
      years_experience: (parsed.years_experience as number) ?? null,
      tools: (parsed.tools as string[]) ?? [],
      specialisations: (parsed.specialisations as string[]) ?? [],
      languages: (parsed.languages as string[]) ?? [],
      education_level: (parsed.education_level as string) ?? null,
      readiness: "unscreened" as const,
      profile_completeness: 25,
    };

    const { data: candidate, error: dbError } = await supabase
      .from("candidates")
      .upsert(candidateData, { onConflict: "user_id" })
      .select("id")
      .single();

    if (dbError || !candidate) {
      console.error("DB upsert error:", dbError);
      return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      candidateId: candidate.id,
      parsed: {
        full_name: parsed.full_name,
        track: inferredTrack,
        years_experience: parsed.years_experience,
        tools_count: (parsed.tools as string[] | undefined)?.length ?? 0,
      },
    });
  } catch (err) {
    console.error("CV upload unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
