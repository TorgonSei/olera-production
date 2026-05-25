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
export type TrackType = "support" | "success" | "assistant";
export type ReadinessLevel = "ready" | "near_ready" | "developing" | "unscreened";
export type FitLevel = "strong" | "possible" | "stretch" | "poor";
export type CandidateStatus =
  | "registered"
  | "cv_uploaded"
  | "profile_parsed"
  | "gaps_filled"
  | "assessed"
  | "review_pending"
  | "active"
  | "placed"
  | "withdrawn";
export type RoleStatus = "draft" | "live" | "paused" | "filled" | "cancelled";
export type ApplicationStatus =
  | "shortlisted"
  | "presented"
  | "interview_requested"
  | "interviewing"
  | "offered"
  | "placed"
  | "rejected"
  | "withdrawn";
export type EmployerTier = "starter" | "growth" | "scale";
export type RemoteVerificationTier = "none" | "confirmed" | "verified";
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
  gap_target_role: string | null;
  gap_english_level: EnglishLevel | null;
  gap_salary_min_usd: number | null;
  gap_salary_max_usd: number | null;
  gap_availability_weeks: number | null;
  gap_contract_pref: ContractType | null;
  remote_verification: RemoteVerificationTier;
  internet_speed_mbps: number | null;
  setup_photo_path: string | null;
  assessment_completed_at: string | null;
  assessment_score: number | null;
  assessment_tier: AssessmentTier | null;
  profile_slug: string | null;
  profile_public: boolean;
  embedding: string | null;
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

export interface RoleRow {
  id: string;
  created_at: string;
  updated_at: string;
  employer_id: string;
  title: string;
  track: TrackType;
  status: RoleStatus;
  description: string | null;
  requirements: string[];
  tools_required: string[];
  salary_min_usd: number | null;
  salary_max_usd: number | null;
  contract_type: ContractType;
  remote: boolean;
  location_preference: string | null;
  shortlist_limit: number;
  placement_fee_usd: number | null;
  embedding: string | null;
}

export interface ApplicationRow {
  id: string;
  created_at: string;
  updated_at: string;
  candidate_id: string;
  role_id: string;
  employer_id: string;
  status: ApplicationStatus;
  fit_level: FitLevel | null;
  fit_score: number | null;
  fit_reasons: string[];
  shortlisted_at: string | null;
  presented_at: string | null;
  interview_requested_at: string | null;
  offered_at: string | null;
  placed_at: string | null;
  placement_fee_usd: number | null;
  payment_status: PaymentStatus | null;
  payment_reference: string | null;
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
      employers: {
        Row: EmployerRow;
        Insert: Partial<EmployerRow> & Pick<EmployerRow, "user_id" | "company_name" | "hq_country" | "contact_name" | "contact_email">;
        Update: Partial<EmployerRow>;
        Relationships: [];
      };
      roles: {
        Row: RoleRow;
        Insert: Partial<RoleRow> & Pick<RoleRow, "employer_id" | "title" | "track">;
        Update: Partial<RoleRow>;
        Relationships: [];
      };
      applications: {
        Row: ApplicationRow;
        Insert: Partial<ApplicationRow> & Pick<ApplicationRow, "candidate_id" | "role_id" | "employer_id">;
        Update: Partial<ApplicationRow>;
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
    Functions: {
      match_candidates: {
        Args: {
          query_embedding: string;
          match_threshold: number;
          match_count: number;
          filter_track?: TrackType;
        };
        Returns: Array<{
          id: string;
          full_name: string;
          track: TrackType;
          readiness: ReadinessLevel;
          fit_score: number;
          years_experience: number;
          tools: string[];
        }>;
      };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      track_type: TrackType;
      readiness_level: ReadinessLevel;
      fit_level: FitLevel;
      candidate_status: CandidateStatus;
      role_status: RoleStatus;
      application_status: ApplicationStatus;
      employer_tier: EmployerTier;
      assessment_tier: AssessmentTier;
    };
    CompositeTypes: Record<string, never>;
  };
}
