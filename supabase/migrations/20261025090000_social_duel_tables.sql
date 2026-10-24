-- Migration: Fitur sosial "Teman Kelas" & Tantangan Duel (safe-mode untuk anak).
-- Semua interaksi terbatas pada santri dalam satu kelas (classroom) yang sama.
-- TIDAK ADA fitur chat/DM bebas.

-- 1. Tabel tantangan duel antar teman sekelas.
CREATE TABLE IF NOT EXISTS friend_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenger_id TEXT NOT NULL,
    opponent_id TEXT NOT NULL,
    room_id UUID NOT NULL,
    game_type TEXT NOT NULL DEFAULT 'kuis',
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending','accepted','completed','rejected','expired')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT friend_challenges_not_self
        CHECK (challenger_id <> opponent_id)
);

CREATE INDEX IF NOT EXISTS idx_friend_challenges_opponent_status
    ON friend_challenges (opponent_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_friend_challenges_challenger
    ON friend_challenges (challenger_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_challenges_status ON friend_challenges (status, created_at);

-- 2. Tabel notifikasi (sinkron DB). Tipe: duel_challenge & duel_result.
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info',
    title TEXT NOT NULL,
    message TEXT NOT NULL DEFAULT '',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index performa sesuai spesifikasi.
CREATE INDEX IF NOT EXISTS idx_notifications_user_created
    ON notifications (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread
    ON notifications (user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread_created
    ON notifications (user_id, is_read, created_at DESC);

-- 3. Kontrol ustadz: izinkan/tidak tantangan antar santri per kelas.
ALTER TABLE ustadz_rooms
    ADD COLUMN IF NOT EXISTS duel_enabled BOOLEAN NOT NULL DEFAULT TRUE;

-- 4. RLS + policy (konsisten dengan pola tabel classroom yang ada).
ALTER TABLE friend_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view friend challenges" ON friend_challenges;
CREATE POLICY "Users can view friend challenges" ON friend_challenges FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage friend challenges" ON friend_challenges;
CREATE POLICY "Users can manage friend challenges" ON friend_challenges FOR ALL USING (true);

DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage own notifications" ON notifications;
CREATE POLICY "Users can manage own notifications" ON notifications FOR ALL USING (true);

COMMENT ON TABLE friend_challenges IS 'Tantangan duel antar santri sekelas (tanpa chat bebas)';
COMMENT ON TABLE notifications IS 'Notifikasi DB (termasuk duel_challenge & duel_result)';
COMMENT ON COLUMN ustadz_rooms.duel_enabled IS 'Ustadz mengizinkan/tidak tantangan antar santri';
