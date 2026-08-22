-- ============================================================================
-- Nayan / Anukool: Privacy-First Safety Intelligence Schema & RLS Policies
-- ============================================================================

-- 1. Trusted Contacts Table
CREATE TABLE IF NOT EXISTS public.trusted_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  contact_method TEXT NOT NULL CHECK (contact_method IN ('WhatsApp', 'SMS', 'Phone Call')),
  contact_value TEXT NOT NULL,
  avatar_color TEXT DEFAULT '#1E3A2F',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for trusted_contacts
ALTER TABLE public.trusted_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only view their own trusted contacts"
  ON public.trusted_contacts FOR SELECT
  USING (auth.uid()::text = user_id OR user_id = 'guest-citizen');

CREATE POLICY "Users can insert their own trusted contacts"
  ON public.trusted_contacts FOR INSERT
  WITH CHECK (auth.uid()::text = user_id OR user_id = 'guest-citizen');

CREATE POLICY "Users can update their own trusted contacts"
  ON public.trusted_contacts FOR UPDATE
  USING (auth.uid()::text = user_id OR user_id = 'guest-citizen');

CREATE POLICY "Users can delete their own trusted contacts"
  ON public.trusted_contacts FOR DELETE
  USING (auth.uid()::text = user_id OR user_id = 'guest-citizen');


-- 2. Trusted Requests Table (Ephemeral Second Opinion Requests)
CREATE TABLE IF NOT EXISTS public.trusted_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  trusted_contact_id UUID REFERENCES public.trusted_contacts(id) ON DELETE CASCADE,
  contact_name TEXT NOT NULL,
  contact_relationship TEXT NOT NULL,
  reason TEXT NOT NULL,
  risk_level TEXT NOT NULL,
  minimal_context JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  response TEXT CHECK (response IN ('looks_safe', 'dont_proceed', 'call_me')),
  response_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '2 hours'),
  responded_at TIMESTAMPTZ
);

ALTER TABLE public.trusted_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own requests"
  ON public.trusted_requests FOR SELECT
  USING (auth.uid()::text = user_id OR user_id = 'guest-citizen');

CREATE POLICY "Users can insert requests for their contacts"
  ON public.trusted_requests FOR INSERT
  WITH CHECK (auth.uid()::text = user_id OR user_id = 'guest-citizen');

CREATE POLICY "Anyone with valid request id can respond"
  ON public.trusted_requests FOR UPDATE
  USING (true);


-- 3. Scam Attempts & History Table
CREATE TABLE IF NOT EXISTS public.scam_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  scenario_id TEXT NOT NULL,
  selected_option_id TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  category TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.scam_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own simulation attempts"
  ON public.scam_attempts FOR SELECT
  USING (auth.uid()::text = user_id OR user_id = 'guest-citizen');

CREATE POLICY "Users can record their simulation attempts"
  ON public.scam_attempts FOR INSERT
  WITH CHECK (auth.uid()::text = user_id OR user_id = 'guest-citizen');


-- 4. Safety Progress / Educational Score Table
CREATE TABLE IF NOT EXISTS public.safety_progress (
  user_id TEXT PRIMARY KEY,
  score INTEGER DEFAULT 70 CHECK (score >= 0 AND score <= 100),
  total_attempts INTEGER DEFAULT 0,
  correct_attempts INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 1,
  monthly_improvement_percentage INTEGER DEFAULT 12,
  weak_categories JSONB DEFAULT '[]'::jsonb,
  completed_scenario_ids JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.safety_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own safety progress"
  ON public.safety_progress FOR SELECT
  USING (auth.uid()::text = user_id OR user_id = 'guest-citizen');

CREATE POLICY "Users can update their own safety progress"
  ON public.safety_progress FOR ALL
  USING (auth.uid()::text = user_id OR user_id = 'guest-citizen');
