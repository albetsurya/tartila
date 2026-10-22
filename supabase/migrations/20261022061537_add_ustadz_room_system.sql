-- Add ustadz/ustadzah role and room system tables

-- 1. Add role column to users table if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS role_ustadz INTEGER DEFAULT 0 COMMENT '1 = ustadz, 2 = ustadzah';

-- 2. Create rooms table for ustadz classrooms
CREATE TABLE IF NOT EXISTS ustadz_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ustadz_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  password_hash VARCHAR(255), -- NULL = open room, hashed = password protected
  max_participants INTEGER DEFAULT 50,
  current_participants INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create room participants table (who's in which room)
CREATE TABLE IF NOT EXISTS ustadz_room_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES ustadz_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_in_room VARCHAR(50) DEFAULT 'murid', -- ustadz, ustadzah, murid
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  left_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(room_id, user_id)
);

-- 4. Create lessons/sessions table
CREATE TABLE IF NOT EXISTS ustadz_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES ustadz_rooms(id) ON DELETE CASCADE,
  ustadz_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  game_type VARCHAR(50) DEFAULT 'tilawati', -- tilawati, quiz, custom
  status VARCHAR(50) DEFAULT 'pending', -- pending, running, completed
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create questions/soal table
CREATE TABLE IF NOT EXISTS ustadz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES ustadz_lessons(id) ON DELETE CASCADE,
  type VARCHAR(50) DEFAULT 'multiple_choice', -- multiple_choice, true_false, fill_blank
  question TEXT NOT NULL,
  options JSONB, -- untuk multiple_choice/true_false
  correct_answer JSONB,
  tilawati_verse_id UUID REFERENCES tilawati_data(id), -- jika terkait ayat tilawati
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ustadz_rooms_ustadz_id ON ustadz_rooms(ustadz_id);
CREATE INDEX IF NOT EXISTS idx_ustadz_rooms_active ON ustadz_rooms(is_active);
CREATE INDEX IF NOT EXISTS idx_ustadz_room_participants_room_id ON ustadz_room_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_ustadz_room_participants_user_id ON ustadz_room_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_ustadz_lessons_room_id ON ustadz_lessons(room_id);
CREATE INDEX IF NOT EXISTS idx_ustadz_questions_lesson_id ON ustadz_questions(lesson_id);

-- 7. Add ustadz status to users (for quick check)
UPDATE users SET role_ustadz = 1 WHERE role IS NOT NULL AND role LIKE '%admin%';

COMMENT ON TABLE ustadz_rooms IS 'Ruang kelas ustadz/ustadzah untuk belajar bareng murid';
COMMENT ON TABLE ustadz_room_participants IS 'Daftar peserta di setiap ruang';
COMMENT ON TABLE ustadz_lessons IS 'Lesson/sesi belajar dalam ruang';
COMMENT ON TABLE ustadz_questions IS 'Soal/pertanyaan yang dibuat ustadz';

-- Insert default ustadz role for existing superadmin/admin (optional)
-- UPDATE users SET role_ustadz = 1 WHERE id IN (SELECT id FROM users WHERE role = 'superadmin');
