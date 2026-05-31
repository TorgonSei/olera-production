import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { company_name, contact_name, work_email, role_track, role_title, role_description } = body;
    if (!company_name || !contact_name || !work_email || !role_track || !role_title || !role_description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createServiceClient();

    const { error } = await supabase.from("employer_requests").insert({
      company_name,
      contact_name,
      work_email,
      company_website:  body.company_website ?? null,
      role_track,
      role_title,
      headcount:        body.headcount ?? 1,
      work_arrangement: body.work_arrangement ?? [],
      location_type:    body.location_type ?? [],
      timezone:         body.timezone ?? null,
      start_date:       body.start_date ?? null,
      role_description,
      daily_tasks:      body.daily_tasks ?? null,
      must_haves:       body.must_haves ?? null,
      nice_to_haves:    body.nice_to_haves ?? null,
      salary_range:     body.salary_range ?? null,
      deal_breakers:    body.deal_breakers ?? null,
      status:           "new_request",
    });

    if (error) {
      console.error("Employer request insert error:", error);
      return NextResponse.json({ error: "Failed to save request" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Employer request unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
