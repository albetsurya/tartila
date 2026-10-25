-- 20261025150000_game_display_configurations.sql
-- Konfigurasi CMS Tata Letak Game Dinamis (Standalone, Hub, Hidden)

CREATE TABLE IF NOT EXISTS game_configurations (
    game_id VARCHAR(64) PRIMARY KEY,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_type VARCHAR(32) NOT NULL DEFAULT 'standalone',
    parent_hub_id VARCHAR(64) DEFAULT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE game_configurations
ADD COLUMN IF NOT EXISTS display_type VARCHAR(32) NOT NULL DEFAULT 'standalone',
ADD COLUMN IF NOT EXISTS parent_hub_id VARCHAR(64) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

-- Nonaktifkan seluruh game yang ada terlebih dahulu agar siap dikurasi
UPDATE game_configurations SET is_active = false;

-- Kurasi 6 game utama dengan is_active = true, display_type = 'standalone', dan sort_order 1-6:
INSERT INTO game_configurations (game_id, is_active, display_type, parent_hub_id, sort_order, updated_at) VALUES
('harakat-slasher', true, 'standalone', NULL, 1, now()),
('memory-match',    true, 'standalone', NULL, 2, now()),
('ayat-scramble',   true, 'standalone', NULL, 3, now()),
('hijaiyah-2048',   true, 'standalone', NULL, 4, now()),
('quiz-ngaji',      true, 'standalone', NULL, 5, now()),
('hijaiyah-pop',    true, 'standalone', NULL, 6, now())
ON CONFLICT (game_id) DO UPDATE SET
    is_active = EXCLUDED.is_active,
    display_type = EXCLUDED.display_type,
    parent_hub_id = EXCLUDED.parent_hub_id,
    sort_order = EXCLUDED.sort_order,
    updated_at = now();

-- Dukung alias rute lama
INSERT INTO game_configurations (game_id, is_active, display_type, parent_hub_id, sort_order, updated_at) VALUES
('harakat-rush',    true, 'standalone', NULL, 1, now()),
('tilawati-memory', true, 'standalone', NULL, 2, now())
ON CONFLICT (game_id) DO UPDATE SET
    is_active = EXCLUDED.is_active,
    display_type = EXCLUDED.display_type,
    parent_hub_id = EXCLUDED.parent_hub_id,
    sort_order = EXCLUDED.sort_order,
    updated_at = now();
