import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { authApi } from "@/services/authApi";
import { getToken, clearToken } from "@/services/api";
import { isUstadzRole, isUstadzUser } from "@/lib/roles";
import { resolveMascotGender } from "@/utils/mascotHelper";
import { useEconomyStore } from "@/features/ngaji-ceria/hooks/useEconomyStore";
import { userApi } from "@/services/userApi";

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
  gender: string | null;
};

// Interface value untuk AuthContext
interface AuthContextValue {
  user: CeriaUser | null;
  loading: boolean;
  isAuthLoading: boolean; // Flag loading autentikasi awal untuk mencegah flicker ke guest
  loginWithGoogle: (credential?: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, isUstadz?: boolean) => Promise<void>;
  login: (identifier: string, password: string) => Promise<void>; // email atau username
  registerCeria: (
    name: string,
    username: string,
    password: string,
    confirmPassword: string,
    referralCode?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  groupId: string | null;
  isUstadz: boolean; // helper: apakah user adalah ustadz/ustadzah
  setUstadzRole: (isUstadz: boolean) => Promise<void>; // Fungsi baru: set role setelah login
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
    is_ustadz: ustadzFlag || isUstadzRole(role),
    photo_url: sbUser.user_metadata?.photo_url || null,
    gender: sbUser.user_metadata?.mascot_gender || sbUser.user_metadata?.gender || null,
  };
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CeriaUser | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("tartila_cached_user");
        if (cached) return JSON.parse(cached);
      } catch {
        // noop
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Initialize: cek session Supabase saat komponen mount
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        // Sinkronisasi data profil & maskot dari Backend Go (Single Source of Truth)
        try {
          const profileRes = await userApi.getUserProfile();
          if (profileRes) {
            useEconomyStore.getState().syncDailyRewardFromProfile(profileRes);
            const rawMascot = profileRes.mascot_gender || profileRes.user?.mascot_gender || profileRes.user?.gender;
            if (rawMascot) {
              const mascotGender = resolveMascotGender(rawMascot);
              void useEconomyStore.getState().setTilaGender(mascotGender);
            }
          }
        } catch {
          // offline atau belum login
        }
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          const isUstadz = 
            session.user.user_metadata?.role === 'ustadz' ||
            session.user.user_metadata?.role === 'ustadzah' ||
            session.user.user_metadata?.is_ustadz === true;
          const ceriaUser = createCeriaUser(session.user, isUstadz);
          if (mounted) {
            setUser(ceriaUser);
            localStorage.setItem("tartila_cached_user", JSON.stringify(ceriaUser));
            void useEconomyStore.getState().setUserId(ceriaUser.id);
            if (ceriaUser.gender) {
              const mascotGender = resolveMascotGender(ceriaUser.gender);
              void useEconomyStore.getState().setTilaGender(mascotGender);
            }
          }
        } else {
          // Fallback bila pengguna login via REST token legacy
          const token = getToken();
          const cached = localStorage.getItem("tartila_cached_user");
          if (token && cached) {
            try {
              const parsed = JSON.parse(cached);
              if (mounted) {
                setUser(parsed);
                void useEconomyStore.getState().setUserId(parsed.id || parsed.user_id || null);
                if (parsed.gender) {
                  const mascotGender = resolveMascotGender(parsed.gender);
                  void useEconomyStore.getState().setTilaGender(mascotGender);
                }
              }
            } catch {
              // noop
            }
          } else if (!token && mounted) {
            setUser(null);
            localStorage.removeItem("tartila_cached_user");
            void useEconomyStore.getState().setUserId(null);
          }
        }
      } catch (err) {
        console.error("[AuthContext] Session init error:", err);
      } finally {
        if (mounted) {
          setLoading(false);
          setIsAuthLoading(false);
        }
      }
    }

    void initAuth();

    // Listen untuk perubahan session (login/logout/token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && session.user) {
          const isUstadz = 
            session.user.user_metadata?.role === 'ustadz' ||
            session.user.user_metadata?.role === 'ustadzah' ||
            session.user.user_metadata?.is_ustadz === true;
          const ceriaUser = createCeriaUser(session.user, isUstadz);
          if (mounted) {
            setUser(ceriaUser);
            localStorage.setItem("tartila_cached_user", JSON.stringify(ceriaUser));
            void useEconomyStore.getState().setUserId(ceriaUser.id);
            if (ceriaUser.gender) {
              const mascotGender = resolveMascotGender(ceriaUser.gender);
              void useEconomyStore.getState().setTilaGender(mascotGender);
            }
            setLoading(false);
            setIsAuthLoading(false);
          }
        } else if (event === "SIGNED_OUT") {
          if (mounted) {
            setUser(null);
            localStorage.removeItem("tartila_cached_user");
            clearToken();
            void useEconomyStore.getState().setUserId(null);
            setLoading(false);
            setIsAuthLoading(false);
          }
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Fungsi login dengan Google
  const loginWithGoogle = async (credential?: string) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
      // Setelah OAuth, arahkan ke onboarding role
      // atau tunggu user login lalu panggil setUstadzRole
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
      // Setelah login berhasil, cek role
      await refreshUser();
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
    } catch (err) {
      console.error('Register error:', err);
      throw err;
    }
  };

  // Fungsi logout
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      localStorage.removeItem("tartila_cached_user");
      clearToken();
      void useEconomyStore.getState().setUserId(null);
    }
  };

  // FUNGSI BARU: Set role ustadz setelah login (bisa dipakai setelah OAuth)
  const setUstadzRole = async (isUstadz: boolean) => {
    // Reflect role ke state lokal secara optimis
    setUser((current) =>
      current ? { ...current, is_ustadz: isUstadz } : current
    );

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Update metadata di Supabase
        await supabase.auth.updateUser({
          data: {
            role: isUstadz ? 'ustadz' : 'member',
            is_ustadz: isUstadz,
          },
        });
      }
    } catch (err) {
      console.error('Failed to set ustadz role:', err);
    }
  };

  // Fungsi refresh user data dari server
  const refreshUser = async () => {
    try {
      // 1. Ambil data user & maskot dari Backend Go (Single Source of Truth)
      const profileRes = await userApi.getUserProfile().catch(() => null);
      if (profileRes) {
        useEconomyStore.getState().syncDailyRewardFromProfile(profileRes);
        const u = profileRes.user || profileRes.profile;
        const rawMascot = profileRes.mascot_gender || u?.mascot_gender || u?.gender;
        if (rawMascot) {
          const mascotGender = resolveMascotGender(rawMascot);
          void useEconomyStore.getState().setTilaGender(mascotGender);
        }
        if (u) {
          const isVipUser = Boolean(profileRes.is_vip ?? u.is_vip ?? (u.role === 'SUPER_ADMIN'));
          setUser((prev) => {
            if (!prev) return prev;
            const updated = {
              ...prev,
              name: u.name || prev.name,
              role: u.role || prev.role,
              group_id: u.group_id ?? prev.group_id,
              gender: rawMascot || prev.gender,
              is_vip: isVipUser,
            };
            try {
              localStorage.setItem("tartila_cached_user", JSON.stringify(updated));
            } catch {
              // noop
            }
            return updated;
          });
          if (isVipUser) {
            useEconomyStore.getState().applyVipSuccess();
          }
        }
      }

      // 2. Refresh metadata dari session Supabase jika ada
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const isUstadz =
          user.user_metadata?.role === 'ustadz' ||
          user.user_metadata?.role === 'ustadzah';
        const ceriaUser = createCeriaUser(user, isUstadz);
        setUser(ceriaUser);
        localStorage.setItem("tartila_cached_user", JSON.stringify(ceriaUser));

        if (ceriaUser.gender) {
          const mascotGender = resolveMascotGender(ceriaUser.gender);
          void useEconomyStore.getState().setTilaGender(mascotGender);
        }
      }
    } catch (err) {
      console.error('Refresh user error:', err);
    }
  };

  // Helper aman untuk ambil user di dalam effect
  const getAuthUnsafe = () => user;

  // Login via email (Supabase) atau username (REST legacy)
  const login = async (identifier: string, password: string) => {
    if (identifier.includes('@')) {
      await loginWithEmail(identifier, password);
      return;
    }

    try {
      const legacyUser = await authApi.login(identifier, password);
      const ceriaUser: CeriaUser = {
        id: legacyUser.user_id || legacyUser.id || identifier,
        email: null,
        username: legacyUser.username || identifier,
        name: legacyUser.name || identifier,
        role: legacyUser.role || 'member',
        group_id: legacyUser.group_id || null,
        is_vip: false,
        is_ustadz: isUstadzUser(legacyUser),
        photo_url: legacyUser.photo_url || null,
        gender: legacyUser.gender || null,
      };
      setUser(ceriaUser);
      localStorage.setItem("tartila_cached_user", JSON.stringify(ceriaUser));
      void useEconomyStore.getState().setUserId(ceriaUser.id);
      if (ceriaUser.gender) {
        const mascotGender = resolveMascotGender(ceriaUser.gender);
        void useEconomyStore.getState().setTilaGender(mascotGender);
      }
      await refreshUser();
    } catch (err) {
      console.error('Username login error:', err);
      throw err;
    }
  };

  // Registrasi akun Ceria via REST legacy (server /api/v1)
  const registerCeria = async (
    name: string,
    username: string,
    password: string,
    confirmPassword: string,
    referralCode?: string,
  ) => {
    try {
      await authApi.registerCeria(
        name,
        username,
        password,
        confirmPassword,
        referralCode,
      );
      await refreshUser();
    } catch (err) {
      console.error('Ceria register error:', err);
      throw err;
    }
  };

  // Value yang akan diterima oleh component anak
  const value: AuthContextValue = {
    user,
    loading,
    isAuthLoading,
    loginWithGoogle,
    loginWithEmail,
    register,
    login,
    registerCeria,
    logout,
    refreshUser,
    groupId: user?.group_id ?? null,
    isUstadz: user?.is_ustadz ?? false,
    setUstadzRole, // Ekspor fungsi baru
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F0FDF4] p-4 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF08A] flex items-center justify-center animate-bounce shadow-[3px_3px_0px_#134E4A]">
            <span className="font-display font-black text-2xl text-[#134E4A]">T</span>
          </div>
          <p className="font-display font-black text-xs text-[#134E4A] tracking-widest uppercase">
            Menyiapkan Tartila...
          </p>
        </div>
      </div>
    );
  }

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
export { AuthProvider };
