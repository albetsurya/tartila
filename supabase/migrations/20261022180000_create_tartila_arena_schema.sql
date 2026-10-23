-- Migration: Create Tartila Arena Schema (Real-time Multiplayer Quiz & Exam Center)
-- Includes rooms, questions, players, answers, violations, and user onboarding columns

-- 1. Alter users table for role & onboarding (Tahap 9)
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS role VARCHAR(30) DEFAULT 'santri';
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS is_onboarded BOOLEAN DEFAULT false;

-- 2. Create rooms table (Tahap 1 & Tahap 7)
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_id TEXT NOT NULL,
    pin VARCHAR(6) UNIQUE NOT NULL,
    room_type VARCHAR(30) NOT NULL DEFAULT 'latihan' CHECK (room_type IN ('latihan', 'kuis_harian', 'ujian_resmi')),
    status VARCHAR(20) NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'finished')),
    current_question_index INTEGER NOT NULL DEFAULT 0,
    kkm INTEGER NOT NULL DEFAULT 75,
    exam_token VARCHAR(8),
    is_randomized BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for PIN lookup & active rooms
CREATE INDEX IF NOT EXISTS idx_rooms_pin ON rooms(pin);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);
CREATE INDEX IF NOT EXISTS idx_rooms_host_id ON rooms(host_id);

-- 3. Create room_questions table (Tahap 1)
CREATE TABLE IF NOT EXISTS room_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    question_type VARCHAR(30) NOT NULL DEFAULT 'text' CHECK (question_type IN ('text', 'audio', 'fill_blank')),
    category VARCHAR(50) NOT NULL CHECK (category IN ('tilawati', 'tajwid', 'nabi')),
    question_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    options JSONB NOT NULL DEFAULT '[]'::jsonb,
    correct_answer TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_room_questions_room_id ON room_questions(room_id);

-- 4. Create room_players table (Tahap 1)
CREATE TABLE IF NOT EXISTS room_players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    user_id TEXT,
    nickname VARCHAR(100) NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_room_players_room_id ON room_players(room_id);
CREATE INDEX IF NOT EXISTS idx_room_players_score ON room_players(score DESC);

-- 5. Create room_answers table (Tahap 1)
CREATE TABLE IF NOT EXISTS room_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES room_players(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES room_questions(id) ON DELETE CASCADE,
    answer TEXT NOT NULL,
    time_taken_ms INTEGER NOT NULL DEFAULT 0,
    is_correct BOOLEAN NOT NULL DEFAULT false,
    score_awarded INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_room_answers_room_id ON room_answers(room_id);
CREATE INDEX IF NOT EXISTS idx_room_answers_player_id ON room_answers(player_id);
CREATE INDEX IF NOT EXISTS idx_room_answers_question_id ON room_answers(question_id);

-- 6. Create exam_violations table (Tahap 7: Anti-cheat)
CREATE TABLE IF NOT EXISTS exam_violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES room_players(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    violation_type VARCHAR(50) NOT NULL DEFAULT 'tab_switch',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exam_violations_player ON exam_violations(player_id);
CREATE INDEX IF NOT EXISTS idx_exam_violations_room ON exam_violations(room_id);

-- Enable Row Level Security (RLS) on new tables
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_violations ENABLE ROW LEVEL SECURITY;

-- Policies for anon & authenticated users (Tartila Arena access)
DROP POLICY IF EXISTS "Public can view rooms by pin" ON rooms;
CREATE POLICY "Public can view rooms by pin" ON rooms FOR SELECT USING (true);

DROP POLICY IF EXISTS "Host can create and update rooms" ON rooms;
CREATE POLICY "Host can create and update rooms" ON rooms FOR ALL USING (true);

DROP POLICY IF EXISTS "Public can view questions (minus answer via backend)" ON room_questions;
CREATE POLICY "Public can view questions (minus answer via backend)" ON room_questions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Host can manage questions" ON room_questions;
CREATE POLICY "Host can manage questions" ON room_questions FOR ALL USING (true);

DROP POLICY IF EXISTS "Players can view room players" ON room_players;
CREATE POLICY "Players can view room players" ON room_players FOR SELECT USING (true);

DROP POLICY IF EXISTS "Players can insert and update selves" ON room_players;
CREATE POLICY "Players can insert and update selves" ON room_players FOR ALL USING (true);

DROP POLICY IF EXISTS "Room answers accessible to participants" ON room_answers;
CREATE POLICY "Room answers accessible to participants" ON room_answers FOR ALL USING (true);

DROP POLICY IF EXISTS "Exam violations recordable" ON exam_violations;
CREATE POLICY "Exam violations recordable" ON exam_violations FOR ALL USING (true);
