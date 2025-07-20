import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { VerseDisplay } from '@/components/VerseDisplay';
import { SettingsPanel } from '@/components/SettingsPanel';
import { SearchPanel } from '@/components/SearchPanel';
import { useTheme } from '@/hooks/useTheme';
import { useSettings } from '@/hooks/useSettings';
import { useVerseData } from '@/hooks/useVerseData';
import { Verse } from '@/types/verse';

export default function Home() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { settings, updateSetting } = useSettings();
  const { 
    currentVerse, 
    currentIndex, 
    totalVerses, 
    loading, 
    error,
    generateRandomVerse, 
    getNextVerse,
    getNextVerseSequential,
    getPreviousVerseSequential,
    setSpecificVerse
  } = useVerseData();

  // Initialize theme from settings on mount
  useEffect(() => {
    setTheme(settings.theme);
  }, [settings.theme, setTheme]); // Include dependencies

  // Auto-advance functionality
  useEffect(() => {
    if (settings.autoAdvance > 0 && currentVerse) {
      const interval = setInterval(() => {
        if (settings.verseMode === 'random') {
          generateRandomVerse();
        } else {
          getNextVerse();
        }
      }, settings.autoAdvance * 1000);

      return () => clearInterval(interval);
    }
  }, [settings.autoAdvance, settings.verseMode, currentVerse, generateRandomVerse, getNextVerse]);

  const handleNewVerse = () => {
    if (settings.verseMode === 'random') {
      generateRandomVerse();
    } else {
      getNextVerse();
    }
  };

  const handleVerseSelect = (verse: Verse) => {
    setSpecificVerse(verse);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="verse-container rounded-xl p-8 max-w-md mx-4 text-center">
          <h2 className="text-xl font-bold mb-4">Error Loading Verses</h2>
          <p className="secondary-text mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="accent-button px-6 py-3 rounded-lg font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'hsl(var(--bg-primary))' }}>
      <Header 
        onSettingsClick={() => setSettingsOpen(true)}
        onSearchClick={() => setSearchOpen(true)}
      />
      
      <VerseDisplay
        verse={currentVerse}
        settings={settings}
        onNewVerse={handleNewVerse}
        onPreviousVerse={getPreviousVerseSequential}
        onNextVerse={getNextVerseSequential}
        loading={loading}
      />

      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onUpdateSetting={updateSetting}
      />

      <SearchPanel
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onVerseSelect={handleVerseSelect}
      />

      {/* About Section at bottom */}
      <footer className="max-w-4xl mx-auto px-4 py-6 md:px-6 md:py-8">
        <div className="verse-container rounded-xl p-6 md:p-8 text-center">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'hsl(var(--text-primary))' }}>
            About Shree Bhagwad Gita Wisdom
          </h3>
          <div className="text-sm space-y-2" style={{ color: 'hsl(var(--text-secondary))' }}>
            <p>Shree Bhagwad Gita Wisdom by AI7IA</p>
            <p>Contains all 701 verses from the Bhagavad Gita</p>
            <p>Text sourced from authentic Sanskrit manuscripts</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
