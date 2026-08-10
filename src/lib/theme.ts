import { useCallback, useState } from 'react';

export type Theme = 'light' | 'dark';

const getDomTheme = (): Theme => {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
};

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getDomTheme);


  const setAndPersistTheme = useCallback((nextTheme: Theme) => {
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('theme', nextTheme);
    setTheme(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setAndPersistTheme(getDomTheme() === 'dark' ? 'light' : 'dark');
  }, [setAndPersistTheme]);

  return { theme, setTheme: setAndPersistTheme, toggleTheme };
}
