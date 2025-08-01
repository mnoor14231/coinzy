'use client';

import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useCharacterStore } from '@/store/characterStore';
import { useAuthStore } from '@/store/authStore';
import Navigation from '@/components/Navigation';
import XPProgress from '@/components/XPProgress';
import AuthWrapper from '@/components/AuthWrapper';
import Amazing3DCharacter from '@/components/Amazing3DCharacter';
import { useEnhancedVoice } from '@/hooks/useEnhancedVoice';
import { useEnhancedSounds } from '@/hooks/useEnhancedSounds';
import { Star, Gift, Target, TrendingUp, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Confetti from 'react-confetti';

const MissionsPage: React.FC = () => {
  const { dailyMissions, streak, addXP, addRewardPoints, weeklySavingGoal, weeklyProgress } = useGameStore();
  const { selectedCharacter } = useCharacterStore();
  const { logout } = useAuthStore();
  const { speakWithCharacter, isSpeaking, isProcessing } = useEnhancedVoice();
  const { playSound } = useEnhancedSounds();
  const router = useRouter();
  
  const [showConfetti, setShowConfetti] = useState(false);
  const [characterEmotion, setCharacterEmotion] = useState<'idle' | 'happy' | 'excited' | 'thinking' | 'speaking' | 'sad' | 'encouraging' | 'celebrating'>('idle');
  const [claimedRewards, setClaimedRewards] = useState<Set<string>>(new Set());

  const completedMissions = dailyMissions.filter(m => m.completed).length;
  const totalMissions = dailyMissions.length;
  const allCompleted = completedMissions === totalMissions;
  
  // Celebrate when all missions are completed
  useEffect(() => {
    if (allCompleted && selectedCharacter) {
      setShowConfetti(true);
      setCharacterEmotion('celebrating');
      
      setTimeout(() => {
        speakWithCharacter(
          'مبروك! أكملت جميع المهام اليوم! أنت بطل حقيقي!',
          selectedCharacter,
          'celebrating'
        );
      }, 500);
      
      setTimeout(() => {
        setShowConfetti(false);
        setCharacterEmotion('happy');
      }, 4000);
    }
  }, [allCompleted, selectedCharacter, speakWithCharacter]);
  
  const handleClaimReward = (missionId: string, reward: number) => {
    if (claimedRewards.has(missionId)) return;
    
    setClaimedRewards(prev => new Set(prev.add(missionId)));
    setCharacterEmotion('celebrating');
    playSound('celebration', selectedCharacter);
    addXP(reward);
    
    // Add reward points for completing mission (50 points per mission)
    addRewardPoints(50, `إكمال مهمة يومية`);
    
    if (selectedCharacter) {
      setTimeout(() => {
        speakWithCharacter(
          `رائع! حصلت على ${reward} نقطة خبرة و 50 نقطة مكافأة!`,
          selectedCharacter,
          'celebrating'
        );
      }, 500);
    }
    
    setTimeout(() => {
      setCharacterEmotion('happy');
    }, 3000);
  };

  const getStreakMessage = () => {
    if (streak === 0) return 'ابدأ سلسلتك اليوم!';
    if (streak < 3) return `رائع! ${streak} يوم متتالي`;
    if (streak < 7) return `ممتاز! ${streak} أيام متتالية`;
    if (streak < 14) return `أسطوري! ${streak} يوم متتالي!`;
    return `مذهل! ${streak} يوم متتالي! أنت بطل!`;
  };

  const getStreakIcon = () => {
    if (streak === 0) return '🌱';
    if (streak < 3) return '🔥';
    if (streak < 7) return '⚡';
    if (streak < 14) return '🌟';
    return '👑';
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <AuthWrapper requiredRole="child">
      <div className="min-h-screen pb-28 relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800">
        
        {/* Confetti Effect */}
        {showConfetti && (
          <Confetti
            width={typeof window !== 'undefined' ? window.innerWidth : 400}
            height={typeof window !== 'undefined' ? window.innerHeight : 800}
            recycle={false}
            numberOfPieces={300}
            gravity={0.1}
          />
        )}

        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10 animate-float"
              style={{
                width: `${Math.random() * 60 + 20}px`,
                height: `${Math.random() * 60 + 20}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${Math.random() * 15 + 10}s`
              }}
            />
          ))}
        </div>
        
        <div className="max-w-md mx-auto p-4 space-y-6">
          {/* Enhanced Header */}
          <div className="text-center py-6">
            <div className="flex justify-between items-center mb-4">
              <div></div>
              <div className="text-7xl animate-bounce">🎯</div>
              <button
                onClick={handleLogout}
                className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-300 shadow-lg transform hover:scale-110"
                title="تسجيل الخروج"
              >
                <LogOut size={20} />
              </button>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
              <span className="gradient-text">المهام اليومية</span>
            </h1>
            <p className="text-white/90 text-lg bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 inline-block border border-white/30">
              أكمل مهامك واحصل على مكافآت رائعة! ✨
            </p>
          </div>

          {/* Character Display */}
          {selectedCharacter && (
            <div className="flex justify-center mb-6">
              <Amazing3DCharacter
                character={selectedCharacter}
                emotion={characterEmotion}
                isSpeaking={isSpeaking}
                isProcessing={isProcessing}
                size="large"
              />
            </div>
          )}

          {/* Enhanced Streak Counter */}
          <div className="ultra-modern-card sparkle modern-shadow">
            <div className="text-center p-8">
              <div className="text-8xl mb-4 animate-bounce">{getStreakIcon()}</div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-3">
                سلسلة {streak} يوم
              </h2>
              <p className="text-white/90 text-lg mb-6">
                {getStreakMessage()}
              </p>
              
              {/* Enhanced Streak Visualization */}
              <div className="flex justify-center gap-3 mb-4">
                {Array.from({length: Math.min(10, streak)}, (_, i) => (
                  <div 
                    key={i} 
                    className="w-4 h-4 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse shadow-lg" 
                    style={{animationDelay: `${i * 0.1}s`}} 
                  />
                ))}
                {Array.from({length: Math.max(0, Math.min(10, 10 - streak))}, (_, i) => (
                  <div key={i + streak} className="w-4 h-4 bg-white/30 rounded-full" />
                ))}
              </div>
              
              {streak >= 7 && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full font-bold animate-pulse">
                  🏆 أسبوع كامل! أنت رائع!
                </div>
              )}
            </div>
          </div>

          {/* Daily Progress Overview */}
          <div className="ultra-modern-card sparkle modern-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <TrendingUp className="text-blue-400" size={28} />
                  تقدم اليوم
                </h3>
                <div className="text-4xl animate-pulse">⚡</div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-lg font-bold text-white mb-3">
                  <span className="bg-blue-500/80 backdrop-blur-sm px-4 py-2 rounded-full">المهام المكتملة</span>
                  <span className="bg-purple-500/80 backdrop-blur-sm px-4 py-2 rounded-full">{completedMissions} / {totalMissions}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden border border-white/30">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-4 rounded-full transition-all duration-1000 relative"
                    style={{ width: `${(completedMissions / totalMissions) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-pulse" />
                  </div>
                </div>
                <div className="text-center mt-2 text-white/80">
                  {Math.round((completedMissions / totalMissions) * 100)}% مكتمل
                </div>
              </div>
              
              {allCompleted && (
                <div className="text-center p-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl text-white transform animate-bounce modern-shadow">
                  <div className="text-4xl mb-3">🎉✨🏆</div>
                  <span className="text-xl font-bold">أكملت جميع المهام اليوم!</span>
                  <p className="mt-2 text-green-100">أنت نجم حقيقي! 🌟</p>
                </div>
              )}
            </div>
          </div>

          {/* Weekly Saving Goal */}
          {weeklySavingGoal && (
            <div className="ultra-modern-card sparkle modern-shadow">
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4 animate-bounce">🎯</div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-3">
                    مهمتك هذا الأسبوع
                  </h3>
                  <p className="text-white/90 text-lg leading-relaxed">
                    ادخر {weeklySavingGoal.weeklyTarget} ريالًا لتحقيق هدفك: {weeklySavingGoal.description} 🎯
                  </p>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-lg font-bold text-white mb-3">
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">التقدم الأسبوعي</span>
                    <span className="bg-orange-500/80 backdrop-blur-sm px-3 py-1 rounded-full">
                      {weeklyProgress} / {weeklySavingGoal.weeklyTarget} ريال
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden border border-white/30">
                    <div 
                      className="bg-gradient-to-r from-orange-400 to-red-500 h-4 rounded-full transition-all duration-700 relative"
                      style={{ width: `${Math.min((weeklyProgress / weeklySavingGoal.weeklyTarget) * 100, 100)}%` }}
                    >
                      <div className="absolute inset-0 bg-white/30 animate-pulse" />
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  {weeklyProgress >= weeklySavingGoal.weeklyTarget ? (
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl text-white transform animate-bounce modern-shadow p-4">
                      <div className="text-4xl mb-2">🎉✨🏆</div>
                      <span className="text-xl font-bold">رائع! حققت هدف هذا الأسبوع!</span>
                      <p className="mt-2 text-green-100">أخبر والديك ليؤكدوا إنجازك! 🌟</p>
                    </div>
                  ) : (
                    <div className="text-white/80">
                      <p className="mb-2">باقي {weeklySavingGoal.weeklyTarget - weeklyProgress} ريال لتحقيق الهدف</p>
                      <p className="text-sm">💪 استمر في الادخار!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* XP Progress */}
          <div className="transform hover:scale-105 transition-transform duration-300">
            <XPProgress />
          </div>

          {/* Enhanced Daily Missions */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white text-center drop-shadow-lg flex items-center justify-center gap-3">
              <Star className="text-yellow-400" size={28} />
              مهام اليوم
              <Star className="text-yellow-400" size={28} />
            </h3>
            
            {dailyMissions.map((mission, index) => (
              <div
                key={mission.id}
                className={`ultra-modern-card transform transition-all duration-500 hover:scale-105 modern-shadow ${
                  mission.completed 
                    ? 'border-2 border-green-400 bg-gradient-to-br from-green-400/20 to-emerald-500/20 sparkle' 
                    : 'hover:border-purple-400/50 hover:shadow-2xl'
                }`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-5xl animate-bounce" style={{animationDelay: `${index * 0.2}s`}}>
                          {mission.emoji}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white mb-2">
                            {mission.title}
                          </h4>
                          <p className="text-white/80 text-lg leading-relaxed">{mission.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    {mission.completed && (
                      <div className="flex flex-col items-center">
                        <span className="text-4xl mb-2 animate-bounce">✅</span>
                        <span className="text-sm text-green-300 font-bold bg-green-500/30 backdrop-blur-sm px-3 py-1 rounded-full border border-green-400/50">
                          مكتمل
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-lg font-bold text-white mb-3">
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">التقدم</span>
                      <span className="bg-blue-500/80 backdrop-blur-sm px-3 py-1 rounded-full">
                        {mission.current} / {mission.target}
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden border border-white/30">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-purple-500 h-3 rounded-full transition-all duration-700 relative"
                        style={{ width: `${Math.min((mission.current / mission.target) * 100, 100)}%` }}
                      >
                        <div className="absolute inset-0 bg-white/30 animate-pulse" />
                      </div>
                      
                      {/* Progress rocket */}
                      {mission.current > 0 && (
                        <div 
                          className="absolute top-1/2 transform -translate-y-1/2 text-white text-sm transition-all duration-700"
                          style={{ left: `${Math.min((mission.current / mission.target) * 100 - 5, 90)}%` }}
                        >
                          🚀
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Reward Section */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Star className="text-yellow-400 animate-spin" size={24} />
                      <span className="text-lg font-bold text-white">
                        {mission.xpReward} نقطة خبرة
                      </span>
                    </div>
                    
                    {mission.completed && (
                      <button
                        onClick={() => handleClaimReward(mission.id, mission.xpReward)}
                        disabled={claimedRewards.has(mission.id)}
                        className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 modern-shadow ${
                          claimedRewards.has(mission.id)
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 sparkle'
                        }`}
                      >
                        {claimedRewards.has(mission.id) ? (
                          <>✅ تم الحصول عليها</>
                        ) : (
                          <>🎁 احصل على المكافأة</>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Encouragement Message */}
          <div className="ultra-modern-card sparkle modern-shadow">
            <div className="p-8 text-center">
              <div className="text-6xl mb-4 animate-pulse">💪</div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-4">
                استمر في التعلم!
              </h3>
              <p className="text-white/90 text-lg mb-6 leading-relaxed">
                كل يوم تتعلم فيه شيئاً جديداً هو يوم مثمر. أنت تقوم بعمل رائع!
              </p>
              
              {/* Motivational badges */}
              <div className="flex justify-center gap-3 flex-wrap">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  🏆 بطل
                </div>
                <div className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  🚀 نشيط
                </div>
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
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