import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ThemeCtx {
  theme: "dark" | "light";
  toggle: () => void;
}

const ThemeContext = createContext<ThemeCtx>({} as ThemeCtx);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "light") {
      document.body.style.background = "#f1f5f9";
      document.body.style.color = "#0f172a";
    } else {
      document.body.style.background = "#020617";
      document.body.style.color = "#f1f5f9";
    }
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
export default ThemeContext;
