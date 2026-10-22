import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Gunakan environment variables atau nilai default untuk development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Helper function untuk ambil user data lengkap
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

// Helper function untuk update user profile
export async function updateUserProfile(userId: string, updates: any) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Helper function untuk cek apakah user adalah VIP/Superadmin
export async function isUserVIP(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('is_vip, group_id, role')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export default supabase;
