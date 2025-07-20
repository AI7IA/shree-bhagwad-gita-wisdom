import { useState, useEffect } from 'react';
import { Settings } from '@/types/verse';

const defaultSettings: Settings = {
  theme: 'wine',
  fontSize: 'medium',
  showSanskrit: true,
  showTransliteration: true,
  showHindi: true,
  showEnglish: true,
  autoAdvance: 0,
  verseMode: 'random'
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const saved = localStorage.getItem('gitaverse-settings');
      if (saved) {
        return { ...defaultSettings, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.warn('Failed to load settings from localStorage:', error);
    }
    return defaultSettings;
  });

  useEffect(() => {
    try {
      localStorage.setItem('gitaverse-settings', JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save settings to localStorage:', error);
    }
  }, [settings]);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return { settings, updateSetting };
}
