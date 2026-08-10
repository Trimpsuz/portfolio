import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../lib/theme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      aria-pressed={isDark}
      onClick={toggleTheme}
    >
      <Sun
        aria-hidden="true"
        className={`theme-toggle__icon${isDark ? ' theme-toggle__icon--hidden' : ''}`}
        size={18}
      />
      <Moon
        aria-hidden="true"
        className={`theme-toggle__icon${isDark ? '' : ' theme-toggle__icon--hidden'}`}
        size={18}
      />
    </button>
  );
}
