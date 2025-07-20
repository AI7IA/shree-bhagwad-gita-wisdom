export interface Verse {
  id: string;
  chapter: number;
  verse: number;
  shloka: string;
  transliteration: string;
  hinMeaning: string;
  engMeaning: string;
  wordMeaning: string;
}

export interface Settings {
  theme: 'wine' | 'lotus' | 'grey';
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  showSanskrit: boolean;
  showTransliteration: boolean;
  showHindi: boolean;
  showEnglish: boolean;
  autoAdvance: number; // 0 for off, seconds for timer
  verseMode: 'random' | 'sequential';
}
