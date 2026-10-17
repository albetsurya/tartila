import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export interface CeriaUser {
  id?: string;
  name: string;
  role?: string;
  member_id?: string;
  username?: string;
  photo_url?: string;
  gender?: string;
}

interface AuthContextValue {
  user: CeriaUser | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  registerCeria: (
    name: string,
    username: string,
    password: string,
    confirmPassword: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const STORAGE_KEY = "tartila-ceria-user";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): CeriaUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CeriaUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CeriaUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(readStoredUser());
    setLoading(false);
  }, []);

  const persist = (next: CeriaUser | null) => {
    setUser(next);
    try {
      if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable — ignore */
    }
  };

  const login = async (_identifier: string, _password: string) => {
    persist({
      id: "local",
      name: "Hamba Allah",
      role: "MEMBER",
      member_id: "LOCAL",
    });
    setLoading(false);
  };

  const registerCeria = async (
    name: string,
    username: string,
    _password: string,
    _confirmPassword: string,
  ) => {
    persist({
      id: "local",
      name,
      username,
      role: "MEMBER",
      member_id: "LOCAL",
    });
    setLoading(false);
  };

  const logout = async () => {
    persist(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, registerCeria, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
