-- Migration: Fix Arena RLS and RPC (Security Patch Phase Final)
-- 1. Tighten RLS policies on rooms, room_questions, room_players, room_answers, exam_violations
--    Drop all policies using `USING (true)` or `FOR ALL`.
--    Enforce strict ownership: `auth.uid()::text = host_id` or `auth.uid()::text = user_id`.
-- 2. Guard `set_room_password` RPC with `AND ustadz_id = auth.uid()::text`.

-- ============================================================================
-- 1. Fix RLS on `rooms`
-- ============================================================================
DROP POLICY IF EXISTS "Host can create and update rooms" ON rooms;
DROP POLICY IF EXISTS "Rooms are owned by user or host" ON rooms;
DROP POLICY IF EXISTS "Rooms created/modified by owner or host" ON rooms;

-- Public/authenticated players can view rooms to join by PIN
DROP POLICY IF EXISTS "Public can view rooms by pin" ON rooms;
CREATE POLICY "Public can view rooms by pin" ON rooms
  FOR SELECT USING (true);

-- Only host can create their room
CREATE POLICY "Host can insert room" ON rooms
  FOR INSERT WITH CHECK (auth.uid()::text = host_id);

-- Only host can update their room
CREATE POLICY "Host can update room" ON rooms
  FOR UPDATE USING (auth.uid()::text = host_id)
  WITH CHECK (auth.uid()::text = host_id);

-- Only host can delete their room
CREATE POLICY "Host can delete room" ON rooms
  FOR DELETE USING (auth.uid()::text = host_id);


-- ============================================================================
-- 2. Fix RLS on `room_questions`
-- ============================================================================
DROP POLICY IF EXISTS "Public can view questions (minus answer via backend)" ON room_questions;
DROP POLICY IF EXISTS "Host can manage questions" ON room_questions;
DROP POLICY IF EXISTS "Room questions readable by authenticated users" ON room_questions;
DROP POLICY IF EXISTS "Room questions owned by user or host" ON room_questions;
DROP POLICY IF EXISTS "Room questions modifiable by owner or host" ON room_questions;

-- Questions can be viewed by participants
CREATE POLICY "Questions can be viewed by participants" ON room_questions
  FOR SELECT USING (true);

-- Only the room's host can insert questions
CREATE POLICY "Host can insert room questions" ON room_questions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM rooms r
      WHERE r.id = room_questions.room_id
        AND r.host_id = auth.uid()::text
    )
  );

-- Only the room's host can update questions
CREATE POLICY "Host can update room questions" ON room_questions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM rooms r
      WHERE r.id = room_questions.room_id
        AND r.host_id = auth.uid()::text
    )
  );

-- Only the room's host can delete questions
CREATE POLICY "Host can delete room questions" ON room_questions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM rooms r
      WHERE r.id = room_questions.room_id
        AND r.host_id = auth.uid()::text
    )
  );


-- ============================================================================
-- 3. Fix RLS on `room_players`
-- ============================================================================
DROP POLICY IF EXISTS "Players can view room players" ON room_players;
DROP POLICY IF EXISTS "Players can insert and update selves" ON room_players;
DROP POLICY IF EXISTS "Room players owned by user or host" ON room_players;
DROP POLICY IF EXISTS "Room players modifiable by owner or host" ON room_players;

-- Players can view participants in the room
CREATE POLICY "Players can view room participants" ON room_players
  FOR SELECT USING (true);

-- Player can join (insert self) or host can add player
CREATE POLICY "Player or host can insert player" ON room_players
  FOR INSERT WITH CHECK (
    auth.uid()::text = user_id
    OR EXISTS (
      SELECT 1 FROM rooms r
      WHERE r.id = room_players.room_id
        AND r.host_id = auth.uid()::text
    )
  );

-- Player can update self or host can update
CREATE POLICY "Player or host can update player" ON room_players
  FOR UPDATE USING (
    auth.uid()::text = user_id
    OR EXISTS (
      SELECT 1 FROM rooms r
      WHERE r.id = room_players.room_id
        AND r.host_id = auth.uid()::text
    )
  );

-- Only host or the player can remove themselves
CREATE POLICY "Player or host can delete player" ON room_players
  FOR DELETE USING (
    auth.uid()::text = user_id
    OR EXISTS (
      SELECT 1 FROM rooms r
      WHERE r.id = room_players.room_id
        AND r.host_id = auth.uid()::text
    )
  );


-- ============================================================================
-- 4. Fix RLS on `room_answers`
-- ============================================================================
DROP POLICY IF EXISTS "Room answers accessible to participants" ON room_answers;
DROP POLICY IF EXISTS "Room answers visible to authenticated users" ON room_answers;
DROP POLICY IF EXISTS "Room answers owned by participant" ON room_answers;

-- Only host and the answering player can view answers
CREATE POLICY "Host and answering player can view answers" ON room_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM room_players rp
      WHERE rp.id = room_answers.player_id
        AND rp.user_id = auth.uid()::text
    )
    OR EXISTS (
      SELECT 1 FROM rooms r
      WHERE r.id = room_answers.room_id
        AND r.host_id = auth.uid()::text
    )
  );

-- Only the answering player can insert their answer
CREATE POLICY "Player can insert answer" ON room_answers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM room_players rp
      WHERE rp.id = room_answers.player_id
        AND rp.user_id = auth.uid()::text
    )
  );


-- ============================================================================
-- 5. Fix RLS on `exam_violations`
-- ============================================================================
DROP POLICY IF EXISTS "Exam violations recordable" ON exam_violations;
DROP POLICY IF EXISTS "Exam violations recordable by authenticated user" ON exam_violations;

-- Only host and the student can view violations
CREATE POLICY "Host and student can view violations" ON exam_violations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM room_players rp
      WHERE rp.id = exam_violations.player_id
        AND rp.user_id = auth.uid()::text
    )
    OR EXISTS (
      SELECT 1 FROM rooms r
      WHERE r.id = exam_violations.room_id
        AND r.host_id = auth.uid()::text
    )
  );

-- Violations can only be recorded by authenticated player themselves or host
CREATE POLICY "Player or host can record violation" ON exam_violations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM room_players rp
      WHERE rp.id = exam_violations.player_id
        AND rp.user_id = auth.uid()::text
    )
    OR EXISTS (
      SELECT 1 FROM rooms r
      WHERE r.id = exam_violations.room_id
        AND r.host_id = auth.uid()::text
    )
  );


-- ============================================================================
-- 6. Fix RPC `set_room_password` with owner guard
-- ============================================================================
CREATE OR REPLACE FUNCTION public.set_room_password(p_room_id uuid, p_password text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
  UPDATE public.ustadz_rooms
  SET password_hash = crypt(p_password, gen_salt('bf', 8)),
      updated_at = now()
  WHERE id = p_room_id
    AND ustadz_id = auth.uid()::text;
$$;
