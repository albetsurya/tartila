-- Migration: Tabel panel ustadz — penugasan game, fokus materi,
-- bank kuis, pengerjaan kuis, log aktivitas, dan jejak baca materi.
-- Semua nama tabel memakai nama baru yang diminta maupun perluasan;
-- lapisan klien (quizBankService/ustadzMonitoringService) memakai tabel ini.
-- Catatan keamanan: kebijakan RLS di bawah setara kelas (aksess perluas
-- untuk MVP); ketatkan per-baris saat integrasi auth penuh.

CREATE TABLE IF NOT EXISTS ustadz_room_game_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES ustadz_rooms(id) ON DELETE CASCADE,
    game_id TEXT NOT NULL,
    assigned_by TEXT NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (room_id, game_id)
);

CREATE INDEX IF NOT EXISTS idx_ustadz_room_game_tasks_room
    ON ustadz_room_game_tasks(room_id);

CREATE TABLE IF NOT EXISTS ustadz_room_focus (
    room_id UUID PRIMARY KEY REFERENCES ustadz_rooms(id) ON DELETE CASCADE,
    materi JSONB NOT NULL DEFAULT '[]',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by TEXT NOT NULL,
    title VARCHAR(160) NOT NULL,
    materi TEXT NOT NULL,
    target_jilid INTEGER,
    room_id UUID REFERENCES ustadz_rooms(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quizzes_created_by ON quizzes(created_by);

CREATE TABLE IF NOT EXISTS quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    options JSONB NOT NULL,
    answer_index INTEGER NOT NULL CHECK (answer_index >= 0 AND answer_index < 4),
    position INTEGER NOT NULL DEFAULT 0,
    UNIQUE (quiz_id, position)
);

CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz
    ON quiz_questions(quiz_id, position);

CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    total INTEGER NOT NULL DEFAULT 0,
    answers JSONB NOT NULL DEFAULT '[]',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (quiz_id, user_id, submitted_at)
);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);

CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES ustadz_rooms(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    game_id TEXT NOT NULL,
    played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_room
    ON activity_logs(room_id, played_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user
    ON activity_logs(user_id);

CREATE TABLE IF NOT EXISTS materi_reads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES ustadz_rooms(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    materi_id TEXT NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (room_id, user_id, materi_id)
);

CREATE INDEX IF NOT EXISTS idx_materi_reads_room ON materi_reads(room_id);

COMMENT ON TABLE ustadz_room_game_tasks IS 'Penugasan game dari ustadz ke kelas (UNIQUE per kelas+game)';
COMMENT ON TABLE ustadz_room_focus IS 'Fokus materi kurikulum yang dipilih ustadz untuk kelas';
COMMENT ON TABLE quizzes IS 'Bank kuis buatan ustadz; room_id NULL = bank pribadi';
COMMENT ON TABLE quiz_questions IS 'Soal pilihan ganda: tepat 4 opsi, answer_index 0-3';
COMMENT ON TABLE quiz_attempts IS 'Hasil pengerjaan kuis oleh santri';
COMMENT ON TABLE activity_logs IS 'Log aktivitas santri (membuka materi/game) untuk monitoring ustadz';
COMMENT ON TABLE materi_reads IS 'Jejak santri membuka materi kurikulum (UNIQUE per kelas+santri+materi)';

-- Enable RLS & policies (pola sama dengan migrasi kelas)
ALTER TABLE ustadz_room_game_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ustadz_room_focus ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE materi_reads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view ustadz room game tasks" ON ustadz_room_game_tasks;
CREATE POLICY "Public can view ustadz room game tasks" ON ustadz_room_game_tasks FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can manage ustadz room game tasks" ON ustadz_room_game_tasks;
CREATE POLICY "Users can manage ustadz room game tasks" ON ustadz_room_game_tasks FOR ALL USING (true);

DROP POLICY IF EXISTS "Public can view ustadz room focus" ON ustadz_room_focus;
CREATE POLICY "Public can view ustadz room focus" ON ustadz_room_focus FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can manage ustadz room focus" ON ustadz_room_focus;
CREATE POLICY "Users can manage ustadz room focus" ON ustadz_room_focus FOR ALL USING (true);

DROP POLICY IF EXISTS "Public can view quizzes" ON quizzes;
CREATE POLICY "Public can view quizzes" ON quizzes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can manage quizzes" ON quizzes;
CREATE POLICY "Users can manage quizzes" ON quizzes FOR ALL USING (true);

DROP POLICY IF EXISTS "Public can view quiz questions" ON quiz_questions;
CREATE POLICY "Public can view quiz questions" ON quiz_questions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can manage quiz questions" ON quiz_questions;
CREATE POLICY "Users can manage quiz questions" ON quiz_questions FOR ALL USING (true);

DROP POLICY IF EXISTS "Public can view quiz attempts" ON quiz_attempts;
CREATE POLICY "Public can view quiz attempts" ON quiz_attempts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can manage quiz attempts" ON quiz_attempts;
CREATE POLICY "Users can manage quiz attempts" ON quiz_attempts FOR ALL USING (true);

DROP POLICY IF EXISTS "Public can view activity logs" ON activity_logs;
CREATE POLICY "Public can view activity logs" ON activity_logs FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can manage activity logs" ON activity_logs;
CREATE POLICY "Users can manage activity logs" ON activity_logs FOR ALL USING (true);

DROP POLICY IF EXISTS "Public can view materi reads" ON materi_reads;
CREATE POLICY "Public can view materi reads" ON materi_reads FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can manage materi reads" ON materi_reads;
CREATE POLICY "Users can manage materi reads" ON materi_reads FOR ALL USING (true);
