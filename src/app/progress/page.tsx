'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import Navigation from '@/components/Navigation';
import XPProgress from '@/components/XPProgress';

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
  
  const [activeFilter, setActiveFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  
  const completedLessons = questions.filter(q => q.completed);
  const totalXPEarned = xp;
  const savingsTotal = bankBalance;
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  
  const stats = [
    {
      title: 'نقاط الخبرة',
      value: totalXPEarned,
      emoji: '⭐',
      color: 'text-yellow-600',
      bg: 'bg-yellow-100'
    },
    {
      title: 'الدروس المكتملة',
      value: completedLessons.length,
      emoji: '📚',
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      title: 'المدخرات',
      value: savingsTotal,
      emoji: '💰',
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      title: 'السلسلة الحالية',
      value: streak,
      emoji: '🔥',
      color: 'text-orange-600',
      bg: 'bg-orange-100'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🏆 إنجازاتي
          </h1>
          <p className="text-gray-600">تتبع تقدمك واحتفل بإنجازاتك!</p>
        </div>

        {/* Level Display */}
        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
          <div className="text-6xl mb-3">👑</div>
          <h2 className="text-3xl font-bold text-purple-600 mb-2">
            المستوى {level}
          </h2>
          <p className="text-gray-600">عبقري المال الصغير</p>
        </div>

        {/* XP Progress */}
        <XPProgress />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-4 shadow-lg text-center">
              <div className={`text-3xl mb-2 p-3 rounded-full ${stat.bg} inline-block`}>
                {stat.emoji}
              </div>
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-600">
                {stat.title}
              </div>
            </div>
          ))}
        </div>

        {/* Achievement Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'الكل', count: achievements.length },
              { key: 'unlocked', label: 'مفتوح', count: unlockedAchievements.length },
              { key: 'locked', label: 'مقفل', count: achievements.length - unlockedAchievements.length }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key as any)}
                className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                  activeFilter === filter.key
                    ? 'bg-purple-100 text-purple-800 border-2 border-purple-300'
                    : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 text-center">
            🎖️ الإنجازات
          </h3>
          
          {filteredAchievements.map((achievement) => {
            const progress = getAchievementProgress(achievement);
            const progressPercentage = (progress.current / progress.target) * 100;
            
            return (
              <div
                key={achievement.id}
                className={`bg-white rounded-2xl p-6 shadow-lg border-2 ${
                  achievement.unlocked 
                    ? 'border-gold-300 bg-gradient-to-r from-yellow-50 to-orange-50' 
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`text-4xl p-3 rounded-full ${
                    achievement.unlocked ? 'bg-yellow-100' : 'bg-gray-100'
                  }`}>
                    {achievement.emoji}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-bold text-gray-800">
                        {achievement.title}
                      </h4>
                      {achievement.unlocked && (
                        <span className="text-yellow-500 text-xl">✨</span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">
                      {achievement.description}
                    </p>
                    
                    {/* Progress Bar */}
                    {!achievement.unlocked && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>التقدم</span>
                          <span>{progress.current} / {progress.target}</span>
                        </div>
                        <div className="progress-bar h-2">
                          <div 
                            className="progress-fill h-2"
                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {achievement.unlocked && achievement.dateUnlocked && (
                      <div className="text-xs text-green-600 font-medium">
                        ✅ مفتوح في {new Date(achievement.dateUnlocked).toLocaleDateString('ar-SA')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            📈 النشاطات الأخيرة
          </h3>
          
          <div className="space-y-3">
            {completedLessons.slice(-3).reverse().map((question) => (
              <div key={question.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                <span className="text-2xl">{question.emoji}</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">
                    أكملت درس: {question.title}
                  </div>
                  <div className="text-sm text-gray-600">
                    +{question.xpReward} نقطة خبرة
                  </div>
                </div>
              </div>
            ))}
            
            {transactions.slice(-2).reverse().map((transaction) => (
              <div key={transaction.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                <span className="text-2xl">💰</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">
                    {transaction.description}
                  </div>
                  <div className="text-sm text-gray-600">
                    +{transaction.amount} عملة
                  </div>
                </div>
              </div>
            ))}
            
            {completedLessons.length === 0 && transactions.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                ابدأ رحلتك التعليمية لرؤية النشاطات هنا!
              </div>
            )}
          </div>
        </div>

        {/* Motivational Message */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-3">🌟</div>
          <h3 className="text-lg font-bold text-purple-800 mb-2">
            أنت تقوم بعمل رائع!
          </h3>
          <p className="text-purple-600 text-sm">
            استمر في التعلم والادخار. كل خطوة تقربك من أن تصبح خبيراً في المال!
          </p>
        </div>
      </div>
      
      <Navigation />
    </div>
  );
};

export default ProgressPage; 