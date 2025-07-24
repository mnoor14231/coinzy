// Enhanced Voice Hook with External Arabic TTS APIs
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
  const [isProcessing, setIsProcessing] = useState(false);

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

  // Try external Arabic TTS APIs first, fallback to browser
  const speakWithExternalAPI = async (text: string, character: Character, emotion: string = 'neutral') => {
    // Prevent multiple simultaneous API calls
    if (isProcessing) {
      console.log('🔄 Speech request already processing, skipping...');
      return false;
    }

    setIsProcessing(true);

    try {
      // Try Azure Speech Services first (best quality and reliability)
      try {
        // Map each character to a specific voice
        let selectedVoice = 'Ahmed'; // Default male voice
        
        // Single character voice mapping
        switch (character.id) {
          case 'koinzy-buddy':
            selectedVoice = 'Ahmed'; // Friendly Saudi Arabic voice
            break;
          default:
            selectedVoice = 'Ahmed'; // Default voice
        }

        console.log(`🎤 Azure Voice Selection: ${character.nameArabic} (${character.id}) → ${selectedVoice}`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch('/api/tts-azure', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            voice_id: selectedVoice,
            emotion
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.text();
          console.log('Azure Speech not available, trying next service...');
          throw new Error(`Azure Speech API failed: ${response.status}`);
        }

        const audioBlob = await response.blob();
        if (audioBlob.size === 0) {
          throw new Error('Received empty audio response from Azure');
        }

        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        setIsSpeaking(true);
        audio.onended = () => {
          setIsSpeaking(false);
          setIsProcessing(false);
          URL.revokeObjectURL(audioUrl);
        };
        audio.onerror = (e) => {
          console.error('Audio playback error:', e);
          setIsSpeaking(false);
          setIsProcessing(false);
          URL.revokeObjectURL(audioUrl);
        };
        
        await audio.play();
        return true;

      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('Azure Speech request timed out, trying fallback...');
        } else {
          console.log('Azure Speech not available, trying ElevenLabs...');
        }
      }

      // Only try ElevenLabs if Azure fails quickly
      try {
        let selectedVoice = 'Ahmed';
        
        switch (character.id) {
          case 'koinzy-buddy':
            selectedVoice = 'Ahmed';
            break;
          default:
            selectedVoice = 'Ahmed';
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for backup

        const response = await fetch('/api/tts-elevenlabs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            voice_id: selectedVoice,
            model_id: 'eleven_multilingual_v2'
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          console.log('ElevenLabs not available (likely out of credits)');
          throw new Error(`ElevenLabs API failed: ${response.status}`);
        }

        const audioBlob = await response.blob();
        if (audioBlob.size === 0) {
          throw new Error('Received empty audio response');
        }

        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        setIsSpeaking(true);
        audio.onended = () => {
          setIsSpeaking(false);
          setIsProcessing(false);
          URL.revokeObjectURL(audioUrl);
        };
        audio.onerror = (e) => {
          console.error('Audio playback error:', e);
          setIsSpeaking(false);
          setIsProcessing(false);
          URL.revokeObjectURL(audioUrl);
        };
        await audio.play();
        return true;

      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('ElevenLabs request timed out');
        } else {
          console.log('ElevenLabs TTS failed');
        }
      }

    } finally {
      setIsProcessing(false);
    }

    // All API services failed
    return false;
  };

  const speakWithBrowserTTS = (text: string, character: Character, emotion: string = 'neutral') => {
    if (!isSupported || !text.trim() || isProcessing) return;

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
    if (!text.trim() || isSpeaking || isProcessing) return;

    // Stop any current speech
    speechSynthesis.cancel();

    console.log('🎤 Starting speech request...');
    
    // Try external APIs first with timeout
    const externalSuccess = await speakWithExternalAPI(text, character, emotion);
    
    // Only use browser TTS if all external APIs failed
    if (!externalSuccess && !isSpeaking) {
      console.log('🔄 Using browser speech synthesis as fallback');
      speakWithBrowserTTS(text, character, emotion);
    }
  }, [voices, isSupported, isSpeaking, isProcessing]);

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
    isProcessing,
    isSupported,
    voices,
    getAvailableVoices,
    currentEmotion
  };
}; 