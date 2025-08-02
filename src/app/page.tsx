'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useSounds } from '@/hooks/useSounds';
import { Eye, EyeOff, Users, Baby, Sparkles, Star, Zap } from 'lucide-react';
import Image from 'next/image';

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
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [logoPosition, setLogoPosition] = useState<'center' | 'final'>('center');
  const [showUsernameHint, setShowUsernameHint] = useState(false);
  const [showPasswordHint, setShowPasswordHint] = useState(false);

  const { login } = useAuthStore();
  const { playSound } = useSounds();
  const router = useRouter();

  useEffect(() => {
    // Logo appears first in center
    setTimeout(() => setIsPageLoaded(true), 100);
    // Logo moves to final position after 3D circles
    setTimeout(() => setLogoPosition('final'), 2000);
    // Content appears after logo animation
    setTimeout(() => setShowContent(true), 3500);
  }, []);

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
    <div className="min-h-screen relative overflow-hidden">
      {/* Bright Modern Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-white via-blue-50 to-indigo-100">
        {/* Bright animated shapes */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-300/40 rounded-full blur-xl animate-pulse" />
          <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-300/40 rounded-full blur-xl animate-pulse delay-1000" />
          <div className="absolute bottom-40 left-20 w-28 h-28 bg-purple-300/40 rounded-full blur-xl animate-pulse delay-2000" />
          <div className="absolute bottom-20 right-10 w-20 h-20 bg-cyan-300/40 rounded-full blur-xl animate-pulse delay-500" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-sky-300/40 rounded-full blur-xl animate-pulse delay-1500" />
          <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-blue-300/40 rounded-full blur-xl animate-pulse delay-3000" />
        </div>
        
        {/* Static Coins Background - Only show with content */}
        {showContent && (
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  transform: `scale(${0.3 + Math.random() * 0.7})`
                }}
              >
                <div className="relative">
                  {/* Coin Body */}
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg border-2 border-yellow-300 flex items-center justify-center">
                    {/* Coin Face */}
                    <div className="w-6 h-6 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-yellow-800 text-xs font-bold">$</span>
                    </div>
                  </div>
                  {/* Coin Shine */}
                  <div className="absolute top-1 left-1 w-2 h-2 bg-white/60 rounded-full blur-sm"></div>
                </div>
              </div>
            ))}
            
            {/* Larger Static Coins */}
            {[...Array(6)].map((_, i) => (
              <div
                key={`large-${i}`}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  transform: `scale(${0.8 + Math.random() * 0.4})`
                }}
              >
                <div className="relative">
                  {/* Large Coin Body */}
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-xl border-2 border-yellow-300 flex items-center justify-center">
                    {/* Large Coin Face */}
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-yellow-800 text-lg font-bold">$</span>
                    </div>
                  </div>
                  {/* Large Coin Shine */}
                  <div className="absolute top-2 left-2 w-3 h-3 bg-white/70 rounded-full blur-sm"></div>
                </div>
              </div>
            ))}
            
            {/* Static Small Coins */}
            {[...Array(8)].map((_, i) => (
              <div
                key={`sparkle-${i}`}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
              >
                <div className="w-4 h-4 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full shadow-md border border-yellow-200 flex items-center justify-center">
                  <span className="text-yellow-700 text-xs font-bold">¢</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Animated Logo - Disappears when content shows */}
      {!showContent && (
        <div className={`relative z-10 min-h-screen flex items-center justify-center transition-all duration-2000 ease-out ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0'}`}>
          {/* Logo Section */}
          <div className={`relative transition-all duration-2000 ease-out ${
            logoPosition === 'final' ? 'transform-none' : 'transform translate-y-48'
          }`}>
            <div className={`relative w-64 h-64 transition-all duration-4000 ease-out ${
              isPageLoaded 
                ? 'opacity-100' 
                : 'opacity-0 scale-95'
            } ${
              logoPosition === 'center' && isPageLoaded 
                ? 'animate-3d-circle-center scale-200' 
                : ''
            } ${
              logoPosition === 'final' 
                ? 'animate-3d-circle-final scale-100' 
                : ''
            }`}>
              <Image
                src="/coinzyLogo.png"
                alt="Coinzy Logo"
                width={256}
                height={256}
                className="w-full h-full object-contain relative z-10"
              />
            </div>
          </div>
        </div>
      )}

      {/* Content Container - Only shown after logo animation */}
      {showContent && (
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4 transition-all duration-2000 ease-out">
          <div className="max-w-md w-full space-y-8">
            
            {/* Enhanced Header with Logo */}
            <div className="text-center space-y-6">
              {/* Logo Section */}
              <div className="relative mb-4">
                <div className="relative w-64 h-64 mx-auto mb-3">
                  <Image
                    src="/coinzyLogo.png"
                    alt="Coinzy Logo"
                    width={256}
                    height={256}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-gray-100 shadow-2xl">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-blue-600 animate-pulse" />
                    <h2 className="text-xl font-bold text-gray-900">التعليم المالي للأطفال</h2>
                    <Zap className="w-5 h-5 text-blue-600 animate-pulse" />
                  </div>
                  <p className="text-gray-700 text-sm mb-4">تعلم إدارة المال بطريقة ممتعة وآمنة</p>
                  <div className="flex justify-center gap-2">
                    <span className="bg-blue-50 text-blue-800 text-xs px-3 py-1 rounded-full font-bold border border-blue-300">٤-٥ سنوات</span>
                    <span className="bg-indigo-50 text-indigo-800 text-xs px-3 py-1 rounded-full font-bold border border-indigo-300">٦-٧ سنوات</span>
                    <span className="bg-purple-50 text-purple-800 text-xs px-3 py-1 rounded-full font-bold border border-purple-300">٨-٩ سنوات</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Role Selection */}
            {!selectedRole && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
                  من أنت؟
                </h2>
                
                <div className="space-y-4">
                  {/* Parent Option */}
                  <button
                    onClick={() => handleRoleSelect('parent')}
                    className="w-full group relative overflow-hidden"
                  >
                    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-gray-100 shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:border-blue-400 group-hover:shadow-3xl">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
                            <Users className="w-8 h-8 text-white" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
                        </div>
                        <div className="flex-1 text-right">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                            👨‍👩‍👧‍👦 الوالدين
                          </h3>
                          <p className="text-gray-700 text-sm">
                            مراقبة تقدم الأطفال وإدارة الحساب
                          </p>
                        </div>
                        <div className="text-3xl text-gray-500 group-hover:text-blue-600 transition-colors animate-pulse">
                          →
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Child Option */}
                  <button
                    onClick={() => handleRoleSelect('child')}
                    className="w-full group relative overflow-hidden"
                  >
                    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-gray-100 shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:border-purple-400 group-hover:shadow-3xl">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <Baby className="w-8 h-8 text-white" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full animate-pulse" />
                        </div>
                        <div className="flex-1 text-right">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
                            🧒 الأطفال
                          </h3>
                          <p className="text-gray-700 text-sm">
                            تعلم إدارة المال بطريقة ممتعة ومشوقة
                          </p>
                        </div>
                        <div className="text-3xl text-gray-500 group-hover:text-purple-600 transition-colors animate-pulse">
                          →
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Login Form */}
            {selectedRole && (
              <div className="transition-all duration-1000 ease-out">
                <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 border border-gray-100 shadow-2xl">
                  <div className="text-center mb-8">
                    <div className="text-6xl mb-4 animate-bounce">
                      {selectedRole === 'parent' ? '👨‍👩‍👧‍👦' : '🧒'}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      تسجيل الدخول - {selectedRole === 'parent' ? 'الوالدين' : 'الأطفال'}
                    </h2>
                    <p className="text-gray-700">
                      {selectedRole === 'parent' 
                        ? 'أدخل بيانات العائلة وكلمة مرور الوالدين'
                        : 'أدخل بيانات العائلة وكلمة مرور الطفل'
                      }
                    </p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-6">
                    {/* Family Name */}
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3">
                        اسم العائلة
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={familyName}
                          onChange={(e) => setFamilyName(e.target.value)}
                          onFocus={() => setShowUsernameHint(true)}
                          onBlur={() => setTimeout(() => setShowUsernameHint(false), 200)}
                          className="w-full p-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none text-gray-900 placeholder-gray-600 text-lg font-medium transition-all duration-300"
                          placeholder="اكتب حكيم"
                          dir="rtl"
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                          🏠
                        </div>
                        
                        {/* Username Hint Popup */}
                        {showUsernameHint && (
                          <div className="absolute bottom-full left-0 right-0 mb-2 bg-blue-500 text-white p-3 rounded-xl shadow-lg z-[9999] animate-fadeIn">
                            <div className="text-center font-bold text-sm">
                              💡 اسم العائلة: <span className="bg-white text-blue-500 px-2 py-1 rounded">حكيم</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setFamilyName('حكيم');
                                setShowUsernameHint(false);
                              }}
                              className="w-full mt-2 bg-white text-blue-500 py-1 px-3 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors"
                            >
                              استخدم هذا الاسم
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3">
                        كلمة المرور
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={() => setShowPasswordHint(true)}
                          onBlur={() => setTimeout(() => setShowPasswordHint(false), 200)}
                          className="w-full p-4 pr-12 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none text-gray-900 placeholder-gray-600 text-lg font-medium text-right transition-all duration-300"
                          placeholder={selectedRole === 'parent' ? '12 كلمة مرور الوالدين' : '123 كلمة مرور الطفل'}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                        
                        {/* Password Hint Popup */}
                        {showPasswordHint && selectedRole && (
                          <div className="absolute bottom-full left-0 right-0 mb-2 bg-green-500 text-white p-3 rounded-xl shadow-lg z-[9999] animate-fadeIn">
                            <div className="text-center font-bold text-sm">
                              🔑 كلمة المرور: <span className="bg-white text-green-500 px-2 py-1 rounded">
                                {selectedRole === 'parent' ? '12' : '123'}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setPassword(selectedRole === 'parent' ? '12' : '123');
                                setShowPasswordHint(false);
                              }}
                              className="w-full mt-2 bg-white text-green-500 py-1 px-3 rounded-lg text-sm font-bold hover:bg-green-50 transition-colors"
                            >
                              استخدم كلمة المرور هذه
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        💡 يمكنك استخدام الأرقام العربية (١٢٣) أو الإنجليزية (123)
                      </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="p-4 bg-red-50 border border-red-300 rounded-2xl text-red-800 text-center font-medium animate-shake">
                        {error}
                      </div>
                    )}

                    {/* Login Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg ${isLoading ? 'opacity-50' : ''}`}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          جاري تسجيل الدخول...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-xl">🚀</span>
                          دخول {selectedRole === 'parent' ? 'الوالدين' : 'الأطفال'}
                        </div>
                      )}
                    </button>

                    {/* Back Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedRole(null)}
                      className="w-full py-3 px-6 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all duration-300 border border-gray-200"
                    >
                      ← العودة للخلف
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Example Families */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-gray-100 shadow-2xl">
              <h3 className="text-lg font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                أمثلة للتجربة
                <Sparkles className="w-5 h-5 text-blue-600" />
              </h3>
              <div className="space-y-4">
                {exampleFamilies.map((family, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 hover:bg-gray-100 transition-all duration-300">
                    <div className="font-bold text-gray-900 mb-3 text-center">عائلة {family.name}</div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-blue-50 p-3 rounded-xl text-center border border-blue-300">
                        <div className="font-medium text-blue-800">الوالدين</div>
                        <div className="text-blue-700 font-bold">{family.parentPass}</div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-xl text-center border border-purple-300">
                        <div className="font-medium text-purple-800">الأطفال</div>
                        <div className="text-purple-700 font-bold">{family.childPass}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Welcome Message */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-gray-100 shadow-2xl text-center">
              <div className="text-4xl mb-4 animate-bounce">✨</div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                مرحباً بك في كوينزي!
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                تطبيق تعليم إدارة المال للأطفال بطريقة ممتعة وتفاعلية مع القصص المشوقة والألعاب التعليمية
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
