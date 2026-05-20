import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "teal" | "purple" | "orange" | "rose" | "blue" | "yellow" | "green" | "spiderman";

const themes: Record<Theme, { primary: string; secondary: string; ring: string; background?: string; foreground?: string }> = {
  teal:      { primary: "174 72% 56%", secondary: "160 84% 39%", ring: "174 72% 56%" },
  purple:    { primary: "270 70% 65%", secondary: "280 60% 50%", ring: "270 70% 65%" },
  orange:    { primary: "28 95% 58%",  secondary: "20 90% 48%",  ring: "28 95% 58%" },
  rose:      { primary: "345 85% 62%", secondary: "330 75% 50%", ring: "345 85% 62%" },
  blue:      { primary: "213 94% 62%", secondary: "220 85% 50%", ring: "213 94% 62%" },
  yellow:    { primary: "45 95% 55%",  secondary: "38 90% 45%",  ring: "45 95% 55%"  },
  green:     { primary: "142 72% 50%", secondary: "150 65% 38%", ring: "142 72% 50%" },
  spiderman: { primary: "0 90% 55%",   secondary: "220 90% 45%", ring: "0 90% 55%", background: "222 47% 6%", foreground: "0 0% 98%" },
};

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
}>({ theme: "teal", setTheme: () => { /* noop */ } });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("teal");

  function setTheme(t: Theme) {
    setThemeState(t);
    const { primary, secondary, ring, background, foreground } = themes[t];
    const root = document.documentElement;
    root.style.setProperty("--primary", primary);
    root.style.setProperty("--secondary", secondary);
    root.style.setProperty("--ring", ring);
    root.style.setProperty("--background", background ?? "240 27.9% 5.7%");
    root.style.setProperty("--foreground", foreground ?? "210 40% 98%");
    localStorage.setItem("portfolio-theme", t);
  }

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-theme") as Theme | null;
    if (saved && themes[saved]) setTheme(saved);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
