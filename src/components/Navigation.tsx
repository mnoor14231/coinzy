'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { BookOpen, Target, PiggyBank, Trophy, Users } from 'lucide-react';

const Navigation: React.FC = () => {
  const pathname = usePathname();
  const { currentUser } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after client mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render anything during SSR to prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  // Don't show navigation if user is not authenticated
  if (!currentUser) {
    return null;
  }

  const navItems = [
    { href: '/lessons', icon: BookOpen, label: 'القصص', emoji: '📚', color: 'from-blue-500 to-cyan-500', roles: ['child'] },
    { href: '/missions', icon: Target, label: 'المهام', emoji: '🎯', color: 'from-green-500 to-emerald-500', roles: ['child'] },
    { href: '/bank', icon: PiggyBank, label: 'البنك', emoji: '🏦', color: 'from-pink-500 to-rose-500', roles: ['child'] },
    { href: '/progress', icon: Trophy, label: 'التقدم', emoji: '🏆', color: 'from-purple-500 to-violet-500', roles: ['child'] },
    { href: '/parent', icon: Users, label: 'العائلة', emoji: '👨‍👩‍👧‍👦', color: 'from-orange-500 to-amber-500', roles: ['parent'] }
  ];

  // Filter nav items based on user role
  const availableNavItems = navItems.filter(item => 
    item.roles.includes(currentUser.role)
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-white/80 backdrop-blur-lg border-t-2 border-white/20 shadow-2xl" />
      <div className="relative max-w-md mx-auto px-4 py-3">
        <div className="flex justify-around items-center">
          {availableNavItems.map((item, index) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center py-2 px-3 rounded-2xl transition-all duration-300 transform group ${
                  isActive ? 'scale-110 -translate-y-2' : 'hover:scale-105 active:scale-95'
                }`}
              >
                {isActive && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-2xl shadow-xl pulse-glow`} />
                )}
                <div className={`relative p-2 rounded-xl transition-all duration-300 ${
                  isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'
                }`}>
                  <div className={`text-2xl mb-1 ${isActive ? 'emoji-bounce' : 'group-hover:animate-bounce'}`}>
                    {item.emoji}
                  </div>
                  <Icon className={`absolute inset-0 w-full h-full p-1 opacity-20 transition-opacity duration-300 ${
                    isActive ? 'opacity-30' : 'group-hover:opacity-40'
                  }`} />
                </div>
                <span className={`text-xs font-bold mt-1 text-center transition-all duration-300 ${
                  isActive ? 'text-white drop-shadow-sm' : 'text-gray-700 group-hover:text-gray-900'
                }`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                    <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                    <div className="absolute inset-0 w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
                <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                  !isActive ? 'group-hover:bg-gray-100/50 group-active:bg-gray-200/70' : ''
                }`} />
              </Link>
            );
          })}
        </div>
        
        {/* User indicator */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
          <div className="w-12 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60" />
        </div>
        
        {/* Family name indicator */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-md">
            <span className="text-xs font-bold text-gray-700">
              {currentUser.role === 'parent' ? '👨‍👩‍👧‍👦' : '🧒'} {currentUser.familyName}
            </span>
          </div>
        </div>
      </div>
      <div className="h-safe-area-inset-bottom bg-white/80 backdrop-blur-lg" />
    </nav>
  );
};

export default Navigation; 