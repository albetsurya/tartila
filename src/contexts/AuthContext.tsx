import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { type User } from "@/services/api";

// Type untuk user yang kita gunakan di aplikasi
export type CeriaUser = {
  id: string;
  email: string | null;
  username: string | null;
  name: string | null;
  role: string; // member, tartila_admin, superadmin
  group_id: string | null;
  is_vip: boolean;
  photo_url: string | null;
};

// Interface value untuk AuthContext
interface AuthContextValue {
  user: CeriaUser | null;
  loading: boolean;
  loginWithGoogle: (credential: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  groupId: string | null;
}

// Helper untuk membuat user dari Supabase auth response
function createCeriaUser(sbUser: any): CeriaUser {
  return {
    id: sbUser.id,
    email: sbUser.email,
    username: sbUser.user_metadata?.username || null,
    name: sbUser.user_metadata?.name || null,
    role: sbUser.user_metadata?.role || 'member',
    group_id: sbUser.user_metadata?.group_id || null,
    is_vip: sbUser.user_metadata?.is_vip || false,
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
        setUser(createCeriaUser(session.user));
      }
      setLoading(false);
    });

    // Listen untuk perubahan session (login/logout)
    const { data: { subscription} } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && session.user) {
          setUser(createCeriaUser(session.user));
        } else {
          setUser(null);
        }
        // Reset state setelah logout
        if (event === 'SIGNED_OUT') {
          // Clear any local storage if needed
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
      // Sign in with Google using supabase
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // redirectTo adalah URL yang akan redirect setelah login
          // di development ini http://localhost:5173
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
      // Session akan di-update oleh onAuthStateChange listener
    } catch (err) {
      console.error('Google login error:', err);
      throw err;
    }
  };

  // Fungsi login dengan email/password (jika ada)
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

  // Fungsi register user baru
  const register = async (email: string, password: string, name: string) => {
    try {
      // Create user dengan Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            role: 'member', // Role default saat register
            is_vip: false,
            group_id: null,
          },
        },
      });

      if (error) throw error;
      if (data.user) {
        // Buat entri di tabel users
        await supabase.from('users').insert({
          id: data.user.id,
          email: data.user.email,
          hearts: 5, // Default
          tickets: 3, // Default
          level: 1,
          xp: 0,
          role: 'member',
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
        setUser(createCeriaUser(user));
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
