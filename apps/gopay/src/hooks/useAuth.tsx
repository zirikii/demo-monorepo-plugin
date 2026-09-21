import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearSession,
  loginWithCredentials,
  readSession,
  type DemoUser,
} from "@/lib/auth";

type AuthContextValue = {
  user: DemoUser | null;
  login: (email: string, password: string, overrides?: Partial<DemoUser>) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(() => readSession());

  const login = useCallback(
    (email: string, password: string, overrides?: Partial<DemoUser>) => {
      setUser(loginWithCredentials(email, password, overrides));
    },
    [],
  );

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
