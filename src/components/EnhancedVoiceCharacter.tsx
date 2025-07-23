'use client';

import React, { useState, useEffect } from 'react';
import { Character } from '@/store/characterStore';

interface Props {
  character: Character;
  emotion: 'idle' | 'happy' | 'excited' | 'thinking' | 'speaking' | 'sad' | 'encouraging' | 'celebrating';
  isSpeaking?: boolean;
  size?: 'small' | 'medium' | 'large';
  showSoundWaves?: boolean;
  action?: 'idle' | 'speaking' | 'celebrating' | 'thinking' | 'encouraging';
}

const EnhancedVoiceCharacter: React.FC<Props> = ({ 
  character,
  emotion = 'idle', 
  isSpeaking = false, 
  size = 'medium',
  showSoundWaves = false,
  action = 'idle'
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState(character.animations.idle);

  useEffect(() => {
    if (isSpeaking) {
      setIsAnimating(true);
      setCurrentAnimation(character.animations.speaking);
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
  }, [isSpeaking, action, character]);

  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'text-6xl';
      case 'medium': return 'text-8xl';
      case 'large': return 'text-9xl';
      default: return 'text-8xl';
    }
  };

  const getAnimationClass = () => {
    let baseClass = 'transition-all duration-300 ';
    
    if (isSpeaking && isAnimating) {
      baseClass += 'scale-110 ';
    }
    
    switch (emotion) {
      case 'excited':
        return baseClass + 'animate-bounce';
      case 'thinking':
        return baseClass + 'animate-pulse';
      case 'speaking':
        return baseClass + (isSpeaking ? 'animate-pulse' : '');
      case 'encouraging':
        return baseClass + 'animate-bounce';
      case 'celebrating':
        return baseClass + 'animate-spin';
      default:
        return baseClass + 'float-animation';
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative">
        {/* Main Character - Single Emoji Display */}
        <div className={`${getSizeClass()} ${getAnimationClass()} filter drop-shadow-lg relative z-10 flex items-center justify-center`}>
          <div className="w-full h-full flex flex-col items-center justify-center">
            {/* Single Character Emoji - Changes Based on Emotion */}
            <div className={`text-6xl transition-all duration-500 ${isSpeaking ? 'animate-bounce' : 'hover:scale-110'}`}>
              {emotion === 'speaking' && '🗣️'}
              {emotion === 'happy' && '😄'}
              {emotion === 'excited' && '🤩'}
              {emotion === 'thinking' && '🤔'}
              {emotion === 'sad' && '😔'}
              {emotion === 'encouraging' && '💪'}
              {emotion === 'celebrating' && '🎉'}
              {(!emotion || emotion === 'idle') && '🤖'}
            </div>

            {/* Character Name */}
            <div className="text-xs font-bold text-white/80 mt-2 text-center">
              {character.nameArabic}
            </div>
          </div>
        </div>

        {/* Sound Waves */}
        {showSoundWaves && isSpeaking && (
          <div className="absolute -inset-8 flex items-center justify-center">
            {[1, 2, 3].map((wave) => (
              <div
                key={wave}
                className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-ping"
                style={{
                  animationDelay: `${wave * 0.3}s`,
                  width: `${80 + wave * 20}px`,
                  height: `${80 + wave * 20}px`,
                  left: `${-40 - wave * 10}px`,
                  top: `${-40 - wave * 10}px`,
                }}
              />
            ))}
          </div>
        )}

        {/* Character Glow */}
        <div className={`absolute -inset-4 rounded-full bg-gradient-to-r ${character.color} opacity-20 blur-xl animate-pulse`} />
      </div>

      {/* Speech Bubble */}
      {isSpeaking && (
        <div className="mt-4 relative">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`w-2 h-2 bg-gradient-to-r ${character.color} rounded-full animate-bounce`} style={{animationDelay: `${i * 0.1}s`}} />
                ))}
              </div>
              <span className="text-sm text-gray-700 font-medium">
                {character.nameArabic} يتحدث...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Character Badge */}
      <div className="mt-2">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${character.color} text-white`}>
          <span>{character.nameArabic}</span>
          {action === 'celebrating' && <span className="animate-bounce">🎉</span>}
        </div>
      </div>
    </div>
  );
};

export default EnhancedVoiceCharacter; 