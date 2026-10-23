-- Migration: Tabel kelas (classroom) untuk fitur Ustadz/Ustadzah
-- Ustadz membuat kelas; santri bergabung lewat kode join; admin memantau (read-only).

CREATE TABLE IF NOT EXISTS ustadz_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ustadz_id TEXT NOT NULL,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    target_jilid INTEGER NOT NULL DEFAULT 1,
    join_code VARCHAR(8) NOT NULL,
    password_hash TEXT,
    max_participants INTEGER NOT NULL DEFAULT 10,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Satu kode join harus unik di antara kelas aktif
CREATE UNIQUE INDEX IF NOT EXISTS idx_ustadz_rooms_join_code
    ON ustadz_rooms(join_code) WHERE is_active = TRUE AND archived = FALSE;
CREATE INDEX IF NOT EXISTS idx_ustadz_rooms_ustadz_id ON ustadz_rooms(ustadz_id);

CREATE TABLE IF NOT EXISTS ustadz_room_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES ustadz_rooms(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    role_in_room VARCHAR(20) NOT NULL DEFAULT 'murid'
        CHECK (role_in_room IN ('ustadz', 'murid')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (room_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_ustadz_room_participants_room
    ON ustadz_room_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_ustadz_room_participants_user
    ON ustadz_room_participants(user_id);

COMMENT ON TABLE ustadz_rooms IS 'Kelas yang dibuat ustadz/ustadzah; santri join via join_code';
COMMENT ON TABLE ustadz_room_participants IS 'Anggota kelas: ustadz (pengajar) atau murid (santri)';

-- Enable RLS & policies
ALTER TABLE ustadz_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE ustadz_room_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active ustadz rooms" ON ustadz_rooms;
CREATE POLICY "Public can view active ustadz rooms" ON ustadz_rooms FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage ustadz rooms" ON ustadz_rooms;
CREATE POLICY "Users can manage ustadz rooms" ON ustadz_rooms FOR ALL USING (true);

DROP POLICY IF EXISTS "Public can view ustadz room participants" ON ustadz_room_participants;
CREATE POLICY "Public can view ustadz room participants" ON ustadz_room_participants FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage ustadz room participants" ON ustadz_room_participants;
CREATE POLICY "Users can manage ustadz room participants" ON ustadz_room_participants FOR ALL USING (true);
