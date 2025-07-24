'use client';

import React, { useState, useEffect } from 'react';
import { Character } from '@/store/characterStore';

interface Props {
  character: Character;
  emotion?: 'idle' | 'happy' | 'excited' | 'thinking' | 'speaking' | 'sad' | 'encouraging' | 'celebrating';
  isSpeaking?: boolean;
  size?: 'small' | 'medium' | 'large';
  showSoundWaves?: boolean;
  action?: 'idle' | 'speaking' | 'celebrating' | 'thinking' | 'encouraging';
  isProcessing?: boolean;
}

const EnhancedVoiceCharacter: React.FC<Props> = ({ 
  character,
  emotion = 'idle', 
  isSpeaking = false, 
  size = 'medium',
  showSoundWaves = false,
  action = 'idle',
  isProcessing = false
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState(character.animations.idle);

  useEffect(() => {
    if (isSpeaking) {
      setIsAnimating(true);
      setCurrentAnimation(character.animations.speaking);
    } else if (isProcessing) {
      setIsAnimating(true);
      setCurrentAnimation(character.animations.thinking);
    } else {
      setIsAnimating(false);
      switch (action) {
        case 'celebrating':
          setCurrentAnimation(character.animations.celebrating);
          break;
        case 'thinking':
          setCurrentAnimation(character.animations.thinking);
          break;
        case 'encouraging':
          setCurrentAnimation(character.animations.encouraging);
          break;
        default:
          setCurrentAnimation(character.animations.idle);
      }
    }
  }, [isSpeaking, isProcessing, action, character]);

  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'text-4xl sm:text-6xl';
      case 'medium': return 'text-6xl sm:text-8xl';
      case 'large': return 'text-8xl sm:text-9xl';
      default: return 'text-6xl sm:text-8xl';
    }
  };

  const getAnimationClass = () => {
    let baseClass = 'transition-all duration-500 ease-in-out transform ';
    
    if (isProcessing) {
      baseClass += 'animate-pulse scale-105 ';
    } else if (isSpeaking && isAnimating) {
      baseClass += 'scale-110 animate-bounce ';
    }
    
    switch (emotion) {
      case 'excited':
        return baseClass + 'animate-bounce';
      case 'thinking':
        return baseClass + 'animate-pulse';
      case 'speaking':
        return baseClass + (isSpeaking ? 'animate-pulse' : '');
      case 'encouraging':
        return baseClass + 'hover:scale-105';
      case 'celebrating':
        return baseClass + 'animate-spin';
      default:
        return baseClass + 'hover:scale-105';
    }
  };

  const getContainerClass = () => {
    return `
      relative flex flex-col items-center justify-center p-4 
      transition-all duration-300 ease-in-out
      ${isProcessing ? 'opacity-75' : 'opacity-100'}
    `;
  };

  return (
    <div className={getContainerClass()}>
      {/* Character */}
      <div className={`${getSizeClass()} ${getAnimationClass()}`}>
        {currentAnimation}
      </div>
      
      {/* Character Name */}
      <div className="mt-2 text-center">
        <h3 className="text-lg font-bold text-white">
          {character.nameArabic}
        </h3>
        {isProcessing && (
          <p className="text-sm text-blue-300 animate-pulse">
            جاري التحضير...
          </p>
        )}
      </div>

      {/* Sound Waves Animation */}
      {(showSoundWaves && (isSpeaking || isProcessing)) && (
        <div className="flex items-center justify-center mt-3 space-x-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`
                w-1 bg-gradient-to-t from-blue-400 to-purple-500 rounded-full
                ${isSpeaking ? 'animate-pulse' : 'animate-bounce'}
                ${isProcessing ? 'opacity-50' : 'opacity-100'}
              `}
              style={{
                height: `${Math.random() * 20 + 10}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: isSpeaking ? '0.8s' : '1.2s'
              }}
            />
          ))}
        </div>
      )}

      {/* Speaking Indicator */}
      {isSpeaking && (
        <div className="absolute -top-2 -right-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
          <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
      )}

      {/* Processing Indicator */}
      {isProcessing && !isSpeaking && (
        <div className="absolute -top-2 -right-2">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

export default EnhancedVoiceCharacter; 