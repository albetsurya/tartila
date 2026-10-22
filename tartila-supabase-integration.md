---
name: tartila-supabase-integration
description: "Migrasi economy dan auth Tartila dari localStorage ke Supabase PostgreSQL. 3-phase approach: database migration, code integration, offline sync strategy."
category: software-development
---

class-level skill: Supabase integration for Tartila

Use when migrating Tartila economy/auth data from localStorage to Supabase PostgreSQL. Follow 3-phase approach: database migration, code integration, offline sync strategy.

## PROCEDURE

### Phase 1: Database Migration
1. Run: `supabase migration new add_game_economy_columns`
2. Edit `supabase/migrations/<timestamp>_add_game_economy_columns.sql` with:
   - ALTER TABLE users ADD COLUMN IF NOT EXISTS hearts INTEGER DEFAULT 5
   - ALTER TABLE users ADD COLUMN IF NOT EXISTS tickets INTEGER DEFAULT 3
   - ALTER TABLE users ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1
   - ALTER TABLE users ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0
   - ALTER TABLE users ADD COLUMN IF NOT EXISTS last_sync TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   - UPDATE users SET hearts = 5 WHERE hearts IS NULL (repeat for each column)
   - Add COMMENT ON COLUMN for each new column
3. Run: `supabase db reset` (or migrate to remote project)

### Phase 2: Code Integration
1. Create `src/lib/supabase.ts`:
   - Import createClient from @supabase/supabase-js
   - Use process.env.NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY with fallbacks
   - Export supabase client
   - Add helpers: getUserProfile(userId), updateUserProfile(userId, updates), isUserVIP(userId)
2. Update `src/contexts/AuthContext.tsx`:
   - Replace localStorage getItem/setItem with supabase.auth.getSession()
   - Use supabase.auth.onAuthStateChange() for session listening
   - Replace login functions with supabase.auth.signInWithOAuth()/signInWithPassword()/signUp()
   - Use supabase.auth.signOut() for logout
   - Extract user metadata (role, group_id, is_vip) from user_metadata
3. Update `src/features/ngaji-ceria/hooks/useEconomyStore.ts`:
   - Replace persist middleware with direct supabase queries
   - Add initialize(): fetch user data from Supabase on login
   - Add consumeHeart/consumTicket: update local state FIRST, THEN sync to server
   - Add restoreHeart/restoreTicket: sync to server after restore
   - Add buyBooster: sync full-heart purchase to server
   - Add setVip/setGroupId: update user profile on Supabase
   - Keep isUnlimitedUser() function for VIP/Superadmin check
   - Add energyQuota() helper using isUnlimitedUser()

### Phase 3: Offline-First Strategy
1. Initialize flow:
   - On app start: supabase.auth.getSession() → populate store
   - If no session: fall back to localStorage as temporary cache
2. Sync mechanism:
   - Every consumeHeart/consumTicket/restore → await supabase update
   - Track lastSync timestamp in store + database
   - On reconnect: auto-sync any pending local changes
3. Error handling:
   - If sync fails: keep local state, retry on next action
   - Show toast: "Menyinkronkan data..." on first load if data was migrated from local

## PITFALLS (with WHY)

1. ⚠️ NEVER remove localStorage immediately after sync
   Why: User might lose internet, app restart, or clear cache. Keep local as fallback until explicit user action.

2. ⚠️ DO NOT call supabase.auth.getUser() outside auth state change
   Why: Supabase client must be initialized; calling too early throws 'client not initialized'. Wrap in useEffect or lazy init.

3. ⚠️ Type mismatch between CeriaUser type and Supabase user metadata
   Why: Supabase returns { id, email, user_metadata: { role, group_id, is_vip, ... } } while app expects flat fields. Always cast to any or map via createCeriaUser() helper.

4. ⚠️ First-load requires internet
   Why: App needs to fetch user data from Supabase on startup. Show skeleton/spinner until data arrives, then cache locally.

5. ⚠️ Forgetting to create Supabase users table rows
   Why: Register flow must INSERT into public.users table after auth.signUp(). Forgetting causes economy data loss.

## REFERENCES

- `references/economy-sync.md` — Decision table: which fields sync, which are local-only, VIP override logic
- `templates/supabase-init.sql` — One-time setup script for new projects
- `scripts/sync-check.js` — Verification script: `node scripts/sync-check.js --project tartila`

## USER PREFERENCES (this task)
- Anti-AI-slop: no 'Great question,' no filler openings
- Direct tone, senior engineer to junior
- Bahasa Indonesia for conversational, English for technical
- Hybrid workflow: Hermes plans/reviews, Opencode executes
- No emoji, no AI-slop in UI/text
- Build must pass tsc --noEmit before committing

## SKILL BOUNDARIES
- This skill covers Tartila→Supabase integration ONLY
- Does NOT cover: full app refactor, other projects, tool bugs unrelated to this flow
- Protected: hermes-agent skill, any bundled skills
- Fall through to skill_manage if this skill needs updating later
---
