"use client";

import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY, oppositeTheme, resolveTheme, type Theme } from "@/lib/theme/theme";
import styles from "./TopBar.module.scss";

const DARK_QUERY = "(prefers-color-scheme: dark)";
const listeners = new Set<() => void>();

function prefersDark(): boolean {
  return window.matchMedia?.(DARK_QUERY).matches ?? false;
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia?.(DARK_QUERY);
  listeners.add(onChange);
  media?.addEventListener("change", onChange);

  return () => {
    listeners.delete(onChange);
    media?.removeEventListener("change", onChange);
  };
}

function getTheme(): Theme {
  return resolveTheme(document.documentElement.dataset.theme, prefersDark());
}

// The server cannot know the theme; the client renders the real one right after hydration.
function getServerTheme(): Theme | null {
  return null;
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be blocked (private mode); the choice then only lasts for this page view.
  }

  listeners.forEach((notify) => notify());
}

/** Switches between light and dark. The icon and label show the theme you switch to. */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);

  const isDark = theme === "dark";
  const label = isDark ? "Skift til lyst tema" : "Skift til mørkt tema";

  const toggle = () => {
    if (!theme) return;

    applyTheme(oppositeTheme(theme));
  };

  return (
    <button
      type="button"
      className={styles.iconButton}
      onClick={toggle}
      aria-label={label}
      title={label}
    >
      {theme && (isDark ? <SunIcon /> : <MoonIcon />)}
    </button>
  );
}

function MoonIcon() {
  return (
    <svg {...iconProps}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
} as const;
