import { useState, useEffect, useCallback } from 'react';

const DARK_MODE_KEY = 'pathlens_dark_mode';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem(DARK_MODE_KEY);
      if (saved !== null) return saved === 'true';
      // Check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(DARK_MODE_KEY, String(isDark));
    } catch {
      // ignore storage errors
    }

    const root = document.documentElement;
    if (isDark) {
      root.style.colorScheme = 'dark';
      root.classList.add('dark-mode');
    } else {
      root.style.colorScheme = 'light';
      root.classList.remove('dark-mode');
    }
  }, [isDark]);

  const toggle = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  return { isDark, toggle };
}
