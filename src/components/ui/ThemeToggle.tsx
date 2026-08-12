"use client";

import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "../store/themeStore";

const ThemeToggle = () => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore(
    (state) => state.toggleTheme
  );

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        isDark
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      title={
        isDark
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-foreground transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
    >
      <Sun
        className={`h-5 w-5 transition-all duration-300 ${
          isDark
            ? "rotate-90 scale-0"
            : "rotate-0 scale-100"
        }`}
      />

      <Moon
        className={`absolute h-5 w-5 transition-all duration-300 ${
          isDark
            ? "rotate-0 scale-100"
            : "-rotate-90 scale-0"
        }`}
      />
    </button>
  );
};

export default ThemeToggle;