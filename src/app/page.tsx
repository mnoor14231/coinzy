'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useSounds } from '@/hooks/useSounds';
import { Eye, EyeOff, Users, Baby } from 'lucide-react';

// Convert Arabic numbers to English
const convertArabicToEnglish = (str: string) => {
  const arabicNumbers = '٠١٢٣٤٥٦٧٨٩';
  const englishNumbers = '0123456789';
  
  return str.replace(/[٠-٩]/g, (char) => {
    const index = arabicNumbers.indexOf(char);
    return index !== -1 ? englishNumbers[index] : char;
  });
};

export default function HomePage() {
  const [selectedRole, setSelectedRole] = useState<'parent' | 'child' | null>(null);
  const [familyName, setFamilyName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuthStore();
  const { playSound } = useSounds();
  const router = useRouter();

  const handleRoleSelect = (role: 'parent' | 'child') => {
    playSound('click');
    setSelectedRole(role);
    setError('');
    setPassword('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole || !familyName.trim() || !password.trim()) {
      setError('يرجى ملء جميع الحقول');
      playSound('error');
      return;
    }

    setIsLoading(true);
    setError('');

    // Convert Arabic numbers to English before login
    const convertedPassword = convertArabicToEnglish(password.trim());

    // Simulate loading for better UX
    setTimeout(() => {
      const success = login(familyName.trim(), convertedPassword, selectedRole);
      
      if (success) {
        playSound('success');
        if (selectedRole === 'parent') {
          router.push('/parent');
        } else {
          router.push('/lessons'); // Redirect to lessons page
        }
      } else {
        setError(selectedRole === 'parent' ? 
          'اسم العائلة أو كلمة مرور الوالدين غير صحيحة' : 
          'اسم العائلة أو كلمة مرور الطفل غير صحيحة'
        );
        playSound('error');
      }
      setIsLoading(false);
    }, 800);
  };

  const exampleFamilies = [
    { name: 'حكيم', parentPass: '12', childPass: '123' },
    { name: 'أحمد', parentPass: 'parent123', childPass: 'child123' },
    { name: 'سارة', parentPass: 'mama456', childPass: 'sara456' }
  ];

  return (
    <div className="min-h-screen p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed top-10 left-10 w-20 h-20 bg-yellow-300/40 rounded-full blur-2xl animate-pulse" />
      <div className="fixed top-32 right-10 w-16 h-16 bg-pink-300/40 rounded-full blur-2xl animate-pulse delay-1000" />
      <div className="fixed bottom-32 left-5 w-12 h-12 bg-blue-300/40 rounded-full blur-2xl animate-pulse delay-2000" />
      <div className="fixed bottom-20 right-8 w-14 h-14 bg-purple-300/40 rounded-full blur-2xl animate-pulse delay-500" />

      <div className="max-w-md mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="text-center py-8">
          <div className="relative mb-6">
            <div className="absolute left-1/2 top-6 -translate-x-1/2 w-32 h-32 bg-yellow-300/60 blur-2xl z-0" />
            <div className="text-8xl mb-4 animate-bounce relative z-10 drop-shadow-[0_4px_32px_rgba(251,191,36,0.7)]">🪙</div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 text-2xl animate-pulse z-10 text-yellow-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.7)]">✨</div>
            <div className="absolute bottom-0 right-1/3 text-xl animate-pulse delay-500 z-10 text-pink-400 drop-shadow-[0_2px_8px_rgba(236,72,153,0.7)]">🌟</div>
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-4 drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)]">
            مرحباً بك في <span className="gradient-text drop-shadow-[0_2px_12px_rgba(168,85,247,0.7)]">كوينزي!</span>
          </h1>
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/40 mx-4">
            <p className="text-purple-700 text-lg mb-2 font-bold">🎓 الكورس المالي للأطفال</p>
            <p className="text-purple-600 text-sm font-semibold">تعلم إدارة المال بطريقة ممتعة وآمنة</p>
            <div className="flex justify-center gap-2 mt-3">
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow">٤-٥ سنوات</span>
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow">٦-٧ سنوات</span>
              <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow">٨-٩ سنوات</span>
            </div>
          </div>
        </div>

        {/* Role Selection */}
        {!selectedRole && (
          <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
            <h2 className="text-2xl font-bold text-purple-700 drop-shadow-[0_2px_8px_rgba(168,85,247,0.5)] text-center mb-6">من أنت؟</h2>
            
            <div className="space-y-4">
              {/* Parent Option */}
              <button
                onClick={() => handleRoleSelect('parent')}
                className="w-full card hover:scale-105 transition-all duration-300 sparkle pulse-glow"
              >
                <div className="flex items-center gap-6 p-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl text-white">
                    <Users size={32} />
                  </div>
                  <div className="flex-1 text-right">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">👨‍👩‍👧‍👦 الوالدين</h3>
                    <p className="text-gray-600">
                      مراقبة تقدم الأطفال وإدارة الحساب
                    </p>
                  </div>
                  <div className="text-4xl emoji-bounce">→</div>
                </div>
              </button>

              {/* Child Option */}
              <button
                onClick={() => handleRoleSelect('child')}
                className="w-full card hover:scale-105 transition-all duration-300 sparkle pulse-glow"
              >
                <div className="flex items-center gap-6 p-6">
                  <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-4 rounded-2xl text-white">
                    <Baby size={32} />
                  </div>
                  <div className="flex-1 text-right">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">🧒 الأطفال</h3>
                    <p className="text-gray-600">
                      تعلم إدارة المال بطريقة ممتعة ومشوقة
                    </p>
                  </div>
                  <div className="text-4xl emoji-bounce">→</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Login Form */}
        {selectedRole && (
          <div className="animate-in slide-in-from-right duration-500">
            <div className="card sparkle">
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">
                  {selectedRole === 'parent' ? '👨‍👩‍👧‍👦' : '🧒'}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  تسجيل الدخول - {selectedRole === 'parent' ? 'الوالدين' : 'الأطفال'}
                </h2>
                <p className="text-gray-600">
                  {selectedRole === 'parent' 
                    ? 'أدخل بيانات العائلة وكلمة مرور الوالدين'
                    : 'أدخل بيانات العائلة وكلمة مرور الطفل'
                  }
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                {/* Family Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    اسم العائلة
                  </label>
                  <input
                    type="text"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-400 focus:outline-none text-lg font-medium"
                    placeholder="مثال: حكيم"
                    dir="rtl"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-400 focus:outline-none text-lg font-medium pr-12 text-right"
                      placeholder={selectedRole === 'parent' ? 'كلمة مرور الوالدين' : 'كلمة مرور الطفل'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    💡 يمكنك استخدام الأرقام العربية (١٢٣) أو الإنجليزية (123)
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-100 border-2 border-red-300 rounded-2xl text-red-800 text-center font-medium animate-shake">
                    {error}
                  </div>
                )}

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full btn-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      جاري تسجيل الدخول...
                    </div>
                  ) : (
                    `🚀 دخول ${selectedRole === 'parent' ? 'الوالدين' : 'الأطفال'}`
                  )}
                </button>

                {/* Back Button */}
                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="w-full py-3 px-6 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition-colors"
                >
                  ← العودة للخلف
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Example Families */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
            🔍 أمثلة للتجربة
          </h3>
          <div className="space-y-3">
            {exampleFamilies.map((family, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-xl">
                <div className="font-bold text-gray-800 mb-2">عائلة {family.name}</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-blue-100 p-2 rounded-lg text-center">
                    <div className="font-medium text-blue-800">الوالدين</div>
                    <div className="text-blue-600">{family.parentPass}</div>
                  </div>
                  <div className="bg-pink-100 p-2 rounded-lg text-center">
                    <div className="font-medium text-pink-800">الأطفال</div>
                    <div className="text-pink-600">{family.childPass}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Welcome Message */}
        <div className="text-center bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-2xl">
          <div className="text-4xl mb-3 float-animation">✨</div>
          <h3 className="text-lg font-bold text-purple-800 mb-2">
            مرحباً بك في كوينزي!
          </h3>
          <p className="text-purple-600 text-sm">
            تطبيق تعليم إدارة المال للأطفال بطريقة ممتعة وتفاعلية مع القصص المشوقة
          </p>
        </div>
      </div>
    </div>
  );
}
