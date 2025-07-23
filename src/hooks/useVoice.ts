import { useState, useEffect, useCallback } from 'react';

interface VoiceOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
  preferFemale?: boolean;
}

export const useVoice = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      
      const updateVoices = () => {
        const availableVoices = speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      updateVoices();
      speechSynthesis.onvoiceschanged = updateVoices;

      return () => {
        speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  const speak = useCallback((
    text: string, 
    options: VoiceOptions = {}
  ) => {
    if (!isSupported || !text.trim()) return;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find the best Arabic voice
    let selectedVoice: SpeechSynthesisVoice | null = null;

    if (options.preferFemale) {
      // Prioritize female Arabic voices for congratulations
      selectedVoice = voices.find(voice => 
        (voice.lang.includes('ar') || voice.name.includes('Arabic') || voice.name.includes('العربية')) &&
        (voice.name.toLowerCase().includes('female') || 
         voice.name.toLowerCase().includes('woman') ||
         voice.name.toLowerCase().includes('sarah') ||
         voice.name.toLowerCase().includes('amira') ||
         voice.name.toLowerCase().includes('sara') ||
         voice.name.toLowerCase().includes('maged') === false) // Avoid male names
      ) || null;
    }

    // Fallback to any Arabic voice
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => 
        voice.lang.includes('ar') || 
        voice.name.includes('Arabic') ||
        voice.name.includes('العربية')
      ) || null;
    }

    // Further fallback to English voices with Arabic support
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => 
        voice.lang.includes('en') && (
          voice.name.toLowerCase().includes('microsoft') ||
          voice.name.toLowerCase().includes('google')
        )
      ) || null;
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.lang = options.lang || 'ar-SA';
    utterance.rate = options.rate || (options.preferFemale ? 0.8 : 0.8);
    utterance.pitch = options.pitch || (options.preferFemale ? 1.2 : 1.1);
    utterance.volume = options.volume || 0.9;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  }, [isSupported, voices]);

  const speakWithHappyWoman = useCallback((text: string) => {
    speak(text, {
      preferFemale: true,
      rate: 0.8,
      pitch: 1.3, // Higher pitch for happiness
      volume: 0.9
    });
  }, [speak]);

  const speakStoryNarration = useCallback((text: string) => {
    speak(text, {
      preferFemale: true,
      rate: 0.7, // Slower for story telling
      pitch: 1.1,
      volume: 0.8
    });
  }, [speak]);

  const stop = useCallback(() => {
    if (isSupported) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  const getAvailableVoices = useCallback(() => {
    const arabicVoices = voices.filter(voice => 
      voice.lang.includes('ar') || 
      voice.name.includes('Arabic') ||
      voice.name.includes('العربية')
    );
    
    const femaleVoices = voices.filter(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('woman') ||
      voice.name.toLowerCase().includes('sarah') ||
      voice.name.toLowerCase().includes('amira')
    );

    return {
      all: voices,
      arabic: arabicVoices,
      female: femaleVoices
    };
  }, [voices]);

  return {
    speak,
    speakWithHappyWoman,
    speakStoryNarration,
    stop,
    isSpeaking,
    isSupported,
    voices,
    getAvailableVoices
  };
}; 