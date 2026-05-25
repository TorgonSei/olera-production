-- ─── Olera MVP — Initial Schema ──────────────────────────────────────────────
-- Run against: Supabase Postgres (16+)
-- Extensions: pgvector for semantic matching
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ─── ENUMS ────────────────────────────────────────────────────────────────────

CREATE TYPE track_type AS ENUM ('support', 'success', 'assistant');
CREATE TYPE readiness_level AS ENUM ('ready', 'near_ready', 'developing', 'unscreened');
CREATE TYPE fit_level AS ENUM ('strong', 'possible', 'stretch', 'poor');
CREATE TYPE candidate_status AS ENUM (
  'registered', 'cv_uploaded', 'profile_parsed', 'gaps_filled',
  'assessed', 'review_pending', 'active', 'placed', 'withdrawn'
);
CREATE TYPE role_status AS ENUM ('draft', 'live', 'paused', 'filled', 'cancelled');
CREATE TYPE application_status AS ENUM (
  'shortlisted', 'presented', 'interview_requested', 'interviewing',
  'offered', 'placed', 'rejected', 'withdrawn'
);
CREATE TYPE employer_tier AS ENUM ('starter', 'growth', 'scale');
CREATE TYPE remote_verification_tier AS ENUM ('none', 'confirmed', 'verified');
CREATE TYPE contract_type AS ENUM ('full_time', 'part_time', 'contract');
CREATE TYPE english_level AS ENUM ('native', 'fluent', 'professional', 'conversational');
CREATE TYPE education_level AS ENUM ('high_school', 'diploma', 'bachelor', 'master', 'phd', 'other');
CREATE TYPE assessment_tier AS ENUM ('pass', 'borderline', 'fail');
CREATE TYPE payment_status AS ENUM ('unpaid', 'invoiced', 'paid');

-- ─── CANDIDATES ────────────────────────────────────────────────────────────────

CREATE TABLE candidates (
  id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id                  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Identity
  full_name                TEXT NOT NULL DEFAULT '',
  phone                    TEXT NOT NULL,
  email                    TEXT,
  location_city            TEXT NOT NULL DEFAULT '',
  location_country         TEXT NOT NULL DEFAULT '',

  -- Profile state
  status                   candidate_status NOT NULL DEFAULT 'registered',
  track                    track_type NOT NULL DEFAULT 'support',
  readiness                readiness_level NOT NULL DEFAULT 'unscreened',
  profile_completeness     SMALLINT NOT NULL DEFAULT 0 CHECK (profile_completeness BETWEEN 0 AND 100),

  -- CV
  cv_file_path             TEXT,
  cv_parsed_at             TIMESTAMPTZ,

  -- Parsed from CV
  summary                  TEXT,
  years_experience         SMALLINT,
  tools                    TEXT[] NOT NULL DEFAULT '{}',
  specialisations          TEXT[] NOT NULL DEFAULT '{}',
  languages                TEXT[] NOT NULL DEFAULT '{}',
  education_level          education_level,

  -- Gap fields (6 key signals not on CV)
  gap_target_role          TEXT,
  gap_english_level        english_level,
  gap_salary_min_usd       INTEGER,
  gap_salary_max_usd       INTEGER,
  gap_availability_weeks   SMALLINT,
  gap_contract_pref        contract_type,

  -- Remote verification
  remote_verification      remote_verification_tier NOT NULL DEFAULT 'none',
  internet_speed_mbps      DECIMAL(6,1),
  setup_photo_path         TEXT,

  -- Assessment
  assessment_completed_at  TIMESTAMPTZ,
  assessment_score         SMALLINT CHECK (assessment_score BETWEEN 0 AND 100),
  assessment_tier          assessment_tier,

  -- Sharing
  profile_slug             TEXT UNIQUE,
  profile_public           BOOLEAN NOT NULL DEFAULT FALSE,

  -- Vector embedding for semantic matching
  embedding                vector(1536),

  CONSTRAINT unique_user_candidate UNIQUE (user_id),
  CONSTRAINT salary_range_check CHECK (
    gap_salary_min_usd IS NULL OR gap_salary_max_usd IS NULL OR
    gap_salary_min_usd <= gap_salary_max_usd
  )
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER candidates_updated_at
  BEFORE UPDATE ON candidates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Indexes
CREATE INDEX idx_candidates_user_id       ON candidates (user_id);
CREATE INDEX idx_candidates_status        ON candidates (status);
CREATE INDEX idx_candidates_readiness     ON candidates (readiness);
CREATE INDEX idx_candidates_track         ON candidates (track);
CREATE INDEX idx_candidates_slug          ON candidates (profile_slug) WHERE profile_slug IS NOT NULL;
CREATE INDEX idx_candidates_embedding     ON candidates USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100) WHERE embedding IS NOT NULL;

-- ─── EMPLOYERS ─────────────────────────────────────────────────────────────────

CREATE TABLE employers (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  company_name      TEXT NOT NULL,
  company_website   TEXT,
  industry          TEXT,
  hq_country        TEXT NOT NULL,
  team_size         TEXT,
  tier              employer_tier NOT NULL DEFAULT 'starter',

  contact_name      TEXT NOT NULL,
  contact_title     TEXT,
  contact_email     TEXT NOT NULL,
  contact_phone     TEXT,

  verified          BOOLEAN NOT NULL DEFAULT FALSE,
  msa_accepted_at   TIMESTAMPTZ,
  msa_accepted_ip   INET,

  CONSTRAINT unique_user_employer UNIQUE (user_id)
);

CREATE TRIGGER employers_updated_at
  BEFORE UPDATE ON employers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_employers_user_id ON employers (user_id);
CREATE INDEX idx_employers_verified ON employers (verified);

-- ─── ROLES ─────────────────────────────────────────────────────────────────────

CREATE TABLE roles (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  employer_id         UUID NOT NULL REFERENCES employers(id) ON DELETE CASCADE,

  title               TEXT NOT NULL,
  track               track_type NOT NULL,
  status              role_status NOT NULL DEFAULT 'draft',

  description         TEXT,
  requirements        TEXT[] NOT NULL DEFAULT '{}',
  tools_required      TEXT[] NOT NULL DEFAULT '{}',
  salary_min_usd      INTEGER,
  salary_max_usd      INTEGER,
  contract_type       contract_type NOT NULL DEFAULT 'full_time',
  remote              BOOLEAN NOT NULL DEFAULT TRUE,
  location_preference TEXT,

  shortlist_limit     SMALLINT NOT NULL DEFAULT 5,
  placement_fee_usd   INTEGER,

  -- Vector for semantic matching
  embedding           vector(1536),

  CONSTRAINT salary_range_check CHECK (
    salary_min_usd IS NULL OR salary_max_usd IS NULL OR
    salary_min_usd <= salary_max_usd
  )
);

CREATE TRIGGER roles_updated_at
  BEFORE UPDATE ON roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_roles_employer_id ON roles (employer_id);
CREATE INDEX idx_roles_status       ON roles (status);
CREATE INDEX idx_roles_track        ON roles (track);
CREATE INDEX idx_roles_embedding    ON roles USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100) WHERE embedding IS NOT NULL;

-- ─── APPLICATIONS ──────────────────────────────────────────────────────────────

CREATE TABLE applications (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  candidate_id            UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  role_id                 UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  employer_id             UUID NOT NULL REFERENCES employers(id) ON DELETE CASCADE,

  status                  application_status NOT NULL DEFAULT 'shortlisted',
  fit_level               fit_level,
  fit_score               SMALLINT CHECK (fit_score BETWEEN 0 AND 100),
  fit_reasons             TEXT[] NOT NULL DEFAULT '{}',

  shortlisted_at          TIMESTAMPTZ,
  presented_at            TIMESTAMPTZ,
  interview_requested_at  TIMESTAMPTZ,
  offered_at              TIMESTAMPTZ,
  placed_at               TIMESTAMPTZ,

  placement_fee_usd       INTEGER,
  payment_status          payment_status,
  payment_reference       TEXT,

  CONSTRAINT unique_application UNIQUE (candidate_id, role_id)
);

CREATE TRIGGER applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_applications_candidate_id ON applications (candidate_id);
CREATE INDEX idx_applications_role_id      ON applications (role_id);
CREATE INDEX idx_applications_employer_id  ON applications (employer_id);
CREATE INDEX idx_applications_status       ON applications (status);

-- ─── ASSESSMENTS ───────────────────────────────────────────────────────────────

CREATE TABLE assessments (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  candidate_id          UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  track                 track_type NOT NULL,

  -- Written response
  written_prompt        TEXT NOT NULL,
  written_response      TEXT NOT NULL,
  written_score         SMALLINT CHECK (written_score BETWEEN 0 AND 100),

  -- Judgment scenarios (3)
  scenario_1_prompt     TEXT NOT NULL DEFAULT '',
  scenario_1_response   TEXT NOT NULL DEFAULT '',
  scenario_1_score      SMALLINT,
  scenario_2_prompt     TEXT NOT NULL DEFAULT '',
  scenario_2_response   TEXT NOT NULL DEFAULT '',
  scenario_2_score      SMALLINT,
  scenario_3_prompt     TEXT NOT NULL DEFAULT '',
  scenario_3_response   TEXT NOT NULL DEFAULT '',
  scenario_3_score      SMALLINT,

  -- Tool familiarity
  tool_ratings          JSONB NOT NULL DEFAULT '{}',

  -- Aggregate
  total_score           SMALLINT CHECK (total_score BETWEEN 0 AND 100),
  tier                  assessment_tier,
  ai_feedback           TEXT,
  reviewed_by           UUID REFERENCES auth.users(id),
  reviewed_at           TIMESTAMPTZ
);

CREATE INDEX idx_assessments_candidate_id ON assessments (candidate_id);

-- ─── ADMIN NOTES ──────────────────────────────────────────────────────────────

CREATE TABLE admin_notes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  author_id     UUID NOT NULL REFERENCES auth.users(id),
  entity_type   TEXT NOT NULL, -- 'candidate' | 'employer' | 'role' | 'application'
  entity_id     UUID NOT NULL,
  note          TEXT NOT NULL,
  is_internal   BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_admin_notes_entity ON admin_notes (entity_type, entity_id);

-- ─── SEMANTIC MATCH FUNCTION ───────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION match_candidates(
  query_embedding   vector(1536),
  match_threshold   FLOAT DEFAULT 0.7,
  match_count       INT DEFAULT 10,
  filter_track      track_type DEFAULT NULL
)
RETURNS TABLE (
  id              UUID,
  full_name       TEXT,
  track           track_type,
  readiness       readiness_level,
  fit_score       INT,
  years_experience SMALLINT,
  tools           TEXT[]
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.full_name,
    c.track,
    c.readiness,
    (1 - (c.embedding <=> query_embedding) ) * 100 AS fit_score,
    c.years_experience,
    c.tools
  FROM candidates c
  WHERE
    c.embedding IS NOT NULL
    AND c.readiness IN ('ready', 'near_ready')
    AND c.profile_public = TRUE
    AND (filter_track IS NULL OR c.track = filter_track)
    AND 1 - (c.embedding <=> query_embedding) > match_threshold
  ORDER BY c.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- ─── ROW LEVEL SECURITY ────────────────────────────────────────────────────────

ALTER TABLE candidates   ENABLE ROW LEVEL SECURITY;
ALTER TABLE employers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notes  ENABLE ROW LEVEL SECURITY;

-- Helper: is current user an admin?
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  );
$$;

-- CANDIDATES — own record only, admins see all
CREATE POLICY "candidates_self_select"    ON candidates FOR SELECT
  USING (user_id = auth.uid() OR is_admin());
CREATE POLICY "candidates_self_insert"    ON candidates FOR INSERT
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "candidates_self_update"    ON candidates FOR UPDATE
  USING (user_id = auth.uid() OR is_admin());
-- Public profiles readable by anyone
CREATE POLICY "candidates_public_select"  ON candidates FOR SELECT
  USING (profile_public = TRUE AND readiness = 'ready');

-- EMPLOYERS — own record + admins
CREATE POLICY "employers_self_select"     ON employers FOR SELECT
  USING (user_id = auth.uid() OR is_admin());
CREATE POLICY "employers_self_insert"     ON employers FOR INSERT
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "employers_self_update"     ON employers FOR UPDATE
  USING (user_id = auth.uid() OR is_admin());

-- ROLES — employer sees own, candidates see live roles, admins see all
CREATE POLICY "roles_employer_select"     ON roles FOR SELECT
  USING (
    employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid())
    OR status = 'live'
    OR is_admin()
  );
CREATE POLICY "roles_employer_insert"     ON roles FOR INSERT
  WITH CHECK (employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid()));
CREATE POLICY "roles_employer_update"     ON roles FOR UPDATE
  USING (
    employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid())
    OR is_admin()
  );

-- APPLICATIONS — candidate sees own, employer sees for their roles, admins all
CREATE POLICY "applications_candidate_select" ON applications FOR SELECT
  USING (
    candidate_id IN (SELECT id FROM candidates WHERE user_id = auth.uid())
    OR employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid())
    OR is_admin()
  );
CREATE POLICY "applications_admin_insert"     ON applications FOR INSERT
  WITH CHECK (is_admin());
CREATE POLICY "applications_admin_update"     ON applications FOR UPDATE
  USING (
    employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid())
    OR is_admin()
  );

-- ASSESSMENTS — own only + admins
CREATE POLICY "assessments_self_select"   ON assessments FOR SELECT
  USING (
    candidate_id IN (SELECT id FROM candidates WHERE user_id = auth.uid())
    OR is_admin()
  );
CREATE POLICY "assessments_self_insert"   ON assessments FOR INSERT
  WITH CHECK (
    candidate_id IN (SELECT id FROM candidates WHERE user_id = auth.uid())
  );

-- ADMIN NOTES — admins only
CREATE POLICY "admin_notes_admin_only"    ON admin_notes FOR ALL
  USING (is_admin());

-- ─── STORAGE BUCKETS CONFIG (run via Supabase dashboard or CLI) ────────────────
-- CREATE BUCKET candidate-docs (private, 10MB max, PDF only)
-- CREATE BUCKET candidate-photos (private, 5MB max, image/*) for setup photos
