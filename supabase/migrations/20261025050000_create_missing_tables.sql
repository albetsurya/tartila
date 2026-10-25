-- Buat tabel konfigurasi tata letak game agar migrasi
-- 20261025040306_remote_schema.sql (ALTER ... ENABLE ROW LEVEL SECURITY)
-- tidak gagal sebelum tabel ini ada.

CREATE TABLE IF NOT EXISTS game_configurations (
    game_id VARCHAR(64) PRIMARY KEY,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_type VARCHAR(32) NOT NULL DEFAULT 'standalone',
    parent_hub_id VARCHAR(64) DEFAULT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE game_configurations
  ENABLE ROW LEVEL SECURITY;
