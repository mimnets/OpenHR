import React, { createContext, useContext, useState, useEffect, useLayoutEffect } from 'react';

/**
 * Dark mode.
 *
 * This used to also carry a selectable accent theme: fourteen palettes, a
 * super-admin picker, and a `default_theme` row read from Supabase on an idle
 * callback, again every 60 seconds, and again on every visibilitychange. That
 * is gone — OpenHRApp has one brand colour, defined once in src/index.css.
 *
 * Removing it also removed three defects:
 *
 *   - A bulk "apply to all organizations" write with no confirmation, which had
 *     already restyled 119 real customer organizations in a single click.
 *   - A colour repaint on load, because the theme arrived over the network after
 *     first paint.
 *   - The same fourteen-palette table duplicated in three places (this file,
 *     index.html's boot script, and index.css), free to drift apart.
 *
 * Dark mode itself is kept: it is a user accessibility preference, stored
 * locally, with no network round trip and nothing for an administrator to
 * override.
 */

export type DarkModePreference = 'light' | 'dark' | 'system';

const DARK_MODE_KEY = 'openhr-dark-mode';

/** The <meta name="theme-color"> value per mode, matching the painted surface. */
const META_THEME_COLOR = { dark: '#0f172a', light: '#fcfdfe' } as const;

/**
 * Read the saved preference synchronously, for use as initial state.
 *
 * This must not be deferred to an effect. index.html's boot script sets the
 * .dark class from this same key before first paint; if React's first render
 * assumed a different value it would remove that class and re-add it a render
 * later, flashing between two themes on every refresh.
 */
function getStoredDarkPreference(): DarkModePreference {
  try {
    const saved = localStorage.getItem(DARK_MODE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
  } catch { /* localStorage unavailable */ }
  return 'system';
}

function getSystemPrefersDark(): boolean {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
}

interface ThemeContextType {
  darkMode: boolean;
  darkModePreference: DarkModePreference;
  setDarkModePreference: (pref: DarkModePreference) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkModePreference, setDarkModePrefState] = useState<DarkModePreference>(getStoredDarkPreference);
  const [systemDark, setSystemDark] = useState(getSystemPrefersDark);

  const darkMode = darkModePreference === 'system' ? systemDark : darkModePreference === 'dark';

  // Track the OS setting so 'system' stays live rather than being sampled once.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // useLayoutEffect, not useEffect: this runs before the browser paints, so the
  // class index.html's boot script already set is never briefly removed.
  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', darkMode ? META_THEME_COLOR.dark : META_THEME_COLOR.light);
  }, [darkMode]);

  const setDarkModePreference = (pref: DarkModePreference) => {
    setDarkModePrefState(pref);
    try { localStorage.setItem(DARK_MODE_KEY, pref); } catch { /* noop */ }
  };

  return (
    <ThemeContext.Provider value={{ darkMode, darkModePreference, setDarkModePreference }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
