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
          isSpeaking ? 'gentle-float scale-105' : 
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
            {/* Character Body - Enhanced Rectangle */}
            <rect 
              x="75" 
              y="180" 
              width="90" 
              height="80" 
              rx="15" 
              ry="15" 
              fill="#4A90E2" 
              opacity="0.8"
              style={{
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
              }}
            />
            
            {/* Body highlight for 3D effect */}
            <rect 
              x="80" 
              y="185" 
              width="75" 
              height="70" 
              rx="12" 
              ry="12" 
              fill="rgba(255,255,255,0.2)"
            />
            
            {/* Body outline for definition */}
            <rect 
              x="75" 
              y="180" 
              width="90" 
              height="80" 
              rx="15" 
              ry="15" 
              fill="none"
              stroke="#3A7BC8"
              strokeWidth="2"
              opacity="0.6"
            />
            
            {/* Character Head - Better Rounded Shape */}
            <rect 
              x="45" 
              y="45" 
              width="150" 
              height="150" 
              rx="75" 
              ry="75" 
              fill={emotion === 'celebrating' ? '#FFD700' : emotion === 'sad' ? '#87CEEB' : '#FFA07A'}
              className={`transition-all duration-500 ${isSpeaking ? 'animate-pulse' : ''}`}
              style={{
                filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.3))'
              }}
            />
            
            {/* Head outline for definition */}
            <rect 
              x="45" 
              y="45" 
              width="150" 
              height="150" 
              rx="75" 
              ry="75" 
              fill="none"
              stroke={emotion === 'celebrating' ? '#E6C200' : emotion === 'sad' ? '#6BA5C7' : '#E68A5C'}
              strokeWidth="3"
              opacity="0.7"
            />
            
            
            
            {/* Enhanced Friendly Eyes */}
            {/* Left Eye */}
            <ellipse 
              cx="95" 
              cy="100" 
              rx={isBlinking ? "2" : "11"} 
              ry={isBlinking ? "1" : "13"}
              fill="#000"
              className="transition-all duration-150"
              style={{
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))'
              }}
            />
            
            {/* Right Eye */}
            <ellipse 
              cx="145" 
              cy="100" 
              rx={isBlinking ? "2" : "11"} 
              ry={isBlinking ? "1" : "13"}
              fill="#000"
              className="transition-all duration-150"
              style={{
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))'
              }}
            />
            
            {/* Enhanced friendly highlights */}
            {!isBlinking && (
              <>
                {/* Main highlights */}
                <circle cx="92" cy="96" r="4" fill="#fff" />
                <circle cx="142" cy="96" r="4" fill="#fff" />
                
                {/* Subtle secondary highlights */}
                <circle cx="94" cy="102" r="2" fill="#fff" opacity="0.7" />
                <circle cx="144" cy="102" r="2" fill="#fff" opacity="0.7" />
                
                {/* Tiny sparkle highlights */}
                <circle cx="90" cy="94" r="1" fill="#fff" opacity="0.9" />
                <circle cx="140" cy="94" r="1" fill="#fff" opacity="0.9" />
              </>
            )}

            {/* Enhanced Expressive Eyebrows - Smaller */}
            {/* Left Eyebrow */}
            <path 
              d={emotion === 'thinking' ? "M 80 82 Q 95 72 110 79" : 
                  emotion === 'sad' ? "M 80 87 Q 95 92 110 85" :
                  emotion === 'happy' ? "M 80 79 Q 95 72 110 77" :
                  emotion === 'excited' ? "M 80 77 Q 95 70 110 75" :
                  emotion === 'celebrating' ? "M 80 76 Q 95 69 110 74" :
                  "M 80 81 Q 95 75 110 80"} 
              stroke="#8B4513" 
              strokeWidth="4" 
              fill="none"
              strokeLinecap="round"
              className="transition-all duration-500"
              style={{ 
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))',
                strokeDasharray: emotion === 'thinking' ? "2,3" : "none"
              }}
            />
            
            {/* Right Eyebrow */}
            <path 
              d={emotion === 'thinking' ? "M 130 79 Q 145 72 160 82" : 
                  emotion === 'sad' ? "M 130 85 Q 145 92 160 87" :
                  emotion === 'happy' ? "M 130 77 Q 145 72 160 79" :
                  emotion === 'excited' ? "M 130 75 Q 145 70 160 77" :
                  emotion === 'celebrating' ? "M 130 74 Q 145 69 160 76" :
                  "M 130 80 Q 145 75 160 81"} 
              stroke="#8B4513" 
              strokeWidth="4" 
              fill="none"
              strokeLinecap="round"
              className="transition-all duration-500"
              style={{ 
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))',
                strokeDasharray: emotion === 'thinking' ? "2,3" : "none"
              }}
            />
            
            {/* Eyebrow highlights for 3D effect - Smaller */}
            <path 
              d={emotion === 'thinking' ? "M 80 80 Q 95 70 110 77" : 
                  emotion === 'sad' ? "M 80 85 Q 95 90 110 83" :
                  emotion === 'happy' ? "M 80 77 Q 95 70 110 75" :
                  emotion === 'excited' ? "M 80 75 Q 95 68 110 73" :
                  emotion === 'celebrating' ? "M 80 74 Q 95 67 110 72" :
                  "M 80 79 Q 95 73 110 78"} 
              stroke="#D2691E" 
              strokeWidth="1.5" 
              fill="none"
              strokeLinecap="round"
              opacity="0.6"
            />
            <path 
              d={emotion === 'thinking' ? "M 130 77 Q 145 70 160 80" : 
                  emotion === 'sad' ? "M 130 83 Q 145 90 160 85" :
                  emotion === 'happy' ? "M 130 75 Q 145 70 160 77" :
                  emotion === 'excited' ? "M 130 73 Q 145 68 160 75" :
                  emotion === 'celebrating' ? "M 130 72 Q 145 67 160 74" :
                  "M 130 78 Q 145 73 160 80"} 
              stroke="#D2691E" 
              strokeWidth="1.5" 
              fill="none"
              strokeLinecap="round"
              opacity="0.6"
            />

            {/* Cute Small Nose */}
            {/* Main nose shape */}
            <ellipse 
              cx="120" 
              cy="115" 
              rx="3" 
              ry="6" 
              fill="#FF8C69"
              style={{
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
              }}
            />
            
            {/* Small nose highlight */}
            <ellipse 
              cx="119" 
              cy="113" 
              rx="1" 
              ry="3" 
              fill="rgba(255,255,255,0.3)"
            />

            {/* Enhanced Friendly Mouth - Smaller */}
            <path 
              d={
                mouthState === 'open' ? "M 105 140 Q 120 155 135 140" :
                mouthState === 'semi' ? "M 107 143 Q 120 150 133 143" :
                emotion === 'sad' ? "M 105 143 Q 120 128 135 143" :
                emotion === 'thinking' ? "M 107 140 Q 120 141 133 140" :
                emotion === 'excited' ? "M 103 135 Q 120 145 137 135" :
                emotion === 'celebrating' ? "M 103 134 Q 120 147 137 134" :
                "M 105 137 Q 120 143 135 137"
              }
              stroke="#8B4513" 
              strokeWidth="4" 
              fill={mouthState !== 'closed' ? "#FFB6C1" : "none"}
              strokeLinecap="round"
              className="transition-all duration-300"
              style={{ 
                filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.2))',
                strokeLinejoin: 'round'
              }}
            />
            
            {/* Mouth highlight for 3D effect - Smaller */}
            {mouthState !== 'closed' && (
              <path 
                d={
                  emotion === 'sad' ? "M 105 141 Q 120 126 135 141" :
                  emotion === 'thinking' ? "M 107 138 Q 120 139 133 138" :
                  emotion === 'excited' ? "M 103 133 Q 120 143 137 133" :
                  emotion === 'celebrating' ? "M 103 132 Q 120 145 137 132" :
                  "M 105 135 Q 120 141 135 135"
                }
                stroke="rgba(255,255,255,0.4)" 
                strokeWidth="1.5" 
                fill="none"
                strokeLinecap="round"
                opacity="0.6"
              />
            )}

            {/* Enhanced Cheeks for happy emotions */}
            {(emotion === 'happy' || emotion === 'celebrating' || emotion === 'excited') && (
              <>
                <circle cx="75" cy="125" r="12" fill="#FFB6C1" opacity="0.7" />
                <circle cx="165" cy="125" r="12" fill="#FFB6C1" opacity="0.7" />
                <circle cx="77" cy="123" r="6" fill="rgba(255,255,255,0.4)" />
                <circle cx="167" cy="123" r="6" fill="rgba(255,255,255,0.4)" />
              </>
            )}

            {/* Enhanced 3D Hands with Rounded Rectangles - Smaller and More Refined */}
            {/* Left Hand */}
            <g className={`transition-all duration-500 ${handPosition === 'waving' ? 'emoji-bounce' : ''}`}>
              {/* Main hand palm - Smaller size */}
              <rect 
                x={handPosition === 'chin' ? "72" : handPosition === 'waving' ? "52" : handPosition === 'thumbsUp' ? "62" : "67"} 
                y={handPosition === 'chin' ? "148" : handPosition === 'waving' ? "128" : handPosition === 'thumbsUp' ? "138" : handPosition === 'down' ? "163" : "163"} 
                width="14" 
                height="28" 
                rx="7" 
                ry="7" 
                fill="#FDBCB4"
                style={{ 
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))',
                  transform: handPosition === 'waving' ? 'rotate(-15deg)' : 'rotate(0deg)'
                }}
              />
              
              {/* Hand palm highlight - Enhanced gradient effect */}
              <rect 
                x={handPosition === 'chin' ? "73" : handPosition === 'waving' ? "53" : handPosition === 'thumbsUp' ? "63" : "68"} 
                y={handPosition === 'chin' ? "150" : handPosition === 'waving' ? "130" : handPosition === 'thumbsUp' ? "140" : handPosition === 'down' ? "165" : "165"} 
                width="12" 
                height="20" 
                rx="6" 
                ry="6" 
                fill="rgba(255,255,255,0.4)"
              />
              
              {/* Hand palm outline - Thinner stroke */}
              <rect 
                x={handPosition === 'chin' ? "72" : handPosition === 'waving' ? "52" : handPosition === 'thumbsUp' ? "62" : "67"} 
                y={handPosition === 'chin' ? "148" : handPosition === 'waving' ? "128" : handPosition === 'thumbsUp' ? "138" : handPosition === 'down' ? "163" : "163"} 
                width="14" 
                height="28" 
                rx="7" 
                ry="7" 
                fill="none"
                stroke="#E6A89C"
                strokeWidth="1"
                opacity="0.6"
              />
              
              {/* Fingers for different positions - Smaller and more refined */}
              {handPosition === 'thumbsUp' && (
                <>
                  {/* Thumb - Smaller */}
                  <ellipse cx="66" cy="144" rx="2.5" ry="6" fill="#FDBCB4" transform="rotate(-20 66 144)" />
                  <ellipse cx="66" cy="144" rx="1.5" ry="4" fill="rgba(255,255,255,0.3)" transform="rotate(-20 66 144)" />
                  {/* Other fingers curled - Smaller */}
                  <ellipse cx="73" cy="163" rx="1.5" ry="2.5" fill="#FDBCB4" transform="rotate(-10 73 163)" />
                  <ellipse cx="75" cy="164" rx="1.5" ry="2.5" fill="#FDBCB4" transform="rotate(5 75 164)" />
                  <ellipse cx="77" cy="163" rx="1.5" ry="2.5" fill="#FDBCB4" transform="rotate(15 77 163)" />
                  <ellipse cx="79" cy="164" rx="1.5" ry="2.5" fill="#FDBCB4" transform="rotate(25 79 164)" />
                </>
              )}
              {handPosition === 'waving' && (
                <>
                  {/* Extended fingers for waving - Smaller */}
                  <ellipse cx="60" cy="137" rx="1.5" ry="5" fill="#FDBCB4" transform="rotate(-10 60 137)" />
                  <ellipse cx="63" cy="135" rx="1.5" ry="6" fill="#FDBCB4" transform="rotate(10 63 135)" />
                  <ellipse cx="66" cy="137" rx="1.5" ry="5" fill="#FDBCB4" transform="rotate(30 66 137)" />
                  <ellipse cx="69" cy="139" rx="1.5" ry="4" fill="#FDBCB4" transform="rotate(45 69 139)" />
                  {/* Thumb tucked - Smaller */}
                  <ellipse cx="69" cy="147" rx="1.5" ry="3" fill="#FDBCB4" transform="rotate(-30 69 147)" />
                </>
              )}
              {handPosition === 'idle' && (
                <>
                  {/* Natural relaxed fingers - Smaller */}
                  <ellipse cx="71" cy="163" rx="1.5" ry="3" fill="#FDBCB4" transform="rotate(-5 71 163)" />
                  <ellipse cx="73" cy="165" rx="1.5" ry="4" fill="#FDBCB4" transform="rotate(5 73 165)" />
                  <ellipse cx="75" cy="163" rx="1.5" ry="3" fill="#FDBCB4" transform="rotate(15 75 163)" />
                  <ellipse cx="77" cy="165" rx="1.5" ry="2.5" fill="#FDBCB4" transform="rotate(25 77 165)" />
                  {/* Thumb - Smaller */}
                  <ellipse cx="68" cy="157" rx="1.5" ry="3" fill="#FDBCB4" transform="rotate(-15 68 157)" />
                </>
              )}
              {handPosition === 'gripping' && (
                <>
                  {/* Gripping fingers - curved around - Smaller */}
                  <ellipse cx="73" cy="160" rx="1.5" ry="2.5" fill="#FDBCB4" transform="rotate(-15 73 160)" />
                  <ellipse cx="75" cy="161" rx="1.5" ry="2.5" fill="#FDBCB4" transform="rotate(-5 75 161)" />
                  <ellipse cx="77" cy="160" rx="1.5" ry="2.5" fill="#FDBCB4" transform="rotate(5 77 160)" />
                  <ellipse cx="79" cy="161" rx="1.5" ry="2.5" fill="#FDBCB4" transform="rotate(15 79 161)" />
                  {/* Thumb for grip - Smaller */}
                  <ellipse cx="69" cy="160" rx="1.5" ry="3" fill="#FDBCB4" transform="rotate(-25 69 160)" />
                </>
              )}
            </g>

            {/* Right Hand */}
            <g className={`transition-all duration-500 ${handPosition === 'waving' ? 'emoji-bounce' : ''}`}
               style={{ animationDelay: handPosition === 'waving' ? '0.2s' : '0s' }}>
              {/* Main hand palm - Smaller size */}
              <rect 
                x={handPosition === 'chin' ? "154" : handPosition === 'waving' ? "174" : handPosition === 'thumbsUp' ? "164" : "159"} 
                y={handPosition === 'chin' ? "148" : handPosition === 'waving' ? "128" : handPosition === 'thumbsUp' ? "138" : handPosition === 'down' ? "163" : "163"} 
                width="14" 
                height="28" 
                rx="7" 
                ry="7" 
                fill="#FDBCB4"
                style={{ 
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))',
                  transform: handPosition === 'waving' ? 'rotate(15deg)' : 'rotate(0deg)'
                }}
              />
              
              {/* Hand palm highlight - Enhanced gradient effect */}
              <rect 
                x={handPosition === 'chin' ? "155" : handPosition === 'waving' ? "175" : handPosition === 'thumbsUp' ? "165" : "160"} 
                y={handPosition === 'chin' ? "150" : handPosition === 'waving' ? "130" : handPosition === 'thumbsUp' ? "140" : handPosition === 'down' ? "165" : "165"} 
                width="12" 
                height="20" 
                rx="6" 
                ry="6" 
                fill="rgba(255,255,255,0.4)"
              />
              
              {/* Hand palm outline - Thinner stroke */}
              <rect 
                x={handPosition === 'chin' ? "154" : handPosition === 'waving' ? "174" : handPosition === 'thumbsUp' ? "164" : "159"} 
                y={handPosition === 'chin' ? "148" : handPosition === 'waving' ? "128" : handPosition === 'thumbsUp' ? "138" : handPosition === 'down' ? "163" : "163"} 
                width="14" 
                height="28" 
                rx="7" 
                ry="7" 
                fill="none"
                stroke="#E6A89C"
                strokeWidth="1"
                opacity="0.6"
              />
              
              {/* Fingers for different positions - Smaller and more refined */}
              {handPosition === 'thumbsUp' && (
                <>
                  {/* Thumb - Smaller */}
                  <ellipse cx="174" cy="144" rx="2.5" ry="6" fill="#FDBCB4" transform="rotate(20 174 144)" />
                  <ellipse cx="174" cy="144" rx="1.5" ry="4" fill="rgba(255,255,255,0.3)" transform="rotate(20 174 144)" />
                  {/* Other fingers curled - Smaller */}
                  <ellipse cx="167" cy="163" rx="1.5" ry="2.5" fill="#FDBCB4" transform="rotate(10 167 163)" />
                  <ellipse cx="165" cy="164" rx="1.5" ry="2.5" fill="#FDBCB4" transform="rotate(-5 165 164)" />
                  <ellipse cx="163" cy="163" rx="1.5" ry="2.5" fill="#FDBCB4" transform="rotate(-15 163 163)" />
                  <ellipse cx="161" cy="164" rx="1.5" ry="2.5" fill="#FDBCB4" transform="rotate(-25 161 164)" />
                </>
              )}
              {handPosition === 'waving' && (
                <>
                  {/* Extended fingers for waving - Smaller */}
                  <ellipse cx="180" cy="137" rx="1.5" ry="5" fill="#FDBCB4" transform="rotate(10 180 137)" />
                  <ellipse cx="177" cy="135" rx="1.5" ry="6" fill="#FDBCB4" transform="rotate(-10 177 135)" />
                  <ellipse cx="174" cy="137" rx="1.5" ry="5" fill="#FDBCB4" transform="rotate(-30 174 137)" />
                  <ellipse cx="171" cy="139" rx="1.5" ry="4" fill="#FDBCB4" transform="rotate(-45 171 139)" />
                  {/* Thumb tucked - Smaller */}
                  <ellipse cx="171" cy="147" rx="1.5" ry="3" fill="#FDBCB4" transform="rotate(30 171 147)" />
                </>
              )}
              {handPosition === 'idle' && (
                <>
                  {/* Natural relaxed fingers - Smaller */}
                  <ellipse cx="169" cy="163" rx="1.5" ry="3" fill="#FDBCB4" transform="rotate(5 169 163)" />
                  <ellipse cx="167" cy="165" rx="1.5" ry="4" fill="#FDBCB4" transform="rotate(-5 167 165)" />
                  <ellipse cx="165" cy="163" rx="1.5" ry="3" fill="#FDBCB4" transform="rotate(-15 165 163)" />
                  <ellipse cx="163" cy="165" rx="1.5" ry="2.5" fill="#FDBCB4" transform="rotate(-25 163 165)" />
                  {/* Thumb - Smaller */}
                  <ellipse cx="172" cy="157" rx="1.5" ry="3" fill="#FDBCB4" transform="rotate(15 172 157)" />
                </>
              )}
              {handPosition === 'gripping' && (
                <>
                  {/* Gripping fingers - curved around - Smaller */}
                  <ellipse cx="167" cy="160" rx="1.5" ry="2.5" fill="#FDBCB4" transform="rotate(15 167 160)" />
                  <ellipse cx="165" cy="161" rx="1.5" ry="2.5" fill="#FDBCB4" transform="rotate(5 165 161)" />
                  <ellipse cx="163" cy="160" rx="1.5" ry="2.5" fill="#FDBCB4" transform="rotate(-5 163 160)" />
                  <ellipse cx="161" cy="161" rx="1.5" ry="2.5" fill="#FDBCB4" transform="rotate(-15 161 161)" />
                  {/* Thumb for grip - Smaller */}
                  <ellipse cx="171" cy="160" rx="1.5" ry="3" fill="#FDBCB4" transform="rotate(25 171 160)" />
                </>
              )}
                        </g>
            
            {/* Money on the Floor/Ground */}
            {/* Coins scattered on the ground around the character */}
            <g>
              {/* Coin 1 - Left side of character */}
              <ellipse 
                cx="85" 
                cy="260" 
                rx="8" 
                ry="8" 
                fill="#FFD700"
                stroke="#DAA520"
                strokeWidth="1"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
              />
              <text x="85" y="264" textAnchor="middle" fontSize="8" fill="#B8860B" fontWeight="bold">$</text>
              
              {/* Coin 2 - Right side of character */}
              <ellipse 
                cx="155" 
                cy="258" 
                rx="6" 
                ry="6" 
                fill="#C0C0C0"
                stroke="#A8A8A8"
                strokeWidth="1"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
              />
              <text x="155" y="261" textAnchor="middle" fontSize="6" fill="#696969" fontWeight="bold">¢</text>
              
              {/* Coin 3 - Behind character */}
              <ellipse 
                cx="120" 
                cy="265" 
                rx="7" 
                ry="7" 
                fill="#FFD700"
                stroke="#DAA520"
                strokeWidth="1"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
              />
              <text x="120" y="269" textAnchor="middle" fontSize="7" fill="#B8860B" fontWeight="bold">$</text>
              
              {/* Bill on the ground - Left side */}
              <rect 
                x="65" 
                y="250" 
                width="25" 
                height="15" 
                rx="2" 
                ry="2" 
                fill="#90EE90"
                stroke="#228B22"
                strokeWidth="0.5"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
              />
              <text x="77.5" y="258" textAnchor="middle" fontSize="8" fill="#006400" fontWeight="bold">$5</text>
              
              {/* Bill on the ground - Right side */}
              <rect 
                x="170" 
                y="252" 
                width="20" 
                height="12" 
                rx="1" 
                ry="1" 
                fill="#90EE90"
                stroke="#228B22"
                strokeWidth="0.5"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
              />
              <text x="180" y="259" textAnchor="middle" fontSize="7" fill="#006400" fontWeight="bold">$1</text>
              
              {/* Additional small coins scattered */}
              <ellipse 
                cx="95" 
                cy="270" 
                rx="5" 
                ry="5" 
                fill="#C0C0C0"
                stroke="#A8A8A8"
                strokeWidth="1"
                style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.2))' }}
              />
              <text x="95" y="273" textAnchor="middle" fontSize="5" fill="#696969" fontWeight="bold">¢</text>
              
              <ellipse 
                cx="145" 
                cy="268" 
                rx="6" 
                ry="6" 
                fill="#FFD700"
                stroke="#DAA520"
                strokeWidth="1"
                style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.2))' }}
              />
              <text x="145" y="271" textAnchor="middle" fontSize="6" fill="#B8860B" fontWeight="bold">$</text>
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
                    {['💰', '💵', '🪙', '💎', '⭐', '✨', '🎉', '🎊', '💫', '🌟', '🎈', '🏆'][i]}
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