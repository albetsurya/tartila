-- Add ustadz/ustadzah role and room system tables
-- Plus subscription features

-- 1. Add subscription and room limit columns to users table (if table exists)
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS subscription_type VARCHAR(50) DEFAULT 'free';
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS rooms_created INTEGER DEFAULT 0;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS max_rooms INTEGER DEFAULT 1;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS max_participants INTEGER DEFAULT 5;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE;

-- 2. Update existing users subscription status (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
        UPDATE users SET subscription_type = 'free' WHERE subscription_type IS NULL;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'role') THEN
            UPDATE users SET subscription_type = 'vip' WHERE role IN ('superadmin', 'admin') AND subscription_type = 'free';
        END IF;

        COMMENT ON COLUMN users.subscription_type IS 'Tipe langganan: free, vip, premium';
        COMMENT ON COLUMN users.rooms_created IS 'Jumlah room sudah dibuat oleh ustadz ini';
        COMMENT ON COLUMN users.max_rooms IS 'Batas maksimal room yang bisa dibuat';
        COMMENT ON COLUMN users.max_participants IS 'Batas maksimal peserta per room';
        COMMENT ON COLUMN users.subscription_expires_at IS 'Tanggal eksripsi langganan (null = permanent/vip)';

        CREATE INDEX IF NOT EXISTS idx_users_subscription ON users(subscription_type);
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'role_ustadz') THEN
            CREATE INDEX IF NOT EXISTS idx_users_ustadz_role ON users(role_ustadz);
        END IF;
    END IF;
END $$;
