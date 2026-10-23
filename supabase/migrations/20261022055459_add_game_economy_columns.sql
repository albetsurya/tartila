-- Add game economy columns to users table
-- This migration adds hearts, tickets, level, and xp columns

-- Add columns if users table exists
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS hearts INTEGER DEFAULT 5;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS tickets INTEGER DEFAULT 3;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS last_sync TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing rows & add comments if users table exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
        UPDATE users SET hearts = 5 WHERE hearts IS NULL;
        UPDATE users SET tickets = 3 WHERE tickets IS NULL;
        UPDATE users SET level = 1 WHERE level IS NULL;
        UPDATE users SET xp = 0 WHERE xp IS NULL;

        COMMENT ON COLUMN users.hearts IS 'Number of remaining hearts (max 5), regen every 4 hours';
        COMMENT ON COLUMN users.tickets IS 'Number of remaining tickets (max 3), regen every 6 hours';
        COMMENT ON COLUMN users.level IS 'User level, determines game access tier';
        COMMENT ON COLUMN users.xp IS 'Experience points for leveling up';
        COMMENT ON COLUMN users.last_sync IS 'Timestamp of last data synchronization with server';
    END IF;
END $$;
