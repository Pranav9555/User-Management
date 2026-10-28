import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "dashboardTheme";

export const themes = {
  Indigo: { bg: "#f5f7fb", surface: "#ffffff", text: "#172033", muted: "#667085", border: "#e4e8f0", accent: "#4f46e5", soft: "#eef2ff" },
  Ocean: { bg: "#f0f9ff", surface: "#ffffff", text: "#123047", muted: "#557184", border: "#d5e8f3", accent: "#0284c7", soft: "#e0f2fe" },
  Forest: { bg: "#f1f8f2", surface: "#ffffff", text: "#173c29", muted: "#5c7565", border: "#dce9df", accent: "#15803d", soft: "#dcfce7" },
  Sunset: { bg: "#fff7f0", surface: "#ffffff", text: "#4b271b", muted: "#8a6a5d", border: "#f2dfd3", accent: "#ea580c", soft: "#ffedd5" },
};

const defaultTheme = { preset: "Indigo", buttonColor: "", fontName: "", fontData: "" };

function readSavedTheme() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved && themes[saved.preset]) return { ...defaultTheme, ...saved };
  } catch (error) {
    console.warn("Could not read saved theme preferences.", error);
  }
  return defaultTheme;
}

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readSavedTheme);

  const resetTheme = useCallback(() => setTheme(defaultTheme), []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
    } catch (error) {
      console.error("Theme preferences could not be saved. The uploaded font may be too large for localStorage.", error);
    }
  }, [theme]);

  useEffect(() => {
    const palette = themes[theme.preset] || themes.Indigo;
    const root = document.documentElement;
    const values = {
      "--app-bg": palette.bg,
      "--surface": palette.surface,
      "--text": palette.text,
      "--muted": palette.muted,
      "--border": palette.border,
      "--accent": theme.buttonColor || palette.accent,
      "--accent-soft": palette.soft,
      "--app-font": theme.fontData ? '"UserUploadedFont", Inter, system-ui, sans-serif' : 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    };
    Object.entries(values).forEach(([key, value]) => root.style.setProperty(key, value));

    const oldStyle = document.getElementById("userflow-uploaded-font");
    if (oldStyle) oldStyle.remove();
    if (theme.fontData && theme.fontName) {
      const style = document.createElement("style");
      style.id = "userflow-uploaded-font";
      style.textContent = `@font-face { font-family: "UserUploadedFont"; src: url("${theme.fontData}"); font-display: swap; }`;
      document.head.appendChild(style);
    }
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme, resetTheme, themes }), [theme, resetTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside ThemeProvider");
  return value;
}
