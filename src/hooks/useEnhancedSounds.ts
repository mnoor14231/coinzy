import { useCallback } from 'react';
import { Character } from '@/store/characterStore';

// Enhanced sound effects using Web Audio API
const createTone = (frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) => {
  if (typeof window === 'undefined' || !window.AudioContext) return;
  
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = type;
  
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

// Coin collection sound
const playCoinSound = () => {
  createTone(800, 0.1, 'triangle', 0.4);
  setTimeout(() => createTone(1000, 0.1, 'triangle', 0.3), 50);
  setTimeout(() => createTone(1200, 0.15, 'triangle', 0.2), 100);
};

// Success melody (more musical)
const playSuccessSound = () => {
  const notes = [
    { freq: 523.25, delay: 0 },    // C5
    { freq: 659.25, delay: 100 },  // E5
    { freq: 783.99, delay: 200 },  // G5
    { freq: 1046.50, delay: 300 }  // C6
  ];
  
  notes.forEach(({ freq, delay }) => {
    setTimeout(() => createTone(freq, 0.3, 'triangle', 0.4), delay);
  });
};

// Magical success (for magical characters like Elsa)
const playMagicalSuccess = () => {
  const notes = [1000, 1200, 1400, 1600, 1800];
  notes.forEach((freq, index) => {
    setTimeout(() => createTone(freq, 0.2, 'sine', 0.3), index * 80);
  });
};

// Heroic success (for superheroes)
const playHeroicSuccess = () => {
  const chord = [523.25, 659.25, 783.99]; // C major chord
  chord.forEach((freq, index) => {
    setTimeout(() => createTone(freq, 0.4, 'square', 0.25), index * 50);
  });
  setTimeout(() => createTone(1046.50, 0.6, 'triangle', 0.4), 200);
};

// Gentle error sound (encouraging, not harsh)
const playGentleError = () => {
  createTone(400, 0.2, 'sine', 0.2);
  setTimeout(() => createTone(350, 0.3, 'sine', 0.15), 100);
};

// Thinking sound
const playThinkingSound = () => {
  const frequencies = [600, 650, 700];
  frequencies.forEach((freq, index) => {
    setTimeout(() => createTone(freq, 0.1, 'triangle', 0.15), index * 200);
  });
};

// Button click sound
const playClickSound = () => {
  createTone(800, 0.05, 'triangle', 0.3);
};

// Page transition whoosh
const playWhooshSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.4);
  oscillator.type = 'sawtooth';
  
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
  
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.4);
};

// Pop sound for UI interactions
const playPopSound = () => {
  createTone(1000, 0.08, 'triangle', 0.3);
  setTimeout(() => createTone(1300, 0.06, 'triangle', 0.2), 30);
};

// Celebration fanfare
const playCelebrationSound = () => {
  // Triumph melody
  const melody = [
    { freq: 523.25, delay: 0, duration: 0.2 },    // C5
    { freq: 659.25, delay: 150, duration: 0.2 },  // E5
    { freq: 783.99, delay: 300, duration: 0.2 },  // G5
    { freq: 1046.50, delay: 450, duration: 0.4 }, // C6
    { freq: 783.99, delay: 600, duration: 0.3 },  // G5
    { freq: 1046.50, delay: 750, duration: 0.5 }  // C6
  ];
  
  melody.forEach(({ freq, delay, duration }) => {
    setTimeout(() => createTone(freq, duration, 'triangle', 0.4), delay);
  });
};

// Character selection sound
const playCharacterSelectSound = () => {
  createTone(659.25, 0.1, 'triangle', 0.4); // E5
  setTimeout(() => createTone(783.99, 0.15, 'triangle', 0.4), 80); // G5
};

export const useEnhancedSounds = () => {
  const playSound = useCallback((
    soundType: 'success' | 'error' | 'celebration' | 'greeting',
    character?: Character | null
  ) => {
    try {
      switch (soundType) {
        case 'success':
          if (character?.personality === 'magical') {
            playMagicalSuccess();
          } else if (character?.personality === 'heroic') {
            playHeroicSuccess();
          } else {
            playSuccessSound();
          }
          break;
        case 'error':
          playGentleError();
          break;
        case 'celebration':
          playCelebrationSound();
          break;
        case 'greeting':
          playCharacterSelectSound();
          break;
      }
    } catch (error) {
      console.log('Enhanced sound playback not available:', error);
    }
  }, []);

  const playEmotionalFeedback = useCallback((
    emotion: 'happy' | 'excited' | 'encouraging' | 'sad',
    character?: Character | null
  ) => {
    switch (emotion) {
      case 'happy':
        playSound('success', character);
        break;
      case 'excited':
        playSound('celebration', character);
        break;
      case 'encouraging':
        // Gentle, supportive sound
        createTone(500, 0.3, 'sine', 0.2);
        setTimeout(() => createTone(600, 0.4, 'sine', 0.25), 200);
        break;
      case 'sad':
        playSound('error', character);
        break;
    }
  }, [playSound]);

  const playCharacterSpecificSound = useCallback((
    character: Character,
    action: 'appear' | 'speak' | 'celebrate' | 'encourage'
  ) => {
    switch (character.personality) {
      case 'energetic':
        if (action === 'celebrate') {
          // Fast, energetic celebration
          for (let i = 0; i < 5; i++) {
            setTimeout(() => createTone(800 + i * 100, 0.1, 'triangle', 0.3), i * 100);
          }
        } else if (action === 'appear') {
          createTone(1000, 0.1, 'triangle', 0.4);
          setTimeout(() => createTone(1200, 0.1, 'triangle', 0.3), 50);
        }
        break;
      case 'magical':
        if (action === 'appear') {
          // Magical shimmer
          const frequencies = [800, 1000, 1200, 1400];
          frequencies.forEach((freq, index) => {
            setTimeout(() => createTone(freq, 0.15, 'sine', 0.2), index * 80);
          });
        }
        break;
      case 'heroic':
        if (action === 'appear') {
          // Heroic fanfare
          createTone(523.25, 0.2, 'square', 0.3);
          setTimeout(() => createTone(783.99, 0.3, 'square', 0.4), 150);
        }
        break;
      case 'wise':
        if (action === 'speak') {
          createTone(400, 0.2, 'sine', 0.15);
        }
        break;
      case 'friendly':
        if (action === 'appear') {
          // Friendly jingle
          createTone(659.25, 0.15, 'triangle', 0.3);
          setTimeout(() => createTone(783.99, 0.15, 'triangle', 0.3), 100);
          setTimeout(() => createTone(1046.50, 0.2, 'triangle', 0.3), 200);
        }
        break;
    }
  }, []);

  return {
    playSound,
    playEmotionalFeedback,
    playCharacterSpecificSound
  };
}; 