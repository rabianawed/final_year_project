/**
 * AuthContext.tsx — PhishGuard AI
 * Provides user auth state + login/logout helpers to the app.
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  plan: "free" | "pro" | "enterprise";
  role: "user" | "admin";
}

interface AuthCtx {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  loading: boolean;
}

const STORAGE_KEY = "phishguard_user";

const AuthContext = createContext<AuthCtx>({} as AuthCtx);

function loadStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(loadStoredUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));

    if (!email || password.length < 6) {
      setLoading(false);
      return false;
    }

    const name = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    setUser({
      id: `usr_${Date.now()}`,
      name: name || "User",
      email,
      plan: email === "demo@phishguard.ai" ? "pro" : "free",
      role: email === "demo@phishguard.ai" ? "admin" : "user",
    });
    setLoading(false);
    return true;
  };

  const register = async (
    name: string,
    email: string,
    _password: string
  ): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1100));

    if (email === "taken@phishguard.ai") {
      setLoading(false);
      return { success: false, message: "An account with this email already exists." };
    }

    setUser({
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email,
      plan: "free",
      role: "user",
    });
    setLoading(false);
    return { success: true };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
