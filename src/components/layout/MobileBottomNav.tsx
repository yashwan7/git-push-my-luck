'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Layers, Wallet, ShieldCheck, Headphones, Mic } from 'lucide-react';
import { useVoice } from '@/context/VoiceContext';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { setIsAssistantModalOpen } = useVoice();

  // Hide on login screen
  if (pathname === '/login') {
    return null;
  }

  const navItems = [
    {
      href: '/',
      label: 'Home',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      href: '/services',
      label: 'Services',
      icon: Layers,
      isActive: pathname.startsWith('/services'),
    },
    {
      href: '/banking',
      label: 'Banking',
      icon: Wallet,
      isActive: pathname.startsWith('/banking'),
    },
    {
      href: '/safety',
      label: 'Safety',
      icon: ShieldCheck,
      isActive: pathname.startsWith('/safety'),
    },
    {
      href: '/emergency',
      label: 'Support',
      icon: Headphones,
      isActive: pathname.startsWith('/emergency'),
    },
  ];

  return (
    <nav 
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#13241D]/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-emerald-900/40 shadow-2xl safe-area-pb"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around px-2 py-1.5 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-200 active:scale-95 cursor-pointer min-w-[56px] ${
                item.isActive
                  ? 'text-emerald-700 dark:text-emerald-300 font-extrabold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                item.isActive 
                  ? 'bg-emerald-100 dark:bg-emerald-900/60 shadow-xs scale-105' 
                  : ''
              }`}>
                <Icon className={`w-4.5 h-4.5 ${item.isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Quick Voice Assistant Mic trigger on mobile */}
        <button
          onClick={() => setIsAssistantModalOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-2xl text-[#1E3A2F] dark:text-emerald-300 active:scale-95 cursor-pointer"
          title="Voice AI"
          aria-label="Open Voice AI Assistant"
        >
          <div className="w-8 h-8 rounded-xl bg-[#1E3A2F] dark:bg-emerald-600 text-white flex items-center justify-center shadow-md">
            <Mic className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold tracking-tight mt-0.5 leading-none">
            Voice
          </span>
        </button>
      </div>
    </nav>
  );
}
