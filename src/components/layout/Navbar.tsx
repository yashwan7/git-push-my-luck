'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccessibility } from '@/context/AccessibilityContext';
import { getTranslation, LANGUAGE_NAMES } from '@/lib/multilingualEngine';
import { SupportedLanguage, TextSize, ContrastTheme } from '@/types';
import { 
  Eye, 
  BrainCircuit, 
  Hand, 
  Volume2, 
  Sparkles, 
  Languages, 
  Sliders, 
  AlertTriangle,
  Menu,
  X,
  Check
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { profile, updateProfileKey, activePersonaName, resetProfile } = useAccessibility();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuickPanelOpen, setIsQuickPanelOpen] = useState(false);

  const t = (key: string, fallback?: string) => getTranslation(profile.language, key, fallback);

  const navLinks = [
    { href: '/', label: t('home', 'Home') },
    { href: '/banking', label: 'Banking (Demo)' },
    { href: '/dashboard', label: t('services', 'Services') },
    { href: '/audit', label: t('auditService', 'Audit a Service') },
    { href: '/provider', label: t('providerMode', 'Provider Mode') },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-color)] bg-[var(--bg-surface)] transition-colors shadow-sm">
      {/* Top Civic Authority Notice Bar */}
      <div className="bg-[var(--text-primary)] text-[var(--bg-primary)] px-4 py-1 text-acc-xs text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-civic-green animate-pulse" />
        {t('civicBanner')}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-civic-blue rounded-md px-2 py-1">
              <div className="w-10 h-10 rounded-lg bg-civic-navy text-white flex items-center justify-center font-bold text-acc-xl tracking-tighter border border-civic-blue shadow-sm">
                N
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-acc-xl tracking-tight text-[var(--text-primary)] flex items-center gap-2">
                  {t('appName')}
                  <span className="text-acc-xs font-semibold px-2 py-0.5 rounded bg-civic-blue/10 text-civic-blue border border-civic-blue/20">
                    {t('adaptiveBadge', 'ADAPTIVE')}
                  </span>
                </span>
                <span className="text-acc-xs text-[var(--text-secondary)] hidden md:inline">
                  {t('digitalInclusionLayer', 'Digital Inclusion Layer')}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg font-medium text-acc-xs transition-all duration-300 relative overflow-hidden border ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-900 to-indigo-900 text-white border-blue-400/80 shadow-md'
                      : 'border-white/20 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-slate-200 hover:border-white/60 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Accessibility Quick Controls & Emergency Action */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Quick Profile Toggle Modal Button */}
            <button
              onClick={() => setIsQuickPanelOpen(!isQuickPanelOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-civic-blue focus:outline-none focus:ring-2 focus:ring-civic-blue transition-all"
              aria-label="Open Quick Accessibility Settings"
            >
              <Sliders className="w-4 h-4 text-civic-blue" />
              <span className="text-acc-xs font-semibold hidden sm:inline">
                {activePersonaName ? activePersonaName : t('activeProfile')}
              </span>
            </button>

            {/* Language Quick Dropdown */}
            <div className="relative hidden sm:block">
              <select
                value={profile.language}
                onChange={(e) => updateProfileKey('language', e.target.value as SupportedLanguage)}
                className="appearance-none px-3 py-2 pr-8 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] text-acc-xs font-medium focus:outline-none focus:ring-2 focus:ring-civic-blue cursor-pointer"
                aria-label="Select Language"
              >
                {Object.entries(LANGUAGE_NAMES).map(([code, lang]) => (
                  <option key={code} value={code}>
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
              <Languages className="w-3.5 h-3.5 text-[var(--text-secondary)] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Emergency "I Need Help" Button */}
            <Link
              href="/emergency"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-civic-red text-white font-bold text-acc-xs hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 shadow-sm"
              aria-label="Emergency Help Screen"
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">{t('help', 'Help')}</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[var(--text-primary)] hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-civic-blue"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Accessibility Adjustments Drawer */}
      {isQuickPanelOpen && (
        <div className="border-t border-[var(--border-color)] bg-[var(--bg-surface)] p-4 sm:p-6 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Text Size Selector */}
            <div>
              <label className="block text-acc-xs font-bold text-[var(--text-primary)] mb-2">
                {t('textSize')}
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['normal', 'large', 'xlarge', 'xxlarge'] as TextSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => updateProfileKey('textSize', size)}
                    className={`py-1.5 text-acc-xs font-semibold rounded border transition-colors ${
                      profile.textSize === size
                        ? 'bg-civic-blue text-white border-civic-blue'
                        : 'border-[var(--border-color)] hover:bg-black/5'
                    }`}
                  >
                    {size === 'normal' ? '100%' : size === 'large' ? '125%' : size === 'xlarge' ? '150%' : '200%'}
                  </button>
                ))}
              </div>
            </div>

            {/* Contrast Theme Selector */}
            <div>
              <label className="block text-acc-xs font-bold text-[var(--text-primary)] mb-2">
                {t('contrast')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'standard', label: 'Standard' },
                  { key: 'high-contrast-dark', label: 'Dark High-Contrast' },
                  { key: 'high-contrast-light', label: 'Light High-Contrast' },
                  { key: 'warm-paper', label: 'Warm Paper' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => updateProfileKey('contrastTheme', item.key as ContrastTheme)}
                    className={`py-1.5 px-2 text-acc-xs font-medium rounded border text-left flex items-center justify-between ${
                      profile.contrastTheme === item.key
                        ? 'bg-civic-navy text-white border-civic-navy font-bold'
                        : 'border-[var(--border-color)] hover:bg-black/5'
                    }`}
                  >
                    <span>{item.label}</span>
                    {profile.contrastTheme === item.key && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Cognitive Step Wizard Toggle */}
            <div>
              <label className="block text-acc-xs font-bold text-[var(--text-primary)] mb-2">
                {t('interactionGuidance', 'Interaction Guidance')}
              </label>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => updateProfileKey('cognitiveLevel', profile.cognitiveLevel === 'step-by-step' ? 'standard' : 'step-by-step')}
                  className={`px-3 py-2 rounded border text-acc-xs font-semibold flex items-center justify-between ${
                    profile.cognitiveLevel === 'step-by-step'
                      ? 'bg-civic-blue text-white border-civic-blue'
                      : 'border-[var(--border-color)] text-[var(--text-primary)]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4" />
                    {t('focusMode', '1 Step / Screen (Focus Mode)')}
                  </span>
                  {profile.cognitiveLevel === 'step-by-step' && <Check className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => updateProfileKey('motionReduction', !profile.motionReduction)}
                  className={`px-3 py-1.5 rounded border text-acc-xs font-semibold flex items-center justify-between ${
                    profile.motionReduction
                      ? 'bg-civic-slate text-white border-civic-slate'
                      : 'border-[var(--border-color)] text-[var(--text-primary)]'
                  }`}
                >
                  <span>{t('reduceMotion', 'Reduce Motion')}</span>
                  {profile.motionReduction && <Check className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Reset / Preset Actions */}
            <div className="flex flex-col justify-end gap-2">
              <Link
                href="/onboarding"
                onClick={() => setIsQuickPanelOpen(false)}
                className="w-full py-2 bg-civic-navy text-white text-acc-xs font-bold text-center rounded-lg hover:bg-slate-800 transition-colors"
              >
                {t('reconfigureProfile', 'Re-configure Full Profile →')}
              </Link>
              <button
                onClick={resetProfile}
                className="w-full py-1 text-acc-xs text-[var(--text-secondary)] hover:underline"
              >
                {t('resetDefaults', 'Reset to Standard Defaults')}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md font-medium text-acc-base text-[var(--text-primary)] hover:bg-black/5"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-[var(--border-color)]">
            <label className="block text-acc-xs font-bold mb-1">{t('language')}</label>
            <select
              value={profile.language}
              onChange={(e) => updateProfileKey('language', e.target.value as SupportedLanguage)}
              className="w-full p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] text-acc-sm"
            >
              {Object.entries(LANGUAGE_NAMES).map(([code, lang]) => (
                <option key={code} value={code}>
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </header>
  );
}
