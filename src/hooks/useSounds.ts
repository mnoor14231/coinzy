import { useCallback } from 'react';

// Sound effect definitions using Web Audio API for instant playback
const createBeep = (frequency: number, duration: number, type: 'sine' | 'square' | 'triangle' = 'sine') => {
  if (typeof window === 'undefined' || !window.AudioContext) return;
  
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = type;
  
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

const playSuccessSound = () => {
  // Happy ascending notes
  setTimeout(() => createBeep(523.25, 0.15), 0);   // C5
  setTimeout(() => createBeep(659.25, 0.15), 100); // E5
  setTimeout(() => createBeep(783.99, 0.25), 200); // G5
};

const playErrorSound = () => {
  // Descending error sound
  createBeep(300, 0.3, 'square');
  setTimeout(() => createBeep(200, 0.3, 'square'), 150);
};

const playClickSound = () => {
  // Quick click sound
  createBeep(800, 0.1, 'triangle');
};

const playPopSound = () => {
  // Pop sound for UI interactions
  createBeep(1000, 0.05);
  setTimeout(() => createBeep(1200, 0.05), 50);
};

const playWhooshSound = () => {
  // Whoosh for transitions
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
  oscillator.type = 'sawtooth';
  
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
  
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.3);
};

const playCelebrationSound = () => {
  // Multi-tone celebration
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  notes.forEach((freq, index) => {
    setTimeout(() => createBeep(freq, 0.2, 'triangle'), index * 100);
  });
};

export const useSounds = () => {
  const playSound = useCallback((soundType: 'success' | 'error' | 'click' | 'pop' | 'whoosh' | 'celebration') => {
    try {
      switch (soundType) {
        case 'success':
          playSuccessSound();
          break;
        case 'error':
          playErrorSound();
          break;
        case 'click':
          playClickSound();
          break;
        case 'pop':
          playPopSound();
          break;
        case 'whoosh':
          playWhooshSound();
          break;
        case 'celebration':
          playCelebrationSound();
          break;
      }
    } catch (error) {
      console.log('Sound playback not available:', error);
    }
  }, []);

  return { playSound };
}; 