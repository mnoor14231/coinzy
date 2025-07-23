'use client';

import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useAuthStore } from '@/store/authStore';
import Navigation from '@/components/Navigation';
import AuthWrapper from '@/components/AuthWrapper';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LogOut, Gift, Award, Star } from 'lucide-react';
import Confetti from 'react-confetti';
import { useRouter } from 'next/navigation';

const ParentPage: React.FC = () => {
  const router = useRouter();
  const { 
    xp, 
    level, 
    questions,
    bankBalance, 
    streak, 
    achievements, 
    transactions,
    familyNotifications,
    setSavingsGoal,
    savingsGoal,
    markNotificationAsRead
  } = useGameStore();
  
  const { logout, currentUser } = useAuthStore();
  const [newGoal, setNewGoal] = useState(savingsGoal);
  const [showSettings, setShowSettings] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const completedQuestions = questions.filter(q => q.completed);
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const unreadNotifications = familyNotifications.filter(n => !n.read);
  
  // Auto-celebrate when parents login with unread notifications
  useEffect(() => {
    if (unreadNotifications.length > 0) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 4000);
    }
  }, [unreadNotifications.length]);
  
  // Prepare progress data for chart
  const progressData = [
    { topic: 'الادخار', completed: questions.filter(q => q.topic === 'saving' && q.completed).length, total: questions.filter(q => q.topic === 'saving').length },
    { topic: 'التخطيط', completed: questions.filter(q => q.topic === 'planning' && q.completed).length, total: questions.filter(q => q.topic === 'planning').length },
    { topic: 'المال', completed: questions.filter(q => q.topic === 'money' && q.completed).length, total: questions.filter(q => q.topic === 'money').length },
  ];

  // XP trend data (last 7 days simulation)
  const xpTrendData = Array.from({ length: 7 }, (_, i) => ({
    day: `يوم ${i + 1}`,
    xp: Math.floor(Math.random() * 50) + 10 * i
  }));

  // Pie chart data for time spent
  const timeSpentData = [
    { name: 'القصص', value: 40, color: '#8b5cf6' },
    { name: 'الادخار', value: 30, color: '#06b6d4' },
    { name: 'الأنشطة', value: 20, color: '#10b981' },
    { name: 'المراجعة', value: 10, color: '#f59e0b' }
  ];

  const handleSaveGoal = () => {
    setSavingsGoal(newGoal);
    setShowSettings(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/'); // Redirect to home page (localhost:3000)
  };

  return (
    <AuthWrapper requiredRole="parent">
      <div className="min-h-screen p-4 pb-28 relative overflow-hidden">
        {/* Floating background elements */}
        <div className="fixed top-20 left-5 w-16 h-16 bg-blue-300/30 rounded-full blur-xl animate-ping delay-300" />
        <div className="fixed top-40 right-3 w-12 h-12 bg-green-300/30 rounded-full blur-xl animate-ping delay-700" />
        <div className="fixed bottom-40 left-8 w-14 h-14 bg-purple-300/30 rounded-full blur-xl animate-ping delay-1000" />
        
        <div className="max-w-md mx-auto space-y-6">
          {/* Header */}
          <div className="text-center py-4">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                👨‍👩‍👧‍👦 <span className="gradient-text">لوحة الأهل</span>
              </h1>
              <button
                onClick={handleLogout}
                className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg"
                title="تسجيل الخروج"
              >
                <LogOut size={20} />
              </button>
            </div>
            <p className="text-white/80 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
              تابع تقدم عائلة {currentUser?.familyName} في رحلة تعلم المال
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card text-center sparkle">
              <div className="text-3xl mb-2">👑</div>
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {level}
              </div>
              <div className="text-xs text-gray-600">المستوى الحالي</div>
            </div>
            
            <div className="card text-center sparkle">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {xp}
              </div>
              <div className="text-xs text-gray-600">نقاط الخبرة</div>
            </div>
            
            <div className="card text-center sparkle">
              <div className="text-3xl mb-2">📚</div>
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {completedQuestions.length}/{questions.length}
              </div>
              <div className="text-xs text-gray-600">الأسئلة المكتملة</div>
            </div>
            
            <div className="card text-center sparkle">
              <div className="text-3xl mb-2">🔥</div>
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {streak}
              </div>
              <div className="text-xs text-gray-600">سلسلة الأيام</div>
            </div>
          </div>

          {/* Learning Progress Chart */}
          <div className="card sparkle">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              📊 تقدم التعلم حسب الموضوع
            </h3>
            
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={progressData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="topic" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Bar dataKey="completed" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* XP Trend */}
          <div className="card sparkle">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              📈 نمو نقاط الخبرة
            </h3>
            
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={xpTrendData}>
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Bar dataKey="xp" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Savings Management */}
          <div className="card sparkle">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">🏦 إدارة الادخار</h3>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                ⚙️
              </button>
            </div>
            
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {bankBalance} عملة
              </div>
              <div className="text-sm text-gray-600">
                من أصل {savingsGoal} هدف الادخار
              </div>
            </div>
            
            <div className="progress-bar mb-4">
              <div 
                className="progress-fill"
                style={{ width: `${Math.min((bankBalance / savingsGoal) * 100, 100)}%` }}
              />
            </div>
            
            {showSettings && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تحديد هدف ادخار جديد
                  </label>
                  <input
                    type="number"
                    value={newGoal}
                    onChange={(e) => setNewGoal(Number(e.target.value))}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
                    placeholder="الهدف الجديد"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveGoal}
                    className="flex-1 btn-secondary"
                  >
                    حفظ الهدف
                  </button>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Time Distribution */}
          <div className="card sparkle">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              ⏰ توزيع وقت التعلم
            </h3>
            
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={timeSpentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {timeSpentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-4">
              {timeSpentData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="card sparkle">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              🏆 الإنجازات الأخيرة
            </h3>
            
            {unlockedAchievements.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                لم يحقق طفلك أي إنجاز بعد
              </div>
            ) : (
              <div className="space-y-3">
                {unlockedAchievements.slice(-3).reverse().map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl sparkle">
                    <span className="text-2xl">{achievement.emoji}</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">
                        {achievement.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {achievement.description}
                      </div>
                    </div>
                    <span className="text-yellow-500 text-xl animate-pulse">✨</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommendations */}
          <div className="card sparkle">
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-blue-800 mb-3 text-center">
                💡 توصيات للأهل
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-blue-700">
                    شجع طفلك على إكمال قصة واحدة يومياً للحفاظ على سلسلة التعلم
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-blue-700">
                    ناقش مع طفلك ما تعلمه من القصص لتعزيز الفهم
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-blue-700">
                    اربط التعلم بالواقع من خلال التسوق المشترك وشرح قرارات الشراء
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-blue-700">
                    احتفل بإنجازات طفلك في الادخار والقرارات المالية الذكية
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Family Info */}
          <div className="card sparkle">
            <div className="text-center">
              <div className="text-4xl mb-3 float-animation">👨‍👩‍👧‍👦</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                عائلة {currentUser?.familyName}
              </h3>
              <p className="text-gray-600 text-sm">
                معاً نتعلم إدارة المال ونبني مستقبلاً أفضل لأطفالنا
              </p>
            </div>
          </div>
        </div>
        
        <Navigation />
      </div>
    </AuthWrapper>
  );
};

export default ParentPage; 