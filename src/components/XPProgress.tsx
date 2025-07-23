'use client';

import React from 'react';
import { useGameStore } from '@/store/gameStore';

interface XPProgressProps {
  showLevel?: boolean;
  className?: string;
}

const XPProgress: React.FC<XPProgressProps> = ({ showLevel = true, className = '' }) => {
  const { xp, level } = useGameStore();
  
  const currentLevelXP = (level - 1) * 100;
  const nextLevelXP = level * 100;
  const progressInLevel = xp - currentLevelXP;
  const progressPercentage = (progressInLevel / 100) * 100;

  return (
    <div className={`card sparkle relative overflow-hidden ${className}`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-yellow-300/20 to-transparent rounded-full blur-xl" />
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl emoji-bounce">⭐</span>
          <span className="font-bold text-gray-800 text-lg">نقاط الخبرة</span>
        </div>
        {showLevel && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg pulse-glow">
            👑 المستوى {level}
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            {progressInLevel} / 100
          </span>
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
            {xp} نقطة إجمالية
          </span>
        </div>
        
        <div className="progress-bar relative">
          <div 
            className="progress-fill relative overflow-hidden"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          >
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-pulse" />
          </div>
          
          {/* Progress indicator emoji */}
          {progressPercentage > 10 && (
            <div 
              className="absolute top-1/2 transform -translate-y-1/2 text-white text-xs transition-all duration-700"
              style={{ left: `${Math.min(progressPercentage - 5, 90)}%` }}
            >
              🚀
            </div>
          )}
        </div>
      </div>
      
      <div className="text-center">
        {progressInLevel >= 100 ? (
          <div className="bg-gradient-to-r from-green-400 to-green-500 text-white p-4 rounded-2xl shadow-lg transform animate-bounce">
            <span className="text-2xl mb-2 block">🎉</span>
            <span className="font-bold text-lg">جاهز للمستوى التالي!</span>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-3 rounded-xl">
            <span className="text-gray-700 font-medium">
              تحتاج <span className="font-bold text-purple-600">{100 - progressInLevel}</span> نقطة للمستوى 
              <span className="font-bold text-purple-600"> {level + 1}</span>
            </span>
            <div className="flex justify-center mt-2 gap-1">
              {Array.from({length: Math.min(5, 100 - progressInLevel)}, (_, i) => (
                <span key={i} className="text-yellow-500 animate-pulse" style={{animationDelay: `${i * 0.2}s`}}>⭐</span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Level celebration effect */}
      {progressInLevel >= 100 && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 left-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
          <div className="absolute top-4 right-4 w-2 h-2 bg-pink-400 rounded-full animate-ping delay-500" />
          <div className="absolute bottom-3 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-ping delay-1000" />
          <div className="absolute bottom-2 right-6 w-3 h-3 bg-green-400 rounded-full animate-ping delay-700" />
        </div>
      )}
    </div>
  );
};

export default XPProgress; 