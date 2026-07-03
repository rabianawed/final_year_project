import React, { createContext, useContext, useState, ReactNode } from "react";
interface ThemeCtx { theme: "dark"|"light"; toggle: ()=>void }
const ThemeContext = createContext<ThemeCtx>({} as ThemeCtx);
export const ThemeProvider: React.FC<{children:ReactNode}> = ({ children }) => {
  const [theme, setTheme] = useState<"dark"|"light">("dark");
  const toggle = () => setTheme(t => t === "dark" ? "light" : "dark");
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
};
export const useTheme = () => useContext(ThemeContext);
export default ThemeContext;
