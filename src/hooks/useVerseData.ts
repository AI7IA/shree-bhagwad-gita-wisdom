import { useState, useEffect, useCallback } from 'react';
import { Verse } from '@/types/verse';
import { apiRequest } from '@/lib/queryClient';

// Convert database verse format to frontend format
const convertDbVerse = (dbVerse: any): Verse => ({
  id: dbVerse.verseId,
  chapter: dbVerse.chapter,
  verse: dbVerse.verse,
  shloka: dbVerse.shloka,
  transliteration: dbVerse.transliteration,
  hinMeaning: dbVerse.hinMeaning,
  engMeaning: dbVerse.engMeaning,
  wordMeaning: dbVerse.wordMeaning
});

export function useVerseData() {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [currentVerse, setCurrentVerse] = useState<Verse | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalVerses, setTotalVerses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVerses();
  }, []);

  const loadVerses = async () => {
    try {
      setLoading(true);
      
      // Get current verse count from database
      const countResponse = await apiRequest('/api/verses/count');
      setTotalVerses(countResponse.count);
      
      // Get a random verse to display
      const randomResponse = await apiRequest('/api/verses/random');
      const randomVerse = convertDbVerse(randomResponse);
      setCurrentVerse(randomVerse);
      setCurrentIndex(1); // Display as verse 1 of total since we're showing random verses
      setError(null);
    } catch (err) {
      setError('Failed to load verses. Please try again.');
      console.error('Error loading verses:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateRandomVerse = useCallback(async () => {
    try {
      const response = await apiRequest('/api/verses/random');
      const randomVerse = convertDbVerse(response);
      setCurrentVerse(randomVerse);
      setCurrentIndex(Math.floor(Math.random() * totalVerses) + 1);
    } catch (err) {
      console.error('Error fetching random verse:', err);
    }
  }, [totalVerses]);

  const getNextVerse = useCallback(() => {
    // For random mode, just generate a new random verse
    generateRandomVerse();
  }, [generateRandomVerse]);

  const setSpecificVerse = (verse: Verse) => {
    setCurrentVerse(verse);
    setCurrentIndex(1); // Reset index for display purposes
  };

  const getNextVerseSequential = useCallback(async () => {
    if (!currentVerse) return;
    
    try {
      const response = await apiRequest(`/api/verses/next/${encodeURIComponent(currentVerse.id)}`);
      const nextVerse = convertDbVerse(response);
      setCurrentVerse(nextVerse);
    } catch (err) {
      console.error('Error fetching next verse:', err);
    }
  }, [currentVerse]);

  const getPreviousVerseSequential = useCallback(async () => {
    if (!currentVerse) return;
    
    try {
      const response = await apiRequest(`/api/verses/previous/${encodeURIComponent(currentVerse.id)}`);
      const previousVerse = convertDbVerse(response);
      setCurrentVerse(previousVerse);
    } catch (err) {
      console.error('Error fetching previous verse:', err);
    }
  }, [currentVerse]);

  return {
    verses,
    currentVerse,
    currentIndex,
    totalVerses,
    loading,
    error,
    generateRandomVerse,
    getNextVerse,
    getNextVerseSequential,
    getPreviousVerseSequential,
    setSpecificVerse,
    reload: loadVerses
  };
}
