import { useTheme } from '@/hooks/useTheme';

const themes = [
  { name: 'wine', color: 'bg-gradient-to-br from-red-900 to-red-700' },
  { name: 'lotus', color: 'bg-gradient-to-br from-pink-600 to-pink-400' },
  { name: 'grey', color: 'bg-gradient-to-br from-gray-700 to-gray-500' }
] as const;

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      {themes.map((themeOption) => (
        <button
          key={themeOption.name}
          onClick={() => setTheme(themeOption.name)}
          className={`theme-dot w-8 h-8 rounded-full border-2 border-white ${themeOption.color} ${
            theme === themeOption.name ? 'active' : ''
          }`}
          aria-label={`${themeOption.name} theme`}
        />
      ))}
    </div>
  );
}
