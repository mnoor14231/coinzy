'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface AuthWrapperProps {
  children: React.ReactNode;
  requiredRole?: 'parent' | 'child' | 'any';
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children, requiredRole = 'any' }) => {
  const { isAuthenticated, currentUser } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch by only checking auth after client mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Allow access to home page without authentication
    if (pathname === '/home') {
      return;
    }

    // Redirect to home if not authenticated
    if (!isAuthenticated) {
      router.replace('/home');
      return;
    }

    // Check role-based access
    if (requiredRole !== 'any' && currentUser?.role !== requiredRole) {
      if (currentUser?.role === 'parent') {
        router.replace('/parent');
      } else {
        router.replace('/');
      }
      return;
    }
  }, [isAuthenticated, currentUser, requiredRole, router, pathname, isMounted]);

  // Show loading during SSR and initial client load
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4 animate-bounce">🪙</div>
          <div className="text-xl font-bold">جاري التحميل<span className="loading-dots"></span></div>
        </div>
      </div>
    );
  }

  // Show loading for non-home pages while checking auth
  if (pathname !== '/home' && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4 animate-bounce">🪙</div>
          <div className="text-xl font-bold">جاري التحميل<span className="loading-dots"></span></div>
        </div>
      </div>
    );
  }

  // Show loading for role mismatch
  if (pathname !== '/home' && requiredRole !== 'any' && currentUser?.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4 animate-spin">🔄</div>
          <div className="text-xl font-bold">جاري التوجيه<span className="loading-dots"></span></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthWrapper; 