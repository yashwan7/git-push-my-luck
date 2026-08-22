'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccessibility } from '@/context/AccessibilityContext';
import { useAuth } from '@/context/AuthContext';
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
  Check,
  LogIn,
  LogOut,
  User as UserIcon,
  Lock,
  Bell
} from 'lucide-react';

import { ThemeSelector } from '@/components/ui/ThemeSelector';
import { AnukoolLogo } from '@/components/ui/AnukoolLogo';
import { TransactionLimitSettingsModal } from '@/components/banking/TransactionLimitSettingsModal';
import { DocumentAssistModal } from '@/components/anukool/DocumentAssistModal';
import { Camera } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { profile, updateProfileKey, activePersonaName, resetProfile } = useAccessibility();
  const { user, profile: authProfile, isAuthenticated, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuickPanelOpen, setIsQuickPanelOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isDocumentAssistOpen, setIsDocumentAssistOpen] = useState(false);
  const [userLimit, setUserLimit] = useState(5000);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nayan_transaction_limit');
      if (stored) {
        const num = Number(stored);
        if (!isNaN(num) && num > 0) setUserLimit(num);
      }
    } catch (e) {}
  }, [isQuickPanelOpen, isSecurityModalOpen]);

  const handleSaveUserLimit = (newLimit: number) => {
    setUserLimit(newLimit);
    try {
      localStorage.setItem('nayan_transaction_limit', String(newLimit));
    } catch (e) {}
  };

  // If on login page, render minimal clean top banner
  if (pathname === '/login') {
    return null;
  }

  const t = (key: string, fallback?: string) => getTranslation(profile.language, key, fallback);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#18191D]/90 backdrop-blur-md transition-all shadow-xs">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Elegant Brand Logo Mark & Name */}
          <div className="flex items-center">
            <AnukoolLogo size="md" />
          </div>

          {/* Clean Right Controls (Theme, Active Profile, Language, User Avatar) */}
          <div className="flex items-center gap-2 sm:gap-2.5">

            {/* Dark / Light Theme Selector */}
            <div className="block">
              <ThemeSelector variant="compact" />
            </div>

            {/* Active Profile Pill & Persona Change Feature */}
            <button
              onClick={() => setIsQuickPanelOpen(!isQuickPanelOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-[#1E2024] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs cursor-pointer"
              aria-label="Open Accessibility Profile Settings"
              title="Active Accessibility Profile (Click to change)"
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>
                {activePersonaName ? activePersonaName : t('activeProfile', 'Active Profile')}
              </span>
            </button>

            {/* Clean Language Selector */}
            <div className="relative hidden md:block">
              <select
                value={profile.language}
                onChange={(e) => updateProfileKey('language', e.target.value as SupportedLanguage)}
                className="appearance-none pl-3 pr-7 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-[#1E2024] dark:text-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-2xs"
                aria-label="Select Language"
              >
                {Object.entries(LANGUAGE_NAMES).map(([code, lang]) => (
                  <option key={code} value={code} className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-white">
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
              <Languages className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Notification Bell with Red Badge */}
            <Link
              href="/audit"
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 relative transition-colors"
              title="Notifications"
            >
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-zinc-900" />
              <Bell className="w-4 h-4" />
            </Link>

            {/* Clean User Profile Avatar & Sign In / Sign Out */}
            {isAuthenticated && authProfile ? (
              <div className="flex items-center gap-1.5 pl-1 border-l border-slate-200 dark:border-white/10">
                <div 
                  className="flex items-center gap-2 px-2 py-1 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 shadow-2xs"
                  title={authProfile.email}
                >
                  {authProfile.avatarUrl ? (
                    <img 
                      src={authProfile.avatarUrl} 
                      alt={authProfile.fullName || 'User'} 
                      className="w-6 h-6 rounded-full object-cover" 
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#1E3A2F] text-white flex items-center justify-center font-bold text-[11px]">
                      {(authProfile.fullName || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 hidden xl:inline max-w-[90px] truncate">
                    {authProfile.fullName || 'User'}
                  </span>
                </div>

                <button
                  onClick={() => signOut()}
                  className="p-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-500 transition-colors"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1E3A2F] hover:bg-[#25493B] text-white font-bold text-xs transition-all shadow-xs focus:ring-2 focus:ring-emerald-500"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-300" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Accessibility Adjustments Drawer */}
      {isQuickPanelOpen && (
        <div className="border-t border-[var(--border-color)] bg-[var(--bg-surface)] p-4 sm:p-6 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            
            {/* Appearance Theme Selector */}
            <div>
              <label className="block text-acc-xs font-bold text-[var(--text-primary)] mb-2">
                Appearance Theme
              </label>
              <ThemeSelector variant="full" className="w-full justify-between" />
            </div>

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
                    {t('focusMode', '1 Step / Screen')}
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

            {/* Reset / Security Actions */}
            <div className="flex flex-col justify-end gap-2">
              <button
                onClick={() => {
                  setIsSecurityModalOpen(true);
                  setIsQuickPanelOpen(false);
                }}
                className="w-full py-2 bg-amber-600/10 hover:bg-amber-600/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-acc-xs font-bold text-center rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Security: Warning Limit (₹{userLimit.toLocaleString('en-IN')})</span>
              </button>
              <Link
                href="/onboarding"
                onClick={() => setIsQuickPanelOpen(false)}
                className="w-full py-2 bg-civic-navy text-white text-acc-xs font-bold text-center rounded-lg hover:bg-slate-800 transition-colors"
              >
                {t('reconfigureProfile', 'Full Profile Settings →')}
              </Link>
              <button
                onClick={resetProfile}
                className="w-full py-1 text-acc-xs text-[var(--text-secondary)] hover:underline"
              >
                {t('resetDefaults', 'Reset Defaults')}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-4 space-y-3">
          <div className="pb-2 border-b border-[var(--border-color)] flex items-center justify-between">
            <span className="text-acc-xs font-bold text-[var(--text-primary)]">Theme</span>
            <ThemeSelector variant="full" />
          </div>
          <div className="pt-2">
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

      {/* Security Warning Limit Modal */}
      <TransactionLimitSettingsModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        currentLimit={userLimit}
        onSaveLimit={handleSaveUserLimit}
        language={profile.language}
      />

      {/* Flagship: Document Snap-to-Form Intelligence Modal */}
      <DocumentAssistModal
        isOpen={isDocumentAssistOpen}
        onClose={() => setIsDocumentAssistOpen(false)}
      />
    </header>
  );
}
