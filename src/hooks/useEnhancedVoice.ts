// Enhanced Voice Hook with Browser-based Arabic TTS
import { useState, useEffect, useCallback } from 'react';
import { Character } from '@/store/characterStore';

interface VoiceOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  emotion?: string;
}

export const useEnhancedVoice = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');

  // Check browser speech synthesis support
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      
      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  const speakWithBrowserTTS = (text: string, character: Character, emotion: string = 'neutral') => {
    if (!isSupported || !text.trim()) return;

    // Stop any current speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Enhanced Arabic voice selection
    let selectedVoice: SpeechSynthesisVoice | null = null;

    // Priority 1: Microsoft Arabic voices (best quality)
    selectedVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('microsoft') && 
      (voice.lang.includes('ar') || voice.name.toLowerCase().includes('arabic'))
    ) || null;

    // Priority 2: Google Arabic voices
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('google') && 
        (voice.lang.includes('ar') || voice.name.toLowerCase().includes('arabic'))
      ) || null;
    }

    // Priority 3: High-quality Arabic female voices for children
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => 
        (voice.lang.includes('ar') || voice.name.toLowerCase().includes('arabic')) &&
        (voice.name.toLowerCase().includes('female') || 
         voice.name.toLowerCase().includes('zeinab') ||
         voice.name.toLowerCase().includes('salma') ||
         voice.name.toLowerCase().includes('hala') ||
         voice.name.toLowerCase().includes('yasmin'))
      ) || null;
    }

    // Priority 4: Regional Arabic voices
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => 
        voice.lang === 'ar-SA' || voice.lang === 'ar-EG' || voice.lang === 'ar-AE' || voice.lang === 'ar-JO'
      ) || null;
    }

    // Fallback: Any Arabic voice
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => 
        voice.lang.includes('ar') || voice.name.toLowerCase().includes('arabic')
      ) || null;
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Enhanced voice settings based on character and emotion
    const baseSettings = character.voiceSettings;
    
    // Emotion-based adjustments
    switch (emotion) {
      case 'happy':
        utterance.rate = baseSettings.rate * 1.1;
        utterance.pitch = baseSettings.pitch * 1.1;
        break;
      case 'excited':
        utterance.rate = baseSettings.rate * 1.2;
        utterance.pitch = baseSettings.pitch * 1.2;
        break;
      case 'thinking':
        utterance.rate = baseSettings.rate * 0.8;
        utterance.pitch = baseSettings.pitch * 0.9;
        break;
      case 'encouraging':
        utterance.rate = baseSettings.rate * 0.9;
        utterance.pitch = baseSettings.pitch * 1.05;
        break;
      case 'celebrating':
        utterance.rate = baseSettings.rate * 1.3;
        utterance.pitch = baseSettings.pitch * 1.3;
        break;
      default:
        utterance.rate = baseSettings.rate;
        utterance.pitch = baseSettings.pitch;
    }

    utterance.volume = baseSettings.volume;

    // Event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentEmotion(emotion);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentEmotion('neutral');
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentEmotion('neutral');
    };

    // Speak
    speechSynthesis.speak(utterance);
  };

  const speakWithCharacter = useCallback(async (
    text: string, 
    character: Character, 
    emotion: string = 'neutral'
  ) => {
    if (!text.trim()) return;

    // Use browser TTS directly
    speakWithBrowserTTS(text, character, emotion);
  }, [voices, isSupported]);

  const speakGreeting = useCallback((character: Character | null) => {
    if (!character) return;
    
    const greetingPhrases = [
      'مرحباً بك! أنا هنا لأساعدك في تعلم إدارة المال',
      'أهلاً وسهلاً! هيا نتعلم معاً أشياء مهمة عن المال',
      'مرحبا! أنا سعيد لرؤيتك. هل أنت مستعد للتعلم؟',
      'أهلاً بك! سنقضي وقتاً ممتعاً في تعلم المال والتوفير'
    ];
    
    const randomGreeting = greetingPhrases[Math.floor(Math.random() * greetingPhrases.length)];
    speakWithCharacter(randomGreeting, character, 'happy');
  }, [speakWithCharacter]);

  const stop = useCallback(() => {
    if (isSupported) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentEmotion('neutral');
    }
  }, [isSupported]);

  const getAvailableVoices = useCallback(() => {
    return voices.filter(voice => 
      voice.lang.includes('ar') || voice.name.toLowerCase().includes('arabic')
    );
  }, [voices]);

  return {
    speakWithCharacter,
    speakGreeting,
    stop,
    isSpeaking,
    isSupported,
    voices,
    getAvailableVoices,
    currentEmotion
  };
}; 