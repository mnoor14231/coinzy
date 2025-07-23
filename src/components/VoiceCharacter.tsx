'use client';

import React, { useState, useEffect } from 'react';

interface VoiceCharacterProps {
  emotion: 'happy' | 'excited' | 'thinking' | 'speaking' | 'sad' | 'encouraging';
  isSpeaking?: boolean;
  size?: 'small' | 'medium' | 'large';
  showSoundWaves?: boolean;
}

const VoiceCharacter: React.FC<VoiceCharacterProps> = ({ 
  emotion = 'happy', 
  isSpeaking = false, 
  size = 'medium',
  showSoundWaves = false 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [eyeBlink, setEyeBlink] = useState(false);

  // Auto blink animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setEyeBlink(true);
      setTimeout(() => setEyeBlink(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Speaking animation
  useEffect(() => {
    if (isSpeaking) {
      setIsAnimating(true);
      const interval = setInterval(() => {
        setIsAnimating(prev => !prev);
      }, 300);
      
      return () => clearInterval(interval);
    } else {
      setIsAnimating(false);
    }
  }, [isSpeaking]);

  const getCharacterEmoji = () => {
    switch (emotion) {
      case 'happy': return '😊';
      case 'excited': return '🤩';
      case 'thinking': return '🤔';
      case 'speaking': return '😄';
      case 'sad': return '😟';
      case 'encouraging': return '💪';
      default: return '😊';
    }
  };

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
      default:
        return baseClass + 'float-animation';
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Character Container */}
      <div className="relative">
        {/* Main Character */}
        <div 
          className={`
            ${getSizeClass()} 
            ${getAnimationClass()}
            filter drop-shadow-lg
            relative z-10
          `}
        >
          {getCharacterEmoji()}
        </div>

        {/* Speaking Mouth Overlay (when speaking) */}
        {isSpeaking && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className={`
              ${isAnimating ? 'scale-110' : 'scale-100'}
              transition-transform duration-200
              ${getSizeClass()}
              opacity-80
            `}>
              😮
            </div>
          </div>
        )}

        {/* Eye Blink Overlay */}
        {eyeBlink && (
          <div className="absolute inset-0 flex items-center justify-center z-15">
            <div className={getSizeClass()}>
              😑
            </div>
          </div>
        )}

        {/* Sound Waves Animation */}
        {showSoundWaves && isSpeaking && (
          <div className="absolute -inset-8 flex items-center justify-center">
            <div className="relative">
              {[1, 2, 3].map((wave) => (
                <div
                  key={wave}
                  className={`
                    absolute inset-0 rounded-full border-2 border-blue-400/30
                    animate-ping
                  `}
                  style={{
                    animationDelay: `${wave * 0.3}s`,
                    animationDuration: '1.5s',
                    width: `${80 + wave * 20}px`,
                    height: `${80 + wave * 20}px`,
                    left: `${-40 - wave * 10}px`,
                    top: `${-40 - wave * 10}px`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Glow Effect */}
        <div className={`
          absolute -inset-4 rounded-full 
          ${emotion === 'excited' ? 'bg-yellow-300/20' : 
            emotion === 'encouraging' ? 'bg-green-300/20' :
            emotion === 'sad' ? 'bg-blue-300/20' :
            'bg-purple-300/20'
          }
          blur-xl animate-pulse
        `} />
      </div>

      {/* Speech Bubble (optional) */}
      {isSpeaking && (
        <div className="mt-4 relative">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg border-2 border-purple-200">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200" />
              </div>
              <span className="text-sm text-purple-700 font-medium">يتحدث...</span>
            </div>
          </div>
          {/* Speech bubble pointer */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white/90 rotate-45 border-l-2 border-t-2 border-purple-200" />
        </div>
      )}

      {/* Emotion Indicator */}
      <div className="mt-2 text-center">
        <div className={`
          inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium
          ${emotion === 'happy' ? 'bg-yellow-100 text-yellow-800' :
            emotion === 'excited' ? 'bg-orange-100 text-orange-800' :
            emotion === 'thinking' ? 'bg-blue-100 text-blue-800' :
            emotion === 'speaking' ? 'bg-purple-100 text-purple-800' :
            emotion === 'encouraging' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }
          transition-all duration-300
        `}>
          <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
          {emotion === 'happy' && 'سعيد'}
          {emotion === 'excited' && 'متحمس'}
          {emotion === 'thinking' && 'يفكر'}
          {emotion === 'speaking' && 'يتحدث'}
          {emotion === 'encouraging' && 'مشجع'}
          {emotion === 'sad' && 'حزين'}
        </div>
      </div>
    </div>
  );
};

export default VoiceCharacter; 