export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

/** A stored choice wins; without one, the system preference decides. */
export function resolveTheme(stored: string | null | undefined, prefersDark: boolean): Theme {
  if (isTheme(stored)) return stored;

  return prefersDark ? "dark" : "light";
}

export function oppositeTheme(theme: Theme): Theme {
  return theme === "dark" ? "light" : "dark";
}

/**
 * Runs in <head> before paint, so a stored choice is applied without a flash.
 * Without a stored choice, no data-theme is set and the CSS follows prefers-color-scheme.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}})()`;
