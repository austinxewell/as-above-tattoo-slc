import { useEffect } from "react";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "as-above-theme";

function getSavedTheme(): Theme {
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export function ThemeToggle() {
  useEffect(() => {
    const savedTheme = getSavedTheme();

    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  function toggleTheme() {
    const isDark = document.documentElement.classList.contains("dark");
    const nextTheme: Theme = isDark ? "light" : "dark";

    document.documentElement.classList.toggle("dark", nextTheme === "dark");

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Storage may be unavailable, but theme switching still works.
      return;
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      className="rounded-md border border-border bg-surface px-4 py-2 text-sm text-foreground transition-colors hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring"
    >
      Toggle theme
    </button>
  );
}
