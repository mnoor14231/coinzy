'use client';

import React, { useState, useEffect } from 'react';
import { Character } from '@/store/characterStore';

interface Props {
  character: Character;
  emotion: 'idle' | 'happy' | 'excited' | 'thinking' | 'speaking' | 'sad' | 'encouraging' | 'celebrating';
  isSpeaking?: boolean;
  text?: string;
  size?: 'small' | 'medium' | 'large';
}

const TalkingHead3D: React.FC<Props> = ({ 
  character,
  emotion = 'idle', 
  isSpeaking = false, 
  text,
  size = 'medium'
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState('🤖');

  const getSizeClass = (size: string) => {
    switch (size) {
      case 'small': return 'w-32 h-32';
      case 'large': return 'w-96 h-96';
      default: return 'w-64 h-64';
    }
  };

  // Enhanced animation based on emotion and speaking
  useEffect(() => {
    if (isSpeaking) {
      setIsAnimating(true);
      setCurrentAnimation('🗣️');
      
      // Create talking animation effect
      const talkingInterval = setInterval(() => {
        setCurrentAnimation(prev => prev === '🗣️' ? '😮' : '🗣️');
      }, 300);

      return () => clearInterval(talkingInterval);
    } else {
      setIsAnimating(false);
      
      // Set emoji based on emotion
      switch (emotion) {
        case 'happy':
          setCurrentAnimation('😄');
          break;
        case 'excited':
          setCurrentAnimation('🤩');
          break;
        case 'celebrating':
          setCurrentAnimation('🎉');
          break;
        case 'thinking':
          setCurrentAnimation('🤔');
          break;
        case 'encouraging':
          setCurrentAnimation('💪');
          break;
        case 'sad':
          setCurrentAnimation('😔');
          break;
        default:
          setCurrentAnimation('🤖');
      }
    }
  }, [isSpeaking, emotion]);

  return (
    <div className="relative">
      {/* Enhanced Character Display */}
      <div className={`${getSizeClass(size)} flex items-center justify-center relative overflow-hidden`}>
        
        {/* Main Character Container */}
        <div className="relative w-full h-full bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 rounded-3xl shadow-2xl border-4 border-white/30 backdrop-blur-sm">
          
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-3xl animate-pulse" />
          
          {/* Character Display */}
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
            
            {/* Main Character Emoji with Advanced Animation */}
            <div className={`text-6xl transition-all duration-500 transform ${
              isSpeaking 
                ? 'animate-bounce scale-110' 
                : emotion === 'celebrating' 
                  ? 'animate-spin' 
                  : 'hover:scale-110'
            }`}>
              {currentAnimation}
            </div>

            {/* Character Name */}
            <div className="text-xs font-bold text-gray-700 mt-2 bg-white/50 px-3 py-1 rounded-full">
              {character.nameArabic}
            </div>

            {/* Emotion Indicator */}
            <div className="absolute -top-1 -right-1 text-xl">
              {emotion === 'celebrating' && <div className="animate-bounce">⭐</div>}
              {emotion === 'happy' && <div className="animate-pulse">❤️</div>}
              {emotion === 'encouraging' && <div className="animate-bounce">✨</div>}
              {isSpeaking && <div className="animate-ping">🔊</div>}
            </div>
          </div>

          {/* Enhanced Sound Waves */}
          {isSpeaking && (
            <div className="absolute inset-0 pointer-events-none">
              {[1, 2, 3, 4].map((wave) => (
                <div
                  key={wave}
                  className="absolute border-2 border-green-400/30 rounded-full animate-ping"
                  style={{
                    width: `${wave * 25}%`,
                    height: `${wave * 25}%`,
                    top: `${50 - (wave * 12.5)}%`,
                    left: `${50 - (wave * 12.5)}%`,
                    animationDelay: `${wave * 0.3}s`,
                    animationDuration: '2s'
                  }}
                />
              ))}
            </div>
          )}

          {/* Celebration Particles */}
          {emotion === 'celebrating' && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-2xl animate-bounce"
                  style={{
                    top: `${Math.random() * 80}%`,
                    left: `${Math.random() * 80}%`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '1s'
                  }}
                >
                  {['🎉', '⭐', '✨', '🎊', '💫', '🌟'][i]}
                </div>
              ))}
            </div>
          )}

          {/* Thinking Bubbles */}
          {emotion === 'thinking' && (
            <div className="absolute -top-2 -right-2">
              <div className="relative">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="absolute bg-white rounded-full animate-pulse"
                    style={{
                      width: `${i * 4}px`,
                      height: `${i * 4}px`,
                      right: `${i * 8}px`,
                      top: `${-i * 6}px`,
                      animationDelay: `${i * 0.3}s`
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TalkingHead3D; 