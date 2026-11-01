-- Migration: tilawati_timeline_edits (Timeline Editor storage)
-- Kolom sesuai master prompt: jilid, page, published_timeline_json JSONB, revision.
-- published_timeline_json berisi objek TimelineEdit utuh:
--   { published?: {timeline, questions, revision}, audioOrder?, textLinks?, textAdditions?, textEdits? }

CREATE TABLE IF NOT EXISTS public.tilawati_timeline_edits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jilid INTEGER NOT NULL CHECK (jilid BETWEEN 1 AND 6),
    page INTEGER NOT NULL CHECK (page BETWEEN 1 AND 44),
    published_timeline_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    revision TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT tilawati_timeline_edits_unique_jilid_page UNIQUE (jilid, page)
);

CREATE INDEX IF NOT EXISTS idx_tilawati_timeline_edits_jilid_page
    ON public.tilawati_timeline_edits (jilid, page);

ALTER TABLE public.tilawati_timeline_edits ENABLE ROW LEVEL SECURITY;

-- Frontend tidak pernah menulis langsung ke DB: read terbuka, write hanya
-- lewat Backend Go (koneksi postgres, bypass RLS).
DROP POLICY IF EXISTS "tilawati_timeline_edits_select_public" ON public.tilawati_timeline_edits;
CREATE POLICY "tilawati_timeline_edits_select_public" ON public.tilawati_timeline_edits
    FOR SELECT TO anon, authenticated USING (true);

-- Storage bucket audio hasil render (upload oleh ustadz dari frontend).
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('audio-tilawati', 'audio-tilawati', TRUE, 52428800, ARRAY['audio/ogg', 'audio/mpeg', 'audio/wav'])
ON CONFLICT (id) DO UPDATE SET public = TRUE;

DROP POLICY IF EXISTS "audio_tilawati_public_read" ON storage.objects;
CREATE POLICY "audio_tilawati_public_read" ON storage.objects
    FOR SELECT TO anon, authenticated
    USING (bucket_id = 'audio-tilawati');

DROP POLICY IF EXISTS "audio_tilawati_public_upload" ON storage.objects;
CREATE POLICY "audio_tilawati_public_upload" ON storage.objects
    FOR INSERT TO anon, authenticated
    WITH CHECK (bucket_id = 'audio-tilawati');

DROP POLICY IF EXISTS "audio_tilawati_public_replace" ON storage.objects;
CREATE POLICY "audio_tilawati_public_replace" ON storage.objects
    FOR UPDATE TO anon, authenticated
    USING (bucket_id = 'audio-tilawati');

DROP POLICY IF EXISTS "audio_tilawati_public_delete" ON storage.objects;
CREATE POLICY "audio_tilawati_public_delete" ON storage.objects
    FOR DELETE TO anon, authenticated
    USING (bucket_id = 'audio-tilawati');
