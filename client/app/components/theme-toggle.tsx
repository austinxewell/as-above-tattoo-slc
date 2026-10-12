import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

type ThemeToggleProps = {
  showLabel?: boolean;
};

const THEME_STORAGE_KEY = "as-above-theme";

function getSavedTheme(): Theme {
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export function ThemeToggle({ showLabel = false }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>(getSavedTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  function toggleTheme() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";

    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    setTheme(nextTheme);

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Theme switching still works if browser storage is unavailable.
    }
  }

  const isDark = theme === "dark";
  const label = isDark ? "Light Mode" : "Dark Mode";
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${label.toLowerCase()}`}
      className={
        showLabel
          ? "flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-foreground/80 transition-colors hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-hover"
          : "inline-flex size-10 items-center justify-center rounded-full text-accent transition-colors hover:bg-surface-raised hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-hover"
      }
    >
      <Icon className="size-5 shrink-0" aria-hidden="true" />
      {showLabel && <span>{label}</span>}
    </button>
  );
}
