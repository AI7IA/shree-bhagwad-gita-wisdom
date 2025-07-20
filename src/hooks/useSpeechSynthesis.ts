import { useState, useEffect, useCallback, useRef } from 'react';

export interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice | null;
  pauseBetweenLines?: boolean;
  pauseDuration?: number;
}

export function useSpeechSynthesis() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [supported, setSupported] = useState(false);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSupported(true);
      
      const updateVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      // Try multiple times to get voices (needed for mobile browsers)
      updateVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }

      // Fallback for mobile browsers
      const timeout = setTimeout(updateVoices, 1000);

      return () => {
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = null;
        }
        clearTimeout(timeout);
      };
    }
  }, []);

  const speakWithPauses = useCallback(async (lines: string[], options: SpeechOptions = {}) => {
    if (!supported || lines.length === 0) return;

    window.speechSynthesis.cancel();
    setSpeaking(true);
    setPaused(false);

    const speakLine = (line: string, isLast: boolean = false): Promise<void> => {
      return new Promise((resolve) => {
        if (!line.trim()) {
          resolve();
          return;
        }

        const utterance = new SpeechSynthesisUtterance(line.trim());
        
        utterance.rate = options.rate ?? 0.6;
        utterance.pitch = options.pitch ?? 1;
        utterance.volume = options.volume ?? 1;
        
        if (options.voice) {
          utterance.voice = options.voice;
        } else {
          const hindiVoice = voices.find(voice => 
            voice.lang.includes('hi') || 
            voice.name.toLowerCase().includes('hindi') ||
            voice.name.toLowerCase().includes('devanagari')
          );
          const englishVoice = voices.find(voice => 
            voice.lang.includes('en')
          );
          utterance.voice = hindiVoice || englishVoice || voices[0] || null;
        }

        utterance.onend = () => {
          if (isLast) {
            setSpeaking(false);
            setPaused(false);
            resolve();
          } else if (options.pauseBetweenLines) {
            pauseTimeoutRef.current = setTimeout(() => {
              resolve();
            }, options.pauseDuration || 1000);
          } else {
            resolve();
          }
        };

        utterance.onerror = () => {
          setSpeaking(false);
          setPaused(false);
          resolve();
        };

        currentUtteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      });
    };

    try {
      for (let i = 0; i < lines.length; i++) {
        await speakLine(lines[i], i === lines.length - 1);
      }
    } catch (error) {
      setSpeaking(false);
      setPaused(false);
    }
  }, [supported, voices]);

  const speak = useCallback((text: string, options: SpeechOptions = {}) => {
    if (!supported || !text.trim()) return;

    if (options.pauseBetweenLines && text.includes('\n')) {
      const lines = text.split('\n').filter(line => line.trim());
      speakWithPauses(lines, options);
    } else {
      window.speechSynthesis.cancel();
      setSpeaking(true);
      setPaused(false);

      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.rate = options.rate ?? 0.6;
      utterance.pitch = options.pitch ?? 1;
      utterance.volume = options.volume ?? 1;
      
      if (options.voice) {
        utterance.voice = options.voice;
      } else {
        const hindiVoice = voices.find(voice => 
          voice.lang.includes('hi') || 
          voice.name.toLowerCase().includes('hindi') ||
          voice.name.toLowerCase().includes('devanagari')
        );
        const englishVoice = voices.find(voice => 
          voice.lang.includes('en')
        );
        utterance.voice = hindiVoice || englishVoice || voices[0] || null;
      }

      utterance.onstart = () => {
        setSpeaking(true);
        setPaused(false);
      };
      
      utterance.onend = () => {
        setSpeaking(false);
        setPaused(false);
      };
      
      utterance.onerror = () => {
        setSpeaking(false);
        setPaused(false);
      };

      currentUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  }, [supported, voices, speakWithPauses]);

  const stop = useCallback(() => {
    if (supported) {
      window.speechSynthesis.cancel();
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
        pauseTimeoutRef.current = null;
      }
      setSpeaking(false);
      setPaused(false);
      currentUtteranceRef.current = null;
    }
  }, [supported]);

  const pause = useCallback(() => {
    if (supported && speaking) {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  }, [supported, speaking]);

  const resume = useCallback(() => {
    if (supported && paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    }
  }, [supported, paused]);

  const getVoicesForLanguage = useCallback((language: string) => {
    return voices.filter(voice => voice.lang.toLowerCase().includes(language.toLowerCase()));
  }, [voices]);

  return {
    speak,
    stop,
    pause,
    resume,
    speaking,
    paused,
    supported,
    voices,
    getVoicesForLanguage
  };
}