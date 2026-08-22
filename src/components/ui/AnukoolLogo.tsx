'use client';

import React from 'react';
import Link from 'next/link';

interface AnukoolLogoProps {
  className?: string;
  showBadge?: boolean;
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

export function AnukoolLogo({
  className = '',
  showBadge = true,
  size = 'md',
  href = '/'
}: AnukoolLogoProps) {
  const iconSizes = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-9 h-9 sm:w-10 sm:h-10 rounded-[14px]',
    lg: 'w-12 h-12 rounded-2xl'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-2xl'
  };

  const Content = (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}>
      
      {/* Sleek Gradient Emblem with Geometric Adaptive 'A' Symbol */}
      <div 
        className={`${iconSizes[size]} bg-gradient-to-br from-[#1E3A2F] via-[#163529] to-[#0D241B] text-white flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all duration-300 relative overflow-hidden border border-emerald-500/30 shrink-0`}
      >
        {/* Subtle Ambient Light Sheen */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/15 to-transparent pointer-events-none" />
        
        {/* Elegant Geometric Vector Icon */}
        <svg 
          viewBox="0 0 32 32" 
          fill="none" 
          className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-300 drop-shadow-xs"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stylized Modern Letter A / Vision Arch */}
          <path 
            d="M16 5L8 23H12L13.8 19H18.2L20 23H24L16 5Z" 
            fill="currentColor" 
            fillOpacity="0.95"
          />
          {/* Inner Triangle Opening */}
          <polygon 
            points="16,10 14.3,16 17.7,16" 
            fill="#122820" 
          />
          {/* Central Luminous Inclusive Core Sparkle */}
          <circle cx="16" cy="14" r="1.5" fill="#6EE7B7" />
          <path 
            d="M23 7L24 9.5L26.5 10.5L24 11.5L23 14L22 11.5L19.5 10.5L22 9.5L23 7Z" 
            fill="#FBBF24" 
          />
        </svg>
      </div>

      {/* Elegant Wordmark + Subtitle Badge */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`${textSizes[size]} font-black tracking-tight text-[#1E2024] dark:text-white leading-none group-hover:text-[#1E3A2F] dark:group-hover:text-emerald-400 transition-colors`}>
            ANUKOOL
          </span>
          {showBadge && (
            <span className="text-[9px] font-black uppercase tracking-[0.16em] px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-500/25 hidden sm:inline-block">
              Adaptive
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase mt-0.5 hidden xs:block">
          Digital Accessibility
        </span>
      </div>

    </div>
  );

  if (href) {
    return (
      <Link 
        href={href} 
        className="focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-2xl p-1"
        title="ANUKOOL — Digital Accessibility Platform"
      >
        {Content}
      </Link>
    );
  }

  return Content;
}
