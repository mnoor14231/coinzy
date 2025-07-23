'use client';

import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useAuthStore } from '@/store/authStore';
import Navigation from '@/components/Navigation';
import AuthWrapper from '@/components/AuthWrapper';
import Amazing3DCharacter from '@/components/Amazing3DCharacter';
import { useCharacterStore } from '@/store/characterStore';
import { useEnhancedVoice } from '@/hooks/useEnhancedVoice';
import { useEnhancedSounds } from '@/hooks/useEnhancedSounds';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { PiggyBank, TrendingUp, Target, Gift, Plus, Minus } from 'lucide-react';
import Confetti from 'react-confetti';

const BankPage: React.FC = () => {
  const { 
    bankBalance, 
    savingsGoal, 
    transactions, 
    familyNotifications,
    depositRealMoney,
    withdrawRealMoney,
    setSavingsGoal,
    markNotificationAsRead
  } = useGameStore();
  
  const { currentUser } = useAuthStore();
  const { selectedCharacter } = useCharacterStore();
  const { speakWithCharacter, isSpeaking } = useEnhancedVoice();
  const { playSound } = useEnhancedSounds();
  
  const [depositAmount, setDepositAmount] = useState('');
  const [depositDescription, setDepositDescription] = useState('');
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawDescription, setWithdrawDescription] = useState('');
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);
  const [newGoal, setNewGoal] = useState(savingsGoal);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState<{ show: boolean, amount: number, message: string }>({ show: false, amount: 0, message: '' });
  const [characterEmotion, setCharacterEmotion] = useState<'idle' | 'happy' | 'excited' | 'thinking' | 'speaking' | 'sad' | 'encouraging' | 'celebrating'>('idle');

  const progressPercentage = Math.min((bankBalance / savingsGoal) * 100, 100);
  const unreadNotifications = familyNotifications.filter(n => !n.read).length;

  const chartData = transactions
    .filter(t => t.type === 'real_money_deposit')
    .slice(-7)
    .map((transaction, index) => ({
      day: `يوم ${index + 1}`,
      amount: transactions
        .filter(t => t.type === 'real_money_deposit')
        .slice(0, index + 1)
        .reduce((acc, t) => acc + t.amount, 0)
    }));

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (amount > 0 && depositDescription.trim()) {
      const oldBalance = bankBalance;
      
      // Deposit the money
      depositRealMoney(amount, depositDescription.trim());
      
      // Start celebrations
      setShowCoinAnimation(true);
      setShowConfetti(true);
      setCharacterEmotion('celebrating');
      
      // Play celebration sound
      playSound('celebration', selectedCharacter);
      
      // Character congratulates for any deposit
      if (selectedCharacter) {
        setTimeout(() => {
          speakWithCharacter(
            `أحسنت! لقد وفرت ${amount} ريال! هذا رائع جداً!`,
            selectedCharacter,
            'celebrating'
          );
        }, 500);
      }
      
      // Check for milestone achievements
      const newBalance = oldBalance + amount;
      let milestoneReached = false;
      let milestoneMessage = '';
      
      if (oldBalance < 50 && newBalance >= 50) {
        milestoneReached = true;
        milestoneMessage = `🎉 مبروك! وصلت إلى 50 ريال! أنت محترف في التوفير! 🎉`;
        setShowMilestoneModal({ show: true, amount: 50, message: milestoneMessage });
      } else if (oldBalance < 100 && newBalance >= 100) {
        milestoneReached = true;
        milestoneMessage = `🏆 رائع جداً! وصلت إلى 100 ريال! أنت بطل التوفير! 🏆`;
        setShowMilestoneModal({ show: true, amount: 100, message: milestoneMessage });
      } else if (oldBalance < 200 && newBalance >= 200) {
        milestoneReached = true;
        milestoneMessage = `👑 ملك التوفير! وصلت إلى 200 ريال! لا يمكن إيقافك! 👑`;
        setShowMilestoneModal({ show: true, amount: 200, message: milestoneMessage });
      }
      
      // Special milestone celebration
      if (milestoneReached && selectedCharacter) {
        setTimeout(() => {
          speakWithCharacter(milestoneMessage, selectedCharacter, 'celebrating');
        }, 2000);
      }
      
      // Reset form
      setDepositAmount('');
      setDepositDescription('');
      setShowDepositForm(false);
      
      // Stop animations after delay
      setTimeout(() => {
        setShowCoinAnimation(false);
        setShowConfetti(false);
        setCharacterEmotion('happy');
      }, milestoneReached ? 5000 : 3000);
    }
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount > 0 && withdrawDescription.trim() && amount <= bankBalance) {
      try {
        // Withdraw the money
        withdrawRealMoney(amount, withdrawDescription.trim());
        
        // Character feedback for withdrawal
        setCharacterEmotion('thinking');
        
        if (selectedCharacter) {
          setTimeout(() => {
            speakWithCharacter(
              `لقد أنفقت ${amount} ريال على ${withdrawDescription}. تذكر أن التوفير مهم!`,
              selectedCharacter,
              'encouraging'
            );
          }, 500);
        }
        
        // Reset form
        setWithdrawAmount('');
        setWithdrawDescription('');
        setShowWithdrawForm(false);
        
        // Reset character emotion
        setTimeout(() => {
          setCharacterEmotion('idle');
        }, 3000);
        
      } catch (error) {
        alert('رصيد غير كافي!');
        setCharacterEmotion('sad');
        
        if (selectedCharacter) {
          setTimeout(() => {
            speakWithCharacter(
              'عذراً، رصيدك غير كافي لهذا الإنفاق. احرص على التوفير أكثر!',
              selectedCharacter,
              'encouraging'
            );
          }, 500);
        }
      }
    }
  };

  const handleSetGoal = () => {
    if (newGoal > bankBalance) {
      setSavingsGoal(newGoal);
      setShowGoalForm(false);
    }
  };

  const quickDepositOptions = [5, 10, 20, 50];
  const quickWithdrawOptions = [5, 10, 15, 25];
  const quickDescriptions = [
    'مصروف اليوم',
    'هدية من العائلة',
    'توفير من الألعاب',
    'إنجاز خاص'
  ];
  const quickWithdrawDescriptions = [
    'شراء حلويات',
    'ألعاب جديدة',
    'كتب ومجلات',
    'هدية للأصدقاء'
  ];

  return (
    <AuthWrapper requiredRole="child">
      <div className="min-h-screen pb-24 relative overflow-hidden">
        
        {/* Confetti Effect */}
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
            gravity={0.3}
          />
        )}
        {/* Animated background elements */}
        <div className="fixed top-20 left-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl animate-pulse" />
        <div className="fixed top-40 right-8 w-24 h-24 bg-green-300/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="fixed bottom-40 left-6 w-28 h-28 bg-blue-300/20 rounded-full blur-xl animate-pulse delay-2000" />

        <div className="max-w-md mx-auto p-4 space-y-6">
          {/* Header */}
          <div className="text-center py-6">
            <div className="text-6xl mb-4 emoji-bounce">🏦</div>
            <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
              بنك <span className="gradient-text">{currentUser?.familyName}</span>
            </h1>
            <p className="text-white/80 text-sm">
              احفظ أموالك واحصل على مكافآت رائعة!
            </p>
          </div>

          {/* Character */}
          {selectedCharacter && (
            <div className="flex justify-center mb-6">
              <Amazing3DCharacter
                character={selectedCharacter}
                emotion={characterEmotion}
                isSpeaking={isSpeaking}
                size="medium"
              />
            </div>
          )}

          {/* Bank Balance - Big Display */}
          <div className="card sparkle relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-500/20" />
            <div className="relative text-center p-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <PiggyBank className="text-green-600" size={32} />
                <h2 className="text-xl font-bold text-gray-800">رصيدك الحالي</h2>
              </div>
              
              <div className={`text-6xl font-bold mb-4 transition-all duration-500 ${
                showCoinAnimation ? 'animate-bounce text-yellow-500' : 'text-green-600'
              }`}>
                {bankBalance.toFixed(2)}
                <span className="text-2xl mr-2">ريال</span>
              </div>

              {showCoinAnimation && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-4xl animate-ping">💰</div>
                </div>
              )}

              <p className="text-gray-600 text-sm">
                {bankBalance >= savingsGoal 
                  ? '🎉 أحسنت! وصلت لهدفك!' 
                  : `تحتاج ${(savingsGoal - bankBalance).toFixed(2)} ريال للوصول لهدفك`
                }
              </p>
            </div>
          </div>

          {/* Family Notifications */}
          {unreadNotifications > 0 && (
            <div className="card bg-gradient-to-r from-orange-100 to-yellow-100 border-2 border-orange-300 sparkle">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Gift className="text-orange-600" size={24} />
                  <h3 className="text-lg font-bold text-orange-800">
                    رسائل من العائلة ({unreadNotifications})
                  </h3>
                </div>
                
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {familyNotifications
                    .filter(n => !n.read)
                    .slice(0, 3)
                    .map(notification => (
                    <div 
                      key={notification.id}
                      className="bg-white/50 p-3 rounded-xl cursor-pointer hover:bg-white/70 transition-colors"
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <p className="text-orange-700 text-sm font-medium">
                        {notification.message}
                      </p>
                      <p className="text-orange-600 text-xs">
                        {new Date(notification.date).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Quick Actions */}
          <div className="grid grid-cols-2 gap-6">
            <button
              onClick={() => setShowDepositForm(true)}
              className="ultra-modern-card hover:scale-110 transition-all duration-500 sparkle group"
            >
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-green-500/50 transition-all duration-500">
                  <Plus className="text-white" size={32} />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">إيداع نقود</h3>
                <p className="text-white/80 text-sm">أضف أموالك المدخرة</p>
              </div>
            </button>

            <button
              onClick={() => setShowWithdrawForm(true)}
              className="ultra-modern-card hover:scale-110 transition-all duration-500 sparkle group"
            >
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-red-500/50 transition-all duration-500">
                  <Minus className="text-white" size={32} />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">إنفاق نقود</h3>
                <p className="text-white/80 text-sm">اشتر شيئاً تحتاجه</p>
              </div>
            </button>
          </div>

          {/* Secondary Actions */}
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => setShowGoalForm(true)}
              className="card hover:scale-105 transition-all duration-300 sparkle"
            >
              <div className="text-center p-4">
                <Target className="mx-auto text-purple-600 mb-2" size={32} />
                <h3 className="font-bold text-gray-800">تحديد هدف ادخار</h3>
                <p className="text-gray-600 text-sm">ضع هدف ادخار جديد</p>
              </div>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="card">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">التقدم نحو الهدف</span>
                <span className="text-sm text-gray-600">{progressPercentage.toFixed(1)}%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-700 relative"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-pulse" />
                </div>
              </div>
              
              <div className="flex justify-between mt-2 text-xs text-gray-600">
                <span>{bankBalance.toFixed(2)} ريال</span>
                <span>{savingsGoal} ريال</span>
              </div>
            </div>
          </div>

          {/* Savings Chart */}
          {chartData.length > 0 && (
            <div className="card">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="text-blue-600" size={20} />
                  <h3 className="font-bold text-gray-800">نمو مدخراتك</h3>
                </div>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis dataKey="day" fontSize={10} />
                      <YAxis fontSize={10} />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Recent Transactions */}
          {transactions.filter(t => t.type === 'real_money_deposit').length > 0 && (
            <div className="card">
              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-4">آخر الإيداعات</h3>
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {transactions
                    .filter(t => t.type === 'real_money_deposit')
                    .slice(0, 5)
                    .map(transaction => (
                    <div key={transaction.id} className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{transaction.description}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(transaction.date).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                      <span className="font-bold text-green-600">+{transaction.amount} ريال</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Deposit Form Modal */}
        {showDepositForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="card max-w-sm w-full sparkle">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  إيداع أموال جديدة
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      المبلغ (ريال)
                    </label>
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:outline-none text-lg"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      من أين حصلت على هذا المال؟
                    </label>
                    <select
                      value={depositDescription}
                      onChange={(e) => setDepositDescription(e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:outline-none"
                    >
                      <option value="">اختر مصدر المال</option>
                      {quickDescriptions.map(desc => (
                        <option key={desc} value={desc}>{desc}</option>
                      ))}
                    </select>
                  </div>

                  {depositDescription === '' && (
                    <input
                      type="text"
                      value={depositDescription}
                      onChange={(e) => setDepositDescription(e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:outline-none"
                      placeholder="اكتب مصدر المال..."
                    />
                  )}

                  <div className="grid grid-cols-4 gap-2">
                    {quickDepositOptions.map(amount => (
                      <button
                        key={amount}
                        onClick={() => setDepositAmount(amount.toString())}
                        className="p-2 bg-green-100 text-green-700 rounded-lg font-bold hover:bg-green-200 transition-colors"
                      >
                        {amount}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleDeposit}
                      disabled={!depositAmount || !depositDescription.trim()}
                      className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-xl transition-colors"
                    >
                      💰 إيداع
                    </button>
                    <button
                      onClick={() => setShowDepositForm(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-xl transition-colors"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Withdraw Form Modal */}
        {showWithdrawForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="card max-w-sm w-full sparkle">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  إنفاق من مدخراتك
                </h3>

                <div className="bg-yellow-100 border-2 border-yellow-300 rounded-xl p-3 mb-4">
                  <p className="text-yellow-800 text-sm font-medium text-center">
                    💡 تذكر: الإنفاق الذكي جزء من تعلم إدارة المال
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      المبلغ (ريال) - الرصيد المتاح: {bankBalance.toFixed(2)} ريال
                    </label>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-red-400 focus:outline-none text-lg"
                      placeholder="0.00"
                      min="0"
                      max={bankBalance}
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      على ماذا ستنفق المال؟
                    </label>
                    <select
                      value={withdrawDescription}
                      onChange={(e) => setWithdrawDescription(e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-red-400 focus:outline-none"
                    >
                      <option value="">اختر نوع الإنفاق</option>
                      {quickWithdrawDescriptions.map(desc => (
                        <option key={desc} value={desc}>{desc}</option>
                      ))}
                    </select>
                  </div>

                  {withdrawDescription === '' && (
                    <input
                      type="text"
                      value={withdrawDescription}
                      onChange={(e) => setWithdrawDescription(e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-red-400 focus:outline-none"
                      placeholder="اكتب نوع الإنفاق..."
                    />
                  )}

                  <div className="grid grid-cols-4 gap-2">
                    {quickWithdrawOptions.map(amount => (
                      <button
                        key={amount}
                        onClick={() => setWithdrawAmount(amount.toString())}
                        disabled={amount > bankBalance}
                        className="p-2 bg-red-100 text-red-700 rounded-lg font-bold hover:bg-red-200 transition-colors disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        {amount}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleWithdraw}
                      disabled={!withdrawAmount || !withdrawDescription.trim() || parseFloat(withdrawAmount) > bankBalance}
                      className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-xl transition-colors"
                    >
                      💸 إنفاق
                    </button>
                    <button
                      onClick={() => setShowWithdrawForm(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-xl transition-colors"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Goal Setting Modal */}
        {showGoalForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="card max-w-sm w-full sparkle">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  تحديد هدف ادخار جديد
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      الهدف الجديد (ريال)
                    </label>
                    <input
                      type="number"
                      value={newGoal}
                      onChange={(e) => setNewGoal(Number(e.target.value))}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none text-lg"
                      placeholder="100"
                      min={bankBalance + 1}
                    />
                  </div>

                  <p className="text-sm text-gray-600">
                    الهدف الحالي: {savingsGoal} ريال
                    <br />
                    يجب أن يكون الهدف الجديد أكبر من رصيدك الحالي ({bankBalance} ريال)
                  </p>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSetGoal}
                      disabled={newGoal <= bankBalance}
                      className="flex-1 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-xl transition-colors"
                    >
                      🎯 تحديد الهدف
                    </button>
                    <button
                      onClick={() => setShowGoalForm(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-xl transition-colors"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Milestone Achievement Modal */}
        {showMilestoneModal.show && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="card max-w-sm w-full sparkle relative overflow-hidden">
              {/* Celebration Particles */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute text-3xl animate-bounce"
                    style={{
                      top: `${Math.random() * 80}%`,
                      left: `${Math.random() * 80}%`,
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: '2s'
                    }}
                  >
                    {['🎉', '⭐', '✨', '🎊', '💫', '🌟', '🏆', '👑', '💰', '🎯'][i]}
                  </div>
                ))}
              </div>
              
              <div className="relative z-10 p-8 text-center">
                <div className="text-8xl mb-4 animate-spin">🏆</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  إنجاز رائع!
                </h2>
                <div className="text-lg text-gray-700 mb-6 leading-relaxed">
                  {showMilestoneModal.message}
                </div>
                
                {/* Character celebrating */}
                {selectedCharacter && (
                  <div className="mb-6">
                    <Amazing3DCharacter
                      character={selectedCharacter}
                      emotion="celebrating"
                      isSpeaking={isSpeaking}
                      size="medium"
                    />
                  </div>
                )}
                
                <button
                  onClick={() => setShowMilestoneModal({ show: false, amount: 0, message: '' })}
                  className="btn-primary w-full"
                >
                  🎊 استمر في التوفير!
                </button>
              </div>
            </div>
          </div>
        )}

        <Navigation />
      </div>
    </AuthWrapper>
  );
};

export default BankPage; 