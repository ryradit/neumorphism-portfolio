// src/components/ThemeToggle.tsx
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import classNames from 'classnames';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      className={classNames(
        'p-2 rounded-full transition-all duration-300',
        isDark
          ? 'bg-dark-bg shadow-neu-dark hover:shadow-neu-dark-inset'
          : 'bg-light-bg shadow-neu-light hover:shadow-neu-light-inset'
      )}
    >
      {isDark ? (
        <FiSun className="w-5 h-5 text-dark-text" />
      ) : (
        <FiMoon className="w-5 h-5 text-light-text" />
      )}
    </button>
  );
}
