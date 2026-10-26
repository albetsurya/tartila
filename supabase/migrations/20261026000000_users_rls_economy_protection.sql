-- Bagian 8.5 (quick patch): cegah direct UPDATE kolom ekonomi dari frontend.
--
-- Aturan:
--   * Frontend (authenticated) boleh SELECT, dan UPDATE hanya pada baris sendiri.
--   * UPDATE ke coins, hearts, tickets, xp, is_vip dari non-service_role
--     DITOLAK dengan RAISE EXCEPTION (pesan tegas).
--   * service_role (Backend Go) selalu bypass.
--
-- Idempoten; tidak menimpa policy lain karena memakai DROP POLICY IF EXISTS.

DO $$
BEGIN
  IF to_regclass('public.users') IS NULL THEN
    RETURN;
  END IF;

  ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

  DROP POLICY IF EXISTS "users_select_authenticated" ON public.users;
  CREATE POLICY "users_select_authenticated" ON public.users
    FOR SELECT TO authenticated USING (true);

  DROP POLICY IF EXISTS "users_select_anon" ON public.users;
  CREATE POLICY "users_select_anon" ON public.users
    FOR SELECT TO anon USING (true);

  DROP POLICY IF EXISTS "users_update_own" ON public.users;
  CREATE POLICY "users_update_own" ON public.users
    FOR UPDATE TO authenticated
    USING (id::text = auth.uid()::text)
    WITH CHECK (id::text = auth.uid()::text);

  -- Trigger function: tolak perubahan kolom ekonomi dari client.
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc WHERE oid = 'public.protect_users_economy_columns()'::regprocedure
  ) THEN
    CREATE FUNCTION public.protect_users_economy_columns()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY INVOKER
    AS $fn$
    BEGIN
      IF current_user = 'service_role' THEN
        RETURN NEW;
      END IF;

      IF (NEW.coins IS DISTINCT FROM OLD.coins)
         OR (NEW.hearts IS DISTINCT FROM OLD.hearts)
         OR (NEW.tickets IS DISTINCT FROM OLD.tickets)
         OR (NEW.xp IS DISTINCT FROM OLD.xp)
         OR (NEW.is_vip IS DISTINCT FROM OLD.is_vip)
      THEN
        RAISE EXCEPTION 'DIRECT UPDATE TO ECONOMY COLUMNS (coins, hearts, tickets, xp, is_vip) IS FORBIDDEN. USE THE GO BACKEND API.';
      END IF;

      RETURN NEW;
    END;
    $fn$;
  END IF;

  DROP TRIGGER IF EXISTS trg_protect_economy ON public.users;
  CREATE TRIGGER trg_protect_economy
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.protect_users_economy_columns();
END $$;
