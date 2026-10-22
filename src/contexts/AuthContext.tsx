import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { authApi, type User } from "@/services/authApi";
import { clearToken, getToken, setGroupId, ApiError } from "@/services/api";
import { addEvent } from "@/services/eventService";

export type CeriaUser = User;

interface AuthContextValue {
  user: User | null;
  groupId: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  registerCeria: (
    name: string,
    username: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const CACHED_USER_KEY = "tartila_cached_user";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getCachedUser(): User | null {
  try {
    const raw = localStorage.getItem(CACHED_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setCachedUser(user: User | null) {
  try {
    if (user) {
      localStorage.setItem(CACHED_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CACHED_USER_KEY);
    }
  } catch {}
}

function isAuthenticationError(error: unknown): boolean {
  return (
    error instanceof ApiError &&
    (error.message.toLowerCase().includes("unauthorized") ||
      error.message.toLowerCase().includes("sesi tidak valid") ||
      error.message.toLowerCase().includes("token") ||
      error.statusCode === 401)
  );
}

let validateSessionPromise: Promise<User> | null = null;

function getValidateSessionPromise(): Promise<User> {
  if (!validateSessionPromise) {
    validateSessionPromise = authApi.validateSession().finally(() => {
      validateSessionPromise = null;
    });
  }
  return validateSessionPromise;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getCachedUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!getToken()) {
        setUser(null);
        setCachedUser(null);
        setLoading(false);
        return;
      }

      try {
        const u = await getValidateSessionPromise();
        if (!cancelled) {
          setGroupId(u?.group_id ?? null);
          setUser(u);
          setCachedUser(u);
        }
      } catch (err) {
        if (!cancelled) {
          // A cached profile is only an optimistic render hint, never proof of
          // authentication. Do not leave it active when validation fails.
          if (isAuthenticationError(err)) {
            clearToken();
            setCachedUser(null);
            setGroupId(null);
            setUser(null);
          } else {
            // Other network errors etc. might be transient, keep cached user
            setLoading(false);
            return; // Don't clear user for transient errors, but stop loading
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function login(username: string, password: string) {
    const u = await authApi.login(username, password);
    setGroupId(u?.group_id ?? null);
    setUser(u);
    setCachedUser(u);
    addEvent({
      type: "login",
      userId: u.id,
      username: u.name || u.username,
      details: { method: "credentials", role: u.role },
    });
  }

  async function loginWithGoogle(credential: string) {
    const u = await authApi.loginWithGoogle(credential);
    setGroupId(u?.group_id ?? null);
    setUser(u);
    setCachedUser(u);
    addEvent({
      type: "login",
      userId: u.id,
      username: u.name || u.username,
      details: { method: "google", role: u.role },
    });
  }

  async function registerCeria(
    name: string,
    username: string,
    password: string,
    confirmPassword: string
  ) {
    const u = await authApi.registerCeria(
      name,
      username,
      password,
      confirmPassword
    );
    setGroupId(u?.group_id ?? null);
    setUser(u);
    setCachedUser(u);
    addEvent({
      type: "user_registered",
      userId: u.id,
      username: u.name || u.username,
      details: { role: u.role },
    });
  }

  async function logout() {
    if (user) {
      addEvent({
        type: "logout",
        userId: user.id,
        username: user.name || user.username,
      });
    }
    const revoke = authApi.logout(); // Start revocation while token is still available
    clearToken();
    setCachedUser(null);
    setGroupId(null);
    setUser(null);
    await revoke.catch(() => {}); // Ignore network errors on logout
  }

  async function refreshUser() {
    try {
      const u = await authApi.validateSession();
      setUser(u);
      setCachedUser(u);
    } catch (err) {
      if (isAuthenticationError(err)) {
        clearToken();
        setCachedUser(null);
        setGroupId(null);
        setUser(null);
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        groupId: user?.group_id ?? null,
        loading,
        login,
        loginWithGoogle,
        registerCeria,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam AuthProvider");
  return ctx;
}