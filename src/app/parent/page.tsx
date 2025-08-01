'use client';

import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useAuthStore } from '@/store/authStore';
import Navigation from '@/components/Navigation';
import AuthWrapper from '@/components/AuthWrapper';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { LogOut, Gift, Award, Star, TrendingUp, Users, Target, Calendar, Settings } from 'lucide-react';
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
    weeklySavingGoal,
    weeklyProgress,
    familyTasks,
    setWeeklySavingGoal,
    updateWeeklyProgress,
    markWeeklyGoalAchieved,
    completeFamilyTask,
    markNotificationAsRead,
    depositRealMoney,
    addRewardPoints
  } = useGameStore();
  
  const { logout, currentUser } = useAuthStore();
  const [newGoal, setNewGoal] = useState(savingsGoal);
  const [showSettings, setShowSettings] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showWeeklyGoalForm, setShowWeeklyGoalForm] = useState(false);
  const [newWeeklyGoal, setNewWeeklyGoal] = useState({
    description: '',
    totalAmount: 200
  });
  
  // Money transfer state
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [transferMessage, setTransferMessage] = useState<string>('');
  const [isTransferring, setIsTransferring] = useState<boolean>(false);
  const [transferHistory, setTransferHistory] = useState<Array<{
    amount: number;
    message?: string;
    date: Date;
  }>>([]);
  
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
  
  // Enhanced progress data for chart
  const progressData = [
    { 
      topic: 'الادخار', 
      completed: questions.filter(q => q.topic === 'saving' && q.completed).length, 
      total: questions.filter(q => q.topic === 'saving').length,
      percentage: Math.round((questions.filter(q => q.topic === 'saving' && q.completed).length / Math.max(questions.filter(q => q.topic === 'saving').length, 1)) * 100)
    },
    { 
      topic: 'التخطيط', 
      completed: questions.filter(q => q.topic === 'planning' && q.completed).length, 
      total: questions.filter(q => q.topic === 'planning').length,
      percentage: Math.round((questions.filter(q => q.topic === 'planning' && q.completed).length / Math.max(questions.filter(q => q.topic === 'planning').length, 1)) * 100)
    },
    { 
      topic: 'المال', 
      completed: questions.filter(q => q.topic === 'money' && q.completed).length, 
      total: questions.filter(q => q.topic === 'money').length,
      percentage: Math.round((questions.filter(q => q.topic === 'money' && q.completed).length / Math.max(questions.filter(q => q.topic === 'money').length, 1)) * 100)
    },
  ];

  // Enhanced XP trend data (last 7 days simulation)
  const xpTrendData = Array.from({ length: 7 }, (_, i) => ({
    day: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'][i],
    xp: Math.floor(Math.random() * 100) + 20 + (i * 15),
    savings: Math.floor(Math.random() * 50) + 10 + (i * 8)
  }));

  // Enhanced pie chart data for time spent
  const timeSpentData = [
    { name: 'القصص', value: 40, color: '#8b5cf6' },
    { name: 'الادخار', value: 30, color: '#06b6d4' },
    { name: 'الأنشطة', value: 20, color: '#10b981' },
    { name: 'المراجعة', value: 10, color: '#f59e0b' }
  ];

  const handleSaveGoal = () => {
    if (newGoal > 0) {
      setSavingsGoal(newGoal);
      setShowSettings(false);
    }
  };

  const handleCreateWeeklyGoal = () => {
    if (newWeeklyGoal.description && newWeeklyGoal.totalAmount > 0) {
      setWeeklySavingGoal(newWeeklyGoal.description, newWeeklyGoal.totalAmount);
      setShowWeeklyGoalForm(false);
      setNewWeeklyGoal({ description: '', totalAmount: 200 });
    }
  };

  const handleMarkWeeklyGoalAchieved = () => {
    markWeeklyGoalAchieved();
    // Add XP reward for parent confirmation
    updateWeeklyProgress(weeklySavingGoal?.weeklyTarget || 0);
  };

  const handleCompleteTask = (taskId: string) => {
    completeFamilyTask(taskId);
  };

  const handleQuickTransfer = (amount: number) => {
    handleTransfer(amount, 'مكافأة سريعة من الأهل');
  };

  const handleCustomTransfer = () => {
    const amount = Number(transferAmount);
    if (amount > 0) {
      handleTransfer(amount, transferMessage || 'تحويل من الأهل');
    }
  };

  const handleTransfer = (amount: number, message: string) => {
    setIsTransferring(true);
    
    // Simulate transfer delay
    setTimeout(() => {
      // Transfer money to child's bank account
      depositRealMoney(amount, message || 'تحويل من الأهل');
      
      // Add reward points (10 riyal = 1 point)
      const rewardPoints = Math.floor(amount / 10);
      if (rewardPoints > 0) {
        addRewardPoints(rewardPoints, `تحويل من الأهل: ${amount} ريال`);
      }
      
      // Add to transfer history
      setTransferHistory(prev => [{
        amount,
        message: message || undefined,
        date: new Date()
      }, ...prev]);
      
      // Reset form
      setTransferAmount('');
      setTransferMessage('');
      setIsTransferring(false);
      
      // Show success message
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }, 1500);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getChildProgress = () => {
    const totalQuestions = questions.length;
    const completedPercent = Math.round((completedQuestions.length / Math.max(totalQuestions, 1)) * 100);
    const savingsPercent = Math.round((bankBalance / Math.max(savingsGoal, 1)) * 100);
    
    if (completedPercent >= 80 && savingsPercent >= 50) return { level: 'ممتاز', color: 'text-green-600', emoji: '🌟' };
    if (completedPercent >= 60 && savingsPercent >= 30) return { level: 'جيد جداً', color: 'text-blue-600', emoji: '⭐' };
    if (completedPercent >= 40 || savingsPercent >= 20) return { level: 'جيد', color: 'text-yellow-600', emoji: '💪' };
    return { level: 'يحتاج تشجيع', color: 'text-orange-600', emoji: '🌱' };
  };

  const childProgress = getChildProgress();

  return (
    <AuthWrapper requiredRole="parent">
      <div className="min-h-screen pb-28 relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
        
        {/* Minimal Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/50 via-indigo-700/50 to-purple-800/50 pointer-events-none"></div>
        
        <div className="max-w-md mx-auto p-4 space-y-6">
          {/* Simplified Header */}
          <div className="text-center py-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-5xl">👨‍👩‍👧‍👦</div>
              <h1 className="text-2xl font-bold text-white">
                <span className="gradient-text">لوحة الأهل</span>
              </h1>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut size={18} />
              </button>
            </div>
            <p className="text-white text-base px-4 py-2 rounded-lg bg-white/10">
            {currentUser?.familyName}, تابع تقدم طفلك في اكتساب الثقافة المالية 
            </p>
          </div>

          {/* Child Progress Summary */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 sparkle">
            <div className="p-6 text-center">
              <div className="text-5xl mb-4">{childProgress.emoji}</div>
              <h2 className="text-2xl font-bold text-white mb-2">تقييم طفلك</h2>
              <div className={`text-xl font-bold ${childProgress.color} mb-4 bg-white/10 px-4 py-2 rounded-full inline-block`}>
                {childProgress.level}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-300">{Math.round((completedQuestions.length / Math.max(questions.length, 1)) * 100)}%</div>
                  <div className="text-white/80 text-sm">إتمام الدروس</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-300">{Math.round((bankBalance / Math.max(savingsGoal, 1)) * 100)}%</div>
                  <div className="text-white/80 text-sm">هدف الادخار</div>
                </div>
              </div>
            </div>
          </div>

          {/* Simplified Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { title: 'المستوى الحالي', value: level, emoji: '👑' },
              { title: 'نقاط الخبرة', value: xp, emoji: '⭐' },
              { title: 'الأسئلة المكتملة', value: `${completedQuestions.length}/${questions.length}`, emoji: '📚' },
              { title: 'سلسلة الأيام', value: streak, emoji: '🔥' }
            ].map((stat, index) => (
              <div key={index} className="bg-white/10 rounded-2xl p-4 border border-white/20 ">
                <div className="text-center">
                  <div className="text-3xl mb-2">{stat.emoji}</div>
                  <div className="text-lg font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm font-bold text-white">{stat.title}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Family Notifications */}
          {unreadNotifications.length > 0 && (
            <div className="ultra-modern-card ">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Gift className="text-orange-400" size={28} />
                  <h3 className="text-xl font-bold text-white">
                    رسائل جديدة ({unreadNotifications.length})
                  </h3>
                </div>
                
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {unreadNotifications.slice(0, 3).map(notification => (
                    <div 
                      key={notification.id}
                      className="bg-white/10 backdrop-blur-sm p-4 rounded-xl cursor-pointer hover:bg-white/20 transition-all duration-300 border border-white/20"
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <p className="text-white font-medium mb-1">
                        {notification.message}
                      </p>
                      <p className="text-white/70 text-sm">
                        {new Date(notification.date).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Learning Progress Chart */}
          <div className="ultra-modern-card sparkle">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
                <TrendingUp className="text-blue-400" size={28} />
                تقدم التعلم حسب الموضوع
              </h3>
              
              <div className="h-48 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progressData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="topic" tick={{ fontSize: 12, fill: '#fff' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#fff' }} />
                    <Bar dataKey="completed" fill="url(#gradient)" radius={[4, 4, 0, 0]} />
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {progressData.map((item, index) => (
                  <div key={index} className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-3">
                    <div className="text-lg font-bold text-white">{item.percentage}%</div>
                    <div className="text-white/80 text-sm">{item.topic}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced XP & Savings Trend */}
          <div className="ultra-modern-card sparkle">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
                <Star className="text-yellow-400" size={28} />
                نمو التعلم والادخار
              </h3>
              
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={xpTrendData}>
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#fff' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#fff' }} />
                    <Line 
                      type="monotone" 
                      dataKey="xp" 
                      stroke="#fbbf24" 
                      strokeWidth={3}
                      dot={{ fill: '#fbbf24', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="savings" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-white/80 text-sm">نقاط الخبرة</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-white/80 text-sm">الادخار</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Savings Management */}
          <div className="ultra-modern-card ">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Target className="text-green-400" size={28} />
                  إدارة الادخار
                </h3>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-white hover:text-blue-300 transition-colors p-2 rounded-full hover:bg-white/10"
                >
                  <Settings size={24} />
                </button>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-2">
                  {bankBalance} ريال
                </div>
                <div className="text-white/80 text-lg">
                  من أصل {savingsGoal} هدف الادخار
                </div>
              </div>
              
              <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden border border-white/30 mb-4">
                <div 
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-4 rounded-full transition-all duration-700 relative"
                  style={{ width: `${Math.min((bankBalance / savingsGoal) * 100, 100)}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-pulse" />
                </div>
              </div>
              
              {showSettings && (
                <div className="space-y-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div>
                    <label className="block text-lg font-bold text-white mb-3">
                      تحديد هدف ادخار جديد
                    </label>
                    <input
                      type="number"
                      value={newGoal}
                      onChange={(e) => setNewGoal(Number(e.target.value))}
                      className="w-full p-3 border-2 border-white/30 rounded-xl focus:border-blue-400 focus:outline-none bg-white/10 backdrop-blur-sm text-white placeholder-white/60"
                      placeholder="الهدف الجديد"
                      min="1"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveGoal}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                      حفظ الهدف
                    </button>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="flex-1 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold py-3 rounded-xl transition-all duration-300 border border-white/30"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 sparkle">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
                <Award className="text-yellow-400" size={24} />
                الإنجازات الأخيرة
              </h3>
              
              {unlockedAchievements.length === 0 ? (
                <div className="text-center text-white/70 py-6">
                  <div className="text-5xl mb-3">🌱</div>
                  <p className="text-lg">لم يحقق طفلك أي إنجاز بعد</p>
                  <p className="text-white/60">شجعه على المتابعة!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {unlockedAchievements.slice(-3).reverse().map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-4 bg-yellow-500/10 rounded-xl border border-yellow-400/20">
                      <span className="text-3xl">{achievement.emoji}</span>
                      <div className="flex-1">
                        <div className="font-bold text-white text-base">
                          {achievement.title}
                        </div>
                        <div className="text-yellow-200 text-sm">
                          {achievement.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Weekly Saving Goals */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 ">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Target className="text-orange-400" size={20} />
                  الهدف الأسبوعي للادخار
                </h3>
                <button
                  onClick={() => setShowWeeklyGoalForm(!showWeeklyGoalForm)}
                  className="text-white hover:text-orange-300 transition-colors p-1.5 rounded-full hover:bg-white/10"
                >
                  <Settings size={18} />
                </button>
              </div>
              
              {weeklySavingGoal ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <h4 className="text-xl font-bold text-white mb-2">{weeklySavingGoal.description}</h4>
                    <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                      هدف هذا الأسبوع: {weeklySavingGoal.weeklyTarget} ريال
                    </div>
                    <p className="text-white/80 text-sm mt-2">من أصل {weeklySavingGoal.totalAmount} ريال إجمالي</p>
                  </div>
                  
                  <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden border border-white/30">
                    <div 
                      className="bg-gradient-to-r from-orange-400 to-red-500 h-4 rounded-full transition-all duration-700"
                      style={{ width: `${Math.min((weeklyProgress / weeklySavingGoal.weeklyTarget) * 100, 100)}%` }}
                    />
                  </div>
                  
                  <div className="text-center">
                    <p className="text-white/90 mb-4">التقدم: {weeklyProgress} / {weeklySavingGoal.weeklyTarget} ريال</p>
                    
                    {!weeklySavingGoal.achieved && weeklyProgress >= weeklySavingGoal.weeklyTarget ? (
                      <button
                        onClick={handleMarkWeeklyGoalAchieved}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                      >
                        ⭐ تأكيد تحقيق الهدف
                      </button>
                    ) : weeklySavingGoal.achieved ? (
                      <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-3 rounded-xl font-bold">
                        🎉 تم تحقيق هدف هذا الأسبوع!
                      </div>
                    ) : (
                      <p className="text-white/70 text-sm">يحتاج {weeklySavingGoal.weeklyTarget - weeklyProgress} ريال إضافي</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎯</div>
                  <p className="text-white/80 mb-4">لم يتم تحديد هدف أسبوعي بعد</p>
                  <button
                    onClick={() => setShowWeeklyGoalForm(true)}
                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    📝 إنشاء هدف جديد
                  </button>
                </div>
              )}
              
              {showWeeklyGoalForm && (
                <div className="mt-6 space-y-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <h4 className="text-lg font-bold text-white mb-3">إنشاء هدف ادخار أسبوعي</h4>
                  
                  <div>
                    <label className="block text-white mb-2">وصف الهدف (مثل: شراء دراجة)</label>
                    <input
                      type="text"
                      value={newWeeklyGoal.description}
                      onChange={(e) => setNewWeeklyGoal({...newWeeklyGoal, description: e.target.value})}
                      className="w-full p-3 border-2 border-white/30 rounded-xl focus:border-orange-400 focus:outline-none bg-white/10 backdrop-blur-sm text-white placeholder-white/60"
                      placeholder="اكتب هدف الادخار"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white mb-2">المبلغ الإجمالي (ريال)</label>
                    <input
                      type="number"
                      value={newWeeklyGoal.totalAmount}
                      onChange={(e) => setNewWeeklyGoal({...newWeeklyGoal, totalAmount: Number(e.target.value)})}
                      className="w-full p-3 border-2 border-white/30 rounded-xl focus:border-orange-400 focus:outline-none bg-white/10 backdrop-blur-sm text-white placeholder-white/60"
                      min="1"
                    />
                    <p className="text-white/70 text-sm mt-1">
                      سيتم تقسيمه على 4 أسابيع: {Math.ceil(newWeeklyGoal.totalAmount / 4)} ريال أسبوعياً
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={handleCreateWeeklyGoal}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                      ✅ إنشاء الهدف
                    </button>
                    <button
                      onClick={() => setShowWeeklyGoalForm(false)}
                      className="flex-1 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold py-3 rounded-xl transition-all duration-300 border border-white/30"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Family Tasks Checklist */}
          <div className="ultra-modern-card border-4 border-green-500">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
                <Users className="text-purple-400" size={28} />
                قائمة المهام العائلية
              </h3>
              
              <div className="space-y-4">
                {familyTasks.map((task, index) => (
                  <div 
                    key={task.id}
                    className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_32px_0_rgba(34,197,94,0.6)] ${
                      task.completed 
                        ? 'bg-green-500/20 border-2 border-green-400' 
                        : 'bg-purple-500/20 border-2 border-purple-400/50 hover:border-purple-400'
                    }`}
                  >
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      disabled={task.completed}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        task.completed 
                          ? 'border-green-400 bg-green-400 text-white' 
                          : 'border-white/50 hover:border-purple-400 hover:bg-purple-400/20'
                      }`}
                    >
                      {task.completed ? '✓' : index + 1}
                    </button>
                    
                    <div className="flex-1">
                      <h4 className={`font-bold mb-2 ${task.completed ? 'text-green-300 line-through' : 'text-white'}`}>
                        {task.title}
                      </h4>
                      <p className={`text-sm leading-relaxed ${task.completed ? 'text-green-200/80 line-through' : 'text-white/80'}`}>
                        {task.description}
                      </p>
                      {task.completed && task.dateCompleted && (
                        <p className="text-green-300 text-xs mt-2">
                          ✅ تم في: {new Date(task.dateCompleted).toLocaleDateString('ar-SA')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <div className="text-sm text-white/80 mb-2">
                  المهام المكتملة: {familyTasks.filter(t => t.completed).length} / {familyTasks.length}
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden border border-white/30">
                  <div 
                    className="bg-gradient-to-r from-purple-400 to-pink-500 h-3 rounded-full transition-all duration-700"
                    style={{ width: `${(familyTasks.filter(t => t.completed).length / familyTasks.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

                    {/* Money Transfer to Child - Enhanced UI/UX */}
          <div className="ultra-modern-card border-4 border-blue-500 relative overflow-hidden">
            {/* Success Animation Overlay */}
            {showCelebration && (
              <div className="absolute inset-0 bg-green-600/90 backdrop-blur-sm z-20 flex items-center justify-center">
                <div className="text-center bg-white/95 rounded-2xl p-8 shadow-2xl border-4 border-green-400">
                  <div className="text-6xl animate-bounce mb-4">🎉</div>
                  <div className="text-2xl font-bold text-green-800 mb-2">تم التحويل بنجاح!</div>
                  <div className="text-green-700 text-lg">سيظهر المال في حساب طفلك فوراً</div>
                  <div className="mt-4 text-green-600 text-sm">
                    💰 تم إضافة المال إلى رصيد طفلك
                  </div>
                </div>
              </div>
            )}
            
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
                <Gift className="text-blue-400" size={28} />
                إرسال مال لطفلك
              </h3>
              
              <div className="text-center mb-6">
                <div className="text-6xl mb-4 animate-pulse">💰</div>
                <p className="text-white/90 text-lg mb-2">
                  أرسل مالاً لطفلك مباشرة إلى حسابه في البنك
                </p>
                <div className="bg-blue-500/20 border border-blue-400/50 rounded-lg p-3 mb-4">
                  <p className="text-blue-300 text-sm font-bold">
                    💡 سيحصل طفلك على نقاط مكافآت: 10 ريال = 1 نقطة
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Quick Transfer Options */}
                <div>
                  <h4 className="text-lg font-bold text-white mb-4 text-center">
                    تحويلات سريعة
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[10, 20, 50].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => handleQuickTransfer(amount)}
                        disabled={isTransferring}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg border-2 border-white/20"
                      >
                        <div className="text-2xl mb-1 animate-bounce">💵</div>
                        <div className="text-lg">{amount} ريال</div>
                        <div className="text-xs opacity-80 bg-white/20 rounded-full px-2 py-1 mt-1">
                          +{amount/10} نقطة
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center">
                  <div className="flex-1 h-px bg-white/20"></div>
                  <span className="px-4 text-white/60 text-sm">أو</span>
                  <div className="flex-1 h-px bg-white/20"></div>
                </div>

                {/* Custom Amount Transfer */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h4 className="text-lg font-bold text-white mb-4 text-center flex items-center justify-center gap-2">
                    <span className="text-2xl">✏️</span>
                    مبلغ مخصص
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white mb-2 font-bold">المبلغ (ريال)</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={transferAmount}
                          onChange={(e) => setTransferAmount(e.target.value)}
                          className="w-full p-4 border-2 border-white/30 rounded-xl focus:border-blue-400 focus:outline-none bg-white/10 backdrop-blur-sm text-white placeholder-white/60 text-center text-xl font-bold"
                          placeholder="0"
                          min={1}
                          disabled={isTransferring}
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                          💰
                        </div>
                      </div>
                      {Number(transferAmount) > 0 && (
                        <div className="mt-3 p-3 bg-green-500/20 border border-green-400/50 rounded-lg">
                          <p className="text-green-300 text-sm text-center font-bold">
                            ✅ سيحصل طفلك على {Math.floor(Number(transferAmount)/10)} نقطة مكافأة
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-white mb-2 font-bold">رسالة للطفل (اختياري)</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={transferMessage}
                          onChange={(e) => setTransferMessage(e.target.value)}
                          className="w-full p-4 pr-16 border-2 border-white/30 rounded-xl focus:border-blue-400 focus:outline-none bg-white/10 backdrop-blur-sm text-white placeholder-white/60"
                          placeholder="أحسنت! هذا مكافأة لك"
                          maxLength={50}
                          disabled={isTransferring}
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                          💬
                        </div>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 text-xs font-bold bg-white/30 px-2 py-1 rounded-full border border-white/20">
                          {transferMessage.length}/50
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleCustomTransfer}
                      disabled={!transferAmount || Number(transferAmount) <= 0 || isTransferring}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg border-2 border-white/20 relative overflow-hidden"
                    >
                      {isTransferring ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>⏳ جاري الإرسال...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-2xl">💸</span>
                          <span>إرسال المال لطفلك</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* Transfer Status */}
                {isTransferring && (
                  <div className="bg-blue-500/20 border border-blue-400/50 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                      <span className="text-blue-300 font-bold">جاري تحويل المال...</span>
                    </div>
                    <p className="text-blue-200 text-sm">يرجى الانتظار، سيتم إرسال المال لطفلك قريباً</p>
                  </div>
                )}

                {/* Transfer History */}
                {transferHistory.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-bold text-white mb-4 text-center flex items-center justify-center gap-2">
                      <span className="text-2xl">📋</span>
                      آخر التحويلات
                    </h4>
                    <div className="space-y-3 max-h-40 overflow-y-auto custom-scrollbar">
                      {transferHistory.slice(0, 5).map((transfer, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-green-500/20 rounded-xl border border-green-400/30 hover:bg-green-500/30 transition-all duration-300">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl animate-pulse">💸</span>
                            <div>
                              <div className="font-bold text-white text-lg">{transfer.amount} ريال</div>
                              {transfer.message && (
                                <div className="text-green-200 text-sm">{transfer.message}</div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-green-300 text-sm">
                              {new Date(transfer.date).toLocaleDateString('ar-SA')}
                            </div>
                            <div className="text-blue-300 text-xs bg-blue-500/20 rounded-full px-2 py-1 mt-1">
                              +{Math.floor(transfer.amount/10)} نقطة
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Family Info */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 sparkle">
            <div className="p-6 text-center">
              <div className="text-5xl mb-3">👨‍👩‍👧‍👦</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                عائلة {currentUser?.familyName}
              </h3>
              <p className="text-white/90 text-base">
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