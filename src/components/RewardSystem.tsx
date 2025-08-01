'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Gift, Coins, DollarSign, Store, X, ArrowRight, CheckCircle } from 'lucide-react';
import Image from 'next/image';

interface RewardSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

const RewardSystem: React.FC<RewardSystemProps> = ({ isOpen, onClose }) => {
  const { 
    rewardPoints, 
    rewardTransactions, 
    convertPointsToCash, 
    spendPointsOnStore 
  } = useGameStore();
  
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [convertAmount, setConvertAmount] = useState('');
  const [selectedStore, setSelectedStore] = useState<'apple' | 'roblox' | 'ps' | null>(null);
  const [spendAmount, setSpendAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Handle escape key to close modals
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showConvertModal) {
          setShowConvertModal(false);
        } else if (showStoreModal) {
          setShowStoreModal(false);
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, showConvertModal, showStoreModal, onClose]);

  const handleConvertToCash = () => {
    const points = parseInt(convertAmount);
    if (points > 0 && points <= rewardPoints && !isProcessing) {
      setIsProcessing(true);
      try {
        convertPointsToCash(points);
        setShowConvertModal(false);
        setConvertAmount('');
        setSuccessMessage(`تم تحويل ${points} نقطة بنجاح!`);
        setShowSuccessMessage(true);
        setTimeout(() => {
          setIsProcessing(false);
          setShowSuccessMessage(false);
        }, 2000);
      } catch (error) {
        setIsProcessing(false);
        alert('حدث خطأ في التحويل');
      }
    }
  };

  const handleSpendOnStore = () => {
    const points = parseInt(spendAmount);
    if (points > 0 && points <= rewardPoints && selectedStore && !isProcessing) {
      setIsProcessing(true);
      try {
        spendPointsOnStore(points, selectedStore);
        setShowStoreModal(false);
        setSpendAmount('');
        setSelectedStore(null);
        setSuccessMessage(`تم شراء من المتجر بنجاح!`);
        setShowSuccessMessage(true);
        setTimeout(() => {
          setIsProcessing(false);
          setShowSuccessMessage(false);
        }, 2000);
      } catch (error) {
        setIsProcessing(false);
        alert('حدث خطأ في الشراء');
      }
    }
  };

  const quickConvertOptions = [10, 50, 100, 200];
  const quickSpendOptions = [50, 100, 200, 500];

  const storeOptions = [
    {
      id: 'apple' as const,
      name: 'متجر Apple',
      image: '/Itunes_store.jpg',
      description: 'ألعاب وتطبيقات من متجر Apple'
    },
    {
      id: 'roblox' as const,
      name: 'متجر Roblox',
      image: '/Roblox.jpg',
      description: 'ألعاب Roblox الرائعة'
    },
    {
      id: 'ps' as const,
      name: 'متجر PlayStation',
      image: '/ps_store.jpg',
      description: 'ألعاب PlayStation المميزة'
    }
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-60 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg animate-bounce">
          <div className="flex items-center gap-2">
            <CheckCircle size={20} />
            <span className="font-bold">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Main Reward Modal */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div 
          className="ultra-modern-card max-w-md w-full sparkle modern-shadow relative animate-in slide-in-from-bottom-4 duration-300 transform -translate-y-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 z-10"
            title="إغلاق"
          >
            <X size={20} className="text-white" />
          </button>

          <div className="p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="text-6xl mb-3 animate-bounce">🎁</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                نظام المكافآت
              </h2>
              <p className="text-white/80">استخدم نقاطك للحصول على مكافآت رائعة!</p>
            </div>

            {/* Points Display */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 mb-6 text-center relative overflow-hidden">
              {/* Animated background particles */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-2 left-4 text-2xl animate-bounce">✨</div>
                <div className="absolute top-4 right-6 text-xl animate-pulse">⭐</div>
                <div className="absolute bottom-4 left-6 text-xl animate-spin">💫</div>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Coins className="text-white animate-pulse" size={24} />
                  <span className="text-white font-bold text-lg">نقاطك الحالية</span>
                </div>
                <div className="text-5xl font-bold text-white mb-2 animate-pulse">
                  {rewardPoints}
                </div>
                <p className="text-white/90 text-sm">
                  كل 10 ريال = 1 نقطة | كل 100 ريال = 10 نقاط
                </p>
                
                {/* Progress indicator for next milestone */}
                {rewardPoints > 0 && (
                  <div className="mt-3">
                    <div className="w-full bg-white/20 rounded-full h-2 mb-1">
                      <div 
                        className="bg-white h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((rewardPoints % 100) / 100 * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-white/80 text-xs">
                      {100 - (rewardPoints % 100)} نقطة للوصول للـ 100 نقطة التالية
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={() => setShowConvertModal(true)}
                disabled={rewardPoints === 0}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2 relative overflow-hidden group"
                title={rewardPoints === 0 ? "لا توجد نقاط للتحويل" : "تحويل النقاط إلى ريال"}
              >
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <DollarSign size={20} className="relative z-10" />
                <span className="relative z-10">تحويل النقاط إلى نقد</span>
              </button>

              <button
                onClick={() => setShowStoreModal(true)}
                disabled={rewardPoints === 0}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2 relative overflow-hidden group"
                title={rewardPoints === 0 ? "لا توجد نقاط للشراء" : "شراء من المتاجر المفضلة"}
              >
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <Store size={20} className="relative z-10" />
                <span className="relative z-10">شراء من المتاجر</span>
              </button>
            </div>

            {/* Recent Transactions */}
            {rewardTransactions.length > 0 && (
              <div className="mt-6">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <span>📋</span>
                  آخر المعاملات
                </h3>
                <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                  {rewardTransactions.slice(0, 3).map((transaction, index) => (
                    <div 
                      key={transaction.id} 
                      className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-white text-sm font-medium">{transaction.description}</span>
                        <span className={`font-bold text-sm px-2 py-1 rounded-full ${
                          transaction.points > 0 
                            ? 'text-green-400 bg-green-400/20' 
                            : 'text-red-400 bg-red-400/20'
                        }`}>
                          {transaction.points > 0 ? '+' : ''}{transaction.points}
                        </span>
                      </div>
                      <p className="text-white/60 text-xs mt-1">
                        {new Date(transaction.date).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Convert to Cash Modal */}
      {showConvertModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowConvertModal(false)}
        >
          <div 
            className="ultra-modern-card max-w-sm w-full sparkle modern-shadow transform -translate-y-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-6xl mb-3 animate-bounce">💰</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  تحويل النقاط إلى نقد
                </h3>
                <p className="text-white/80">كل نقطة = 0.1 ريال</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-lg font-bold text-white mb-3">
                    عدد النقاط
                  </label>
                  <input
                    type="number"
                    value={convertAmount}
                    onChange={(e) => setConvertAmount(e.target.value)}
                    className="w-full p-4 border-2 border-white/30 rounded-xl focus:border-green-400 focus:outline-none text-xl bg-white/10 backdrop-blur-sm text-white placeholder-white/60"
                    placeholder="0"
                    min="1"
                    max={rewardPoints}
                  />
                </div>

                {convertAmount && (
                  <div className="bg-green-500/20 border-2 border-green-400/50 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-green-200 text-lg font-bold text-center">
                      ستحصل على: {(parseInt(convertAmount) || 0) * 0.1} ريال
                    </p>
                  </div>
                )}

                {/* Quick Amount Buttons */}
                <div>
                  <label className="block text-lg font-bold text-white mb-3">
                    ⚡ مبالغ سريعة
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {quickConvertOptions.map(amount => (
                      <button
                        key={amount}
                        onClick={() => setConvertAmount(amount.toString())}
                        disabled={amount > rewardPoints}
                        className="p-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl font-bold hover:from-green-500 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {amount}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleConvertToCash}
                    disabled={!convertAmount || parseInt(convertAmount) > rewardPoints || isProcessing}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                  >
                    {isProcessing ? '⏳ جاري التحويل...' : '💰 تحويل الآن'}
                  </button>
                  <button
                    onClick={() => setShowConvertModal(false)}
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

      {/* Store Selection Modal */}
      {showStoreModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowStoreModal(false)}
        >
          <div 
            className="ultra-modern-card max-w-sm w-full sparkle modern-shadow transform -translate-y-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-6xl mb-3 animate-bounce">🛒</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  اختر المتجر
                </h3>
                <p className="text-white/80">استخدم نقاطك لشراء من المتاجر المفضلة</p>
              </div>

              <div className="space-y-4">
                {storeOptions.map(store => (
                  <button
                    key={store.id}
                    onClick={() => setSelectedStore(store.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      selectedStore === store.id
                        ? 'border-purple-400 bg-purple-500/20'
                        : 'border-white/30 bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/20">
                        <Image
                          src={store.image}
                          alt={store.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-right flex-1">
                        <h4 className="text-white font-bold">{store.name}</h4>
                        <p className="text-white/70 text-sm">{store.description}</p>
                      </div>
                      {selectedStore === store.id && (
                        <CheckCircle className="text-purple-400" size={20} />
                      )}
                    </div>
                  </button>
                ))}

                {selectedStore && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-lg font-bold text-white mb-3">
                        عدد النقاط
                      </label>
                      <input
                        type="number"
                        value={spendAmount}
                        onChange={(e) => setSpendAmount(e.target.value)}
                        className="w-full p-4 border-2 border-white/30 rounded-xl focus:border-purple-400 focus:outline-none text-xl bg-white/10 backdrop-blur-sm text-white placeholder-white/60"
                        placeholder="0"
                        min="1"
                        max={rewardPoints}
                      />
                    </div>

                    {/* Quick Amount Buttons */}
                    <div>
                      <label className="block text-lg font-bold text-white mb-3">
                        ⚡ مبالغ سريعة
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {quickSpendOptions.map(amount => (
                          <button
                            key={amount}
                            onClick={() => setSpendAmount(amount.toString())}
                            disabled={amount > rewardPoints}
                            className="p-3 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-xl font-bold hover:from-purple-500 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed disabled:transform-none"
                          >
                            {amount}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSpendOnStore}
                        disabled={!spendAmount || parseInt(spendAmount) > rewardPoints || isProcessing}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                      >
                        {isProcessing ? '⏳ جاري الشراء...' : '🛒 شراء الآن'}
                      </button>
                      <button
                        onClick={() => setShowStoreModal(false)}
                        disabled={isProcessing}
                        className="flex-1 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold py-4 rounded-xl transition-all duration-300 border border-white/30"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RewardSystem; 