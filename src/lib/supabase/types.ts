/* ─── Olera Database Types ────────────────────────────────────────────────────
   Typed definitions for Supabase client generics.
   Regenerate with: npx supabase gen types typescript --linked > src/lib/supabase/types.ts
──────────────────────────────────────────────────────────────────────────── */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/* ─── Enums ─────────────────────────────────────────────────────────────── */
export type TrackType = "support" | "success" | "assistant" | "operations";
export type ReadinessLevel = "ready" | "remote_ready" | "near_ready" | "developing" | "unscreened";
export type FitLevel = "strong" | "possible" | "stretch" | "poor";

// Candidate lifecycle — first half is candidate-triggered, second is admin-controlled
export type CandidateStatus =
  // Candidate-triggered
  | "registered"       // signed up, magic link clicked
  | "cv_uploaded"      // CV uploaded and parsed
  | "submitted"        // completed intake form — enters admin queue
  // Legacy (keep for backward compat)
  | "profile_parsed"
  | "gaps_filled"
  // Admin-controlled
  | "needs_review"
  | "keep_in_pool"
  | "screening_needed"
  | "screening_scheduled"
  | "screened"
  | "assessed"
  | "employer_ready"
  | "shortlisted"
  | "interview_requested"
  | "placed"
  | "rejected"
  | "archived"
  // Legacy admin statuses (keep for backward compat)
  | "assessment_invited"
  | "assessment_complete"
  | "interview_invited"
  | "review_pending"
  | "active"
  | "withdrawn";

export type EmployerRequestStatus =
  | "new_request"
  | "reviewing"
  | "can_support"
  | "cannot_support"
  | "need_more_info"
  | "shortlist_in_progress"
  | "shortlist_sent"
  | "interview_stage"
  | "offer_stage"
  | "hired"
  | "closed";

export type RoleStatus = "draft" | "live" | "paused" | "filled" | "cancelled";
export type EmployerTier = "starter" | "growth" | "scale";
export type ContractType = "full_time" | "part_time" | "contract";
export type EnglishLevel = "native" | "fluent" | "professional" | "conversational";
export type EducationLevel = "high_school" | "diploma" | "bachelor" | "master" | "phd" | "other";
export type AssessmentTier = "pass" | "borderline" | "fail";
export type PaymentStatus = "unpaid" | "invoiced" | "paid";

/* ─── Row shapes ────────────────────────────────────────────────────────── */
export interface CandidateRow {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  full_name: string;
  phone: string;
  email: string | null;
  location_city: string;
  location_country: string;
  status: CandidateStatus;
  track: TrackType;
  readiness: ReadinessLevel;
  profile_completeness: number;
  cv_file_path: string | null;
  cv_parsed_at: string | null;
  summary: string | null;
  years_experience: number | null;
  tools: string[];
  specialisations: string[];
  languages: string[];
  education_level: EducationLevel | null;
  // Intake fields (from gaps form, now intake form)
  role_interests: string[];
  work_preferences: string[];
  intake_note: string | null;
  linkedin_url: string | null;
  // Legacy gap fields (kept for existing records)
  gap_target_role: string | null;
  gap_english_level: EnglishLevel | null;
  gap_salary_min_usd: number | null;
  gap_salary_max_usd: number | null;
  gap_availability_weeks: number | null;
  gap_contract_pref: ContractType | null;
  // Assessment (admin-triggered, internal)
  assessment_completed_at: string | null;
  assessment_score: number | null;
  assessment_tier: AssessmentTier | null;
  // Profile
  profile_slug: string | null;
  profile_public: boolean;
  embedding: string | null;
  // Deprecated
  remote_verification?: string;
  internet_speed_mbps?: number | null;
  setup_photo_path?: string | null;
}

export interface EmployerRequestRow {
  id: string;
  created_at: string;
  updated_at: string;
  company_name: string;
  contact_name: string;
  work_email: string;
  company_website: string | null;
  role_track: string;
  role_title: string;
  headcount: number;
  work_arrangement: string[];
  location_type: string[];
  timezone: string | null;
  start_date: string | null;
  role_description: string;
  daily_tasks: string | null;
  required_tools: string[];
  must_haves: string | null;
  nice_to_haves: string | null;
  salary_range: string | null;
  deal_breakers: string | null;
  status: EmployerRequestStatus;
  admin_owner: string | null;
  admin_notes: string | null;
}

export interface CandidateNoteRow {
  id: string;
  created_at: string;
  candidate_id: string;
  admin_email: string | null;
  note: string;
  note_type: string;
}

export interface EmployerRow {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  company_name: string;
  company_website: string | null;
  industry: string | null;
  hq_country: string;
  team_size: string | null;
  tier: EmployerTier;
  contact_name: string;
  contact_title: string | null;
  contact_email: string;
  contact_phone: string | null;
  verified: boolean;
  msa_accepted_at: string | null;
  msa_accepted_ip: string | null;
}

export interface AssessmentRow {
  id: string;
  created_at: string;
  candidate_id: string;
  track: TrackType;
  written_prompt: string;
  written_response: string;
  written_score: number | null;
  scenario_1_prompt: string;
  scenario_1_response: string;
  scenario_1_score: number | null;
  scenario_2_prompt: string;
  scenario_2_response: string;
  scenario_2_score: number | null;
  scenario_3_prompt: string;
  scenario_3_response: string;
  scenario_3_score: number | null;
  tool_ratings: Json;
  total_score: number | null;
  tier: AssessmentTier | null;
  ai_feedback: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
}

/* ─── Database interface (Supabase generic) ─────────────────────────────── */
export interface Database {
  public: {
    Tables: {
      candidates: {
        Row: CandidateRow;
        Insert: Partial<CandidateRow> & Pick<CandidateRow, "user_id" | "phone" | "track">;
        Update: Partial<CandidateRow>;
        Relationships: [];
      };
      employer_requests: {
        Row: EmployerRequestRow;
        Insert: Partial<EmployerRequestRow> & Pick<EmployerRequestRow, "company_name" | "contact_name" | "work_email" | "role_track" | "role_title" | "role_description">;
        Update: Partial<EmployerRequestRow>;
        Relationships: [];
      };
      candidate_notes: {
        Row: CandidateNoteRow;
        Insert: Partial<CandidateNoteRow> & Pick<CandidateNoteRow, "candidate_id" | "note">;
        Update: Partial<CandidateNoteRow>;
        Relationships: [];
      };
      employers: {
        Row: EmployerRow;
        Insert: Partial<EmployerRow> & Pick<EmployerRow, "user_id" | "company_name" | "hq_country" | "contact_name" | "contact_email">;
        Update: Partial<EmployerRow>;
        Relationships: [];
      };
      assessments: {
        Row: AssessmentRow;
        Insert: Partial<AssessmentRow> & Pick<AssessmentRow, "candidate_id" | "track" | "written_prompt" | "written_response">;
        Update: Partial<AssessmentRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      track_type: TrackType;
      readiness_level: ReadinessLevel;
      candidate_status: CandidateStatus;
      employer_request_status: EmployerRequestStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
