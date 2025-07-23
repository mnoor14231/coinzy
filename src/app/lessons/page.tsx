'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useCharacterStore } from '@/store/characterStore';
import LessonPage from '@/components/LessonPage';
import Navigation from '@/components/Navigation';
import AuthWrapper from '@/components/AuthWrapper';

export default function LessonsPage() {
  const { isAuthenticated, currentUser } = useAuthStore();
  const { selectedCharacter, getDefaultCharacter } = useCharacterStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Redirect non-authenticated users to home
    if (!isAuthenticated) {
      router.replace('/');
      return;
    }

    // Redirect parents to their dashboard
    if (currentUser?.role === 'parent') {
      router.replace('/parent');
      return;
    }

    // Auto-select character if none selected
    if (!selectedCharacter) {
      // Character should be auto-selected from store
      console.log('Character auto-selected:', getDefaultCharacter());
    }
  }, [isAuthenticated, currentUser, selectedCharacter, router, isMounted, getDefaultCharacter]);

  // Show loading during SSR and initial client load
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4 animate-bounce">🤖</div>
          <div className="text-xl font-bold">جاري التحميل<span className="loading-dots"></span></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4 animate-bounce">🏠</div>
          <div className="text-xl font-bold">جاري التوجيه للصفحة الرئيسية<span className="loading-dots"></span></div>
        </div>
      </div>
    );
  }

  // Redirect parents to parent dashboard
  if (currentUser?.role === 'parent') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4 animate-spin">🔄</div>
          <div className="text-xl font-bold">جاري التوجيه لوحة الوالدين<span className="loading-dots"></span></div>
        </div>
      </div>
    );
  }

  // Show content for authenticated children
  return (
    <AuthWrapper requiredRole="child">
      <div>
        <LessonPage />
        <Navigation />
      </div>
    </AuthWrapper>
  );
} 