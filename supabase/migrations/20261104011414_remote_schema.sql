SET local check_function_bodies = off;

REVOKE ALL ("category") ON TABLE "public"."room_questions" FROM "anon";

REVOKE ALL ("created_at") ON TABLE "public"."room_questions" FROM "anon";

REVOKE ALL ("id") ON TABLE "public"."room_questions" FROM "anon";

REVOKE ALL ("options") ON TABLE "public"."room_questions" FROM "anon";

REVOKE ALL ("order_index") ON TABLE "public"."room_questions" FROM "anon";

REVOKE ALL ("question_data") ON TABLE "public"."room_questions" FROM "anon";

REVOKE ALL ("question_type") ON TABLE "public"."room_questions" FROM "anon";

REVOKE ALL ("room_id") ON TABLE "public"."room_questions" FROM "anon";

REVOKE ALL ("category") ON TABLE "public"."room_questions" FROM "authenticated";

REVOKE ALL ("created_at") ON TABLE "public"."room_questions" FROM "authenticated";

REVOKE ALL ("id") ON TABLE "public"."room_questions" FROM "authenticated";

REVOKE ALL ("options") ON TABLE "public"."room_questions" FROM "authenticated";

REVOKE ALL ("order_index") ON TABLE "public"."room_questions" FROM "authenticated";

REVOKE ALL ("question_data") ON TABLE "public"."room_questions" FROM "authenticated";

REVOKE ALL ("question_type") ON TABLE "public"."room_questions" FROM "authenticated";

REVOKE ALL ("room_id") ON TABLE "public"."room_questions" FROM "authenticated";

DROP POLICY "friend_challenges_delete_challenger" ON "public"."friend_challenges";

DROP POLICY "friend_challenges_insert_challenger" ON "public"."friend_challenges";

DROP POLICY "friend_challenges_select_participant" ON "public"."friend_challenges";

DROP POLICY "friend_challenges_update_participant" ON "public"."friend_challenges";

DROP POLICY "notifications_delete_own" ON "public"."notifications";

DROP POLICY "notifications_insert_own" ON "public"."notifications";

DROP POLICY "notifications_select_own" ON "public"."notifications";

DROP POLICY "notifications_update_own" ON "public"."notifications";

DROP POLICY "audio_tilawati_authenticated_delete" ON "storage"."objects";

DROP POLICY "audio_tilawati_authenticated_replace" ON "storage"."objects";

DROP POLICY "audio_tilawati_authenticated_upload" ON "storage"."objects";

ALTER TABLE "public"."event_missions"
  DROP CONSTRAINT "event_missions_event_id_fkey";

ALTER TABLE "public"."user_event_progress"
  DROP CONSTRAINT "user_event_progress_event_id_fkey";

ALTER TABLE "public"."user_event_progress"
  DROP CONSTRAINT "user_event_progress_mission_id_fkey";

DROP FUNCTION "public"."get_room_answers"(uuid);

DROP TABLE "public"."event_missions";

DROP TABLE "public"."events";

DROP TABLE "public"."user_event_progress";

DROP FUNCTION "public"."protect_user_event_progress_claim"();

CREATE POLICY "Users can manage friend challenges" ON "public"."friend_challenges"
  FOR ALL
  TO PUBLIC
  USING (true);

CREATE POLICY "Users can view friend challenges" ON "public"."friend_challenges"
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Users can manage own notifications" ON "public"."notifications"
  FOR ALL
  TO PUBLIC
  USING (true);

CREATE POLICY "Users can view own notifications" ON "public"."notifications"
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "leaderboard_read_policy" ON "public"."quiz_attempts"
  FOR SELECT
  TO "anon", "authenticated"
  USING (true);

CREATE POLICY "quiz_attempts_upsert_update_policy" ON "public"."quiz_attempts"
  FOR UPDATE
  TO "anon", "authenticated"
  USING ((user_id IS NOT NULL));

CREATE POLICY "audio_tilawati_public_delete" ON "storage"."objects"
  FOR DELETE
  TO "anon", "authenticated"
  USING ((bucket_id = 'audio-tilawati'::text));

CREATE POLICY "audio_tilawati_public_replace" ON "storage"."objects"
  FOR UPDATE
  TO "anon", "authenticated"
  USING ((bucket_id = 'audio-tilawati'::text));

CREATE POLICY "audio_tilawati_public_upload" ON "storage"."objects"
  FOR INSERT
  TO "anon", "authenticated"
  WITH CHECK ((bucket_id = 'audio-tilawati'::text));

REVOKE ALL ON TABLE "public"."room_questions" FROM "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."room_questions" TO "anon";

REVOKE ALL ON TABLE "public"."room_questions" FROM "authenticated";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."room_questions" TO "authenticated";

