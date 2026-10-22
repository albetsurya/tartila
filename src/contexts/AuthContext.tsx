import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";

// Tipe user yang digunakan di aplikasi
export type CeriaUser = {
  id: string;
  email: string | null;
  username: string | null;
  name: string | null;
  role: string; // member, tartila_admin, superadmin, ustadz, ustadzah
  group_id: string | null;
  is_vip: boolean;
  is_ustadz: boolean; // flag baru untuk ustadz/ustadzah
  photo_url: string | null;
};

// Interface value untuk AuthContext
interface AuthContextValue {
  user: CeriaUser | null;
  loading: boolean;
  loginWithGoogle: (credential: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, isUstadz?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  groupId: string | null;
  isUstadz: boolean; // helper: apakah user adalah ustadz/ustadzah
}

// Helper untuk membuat user dari Supabase auth response
function createCeriaUser(sbUser: any, ustadzFlag: boolean = false): CeriaUser {
  const role = sbUser.user_metadata?.role || 'member';
  return {
    id: sbUser.id,
    email: sbUser.email,
    username: sbUser.user_metadata?.username || null,
    name: sbUser.user_metadata?.name || null,
    role: role,
    group_id: sbUser.user_metadata?.group_id || null,
    is_vip: sbUser.user_metadata?.is_vip || false,
    is_ustadz: ustadzFlag || role === 'ustadz' || role === 'ustadzah',
    photo_url: sbUser.user_metadata?.photo_url || null,
  };
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CeriaUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize: cek session Supabase saat komponen mount
  useEffect(() => {
    // Cek session yang ada
    supabase.auth.getSession().then(({ data: { session} }) => {
      if (session && session.user) {
        // Determine if this user is an ustadz/ustadzah
        const isUstadz = 
          session.user.user_metadata?.role === 'ustadz' ||
          session.user.user_metadata?.role === 'ustadzah' ||
          session.user.user_metadata?.is_ustadz === true;
        setUser(createCeriaUser(session.user, isUstadz));
      }
      setLoading(false);
    });

    // Listen untuk perubahan session (login/logout)
    const { data: { subscription} } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && session.user) {
          const isUstadz = 
            session.user.user_metadata?.role === 'ustadz' ||
            session.user.user_metadata?.role === 'ustadzah' ||
            session.user.user_metadata?.is_ustadz === true;
          setUser(createCeriaUser(session.user, isUstadz));
        } else {
          setUser(null);
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fungsi login dengan Google
  const loginWithGoogle = async (credential: string) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
    } catch (err) {
      console.error('Google login error:', err);
      throw err;
    }
  };

  // Fungsi login dengan email/password
  const loginWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (err) {
      console.error('Email login error:', err);
      throw err;
    }
  };

  // Fungsi register user baru (dengan opsi jadi ustadz/ustadzah)
  const register = async (email: string, password: string, name: string, isUstadz?: boolean) => {
    try {
      // Create user dengan Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            role: isUstadz ? 'ustadz' : 'member', // Role default berdasarkan tanda
            is_vip: false,
            is_ustadz: isUstadz || false,
            group_id: null,
          },
        },
      });

      if (error) throw error;
      if (data.user) {
        // Determine the actual role based on isUstadz parameter
        const actualRole = isUstadz ? 'ustadz' : 'member';
        
        // Buat entri di tabel users dengan role yang sesuai
        await supabase.from('users').insert({
          id: data.user.id,
          email: data.user.email,
          role_ustadz: isUstadz ? 1 : 0, // 1 = ustadz, 0 = bukan
          hearts: 5, // Default
          tickets: 3, // Default
          level: 1,
          xp: 0,
          role: actualRole,
          group_id: null,
          is_vip: false,
        });
      }
    } catch (err) {
      console.error('Register error:', err);
      throw err;
    }
  };

  // Fungsi logout
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      throw err;
    }
  };

  // Fungsi refresh user data dari server
  const refreshUser = async () => {
    try {
      const { data: { user} } = await supabase.auth.getUser();
      if (user) {
        // Cek role dari metadata atau database
        const { data: profileData } = await supabase
          .from('users')
          .select('role_ustadz')
          .eq('id', user.id)
          .single();
        
        const isUstadz = 
          user.user_metadata?.role === 'ustadz' ||
          user.user_metadata?.role === 'ustadzah' ||
          (profileData?.role_ustadz && profileData.role_ustadz === 1);
        
        setUser(createCeriaUser(user, isUstadz));
      }
    } catch (err) {
      console.error('Refresh user error:', err);
    }
  };

  // Value yang akan diterima oleh component anak
  const value: AuthContextValue = {
    user,
    loading,
    loginWithGoogle,
    loginWithEmail,
    register,
    logout,
    refreshUser,
    groupId: user?.group_id ?? null,
    isUstadz: user?.is_ustadz ?? false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export default AuthContext;
