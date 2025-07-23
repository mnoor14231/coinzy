'use client';

import React from 'react';
import { useGameStore } from '@/store/gameStore';
import Navigation from '@/components/Navigation';
import XPProgress from '@/components/XPProgress';
import AuthWrapper from '@/components/AuthWrapper';
import { useSounds } from '@/hooks/useSounds';

const MissionsPage: React.FC = () => {
  const { dailyMissions, streak, addXP } = useGameStore();
  const { playSound } = useSounds();

  const completedMissions = dailyMissions.filter(m => m.completed).length;
  const totalMissions = dailyMissions.length;
  
  const handleClaimReward = (missionId: string, reward: number) => {
    playSound('success');
    addXP(reward);
    // In a real app, you'd mark the reward as claimed
  };

  return (
    <AuthWrapper requiredRole="child">
      <div className="min-h-screen p-4 pb-28 relative overflow-hidden">
        {/* Floating background elements */}
        <div className="fixed top-20 left-5 w-16 h-16 bg-green-300/30 rounded-full blur-xl animate-ping delay-300" />
        <div className="fixed top-40 right-3 w-12 h-12 bg-blue-300/30 rounded-full blur-xl animate-ping delay-700" />
        <div className="fixed bottom-40 left-8 w-14 h-14 bg-yellow-300/30 rounded-full blur-xl animate-ping delay-1000" />
        
        <div className="max-w-md mx-auto space-y-6">
          {/* Header */}
          <div className="text-center py-4">
            <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
              🎯 <span className="gradient-text">المهام اليومية</span>
            </h1>
            <p className="text-white/80 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
              أكمل مهامك واحصل على مكافآت رائعة!
            </p>
          </div>

          {/* Streak Counter */}
          <div className="card sparkle pulse-glow">
            <div className="text-center">
              <div className="text-6xl mb-3 emoji-bounce">🔥</div>
              <h2 className="text-2xl font-bold text-orange-600 mb-2">
                سلسلة {streak} يوم
              </h2>
              <p className="text-gray-600">
                {streak === 0 
                  ? 'ابدأ سلسلتك اليوم!' 
                  : `رائع! حافظت على التعلم لمدة ${streak} يوم متتالي`
                }
              </p>
              
              {/* Streak visualization */}
              <div className="flex justify-center mt-4 gap-2">
                {Array.from({length: Math.min(7, streak)}, (_, i) => (
                  <div key={i} className="w-3 h-3 bg-orange-400 rounded-full animate-pulse" style={{animationDelay: `${i * 0.2}s`}} />
                ))}
                {Array.from({length: Math.max(0, 7 - streak)}, (_, i) => (
                  <div key={i + streak} className="w-3 h-3 bg-gray-300 rounded-full" />
                ))}
              </div>
            </div>
          </div>

          {/* Daily Progress Overview */}
          <div className="card sparkle">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">📊 تقدم اليوم</h3>
              <div className="text-3xl emoji-bounce">⚡</div>
            </div>
            
            <div className="mb-3">
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">المهام المكتملة</span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">{completedMissions} / {totalMissions}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(completedMissions / totalMissions) * 100}%` }}
                />
              </div>
            </div>
            
            {completedMissions === totalMissions && (
              <div className="text-center p-4 bg-gradient-to-r from-green-400 to-green-500 rounded-2xl text-white transform animate-bounce">
                <div className="text-2xl mb-2">🎉</div>
                <span className="font-bold">أكملت جميع المهام اليوم!</span>
              </div>
            )}
          </div>

          {/* XP Progress */}
          <div className="transform hover:scale-105 transition-transform duration-300">
            <XPProgress />
          </div>

          {/* Daily Missions */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center drop-shadow-lg">
              ✨ مهام اليوم ✨
            </h3>
            
            {dailyMissions.map((mission, index) => (
              <div
                key={mission.id}
                className={`card transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  mission.completed 
                    ? 'border-green-300 bg-gradient-to-r from-green-50 to-green-100 sparkle' 
                    : 'hover:border-purple-300'
                }`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl emoji-bounce" style={{animationDelay: `${index * 0.2}s`}}>
                        {mission.emoji}
                      </span>
                      <h4 className="text-lg font-bold text-gray-800">
                        {mission.title}
                      </h4>
                    </div>
                    <p className="text-gray-600 mb-3">{mission.description}</p>
                  </div>
                  
                  {mission.completed && (
                    <div className="flex flex-col items-center">
                      <span className="text-3xl mb-1 animate-bounce">✅</span>
                      <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">
                        مكتمل
                      </span>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <span className="bg-gray-100 px-3 py-1 rounded-full">التقدم</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      {mission.current} / {mission.target}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${Math.min((mission.current / mission.target) * 100, 100)}%` }}
                    />
                    
                    {/* Progress rocket */}
                    {mission.current > 0 && (
                      <div 
                        className="absolute top-1/2 transform -translate-y-1/2 text-white text-xs transition-all duration-700"
                        style={{ left: `${Math.min((mission.current / mission.target) * 100 - 5, 90)}%` }}
                      >
                        🚀
                      </div>
                    )}
                  </div>
                </div>

                {/* Reward */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500 text-xl emoji-bounce">⭐</span>
                    <span className="text-sm font-medium text-gray-700">
                      {mission.xpReward} نقطة خبرة
                    </span>
                  </div>
                  
                  {mission.completed && (
                    <button
                      onClick={() => handleClaimReward(mission.id, mission.xpReward)}
                      className="btn-secondary text-sm transform hover:scale-105 active:scale-95 sparkle"
                    >
                      🎁 احصل على المكافأة
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Encouragement Message */}
          <div className="card sparkle">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-2xl text-center">
              <div className="text-4xl mb-3 float-animation">💪</div>
              <h3 className="text-lg font-bold text-purple-800 mb-2">
                استمر في التعلم!
              </h3>
              <p className="text-purple-600">
                كل يوم تتعلم فيه شيئاً جديداً هو يوم مثمر. أنت تقوم بعمل رائع!
              </p>
              
              {/* Motivational badges */}
              <div className="flex justify-center gap-2 mt-4">
                <div className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">
                  🏆 بطل
                </div>
                <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
                  🚀 نشيط
                </div>
                <div className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
                  ⭐ متميز
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Navigation />
      </div>
    </AuthWrapper>
  );
};

export default MissionsPage; 