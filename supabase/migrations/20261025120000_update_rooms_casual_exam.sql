-- Migration: Update Tartila Arena rooms for casual vs exam
ALTER TABLE IF EXISTS rooms DROP CONSTRAINT IF EXISTS rooms_room_type_check;
ALTER TABLE IF EXISTS rooms ADD CONSTRAINT rooms_room_type_check CHECK (room_type IN ('latihan', 'kuis_harian', 'ujian_resmi', 'casual', 'exam'));
ALTER TABLE IF EXISTS rooms ADD COLUMN IF NOT EXISTS room_code VARCHAR(6);
UPDATE rooms SET room_code = pin WHERE room_code IS NULL AND pin IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_rooms_room_code ON rooms(room_code);
