'use client';

import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useCharacterStore } from '@/store/characterStore';
import Navigation from '@/components/Navigation';
import XPProgress from '@/components/XPProgress';
import AuthWrapper from '@/components/AuthWrapper';
import Amazing3DCharacter from '@/components/Amazing3DCharacter';
import { useEnhancedVoice } from '@/hooks/useEnhancedVoice';
import { useEnhancedSounds } from '@/hooks/useEnhancedSounds';
import { Trophy, Star, TrendingUp, Target, Calendar, Award, Gift, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Confetti from 'react-confetti';

const ProgressPage: React.FC = () => {
  const { 
    xp, 
    level, 
    achievements, 
    questions, 
    streak, 
    bankBalance,
    transactions
  } = useGameStore();
  
  const { selectedCharacter } = useCharacterStore();
  const { logout } = useAuthStore();
  const { speakWithCharacter, isSpeaking, isProcessing } = useEnhancedVoice();
  const { playSound } = useEnhancedSounds();
  const router = useRouter();
  
  const [activeFilter, setActiveFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [showCelebration, setShowCelebration] = useState(false);
  const [characterEmotion, setCharacterEmotion] = useState<'idle' | 'happy' | 'excited' | 'thinking' | 'speaking' | 'sad' | 'encouraging' | 'celebrating'>('idle');
  const [isVoiceProcessing, setIsVoiceProcessing] = useState(false);
  
  const completedLessons = questions.filter(q => q.completed);
  const totalXPEarned = xp;
  const savingsTotal = bankBalance;
  const unlockedAchievements = achievements.filter(a => a.unlocked);

  // Celebrate achievements - ONLY ONCE when new achievements are unlocked
  useEffect(() => {
    // Only celebrate if there are NEW achievements (not every time page loads)
    const hasNewAchievements = unlockedAchievements.length > 0 && 
                              !localStorage.getItem('lastCelebratedCount') ||
                              parseInt(localStorage.getItem('lastCelebratedCount') || '0') < unlockedAchievements.length;
    
    if (hasNewAchievements && selectedCharacter && !isVoiceProcessing) {
      // Store the current count to prevent repeated celebrations
      localStorage.setItem('lastCelebratedCount', unlockedAchievements.length.toString());
      
      setShowCelebration(true);
      setCharacterEmotion('celebrating');
      setIsVoiceProcessing(true);
      
      setTimeout(() => {
        speakWithCharacter(
          `مبروك! حققت ${unlockedAchievements.length} إنجاز رائع! أنت نجم حقيقي!`,
          selectedCharacter,
          'celebrating'
        );
      }, 500);
      
      setTimeout(() => {
        setShowCelebration(false);
        setCharacterEmotion('happy');
        setIsVoiceProcessing(false);
      }, 6000); // Longer delay to ensure voice completes
    }
  }, [unlockedAchievements.length, selectedCharacter, speakWithCharacter, isVoiceProcessing]);
  
  const stats = [
    {
      title: 'نقاط الخبرة',
      value: totalXPEarned,
      emoji: '⭐',
      color: 'from-yellow-400 to-orange-500',
      icon: Star
    },
    {
      title: 'الدروس المكتملة',
      value: completedLessons.length,
      emoji: '📚',
      color: 'from-blue-400 to-cyan-500',
      icon: Target
    },
    {
      title: 'المدخرات',
      value: `${savingsTotal} ريال`,
      emoji: '💰',
      color: 'from-green-400 to-emerald-500',
      icon: TrendingUp
    },
    {
      title: 'السلسلة الحالية',
      value: `${streak} يوم`,
      emoji: '🔥',
      color: 'from-orange-400 to-red-500',
      icon: Calendar
    }
  ];

  const filteredAchievements = achievements.filter(achievement => {
    if (activeFilter === 'unlocked') return achievement.unlocked;
    if (activeFilter === 'locked') return !achievement.unlocked;
    return true;
  });

  const getAchievementProgress = (achievement: any) => {
    switch (achievement.id) {
      case '1': // أول درس
        return { current: completedLessons.length > 0 ? 1 : 0, target: 1 };
      case '2': // 100 عملة
        return { current: Math.min(bankBalance, 100), target: 100 };
      case '3': // 5 دروس
        return { current: Math.min(completedLessons.length, 5), target: 5 };
      case '4': // 500 نقطة
        return { current: Math.min(xp, 500), target: 500 };
      case '5': // 7 أيام
        return { current: Math.min(streak, 7), target: 7 };
      default:
        return { current: 0, target: 1 };
    }
  };

  const handleFilterChange = (filter: typeof activeFilter) => {
    setActiveFilter(filter);
    // Only play sound if no voice is currently processing
    if (!isVoiceProcessing && !isSpeaking) {
      playSound('success', selectedCharacter);
    }
  };

  const getMotivationalMessage = () => {
    if (unlockedAchievements.length === 0) {
      return 'ابدأ رحلتك التعليمية لتحقق إنجازات رائعة!';
    } else if (unlockedAchievements.length < 3) {
      return 'أنت في بداية رائعة! استمر في التعلم والادخار!';
    } else if (unlockedAchievements.length < 5) {
      return 'أداء ممتاز! أنت تحقق تقدماً رائعاً في تعلم المال!';
    } else {
      return 'أنت نجم حقيقي! إنجازاتك ملهمة للجميع!';
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <AuthWrapper requiredRole="child">
      <div className="min-h-screen pb-28 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-700">
        
        {/* Confetti Effect */}
        {showCelebration && (
          <Confetti
            width={typeof window !== 'undefined' ? window.innerWidth : 400}
            height={typeof window !== 'undefined' ? window.innerHeight : 800}
            recycle={false}
            numberOfPieces={200}
            gravity={0.1}
          />
        )}

        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10 animate-float"
              style={{
                width: `${Math.random() * 80 + 30}px`,
                height: `${Math.random() * 80 + 30}px`,
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
              <div className="text-7xl animate-bounce">🏆</div>
              <button
                onClick={handleLogout}
                className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-300 shadow-lg transform hover:scale-110"
                title="تسجيل الخروج"
              >
                <LogOut size={20} />
              </button>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
              <span className="gradient-text">إنجازاتي</span>
            </h1>
            <p className="text-white/90 text-lg bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 inline-block border border-white/30">
              تتبع تقدمك واحتفل بإنجازاتك! ✨
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

          {/* Enhanced Level Display */}
          <div className="ultra-modern-card sparkle modern-shadow">
            <div className="text-center p-8">
              <div className="text-8xl mb-4 animate-pulse">👑</div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-3">
                المستوى {level}
              </h2>
              <p className="text-white/90 text-xl">عبقري المال الصغير</p>
              <div className="mt-4 flex justify-center gap-2">
                {Array.from({length: level}, (_, i) => (
                  <Star key={i} className="text-yellow-400 animate-pulse" size={24} style={{animationDelay: `${i * 0.1}s`}} />
                ))}
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="transform hover:scale-105 transition-transform duration-300">
            <XPProgress />
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="ultra-modern-card sparkle modern-shadow transform hover:scale-105 transition-all duration-300">
                <div className="text-center p-6">
                  <div className={`text-5xl mb-4 animate-bounce`} style={{animationDelay: `${index * 0.2}s`}}>
                    {stat.emoji}
                  </div>
                  <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/80 font-medium">
                    {stat.title}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Achievement Filters */}
          <div className="ultra-modern-card sparkle modern-shadow">
            <div className="p-4">
              <div className="flex gap-3">
                {[
                  { key: 'all', label: 'الكل', count: achievements.length, icon: Trophy },
                  { key: 'unlocked', label: 'مفتوح', count: unlockedAchievements.length, icon: Award },
                  { key: 'locked', label: 'مقفل', count: achievements.length - unlockedAchievements.length, icon: Gift }
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => handleFilterChange(filter.key as any)}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 ${
                      activeFilter === filter.key
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                        : 'bg-white/20 backdrop-blur-sm text-white/80 border border-white/30 hover:bg-white/30'
                    }`}
                  >
                    <filter.icon size={16} />
                    {filter.label} ({filter.count})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Achievements */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white text-center drop-shadow-lg flex items-center justify-center gap-3">
              <Award className="text-yellow-400" size={28} />
              الإنجازات
              <Award className="text-yellow-400" size={28} />
            </h3>
            
            {filteredAchievements.map((achievement, index) => {
              const progress = getAchievementProgress(achievement);
              const progressPercentage = (progress.current / progress.target) * 100;
              
              return (
                <div
                  key={achievement.id}
                  className={`ultra-modern-card modern-shadow transform transition-all duration-500 hover:scale-105 ${
                    achievement.unlocked 
                      ? 'border-2 border-yellow-400 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 sparkle' 
                      : 'hover:border-purple-400/50'
                  }`}
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`text-5xl p-4 rounded-full transform transition-all duration-300 ${
                        achievement.unlocked ? 'bg-yellow-400/30 backdrop-blur-sm animate-pulse' : 'bg-white/20 backdrop-blur-sm'
                      }`}>
                        {achievement.emoji}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h4 className="text-xl font-bold text-white">
                            {achievement.title}
                          </h4>
                          {achievement.unlocked && (
                            <div className="text-yellow-400 text-2xl animate-spin">
                              ✨
                            </div>
                          )}
                        </div>
                        
                        <p className="text-white/80 text-lg mb-4 leading-relaxed">
                          {achievement.description}
                        </p>
                        
                        {/* Enhanced Progress Bar */}
                        {!achievement.unlocked && (
                          <div className="mb-4">
                            <div className="flex justify-between text-sm text-white/80 mb-2">
                              <span>التقدم</span>
                              <span>{progress.current} / {progress.target}</span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden border border-white/30">
                              <div 
                                className="bg-gradient-to-r from-blue-400 to-purple-500 h-3 rounded-full transition-all duration-700 relative"
                                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                              >
                                <div className="absolute inset-0 bg-white/30 animate-pulse" />
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {achievement.unlocked && achievement.dateUnlocked && (
                          <div className="text-sm text-green-300 font-bold bg-green-500/30 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
                            ✅ مفتوح في {new Date(achievement.dateUnlocked).toLocaleDateString('ar-SA')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enhanced Recent Activities */}
          <div className="ultra-modern-card sparkle modern-shadow">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
                <TrendingUp className="text-green-400" size={28} />
                النشاطات الأخيرة
              </h3>
              
              <div className="space-y-4">
                {completedLessons.slice(-3).reverse().map((question, index) => (
                  <div key={question.id} className="flex items-center gap-4 p-4 bg-blue-500/20 backdrop-blur-sm rounded-xl border border-blue-400/30 transform hover:scale-105 transition-all duration-300">
                    <span className="text-3xl animate-bounce" style={{animationDelay: `${index * 0.1}s`}}>{question.emoji}</span>
                    <div className="flex-1">
                      <div className="font-bold text-white text-lg">
                        أكملت درس: {question.title}
                      </div>
                      <div className="text-blue-300 font-medium">
                        +{question.xpReward} نقطة خبرة
                      </div>
                    </div>
                    <Star className="text-yellow-400 animate-pulse" size={24} />
                  </div>
                ))}
                
                {transactions.slice(-2).reverse().map((transaction, index) => (
                  <div key={transaction.id} className="flex items-center gap-4 p-4 bg-green-500/20 backdrop-blur-sm rounded-xl border border-green-400/30 transform hover:scale-105 transition-all duration-300">
                    <span className="text-3xl animate-bounce" style={{animationDelay: `${index * 0.1}s`}}>💰</span>
                    <div className="flex-1">
                      <div className="font-bold text-white text-lg">
                        {transaction.description}
                      </div>
                      <div className="text-green-300 font-medium">
                        +{transaction.amount} عملة
                      </div>
                    </div>
                    <TrendingUp className="text-green-400 animate-pulse" size={24} />
                  </div>
                ))}
                
                {completedLessons.length === 0 && transactions.length === 0 && (
                  <div className="text-center text-white/70 py-8">
                    <div className="text-6xl mb-4 animate-pulse">🌟</div>
                    <p className="text-lg">ابدأ رحلتك التعليمية لرؤية النشاطات هنا!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Motivational Message */}
          <div className="ultra-modern-card sparkle modern-shadow">
            <div className="p-8 text-center">
              <div className="text-6xl mb-4 animate-pulse">🌟</div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-4">
                أنت تقوم بعمل رائع!
              </h3>
              <p className="text-white/90 text-lg mb-6 leading-relaxed">
                {getMotivationalMessage()}
              </p>
              
              {/* Achievement Badges */}
              <div className="flex justify-center gap-3 flex-wrap">
                {unlockedAchievements.length > 0 && (
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    🏆 {unlockedAchievements.length} إنجاز
                  </div>
                )}
                {completedLessons.length > 0 && (
                  <div className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    📚 {completedLessons.length} درس
                  </div>
                )}
                {savingsTotal > 0 && (
                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    💰 {savingsTotal} ريال
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <Navigation />
      </div>
    </AuthWrapper>
  );
};

export default ProgressPage; 