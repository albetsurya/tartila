import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { authApi } from "@/services/authApi";
import { getToken, clearToken } from "@/services/api";
import { isUstadzRole, isUstadzUser, normalizeRole } from "@/lib/roles";
import { resolveMascotGender } from "@/utils/mascotHelper";
import { MASCOT_STORAGE_KEY } from "@/constants/mascot";
import {
  useEconomyStore,
  DAILY_CLAIM_STORAGE_KEY,
  DAILY_CLAIMED_DAYS_STORAGE_KEY,
} from "@/features/ngaji-ceria/hooks/useEconomyStore";

// Tipe user yang digunakan di aplikasi
export type CeriaUser = {
  id: string;
  email: string | null;
  username: string | null;
  name: string | null;
  role: string; // member, tartila_admin, superadmin, ustadz, ustadzah
  group_id: string | null;
  is_vip: boolean;
  is_ustadz: boolean; // flag untuk ustadz/ustadzah
  photo_url: string | null;
  gender: string | null;
};

// Interface value untuk AuthContext
interface AuthContextValue {
  user: CeriaUser | null;
  loading: boolean;
  isAuthLoading: boolean; // Flag loading autentikasi awal untuk mencegah flicker ke guest
  isRoleVerified: boolean; // Flag verifikasi role otoritatif dari server
  loginWithGoogle: () => Promise<void>;
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
  setUstadzRole: (isUstadz: boolean) => Promise<void>;
}

function getApiBaseUrl(): string {
  const url = import.meta.env.VITE_API_BASE_URL || "";
  return url.replace(/\/api(\/v1)?\/?$/, "").replace(/\/+$/, "");
}

/**
 * Normalisasi role ke kanonik dan turunkan role Admin Sambung Ngaji ('admin')
 * menjadi 'member'. Superadmin tetap penuh. Role tak dikenal -> 'member'.
 */
function toTartilaRole(role: string | null | undefined): string {
  const normalized = normalizeRole(role);
  if (!normalized || normalized === 'admin') return 'member';
  return normalized;
}

/**
 * Bersihkan cache lokal yang bersifat per-user.
 */
function clearAuthCache() {
  try {
    localStorage.removeItem("tartila_cached_user");
  } catch {
    // noop
  }
  localStorage.removeItem(MASCOT_STORAGE_KEY);
  localStorage.removeItem(DAILY_CLAIM_STORAGE_KEY);
  localStorage.removeItem(DAILY_CLAIMED_DAYS_STORAGE_KEY);
  try {
    useEconomyStore.persist.clearStorage();
  } catch {
    // noop
  }
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CeriaUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isRoleVerified, setIsRoleVerified] = useState(false);
  const initInFlightRef = useRef<Promise<void> | null>(null);
  const mountedRef = useRef(false);

  // Initialize: cek session profil langsung ke Backend Go via credentials: include
  const initAuth = useCallback(() => {
    if (initInFlightRef.current) return initInFlightRef.current;
    const promise = (async () => {
      let roleVerified = false;
      try {
        const apiBase = getApiBaseUrl();
        const headers: Record<string, string> = {};
        const legacyToken = getToken();
        if (legacyToken) {
          headers["Authorization"] = `Bearer ${legacyToken}`;
        }

        const res = await fetch(`${apiBase}/api/v1/user/profile`, {
          credentials: "include",
          headers,
        });

        if (res.ok) {
          const profileRes = await res.json();
          const goUser = profileRes.user || profileRes.profile;
          const safeRole = toTartilaRole(goUser?.role);
          const rawMascot = profileRes.mascot_gender || goUser?.mascot_gender || goUser?.gender;

          const ceriaUser: CeriaUser = {
            id: goUser?.id || goUser?.user_id || "google-user",
            email: goUser?.email || null,
            username: goUser?.username || null,
            name: goUser?.name || null,
            role: safeRole,
            group_id: goUser?.group_id || null,
            is_vip: Boolean(goUser?.is_vip || profileRes.is_vip),
            is_ustadz: isUstadzRole(safeRole),
            photo_url: goUser?.photo_url || null,
            gender: rawMascot || null,
          };

          if (mountedRef.current) {
            setUser(ceriaUser);
            localStorage.setItem("tartila_cached_user", JSON.stringify(ceriaUser));
            void useEconomyStore.getState().setUserId(ceriaUser.id);
            useEconomyStore.getState().syncDailyRewardFromProfile(profileRes);
            if (rawMascot) {
              const mascotGender = resolveMascotGender(rawMascot);
              void useEconomyStore.getState().setTilaGender(mascotGender);
            }
            roleVerified = true;
          }
        } else {
          // Response 401 Unauthorized atau tidak ok -> user null
          if (mountedRef.current) {
            setUser(null);
            clearAuthCache();
            clearToken();
            void useEconomyStore.getState().setUserId(null);
            roleVerified = true;
          }
        }
      } catch (err) {
        console.error("[AuthContext] Session init error:", err);
        if (mountedRef.current) {
          setUser(null);
        }
      } finally {
        initInFlightRef.current = null;
        if (mountedRef.current) {
          setIsRoleVerified(roleVerified);
          setLoading(false);
          setIsAuthLoading(false);
        }
      }
    })();
    initInFlightRef.current = promise;
    return promise;
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    void initAuth();

    return () => {
      mountedRef.current = false;
    };
  }, [initAuth]);

  // Fungsi redirect ke endpoint Goth Google OAuth di backend
  const loginWithGoogle = async () => {
    const apiBase = getApiBaseUrl();
    window.location.href = `${apiBase}/api/auth/google`;
  };

  // Fungsi refresh user data dari server
  const refreshUser = async () => {
    try {
      const apiBase = getApiBaseUrl();
      const headers: Record<string, string> = {};
      const legacyToken = getToken();
      if (legacyToken) {
        headers["Authorization"] = `Bearer ${legacyToken}`;
      }

      const res = await fetch(`${apiBase}/api/v1/user/profile`, {
        credentials: "include",
        headers,
      });

      if (res.ok) {
        const profileRes = await res.json();
        const goUser = profileRes.user || profileRes.profile;
        const safeRole = toTartilaRole(goUser?.role);
        const rawMascot = profileRes.mascot_gender || goUser?.mascot_gender || goUser?.gender;

        const ceriaUser: CeriaUser = {
          id: goUser?.id || goUser?.user_id || "google-user",
          email: goUser?.email || null,
          username: goUser?.username || null,
          name: goUser?.name || null,
          role: safeRole,
          group_id: goUser?.group_id || null,
          is_vip: Boolean(goUser?.is_vip || profileRes.is_vip),
          is_ustadz: isUstadzRole(safeRole),
          photo_url: goUser?.photo_url || null,
          gender: rawMascot || null,
        };

        if (mountedRef.current) {
          setUser(ceriaUser);
          localStorage.setItem("tartila_cached_user", JSON.stringify(ceriaUser));
          void useEconomyStore.getState().setUserId(ceriaUser.id);
          useEconomyStore.getState().syncDailyRewardFromProfile(profileRes);
          if (rawMascot) {
            const mascotGender = resolveMascotGender(rawMascot);
            void useEconomyStore.getState().setTilaGender(mascotGender);
          }
          setIsRoleVerified(true);
        }
      } else {
        if (mountedRef.current) {
          setUser(null);
          clearAuthCache();
          clearToken();
          void useEconomyStore.getState().setUserId(null);
        }
      }
    } catch (err) {
      console.error("Refresh user error:", err);
    }
  };

  // Fungsi login via email / username
  const login = async (identifier: string, password: string) => {
    try {
      const legacyUser = await authApi.login(identifier, password);
      const ceriaUser: CeriaUser = {
        id: legacyUser.user_id || legacyUser.id || identifier,
        email: null,
        username: legacyUser.username || identifier,
        name: legacyUser.name || identifier,
        role: toTartilaRole(legacyUser.role),
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
      console.error("Login error:", err);
      throw err;
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    return login(email, password);
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      await authApi.registerCeria(name, email, password, password);
      await refreshUser();
    } catch (err) {
      console.error("Register error:", err);
      throw err;
    }
  };

  // Fungsi logout: panggil POST /api/auth/logout dengan credentials: include lalu bersihkan state
  const logout = async () => {
    try {
      const apiBase = getApiBaseUrl();
      await fetch(`${apiBase}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      if (mountedRef.current) {
        setUser(null);
        clearAuthCache();
        clearToken();
        void useEconomyStore.getState().setUserId(null);
        setIsRoleVerified(true);
      }
    }
  };

  const setUstadzRole = async (isUstadz: boolean) => {
    setUser((current) =>
      current ? { ...current, is_ustadz: isUstadz } : current
    );
  };

  const registerCeria = async (
    name: string,
    username: string,
    password: string,
    confirmPassword: string,
    referralCode?: string
  ) => {
    try {
      await authApi.registerCeria(
        name,
        username,
        password,
        confirmPassword,
        referralCode
      );
      await refreshUser();
    } catch (err) {
      console.error("Ceria register error:", err);
      throw err;
    }
  };

  const value: AuthContextValue = {
    user,
    loading,
    isAuthLoading,
    isRoleVerified,
    loginWithGoogle,
    loginWithEmail,
    register,
    login,
    registerCeria,
    logout,
    refreshUser,
    groupId: user?.group_id ?? null,
    isUstadz: user?.is_ustadz ?? false,
    setUstadzRole,
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
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export default AuthContext;
export { AuthProvider };
