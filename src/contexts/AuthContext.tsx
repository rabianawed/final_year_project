/**
 * AuthContext.tsx — PhishGuard AI
 * Provides user auth state + login/logout helpers to the app.
 * Replace fakeLogin with real API calls via authService.ts
 */
import React, { createContext, useContext, useState, ReactNode } from "react";

interface User { id: string; name: string; email: string; plan: "free"|"pro"|"enterprise"; role: "user"|"admin" }
interface AuthCtx { user: User|null; login: (email:string,password:string)=>Promise<boolean>; logout: ()=>void; loading: boolean }

const AuthContext = createContext<AuthCtx>({} as AuthCtx);

export const AuthProvider: React.FC<{children:ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User|null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    if (email === "demo@phishguard.ai" && password === "demo1234") {
      setUser({ id: "usr_001", name: "Jane Doe", email, plan: "pro", role: "admin" });
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  const logout = () => setUser(null);

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
