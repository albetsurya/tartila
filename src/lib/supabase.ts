import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Gunakan environment variables (Vite) atau nilai default untuk development.
// Akses import.meta.env dibungkus agar aman di environment non-Vite (tes Node).
const viteEnv: Record<string, string | boolean | undefined> =
  typeof import.meta !== "undefined" &&
  typeof (import.meta as { env?: Record<string, string | boolean | undefined> })
    .env === "object"
    ? ((import.meta as { env: Record<string, string | boolean | undefined> })
        .env ?? {})
    : {};

const supabaseUrl =
  (typeof viteEnv.VITE_SUPABASE_URL === "string" &&
    viteEnv.VITE_SUPABASE_URL) ||
  "https://your-project.supabase.co";
const supabaseAnonKey =
  (typeof viteEnv.VITE_SUPABASE_ANON_KEY === "string" &&
    viteEnv.VITE_SUPABASE_ANON_KEY) ||
  "your-anon-key";

export const isSupabaseConfigured: boolean =
  supabaseUrl !== "https://your-project.supabase.co" &&
  supabaseAnonKey !== "your-anon-key" &&
  Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
});

if (viteEnv.DEV) {
  console.info(`[Supabase] Connected to: ${supabaseUrl}`);
}

export default supabase;
