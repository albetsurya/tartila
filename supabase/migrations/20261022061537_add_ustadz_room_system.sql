-- Add ustadz/ustadzah role and room system tables
-- Plus subscription features

-- 1. Add subscription and room limit columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_type VARCHAR(50) DEFAULT 'free' COMMENT 'free, vip, premium';
ALTER TABLE users ADD COLUMN IF NOT EXISTS rooms_created INTEGER DEFAULT 0 COMMENT 'Jumlah room yang dibuat';
ALTER TABLE users ADD COLUMN IF NOT EXISTS max_rooms INTEGER DEFAULT 1 COMMENT 'Batas maksimal room (free: 1, vip: 5, premium: unlimited)';
ALTER TABLE users ADD COLUMN IF NOT EXISTS max_participants INTEGER DEFAULT 5 COMMENT 'Batas peserta per room (free: 5, vip: 10, premium: 50)';

-- 2. Update rooms table with subscription awareness
-- (Migration sebelumnya sudah membuat tabel, hanya perlu tambah kolom)

-- 3. Update room participants count trigger
-- Kita akan handle di application level, tapi add constraint helper

-- 4. Add subscription expiry if needed
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE;

-- 5. Update existing users subscription status
-- Free users stay free, admin/uperadmin bisa di-set vip
UPDATE users SET subscription_type = 'free' WHERE subscription_type IS NULL;
UPDATE users SET subscription_type = 'vip' WHERE role IN ('superadmin', 'admin') AND subscription_type = 'free';

-- 6. Tambah constraint sederhana via application code
-- (Supabase memungkinkan RLS yang bisa dikonfigurasi lebih lanjut)

COMMENT ON COLUMN users.subscription_type IS 'Tipe langganan: free, vip, premium';
COMMENT ON COLUMN users.rooms_created IS 'Jumlah room sudah dibuat oleh ustadz ini';
COMMENT ON COLUMN users.max_rooms IS 'Batas maksimal room yang bisa dibuat';
COMMENT ON COLUMN users.max_participants IS 'Batas maksimal peserta per room';
COMMENT ON COLUMN users.subscription_expires_at IS 'Tanggal eksripsi langganan (null = permanent/vip)';

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_users_subscription ON users(subscription_type);
CREATE INDEX IF NOT EXISTS idx_users_ustadz_role ON users(role_ustadz);

