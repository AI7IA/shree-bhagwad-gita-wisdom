import { Settings, Search } from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';

interface HeaderProps {
  onSettingsClick: () => void;
  onSearchClick: () => void;
}

export function Header({ onSettingsClick, onSearchClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 verse-container border-b px-4 py-3 md:px-6 md:py-4">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">श्री</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Shree Bhagwad Gita Wisdom</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeSelector />
          <button
            onClick={onSearchClick}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Search Verses"
          >
            <Search className="w-5 h-5 secondary-text" />
          </button>
          <button
            onClick={onSettingsClick}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Open Settings"
          >
            <Settings className="w-5 h-5 secondary-text" />
          </button>
        </div>
      </div>
    </header>
  );
}
