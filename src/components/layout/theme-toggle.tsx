"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "gestor-theme";

type ThemeMode = "light" | "dark";

const applyTheme = (theme: ThemeMode) => {
  document.documentElement.dataset.theme = theme;
};

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof document !== "undefined") {
      const current = document.documentElement.dataset.theme;

      if (current === "dark" || current === "light") {
        return current;
      }
    }

    return "light";
  });

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";

    setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--ink-soft)] transition hover:border-[var(--accent)] hover:text-[var(--ink)]"
      aria-label="Alternar tema"
    >
      {theme === "dark" ? (
        <MoonStar className="h-4 w-4 text-[var(--accent)]" />
      ) : (
        <SunMedium className="h-4 w-4 text-[var(--accent)]" />
      )}
      {theme === "dark" ? "Escuro" : "Claro"}
    </button>
  );
};
