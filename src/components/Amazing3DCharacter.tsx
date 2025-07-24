'use client';

import React, { useState, useEffect } from 'react';
import { Character } from '@/store/characterStore';

interface Props {
  character: Character;
  emotion: 'idle' | 'happy' | 'excited' | 'thinking' | 'speaking' | 'sad' | 'encouraging' | 'celebrating';
  isSpeaking?: boolean;
  isProcessing?: boolean;
  text?: string;
  size?: 'small' | 'medium' | 'large';
}

const Amazing3DCharacter: React.FC<Props> = ({ 
  character,
  emotion = 'idle', 
  isSpeaking = false, 
  isProcessing = false,
  text,
  size = 'medium'
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [mouthState, setMouthState] = useState('closed');
  const [handPosition, setHandPosition] = useState('normal');

  const getSizeClass = (size: string) => {
    switch (size) {
      case 'small': return 'w-40 h-40';
      case 'large': return 'w-96 h-96';
      default: return 'w-72 h-72';
    }
  };

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 2000 + Math.random() * 3000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Speaking animation
  useEffect(() => {
    if (isSpeaking) {
      const speakInterval = setInterval(() => {
        setMouthState(prev => prev === 'open' ? 'semi' : prev === 'semi' ? 'closed' : 'open');
      }, 200);

      return () => clearInterval(speakInterval);
    } else {
      setMouthState('closed');
    }
  }, [isSpeaking]);

  // Hand position based on emotion
  useEffect(() => {
    switch (emotion) {
      case 'thinking': setHandPosition('chin'); break;
      case 'happy': case 'celebrating': setHandPosition('waving'); break;
      case 'encouraging': setHandPosition('thumbsUp'); break;
      case 'sad': setHandPosition('down'); break;
      default: setHandPosition('normal');
    }
  }, [emotion]);

  // Frame animation for dynamic poses
  useEffect(() => {
    const frameInterval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % 8);
    }, 500);

    return () => clearInterval(frameInterval);
  }, []);

  const getEmotionColors = (emotion: string) => {
    switch (emotion) {
      case 'happy': return { bg: 'from-yellow-200 via-orange-200 to-yellow-300', accent: 'from-yellow-400 to-orange-500', shadow: 'shadow-yellow-400/50' };
      case 'excited': return { bg: 'from-pink-200 via-purple-200 to-pink-300', accent: 'from-pink-400 to-purple-500', shadow: 'shadow-pink-400/50' };
      case 'celebrating': return { bg: 'from-green-200 via-emerald-200 to-green-300', accent: 'from-green-400 to-emerald-500', shadow: 'shadow-green-400/50' };
      case 'thinking': return { bg: 'from-blue-200 via-indigo-200 to-blue-300', accent: 'from-blue-400 to-indigo-500', shadow: 'shadow-blue-400/50' };
      case 'encouraging': return { bg: 'from-purple-200 via-pink-200 to-purple-300', accent: 'from-purple-400 to-pink-500', shadow: 'shadow-purple-400/50' };
      case 'sad': return { bg: 'from-gray-200 via-slate-200 to-gray-300', accent: 'from-gray-400 to-slate-500', shadow: 'shadow-gray-400/50' };
      default: return { bg: 'from-cyan-200 via-blue-200 to-cyan-300', accent: 'from-cyan-400 to-blue-500', shadow: 'shadow-cyan-400/50' };
    }
  };

  const colors = getEmotionColors(emotion);

  return (
    <div className="relative flex items-center justify-center">
      <div className={`${getSizeClass(size)} relative`}>
        
        {/* 3D Container with enhanced shadow and depth */}
        <div className={`w-full h-full relative rounded-full bg-gradient-to-br ${colors.bg} shadow-2xl ${colors.shadow} border-4 border-white/60 overflow-hidden transform-gpu transition-all duration-500 ${
          isProcessing ? 'animate-pulse scale-105 opacity-75' : 
          isSpeaking ? 'animate-bounce scale-110' : 
          'hover:scale-105'
        }`}
             style={{
               background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 50%), linear-gradient(135deg, ${colors.bg.replace('from-', '').replace('via-', '').replace('to-', '').split(' ').join(', ')})`
             }}>
          
          {/* Processing Overlay */}
          {isProcessing && (
            <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-pulse z-20" />
          )}
          
          {/* 3D Depth Gradient */}
          <div className="absolute inset-0 rounded-full"
               style={{
                 background: `radial-gradient(ellipse at 40% 35%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 40%, transparent 70%), 
                             radial-gradient(ellipse at 70% 80%, rgba(0,0,0,0.1) 0%, transparent 50%)`
               }} />
          
          {/* Enhanced Character Face SVG */}
          <svg viewBox="0 0 240 280" className="w-full h-full relative z-10">
            {/* Character Body */}
            <ellipse cx="120" cy="220" rx="45" ry="30" fill="#4A90E2" opacity="0.8" />
            
            {/* Character Head */}
            <circle 
              cx="120" 
              cy="120" 
              r="85" 
              fill={emotion === 'celebrating' ? '#FFD700' : emotion === 'sad' ? '#87CEEB' : '#FFA07A'}
              className={`transition-all duration-500 ${isSpeaking ? 'animate-pulse' : ''}`}
              style={{
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
              }}
            />
            
            {/* Face highlight for 3D effect */}
            <ellipse cx="105" cy="95" rx="30" ry="35" fill="rgba(255,255,255,0.3)" />
            
            {/* Eyes with 3D depth */}
            <ellipse 
              cx="95" 
              cy="100" 
              rx={isBlinking ? "3" : "12"} 
              ry={isBlinking ? "2" : "15"}
              fill="#000"
              className="transition-all duration-150"
            />
            <ellipse 
              cx="145" 
              cy="100" 
              rx={isBlinking ? "3" : "12"} 
              ry={isBlinking ? "2" : "15"}
              fill="#000"
              className="transition-all duration-150"
            />
            
            {/* Eye highlights and pupils */}
            {!isBlinking && (
              <>
                <circle cx="98" cy="97" r="4" fill="#fff" />
                <circle cx="148" cy="97" r="4" fill="#fff" />
                <circle cx="100" cy="102" r="2" fill="#fff" opacity="0.8" />
                <circle cx="150" cy="102" r="2" fill="#fff" opacity="0.8" />
              </>
            )}

            {/* Enhanced Eyebrows with 3D effect */}
            <path 
              d={emotion === 'thinking' ? "M 80 85 Q 95 75 110 82" : 
                  emotion === 'sad' ? "M 80 90 Q 95 95 110 88" :
                  emotion === 'happy' ? "M 80 82 Q 95 75 110 80" :
                  "M 80 85 Q 95 78 110 83"} 
              stroke="#8B4513" 
              strokeWidth="4" 
              fill="none"
              className="transition-all duration-500"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}
            />
            <path 
              d={emotion === 'thinking' ? "M 130 82 Q 145 75 160 85" : 
                  emotion === 'sad' ? "M 130 88 Q 145 95 160 90" :
                  emotion === 'happy' ? "M 130 80 Q 145 75 160 82" :
                  "M 130 83 Q 145 78 160 85"} 
              stroke="#8B4513" 
              strokeWidth="4" 
              fill="none"
              className="transition-all duration-500"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}
            />

            {/* 3D Nose */}
            <ellipse cx="120" cy="115" rx="4" ry="8" fill="#FF8C69" />
            <ellipse cx="120" cy="113" rx="2" ry="4" fill="rgba(255,255,255,0.3)" />

            {/* Enhanced Mouth with 3D depth */}
            <path 
              d={
                mouthState === 'open' ? "M 100 140 Q 120 160 140 140" :
                mouthState === 'semi' ? "M 105 145 Q 120 155 135 145" :
                emotion === 'happy' || emotion === 'celebrating' ? "M 100 135 Q 120 150 140 135" :
                emotion === 'sad' ? "M 100 145 Q 120 130 140 145" :
                "M 105 140 L 135 140"
              }
              stroke="#8B4513" 
              strokeWidth="4" 
              fill={mouthState !== 'closed' ? "#FFB6C1" : "none"}
              className="transition-all duration-200"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
            />

            {/* Enhanced Cheeks for happy emotions */}
            {(emotion === 'happy' || emotion === 'celebrating' || emotion === 'excited') && (
              <>
                <circle cx="75" cy="125" r="12" fill="#FFB6C1" opacity="0.7" />
                <circle cx="165" cy="125" r="12" fill="#FFB6C1" opacity="0.7" />
                <circle cx="77" cy="123" r="6" fill="rgba(255,255,255,0.4)" />
                <circle cx="167" cy="123" r="6" fill="rgba(255,255,255,0.4)" />
              </>
            )}

            {/* HANDS - The main enhancement! */}
            {/* Left Hand */}
            <g className={`transition-all duration-500 ${handPosition === 'waving' ? 'animate-bounce' : ''}`}>
              <circle 
                cx={handPosition === 'chin' ? "80" : handPosition === 'waving' ? "60" : handPosition === 'thumbsUp' ? "70" : "75"} 
                cy={handPosition === 'chin' ? "160" : handPosition === 'waving' ? "140" : handPosition === 'thumbsUp' ? "150" : handPosition === 'down' ? "200" : "175"} 
                r="15" 
                fill="#FDBCB4"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
              />
              {/* Fingers */}
              {handPosition === 'thumbsUp' && (
                <ellipse cx="65" cy="142" rx="3" ry="8" fill="#FDBCB4" transform="rotate(-20 65 142)" />
              )}
              {handPosition === 'waving' && (
                <>
                  <ellipse cx="58" cy="135" rx="2" ry="6" fill="#FDBCB4" transform="rotate(-10 58 135)" />
                  <ellipse cx="62" cy="133" rx="2" ry="7" fill="#FDBCB4" transform="rotate(10 62 133)" />
                  <ellipse cx="66" cy="135" rx="2" ry="6" fill="#FDBCB4" transform="rotate(30 66 135)" />
                </>
              )}
            </g>

            {/* Right Hand */}
            <g className={`transition-all duration-500 ${handPosition === 'waving' ? 'animate-bounce' : ''}`}
               style={{ animationDelay: handPosition === 'waving' ? '0.2s' : '0s' }}>
              <circle 
                cx={handPosition === 'chin' ? "160" : handPosition === 'waving' ? "180" : handPosition === 'thumbsUp' ? "170" : "165"} 
                cy={handPosition === 'chin' ? "160" : handPosition === 'waving' ? "140" : handPosition === 'thumbsUp' ? "150" : handPosition === 'down' ? "200" : "175"} 
                r="15" 
                fill="#FDBCB4"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
              />
              {/* Fingers */}
              {handPosition === 'thumbsUp' && (
                <ellipse cx="175" cy="142" rx="3" ry="8" fill="#FDBCB4" transform="rotate(20 175 142)" />
              )}
              {handPosition === 'waving' && (
                <>
                  <ellipse cx="182" cy="135" rx="2" ry="6" fill="#FDBCB4" transform="rotate(10 182 135)" />
                  <ellipse cx="178" cy="133" rx="2" ry="7" fill="#FDBCB4" transform="rotate(-10 178 133)" />
                  <ellipse cx="174" cy="135" rx="2" ry="6" fill="#FDBCB4" transform="rotate(-30 174 135)" />
                </>
              )}
            </g>
          </svg>

          {/* Enhanced Floating Elements */}
          {emotion === 'celebrating' && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-2xl animate-bounce"
                  style={{
                    top: `${5 + Math.sin(currentFrame + i) * 25}%`,
                    left: `${5 + Math.cos(currentFrame + i) * 35}%`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '1s',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                  }}
                >
                  {['🎉', '⭐', '✨', '🎊', '💫', '🌟', '🎈', '🎁', '🏆', '💎', '🔥', '⚡'][i]}
                </div>
              ))}
            </div>
          )}

          {/* Enhanced Thinking bubbles */}
          {emotion === 'thinking' && (
            <div className="absolute -top-6 -right-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="absolute bg-white rounded-full shadow-xl animate-pulse border-2 border-blue-200"
                  style={{
                    width: `${i * 8}px`,
                    height: `${i * 8}px`,
                    right: `${i * 12}px`,
                    top: `${-i * 10}px`,
                    animationDelay: `${i * 0.3}s`,
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                  }}
                >
                  {i === 4 && <div className="absolute inset-0 flex items-center justify-center text-xs">💭</div>}
                </div>
              ))}
            </div>
          )}

          {/* Enhanced Sound waves when speaking */}
          {isSpeaking && (
            <div className="absolute inset-0 pointer-events-none">
              {[1, 2, 3, 4, 5].map((wave) => (
                <div
                  key={wave}
                  className="absolute border-4 border-green-400 rounded-full animate-ping opacity-40"
                  style={{
                    width: `${90 + wave * 25}%`,
                    height: `${90 + wave * 25}%`,
                    top: `${-wave * 12.5}%`,
                    left: `${-wave * 12.5}%`,
                    animationDelay: `${wave * 0.15}s`,
                    animationDuration: '1.8s',
                    borderStyle: 'dashed'
                  }}
                />
              ))}
            </div>
          )}

          {/* 3D Glow effect */}
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${colors.accent} opacity-25 blur-2xl scale-110`} />
        </div>

        {/* Enhanced Character Name */}
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="bg-white/95 backdrop-blur-md px-6 py-3 rounded-full shadow-xl border-2 border-white/50">
            <div className="text-sm font-bold text-gray-800 text-center tracking-wide">
              {character.nameArabic}
            </div>
          </div>
        </div>

        {/* Enhanced Status Indicators */}
        <div className="absolute -top-3 -right-3 space-y-2">
          {isSpeaking && (
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-bounce flex items-center justify-center shadow-xl border-2 border-white">
              <span className="text-white text-sm">🔊</span>
            </div>
          )}
          {emotion === 'celebrating' && (
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full animate-spin flex items-center justify-center shadow-xl border-2 border-white">
              <span className="text-white text-sm">🏆</span>
            </div>
          )}
          {emotion === 'encouraging' && (
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse flex items-center justify-center shadow-xl border-2 border-white">
              <span className="text-white text-sm">💪</span>
            </div>
          )}
          {emotion === 'thinking' && (
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse flex items-center justify-center shadow-xl border-2 border-white">
              <span className="text-white text-sm">🧠</span>
            </div>
          )}
        </div>

        {/* Enhanced Particle System */}
        {(emotion === 'happy' || emotion === 'celebrating') && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-ping shadow-lg"
                style={{
                  top: `${15 + Math.sin(currentFrame * 0.5 + i) * 35}%`,
                  left: `${15 + Math.cos(currentFrame * 0.5 + i) * 35}%`,
                  animationDelay: `${i * 0.4}s`,
                  animationDuration: '2.5s'
                }}
              />
            ))}
          </div>
        )}

        {/* Status Indicators */}
        {isSpeaking && (
          <div className="absolute -top-2 -right-2 z-30">
            <div className="w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
            <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full"></div>
          </div>
        )}

        {isProcessing && !isSpeaking && (
          <div className="absolute -top-2 -right-2 z-30">
            <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
          </div>
        )}

        {/* Processing Text */}
        {isProcessing && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="bg-blue-500/80 text-white text-sm px-3 py-1 rounded-full animate-pulse">
              جاري التحضير...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Amazing3DCharacter; 