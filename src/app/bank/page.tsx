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
import { PiggyBank, TrendingUp, Target, Gift, Plus, Minus, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Confetti from 'react-confetti';
import RewardSystem from '@/components/RewardSystem';
import Image from 'next/image';

const BankPage: React.FC = () => {
  const { 
    bankBalance, 
    savingsGoal, 
    transactions, 
    familyNotifications,
    depositRealMoney,
    withdrawRealMoney,
    setSavingsGoal,
    markNotificationAsRead,
    rewardPoints
  } = useGameStore();
  
  const { currentUser, logout } = useAuthStore();
  const { selectedCharacter } = useCharacterStore();
  const { speakWithCharacter, isSpeaking } = useEnhancedVoice();
  const router = useRouter();
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRewardSystem, setShowRewardSystem] = useState(false);

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
    if (amount > 0 && depositDescription.trim() && !isProcessing) {
      setIsProcessing(true);
      const oldBalance = bankBalance;
      
      // Deposit the money
      depositRealMoney(amount, depositDescription.trim());
      
      // Start celebrations
      setShowCoinAnimation(true);
      setShowConfetti(true);
      setCharacterEmotion('celebrating');
      
      // Play celebration sound ONCE
      playSound('celebration', selectedCharacter);
      
      // Check for milestone achievements BEFORE speaking
      const newBalance = oldBalance + amount;
      let milestoneReached = false;
      let milestoneMessage = '';
      
      if (oldBalance < 50 && newBalance >= 50) {
        milestoneReached = true;
        milestoneMessage = ` مبروك! لقد وصلت إلى خمسين ريال! أنت محترف في التوفير! `;
        setShowMilestoneModal({ show: true, amount: 50, message: milestoneMessage });
      } else if (oldBalance < 100 && newBalance >= 100) {
        milestoneReached = true;
        milestoneMessage = `🏆 رائع جداً! وصلت إلى 100 ريال! أنت بطل التوفير! 🏆`;
        setShowMilestoneModal({ show: true, amount: 100, message: milestoneMessage });
      } else if (oldBalance < 200 && newBalance >= 200) {
        milestoneReached = true;
        milestoneMessage = `👑 ملك التوفير! وصلت إلى 200 ريال! لا يمكن إيقافك! 👑`;
        setShowMilestoneModal({ show: true, amount: 200, message: milestoneMessage });
      } else if (oldBalance < 500 && newBalance >= 500) {
        milestoneReached = true;
        milestoneMessage = `🌟 أسطورة التوفير! وصلت إلى 500 ريال! أنت قدوة للجميع! 🌟`;
        setShowMilestoneModal({ show: true, amount: 500, message: milestoneMessage });
      }
      
      // Character speaks ONLY ONCE - either milestone or regular message
      if (selectedCharacter) {
        setTimeout(() => {
          if (milestoneReached) {
            speakWithCharacter(milestoneMessage, selectedCharacter, 'celebrating');
          } else {
            speakWithCharacter(
              `أحسنت! لقد وفرت ${amount} ريال! هذا رائع جداً!`,
              selectedCharacter,
              'celebrating'
            );
          }
          setIsProcessing(false);
        }, 1000);
      } else {
        setIsProcessing(false);
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
      }, milestoneReached ? 6000 : 4000);
    }
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount > 0 && withdrawDescription.trim() && amount <= bankBalance && !isProcessing) {
      setIsProcessing(true);
      
      try {
        // Withdraw the money
        withdrawRealMoney(amount, withdrawDescription.trim());
        
        // Character feedback for withdrawal
        setCharacterEmotion('thinking');
        
        if (selectedCharacter) {
          setTimeout(() => {
            speakWithCharacter(
              `َلقد أنفَقٌت ${amount} ريالْ على ${withdrawDescription}. ْتَذَكَّر أن التوفير مهم!`,
              selectedCharacter,
              'encouraging'
            );
            setIsProcessing(false);
          }, 500);
        } else {
          setIsProcessing(false);
        }
        
        // Reset form
        setWithdrawAmount('');
        setWithdrawDescription('');
        setShowWithdrawForm(false);
        
        // Reset character emotion
        setTimeout(() => {
          setCharacterEmotion('idle');
        }, 4000);
        
      } catch (error) {
        setIsProcessing(false);
        setCharacterEmotion('sad');
        
        // Play error sound
        playSound('error', selectedCharacter);
        
        if (selectedCharacter) {
          setTimeout(() => {
            speakWithCharacter(
              'عذراً، رصيدك غير كافي لهذا الإنفاق. احرص على التوفير أكثر!',
              selectedCharacter,
              'encouraging'
            );
          }, 500);
        }
        
        setTimeout(() => {
          setCharacterEmotion('idle');
        }, 4000);
      }
    }
  };

  const handleSetGoal = () => {
    if (newGoal > bankBalance) {
      setSavingsGoal(newGoal);
      setShowGoalForm(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
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
      <div className="min-h-screen pb-24 relative overflow-hidden bg-gradient-to-br from-blue-200 via-pink-200 via-yellow-100 to-green-200">
        
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
        <div className="fixed top-10 left-10 w-32 h-32 bg-blue-300/40 rounded-full blur-2xl animate-pulse" />
        <div className="fixed top-32 right-10 w-24 h-24 bg-yellow-300/50 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="fixed bottom-40 left-6 w-40 h-40 bg-green-300/40 rounded-full blur-2xl animate-pulse delay-2000" />
        <div className="absolute top-24 left-1/4 w-12 h-12 bg-pink-300/40 rounded-full blur-xl animate-float" />
        <div className="absolute top-1/2 right-10 w-10 h-10 bg-yellow-200/60 rounded-full blur-lg animate-float" />
        <div className="absolute bottom-32 left-1/3 w-16 h-16 bg-green-300/40 rounded-full blur-xl animate-float" />

        <div className="max-w-md mx-auto p-4 space-y-6">
          {/* Header */}
          <div className="text-center py-6">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setShowRewardSystem(true)}
                className="p-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-xl transform hover:scale-110 animate-pulse relative"
                title="نظام المكافآت"
              >
                <Gift size={20} className="animate-bounce" />
                {rewardPoints > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                    {rewardPoints > 99 ? '99+' : rewardPoints}
                  </div>
                )}
              </button>
              <div className="relative">
                <div className="absolute left-1/2 top-6 -translate-x-1/2 w-24 h-24 bg-yellow-300/60 blur-2xl z-0" />
                <div className="text-6xl emoji-bounce relative z-10 drop-shadow-[0_4px_32px_rgba(59,130,246,0.7)]">🏦</div>
              </div>
              <button
                onClick={handleLogout}
                className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-300 shadow-xl transform hover:scale-110"
                title="تسجيل الخروج"
              >
                <LogOut size={20} />
              </button>
            </div>
            <h1 className="text-3xl font-extrabold text-cyan-600 mb-2 drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
              بنك <span className="font-extrabold text-black drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">{currentUser?.familyName}</span>
            </h1>
            <p className="text-blue-600 text-base font-extrabold drop-shadow-[0_2px_8px_rgba(255,255,255,0.7)]">
              احفظ أموالك واحصل على مكافآت رائعة!
            </p>
          </div>

          {/* Alinma Card - Bigger */}
            <div className="flex justify-center mb-6">
            <div className="relative group">
              {/* Card Container - Stable */}
              <div className="relative perspective-1000">
                {/* Card Shadow */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-[28rem] h-8 bg-black/20 rounded-full blur-xl animate-pulse"></div>
                
                {/* Main Card Container - Much Bigger */}
                <div className="relative w-[28rem] h-72 overflow-hidden transform transition-all duration-1000 hover:scale-105">
                  {/* Alinma Card Image - Animated */}
                  <Image
                    src="/alinma.png"
                    alt="بطاقة العليما"
                    width={448}
                    height={288}
                    className="w-full h-full object-contain animate-card-circle"
                  />
                  
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] animate-shimmer"></div>
            </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-4 -left-4 w-5 h-5 bg-green-400 rounded-full animate-bounce delay-300"></div>
                <div className="absolute top-1/2 -right-5 w-4 h-4 bg-blue-400 rounded-full animate-bounce delay-600"></div>
                <div className="absolute top-1/2 -left-5 w-4 h-4 bg-purple-400 rounded-full animate-bounce delay-900"></div>
              </div>
              
              {/* Card Info */}
              <div className="text-center mt-4">
                <div className="text-black text-base font-medium mb-1">بطاقة الدفع الخاصة بك</div>
                <div className="text-black text-sm">استخدمها للتسوق والمدفوعات الآمنة</div>
              </div>
            </div>
          </div>

          {/* Small Character - Looking at the child (No Background) */}
          <div className="absolute top-20 left-20 z-10">
            <div className="relative">
              {/* Character Container - No Background */}
              <div className="w-24 h-24 transform scale-75 hover:scale-90 transition-transform duration-300">
                {selectedCharacter && (
                  <div className="relative w-full h-full">
                    {/* Custom Character SVG - Only Body and Face */}
                    <svg viewBox="0 0 240 280" className="w-full h-full">
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
                        fill={characterEmotion === 'celebrating' ? '#FFD700' : characterEmotion === 'sad' ? '#87CEEB' : '#FFA07A'}
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
                        stroke={characterEmotion === 'celebrating' ? '#E6C200' : characterEmotion === 'sad' ? '#6BA5C7' : '#E68A5C'}
                        strokeWidth="3"
                        opacity="0.7"
                      />
                      
                      {/* Enhanced Friendly Eyes */}
                      {/* Left Eye */}
                      <ellipse 
                        cx="95" 
                        cy="100" 
                        rx="11" 
                        ry="13"
                        fill="#000"
                        style={{
                          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))'
                        }}
                      />
                      
                      {/* Right Eye */}
                      <ellipse 
                        cx="145" 
                        cy="100" 
                        rx="11" 
                        ry="13"
                        fill="#000"
                        style={{
                          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))'
                        }}
                      />
                      
                      {/* Enhanced friendly highlights */}
                      <circle cx="92" cy="96" r="4" fill="#fff" />
                      <circle cx="142" cy="96" r="4" fill="#fff" />
                      
                      {/* Subtle secondary highlights */}
                      <circle cx="94" cy="102" r="2" fill="#fff" opacity="0.7" />
                      <circle cx="144" cy="102" r="2" fill="#fff" opacity="0.7" />
                      
                      {/* Tiny sparkle highlights */}
                      <circle cx="90" cy="94" r="1" fill="#fff" opacity="0.9" />
                      <circle cx="140" cy="94" r="1" fill="#fff" opacity="0.9" />

                      {/* Enhanced Expressive Eyebrows */}
                      {/* Left Eyebrow */}
                      <path 
                        d={characterEmotion === 'thinking' ? "M 80 82 Q 95 72 110 79" : 
                            characterEmotion === 'sad' ? "M 80 87 Q 95 92 110 85" :
                            characterEmotion === 'happy' ? "M 80 79 Q 95 72 110 77" :
                            characterEmotion === 'excited' ? "M 80 77 Q 95 70 110 75" :
                            characterEmotion === 'celebrating' ? "M 80 76 Q 95 69 110 74" :
                            "M 80 81 Q 95 75 110 80"} 
                        stroke="#8B4513" 
                        strokeWidth="4" 
                        fill="none"
                        strokeLinecap="round"
                        className="transition-all duration-500"
                        style={{ 
                          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))'
                        }}
                      />
                      
                      {/* Right Eyebrow */}
                      <path 
                        d={characterEmotion === 'thinking' ? "M 130 79 Q 145 72 160 82" : 
                            characterEmotion === 'sad' ? "M 130 85 Q 145 92 160 87" :
                            characterEmotion === 'happy' ? "M 130 77 Q 145 72 160 79" :
                            characterEmotion === 'excited' ? "M 130 75 Q 145 70 160 77" :
                            characterEmotion === 'celebrating' ? "M 130 74 Q 145 69 160 76" :
                            "M 130 80 Q 145 75 160 81"} 
                        stroke="#8B4513" 
                        strokeWidth="4" 
                        fill="none"
                        strokeLinecap="round"
                        className="transition-all duration-500"
                        style={{ 
                          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))'
                        }}
                      />

                      {/* Cute Small Nose */}
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

                      {/* Enhanced Friendly Mouth */}
                      <path 
                        d={
                          characterEmotion === 'sad' ? "M 105 143 Q 120 128 135 143" :
                          characterEmotion === 'thinking' ? "M 107 140 Q 120 141 133 140" :
                          characterEmotion === 'excited' ? "M 103 135 Q 120 145 137 135" :
                          characterEmotion === 'celebrating' ? "M 103 134 Q 120 147 137 134" :
                          "M 105 137 Q 120 143 135 137"
                        }
                        stroke="#8B4513" 
                        strokeWidth="4" 
                        fill="none"
                        strokeLinecap="round"
                        className="transition-all duration-300"
                        style={{ 
                          filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.2))',
                          strokeLinejoin: 'round'
                        }}
                      />

                      {/* Enhanced Cheeks for happy emotions */}
                      {(characterEmotion === 'happy' || characterEmotion === 'celebrating' || characterEmotion === 'excited') && (
                        <>
                          <circle cx="75" cy="125" r="12" fill="#FFB6C1" opacity="0.7" />
                          <circle cx="165" cy="125" r="12" fill="#FFB6C1" opacity="0.7" />
                          <circle cx="77" cy="123" r="6" fill="rgba(255,255,255,0.4)" />
                          <circle cx="167" cy="123" r="6" fill="rgba(255,255,255,0.4)" />
                        </>
                      )}
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Speech Bubble */}
              {isSpeaking && (
                <div className="absolute -top-12 -right-2 bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-gray-200 max-w-32">
                  <div className="text-xs text-gray-700 text-center">
                    👀 أنظر إلى بطاقتك!
                  </div>
                  <div className="absolute bottom-0 right-3 w-2 h-2 bg-white/95 transform rotate-45 border-r border-b border-gray-200"></div>
                </div>
              )}
            </div>
          </div>

          {/* Bank Balance - Big Display */}
          <div className="card sparkle relative overflow-hidden border-4 border-pink-200 shadow-xl">
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
                      className={`p-3 rounded-xl cursor-pointer hover:bg-white/70 transition-colors ${
                        notification.type === 'parent_transfer' 
                          ? 'bg-gradient-to-r from-green-100 to-blue-100 border-2 border-green-300' 
                          : 'bg-white/50'
                      }`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {notification.type === 'parent_transfer' && (
                          <span className="text-lg">💰</span>
                        )}
                        <p className={`text-sm font-medium ${
                          notification.type === 'parent_transfer' 
                            ? 'text-green-700' 
                            : 'text-orange-700'
                        }`}>
                        {notification.message}
                      </p>
                      </div>
                      <p className={`text-xs ${
                        notification.type === 'parent_transfer' 
                          ? 'text-green-600' 
                          : 'text-orange-600'
                      }`}>
                        {new Date(notification.date).toLocaleDateString('ar-SA')}
                      </p>
                      {notification.type === 'parent_transfer' && (
                        <div className="mt-2 text-xs text-green-600 font-bold">
                          🎁 +{Math.floor(notification.amount/10)} نقطة مكافأة
                        </div>
                      )}
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
                <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-green-300 via-yellow-200 to-blue-400 rounded-full flex items-center justify-center shadow-lg border-4 border-green-200 group-hover:shadow-green-500/50 transition-all duration-500">
                  <Plus className="text-white" size={32} />
                </div>
                <div className="text-center text-green-800 font-bold text-sm mb-2">إيداع</div>
                <p className="text-black/80 text-sm">أضف أموالك المدخرة</p>
              </div>
            </button>

            <button
              onClick={() => setShowWithdrawForm(true)}
              className="ultra-modern-card hover:scale-110 transition-all duration-500 sparkle group"
            >
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-pink-300 via-yellow-200 to-red-400 rounded-full flex items-center justify-center shadow-lg border-4 border-pink-200 group-hover:shadow-red-500/50 transition-all duration-500">
                  <Minus className="text-white" size={32} />
                </div>
                <div className="text-center text-pink-700 font-bold text-sm mb-2">سحب</div>
                <p className="text-black/80 text-sm">اشتر شيئاً تحتاجه</p>
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
          <div className="card bg-gradient-to-br from-blue-100 via-green-100 to-yellow-100 border-2 border-blue-200">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-blue-700">التقدم نحو الهدف</span>
                <span className="text-sm font-bold text-green-700">{progressPercentage.toFixed(1)}%</span>
              </div>
              
              <div className="w-full bg-white/40 rounded-full h-3 overflow-hidden border border-green-300">
                <div 
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-700 relative"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-pulse" />
                </div>
              </div>
              
              <div className="flex justify-between mt-2 text-xs font-bold text-blue-700">
                <span>{bankBalance.toFixed(2)} ريال</span>
                <span>{savingsGoal} ريال</span>
              </div>
            </div>
          </div>

          {/* Savings Chart */}
          {chartData.length > 0 && (
            <div className="card bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 border-2 border-purple-200">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="text-purple-400" size={20} />
                  <h3 className="font-bold text-purple-700 flex items-center gap-1">📈 نمو مدخراتك</h3>
                </div>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis dataKey="day" fontSize={10} />
                      <YAxis fontSize={10} />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#a21caf" 
                        strokeWidth={3}
                        dot={{ fill: '#fbbf24', strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Recent Transactions */}
          {transactions.filter(t => ['deposit', 'real_money_deposit', 'withdraw', 'real_money_withdraw', 'انفاق'].includes(t.type)).length > 0 && (
            <div className="card bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 border-2 border-yellow-200">
              <div className="p-4">
                <h3 className="font-bold text-yellow-700 mb-4 flex items-center gap-2">🧾 آخر الإيداعات والسحوبات</h3>
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {transactions
                    .filter(t => ['deposit', 'real_money_deposit', 'withdraw', 'real_money_withdraw', 'انفاق'].includes(t.type))
                    .slice(0, 5)
                    .map(transaction => {
                      const isDeposit = transaction.type === 'deposit' || transaction.type === 'real_money_deposit';
                      const isWithdraw = !isDeposit && ((transaction as any).type === 'withdraw' || (transaction as any).type === 'real_money_withdraw' || (transaction as any).type === 'انفاق');
                      return (
                        <div key={transaction.id} className={`flex justify-between items-center p-2 rounded-lg shadow-sm border-l-4 mb-1 ${
                          isDeposit ? 'bg-green-100 border-green-400' : isWithdraw ? 'bg-red-100 border-red-400' : 'bg-gray-100 border-gray-300'
                        }`}> 
                          <div className="flex items-center gap-2">
                            <span className={`text-2xl ${isDeposit ? 'text-green-500' : isWithdraw ? 'text-red-500' : 'text-gray-400'}`}>{isDeposit ? '💰' : isWithdraw ? '💸' : ''}</span>
                            <div>
                              <p className="font-bold text-gray-800">{transaction.description}</p>
                              <p className="text-xs font-bold text-gray-700">{new Date(transaction.date).toLocaleDateString('ar-SA')}</p>
                            </div>
                          </div>
                          <span className={`font-bold text-lg ${isDeposit ? 'text-green-700 bg-green-200' : isWithdraw ? 'text-red-700 bg-red-200' : 'text-gray-600 bg-gray-200'} px-3 py-1 rounded-full`}>
                            {isDeposit ? `+${transaction.amount}` : isWithdraw ? `-${Math.abs(transaction.amount)}` : transaction.amount} ريال
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Deposit Form Modal */}
        {showDepositForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="ultra-modern-card max-w-sm w-full sparkle modern-shadow">
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-3 animate-bounce">💰</div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    إيداع أموال جديدة
                  </h3>
                  <p className="text-white/80">أضف أموالك المدخرة وشاهد رصيدك ينمو!</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-lg font-bold text-white mb-3">
                      💵 المبلغ (ريال)
                    </label>
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full p-4 border-2 border-white/30 rounded-xl focus:border-green-400 focus:outline-none text-xl bg-white/10 backdrop-blur-sm text-white placeholder-white/60"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-bold text-white mb-3">
                      🎯 من أين حصلت على هذا المال؟
                    </label>
                    <select
                      value={depositDescription}
                      onChange={(e) => setDepositDescription(e.target.value)}
                      className="w-full p-4 border-2 border-white/30 rounded-xl focus:border-green-400 focus:outline-none bg-white/10 backdrop-blur-sm text-white"
                    >
                      <option value="" className="text-gray-800">اختر مصدر المال</option>
                      {quickDescriptions.map(desc => (
                        <option key={desc} value={desc} className="text-gray-800">{desc}</option>
                      ))}
                    </select>
                  </div>

                  {/* Quick Amount Buttons */}
                  <div>
                    <label className="block text-lg font-bold text-white mb-3">
                      ⚡ مبالغ سريعة
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {quickDepositOptions.map(amount => (
                        <button
                          key={amount}
                          onClick={() => setDepositAmount(amount.toString())}
                          className="p-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl font-bold hover:from-green-500 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                        >
                          {amount}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleDeposit}
                      disabled={!depositAmount || !depositDescription.trim() || isProcessing}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                    >
                      {isProcessing ? '⏳ جاري الإيداع...' : '💰 إيداع الآن'}
                    </button>
                    <button
                      onClick={() => setShowDepositForm(false)}
                      disabled={isProcessing}
                      className="flex-1 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold py-4 rounded-xl transition-all duration-300 border border-white/30"
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
            <div className="ultra-modern-card max-w-sm w-full sparkle modern-shadow">
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-3 animate-bounce">💸</div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    إنفاق من مدخراتك
                  </h3>
                  <p className="text-white/80">تذكر: الإنفاق الذكي جزء من تعلم إدارة المال</p>
                </div>

                <div className="bg-yellow-400/20 border-2 border-yellow-400/50 rounded-xl p-4 mb-6 backdrop-blur-sm">
                  <p className="text-yellow-200 text-lg font-bold text-center">
                    💡 رصيدك المتاح: {bankBalance.toFixed(2)} ريال
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-lg font-bold text-white mb-3">
                      💸 المبلغ (ريال)
                    </label>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full p-4 border-2 border-white/30 rounded-xl focus:border-red-400 focus:outline-none text-xl bg-white/10 backdrop-blur-sm text-white placeholder-white/60"
                      placeholder="0.00"
                      min="0"
                      max={bankBalance}
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-bold text-white mb-3">
                      🛒 على ماذا ستنفق المال؟
                    </label>
                    <select
                      value={withdrawDescription}
                      onChange={(e) => setWithdrawDescription(e.target.value)}
                      className="w-full p-4 border-2 border-white/30 rounded-xl focus:border-red-400 focus:outline-none bg-white/10 backdrop-blur-sm text-white"
                    >
                      <option value="" className="text-gray-800">اختر نوع الإنفاق</option>
                      {quickWithdrawDescriptions.map(desc => (
                        <option key={desc} value={desc} className="text-gray-800">{desc}</option>
                      ))}
                    </select>
                  </div>

                  {/* Quick Amount Buttons */}
                  <div>
                    <label className="block text-lg font-bold text-white mb-3">
                      ⚡ مبالغ سريعة
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {quickWithdrawOptions.map(amount => (
                        <button
                          key={amount}
                          onClick={() => setWithdrawAmount(amount.toString())}
                          disabled={amount > bankBalance}
                          className="p-3 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-xl font-bold hover:from-red-500 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {amount}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleWithdraw}
                      disabled={!withdrawAmount || !withdrawDescription.trim() || parseFloat(withdrawAmount) > bankBalance || isProcessing}
                      className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                    >
                      {isProcessing ? '⏳ جاري الإنفاق...' : '💸 إنفاق الآن'}
                    </button>
                    <button
                      onClick={() => setShowWithdrawForm(false)}
                      disabled={isProcessing}
                      className="flex-1 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold py-4 rounded-xl transition-all duration-300 border border-white/30"
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
            <div className="card max-w-sm w-full sparkle bg-green-900/90 border-1 border-green-900">
              <div className="p-6">
                <h3 className="text-xl font-extrabold text-blue-500 mb-4 text-center">
                  تحديد هدف ادخار جديد
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-base font-bold text-white mb-2">
                      الهدف الجديد (ريال)
                    </label>
                    <input
                      type="number"
                      value={newGoal}
                      onChange={(e) => setNewGoal(Number(e.target.value))}
                      className="w-full p-3 border-2 border-purple-400 rounded-xl focus:border-blue-500 focus:outline-none text-lg text-gray-900 bg-white placeholder-gray-400"
                      placeholder="100"
                      min={bankBalance + 1}
                    />
                  </div>
                  <p className="text-sm text-white">
                    الهدف الحالي: {savingsGoal} ريال
                    <br />
                    يجب أن يكون الهدف الجديد أكبر من رصيدك الحالي ({bankBalance} ريال)
                  </p>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSetGoal}
                      disabled={newGoal <= bankBalance}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-xl transition-colors"
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
        
        {/* Reward System */}
        <RewardSystem 
          isOpen={showRewardSystem} 
          onClose={() => setShowRewardSystem(false)} 
        />
      </div>
    </AuthWrapper>
  );
};

export default BankPage; 