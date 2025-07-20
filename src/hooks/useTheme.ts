import { useState, useEffect } from 'react';

type Theme = 'wine' | 'lotus' | 'grey';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('gitaverse-theme');
    return (saved as Theme) || 'wine';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gitaverse-theme', theme);
  }, [theme]);

  return { theme, setTheme };
}
