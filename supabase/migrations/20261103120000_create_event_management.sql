-- Event management: events, event_missions, user_event_progress.
-- Semua transaksi ekonomi (grant hadiah) hanya lewat Backend Go.
-- Idempoten: aman dijalankan ulang.

-- ============================================================================
-- 1. events
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  description text NOT NULL DEFAULT '',
  start_date  timestamptz NOT NULL,
  end_date    timestamptz NOT NULL,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT events_date_range_check CHECK (end_date >= start_date)
);

-- ============================================================================
-- 2. event_missions
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.event_missions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id       uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  title          text NOT NULL,
  action_type    text NOT NULL DEFAULT 'PLAY_GAME',
  target_amount  integer NOT NULL DEFAULT 1 CHECK (target_amount > 0),
  reward_coins   integer NOT NULL DEFAULT 0 CHECK (reward_coins >= 0),
  reward_tickets integer NOT NULL DEFAULT 0 CHECK (reward_tickets >= 0),
  reward_hearts  integer NOT NULL DEFAULT 0 CHECK (reward_hearts >= 0),
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_event_missions_event_id
  ON public.event_missions(event_id);

-- ============================================================================
-- 3. user_event_progress
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_event_progress (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    text NOT NULL,
  event_id   uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  mission_id uuid NOT NULL REFERENCES public.event_missions(id) ON DELETE CASCADE,
  progress   integer NOT NULL DEFAULT 0 CHECK (progress >= 0),
  is_claimed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_event_progress_user_mission_key UNIQUE (user_id, mission_id)
);

CREATE INDEX IF NOT EXISTS idx_user_event_progress_user_event
  ON public.user_event_progress(user_id, event_id);

-- ============================================================================
-- 4. RLS
--    * events & event_missions: user login hanya boleh membaca.
--    * user_event_progress: user hanya boleh membaca dan update barisnya
--      sendiri. INSERT tetap milik Backend Go (service role).
-- ============================================================================
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_event_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "events_select_authenticated" ON public.events;
CREATE POLICY "events_select_authenticated" ON public.events
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "event_missions_select_authenticated" ON public.event_missions;
CREATE POLICY "event_missions_select_authenticated" ON public.event_missions
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "user_event_progress_select_own" ON public.user_event_progress;
CREATE POLICY "user_event_progress_select_own" ON public.user_event_progress
  FOR SELECT TO authenticated
  USING (user_id = auth.uid()::text);

DROP POLICY IF EXISTS "user_event_progress_update_own" ON public.user_event_progress;
CREATE POLICY "user_event_progress_update_own" ON public.user_event_progress
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid()::text)
  WITH CHECK (user_id = auth.uid()::text);

-- Klaim hadiah hanya boleh ditandai oleh Backend Go. Frontend tidak boleh
-- mengubah is_claimed secara langsung meskipun barisnya sendiri.
CREATE OR REPLACE FUNCTION public.protect_user_event_progress_claim()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
AS $fn$
BEGIN
  IF NEW.is_claimed IS DISTINCT FROM OLD.is_claimed
     AND current_user NOT IN ('postgres', 'service_role', 'supabase_admin') THEN
    RAISE EXCEPTION 'PERUBAHAN is_claimed DILARANG DARI CLIENT. KLAIM HADIAH HARUS LEWAT BACKEND GO.';
  END IF;

  IF NEW.user_id IS DISTINCT FROM OLD.user_id
     OR NEW.event_id IS DISTINCT FROM OLD.event_id
     OR NEW.mission_id IS DISTINCT FROM OLD.mission_id THEN
    RAISE EXCEPTION 'user_id, event_id, dan mission_id tidak boleh diubah.';
  END IF;

  NEW.updated_at := now();
  RETURN NEW;
END;
$fn$;

DROP TRIGGER IF EXISTS trg_protect_user_event_progress_claim ON public.user_event_progress;
CREATE TRIGGER trg_protect_user_event_progress_claim
  BEFORE UPDATE ON public.user_event_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_user_event_progress_claim();
