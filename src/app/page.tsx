'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Eye, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Sun, 
  Moon, 
  Wallet, 
  Send, 
  Receipt, 
  LayoutGrid,
  Globe,
  Sparkles,
  CheckCircle2,
  Mic,
  Camera,
  FileText,
  Stethoscope,
  GraduationCap,
  CreditCard,
  Building2,
  Navigation
} from 'lucide-react';
import { useAccessibility } from '@/context/AccessibilityContext';
import { getTranslation, LANGUAGE_NAMES } from '@/lib/multilingualEngine';
import { SupportedLanguage } from '@/types';

export default function LandingPage() {
  const router = useRouter();
  const { profile, resolvedTheme, setThemeMode, updateProfileKey } = useAccessibility();

  const lang = profile.language;

  const t = (key: string, fallback: string) => {
    const dict: Record<string, Record<string, string>> = {
      kn: {
        eyebrow: 'ಮುನ್ನಡೆಯ ಸ್ಪಷ್ಟ ದಾರಿ',
        heroTitle: 'ಮುಖ್ಯ ಸೇವೆಗಳು, ಈಗ ಅತ್ಯಂತ ಸರಳ.',
        heroSubtitle: 'ಬ್ಯಾಂಕಿಂಗ್, ಪಿಂಚಣಿ ಮತ್ತು ಸರ್ಕಾರಿ ಸೇವೆಗಳನ್ನು ನಿಮ್ಮ ಸ್ವಂತ ಭಾಷೆಯಲ್ಲಿ, ಹಂತ-ಹಂತದ ಸುಲಭ ಮಾರ್ಗದರ್ಶನದೊಂದಿಗೆ ಪಡೆದುಕೊಳ್ಳಿ.',
        getStarted: 'ಪ್ರಾರಂಭಿಸಿ →',
        seeHowItWorks: 'ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ ನೋಡಿ',
        heroTagline: '✓ ಸರಳ. ಹಂತ-ಹಂತದ ಮಾರ್ಗದರ್ಶನ. ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ.',
        voicePrompt: 'ನಿಮಗೆ ಏನು ಸಹಾಯ ಬೇಕು?',
        voiceGuide: 'ಸಾಥಿ ಧ್ವನಿ ಮಾರ್ಗದರ್ಶಿ',
        voiceGuideMsg: 'ಈ ಹಂತದಲ್ಲಿ ನಾನು ನಿಮಗೆ ನೆರವಾಗುತ್ತೇನೆ.',
        docDetected: 'ದಾಖಲೆ ಪತ್ತೆಯಾಗಿದೆ',
        docDetectedMsg: 'ಹೆಸರು, ಜನ್ಮ ದಿನಾಂಕ ಹಾಗೂ ವಿಳಾಸ ಪರಿಶೀಲಿಸಲಾಗಿದೆ.',
        keyServicesTitle: 'ಪ್ರಮುಖ ನಾಗರಿಕ ಸೇವೆಗಳು',
        pensionTitle: 'ಮಾಸಿಕ ಪಿಂಚಣಿ ಮತ್ತು ರೇಷನ್',
        pensionDesc: 'ಖಾತೆಗೆ ನೇರ ಹಣ ವರ್ಗಾವಣೆ • ₹2,000 / ತಿಂಗಳು',
        scholarshipTitle: 'ಸರ್ಕಾರಿ ವಿದ್ಯಾರ್ಥಿವೇತನ',
        scholarshipDesc: 'ಅಂಕಪಟ್ಟಿ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
        emergencyTitle: 'ಆಸ್ಪತ್ರೆ ತುರ್ತು ದಾಖಲಾತಿ',
        emergencyDesc: 'ಲೈವ್ ಜಿಪಿಎಸ್ ಮಾರ್ಗ • 8 ನಿಮಿಷಗಳಲ್ಲಿ ಆರೈಕೆ',
        bankingTitle: 'ಸರಳ ಬ್ಯಾಂಕಿಂಗ್ ಮತ್ತು ಬಿಲ್‌ಗಳು',
        bankingDesc: 'ಬ್ಯಾಲೆನ್ಸ್ ಚೆಕ್, ಹಣ ಕಳುಹಿಸಿ ಮತ್ತು ಬಿಲ್ ಪಾವತಿಸಿ',
        sameServiceDiffExp: 'ಅದೇ ಸೇವೆ. ಸಂಪೂರ್ಣ ಹೊಸ ಅನುಭವ.',
        traditionalInterface: 'ಸಾಂಪ್ರದಾಯಿಕ ಸಂಕೀರ್ಣ ವೆಬ್‌ಸೈಟ್',
        anukoolAdaptedInterface: 'ಅನುಕೂಲ ಸರಳ ಹೊಂದಿಕೊಳ್ಳುವ ಇಂಟರ್ಫೇಸ್',
        checkBalance: 'ಬ್ಯಾಲೆನ್ಸ್ ಚೆಕ್',
        sendMoney: 'ಹಣ ಕಳುಹಿಸಿ',
        payBills: 'ಬಿಲ್ ಪಾವತಿಸಿ',
        transactions: 'ವಹಿವಾಟುಗಳು',
        privacyControl: 'ಗೌಪ್ಯತೆಗೆ ಮೊದಲ ಆದ್ಯತೆ. ನಿಮ್ಮ ನಿಯಂತ್ರಣದಲ್ಲೇ ಎಲ್ಲವೂ.',
      },
      hi: {
        eyebrow: 'सरल और स्पष्ट शुरुआत',
        heroTitle: 'महत्वपूर्ण सेवाएं, अब बेहद आसान।',
        heroSubtitle: 'बैंकिंग, पेंशन और सरकारी सेवाओं का लाभ अपनी भाषा में, हर कदम पर सरल मार्गदर्शन के साथ उठाएं।',
        getStarted: 'शुरू करें →',
        seeHowItWorks: 'यह कैसे काम करता है',
        heroTagline: '✓ सरल। चरणबद्ध मार्गदर्शन। आपकी अपनी भाषा में।',
        voicePrompt: 'आपको क्या सहायता चाहिए?',
        voiceGuide: 'साथी वॉयस गाइड',
        voiceGuideMsg: 'मैं इस चरण में आपकी पूरी मदद करूंगा।',
        docDetected: 'दस्तावेज़ सत्यापित',
        docDetectedMsg: 'नाम, जन्मतिथि और पता सुरक्षित रूप से पहचाना गया।',
        keyServicesTitle: 'प्रमुख नागरिक सेवाएं',
        pensionTitle: 'मासिक पेंशन और राशन',
        pensionDesc: 'सीधे बैंक खाते में सहायता • ₹2,000 / महीना',
        scholarshipTitle: 'सरकारी छात्रवृत्ति',
        scholarshipDesc: 'अंकतालिका स्कैन करें और तुरंत आवेदन करें',
        emergencyTitle: 'अस्पताल आपातकालीन सहायता',
        emergencyDesc: 'लाइव जीपीएस रूट • 8 मिनट में नजदीकी अस्पताल',
        bankingTitle: 'सरल बैंकिंग और बिल',
        bankingDesc: 'बैलेंस जांचें, पैसे भेजें और बिल भरें',
        sameServiceDiffExp: 'वही सेवा। बिल्कुल नया अनुभव।',
        traditionalInterface: 'पारंपरिक जटिल इंटरफ़ेस',
        anukoolAdaptedInterface: 'अनुकूल एडैप्टिव इंटरफ़ेस',
        checkBalance: 'बैलेंस जांचें',
        sendMoney: 'पैसे भेजें',
        payBills: 'बिल भरें',
        transactions: 'लेन-देन',
        privacyControl: 'गोपनीयता सर्वप्रथम। आप हमेशा नियंत्रण में हैं।',
      },
    };

    if (dict[lang] && dict[lang][key]) {
      return dict[lang][key];
    }
    return getTranslation(lang, key, fallback);
  };

  const handleToggleTheme = () => {
    setThemeMode(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-[#ECEEF1] dark:bg-[#0A0B0E] py-4 sm:py-8 md:py-12 px-3 sm:px-6 flex justify-center items-center font-sans">
      
      {/* ─────────────────────────────────────────────────────────────
          MAIN CANVAS CONTAINER (CLEAN, ELEVATED & NON-MESSY)
         ───────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-[1120px] bg-white dark:bg-[#13151B] rounded-[32px] sm:rounded-[38px] border border-slate-200/80 dark:border-white/10 shadow-sm p-6 sm:p-10 md:p-12 space-y-10 sm:space-y-12 transition-colors">

        {/* ═══════════════════════════════════════════════════════════
            TOP HEADER
           ═══════════════════════════════════════════════════════════ */}
        <header className="flex justify-between items-center">
          {/* Logo & Title */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-[#134233]/10 dark:bg-emerald-500/20 flex items-center justify-center text-[#134233] dark:text-emerald-400 border border-[#134233]/20">
              <Eye className="w-5 h-5 stroke-[2.4]" />
            </div>
            <div>
              <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white block leading-tight">
                {t('appName', 'ANUKOOL')}
              </span>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block -mt-0.5">
                {t('digitalInclusionLayer', 'Adaptive Access Layer')}
              </span>
            </div>
          </Link>

          {/* Right Controls: Language Selector + Sun/Moon + Get Started */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Language Dropdown */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-2xs">
              <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <select
                value={profile.language}
                onChange={(e) => updateProfileKey('language', e.target.value as SupportedLanguage)}
                className="appearance-none bg-transparent cursor-pointer focus:outline-none pr-1 font-bold text-xs"
              >
                {Object.entries(LANGUAGE_NAMES).map(([code, langItem]) => (
                  <option key={code} value={code} className="bg-white dark:bg-[#13151B] text-slate-900 dark:text-white">
                    {langItem.nativeName} ({langItem.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Sun/Moon Toggle */}
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              title="Toggle Appearance"
            >
              {resolvedTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Get Started Pill */}
            <Link
              href="/onboarding"
              className="px-4.5 py-2 rounded-full bg-[#134233] hover:bg-[#1a5542] text-white font-extrabold text-xs tracking-wide shadow-sm transition-all hover:scale-105"
            >
              {t('getStarted', 'Get Started →')}
            </Link>
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════════════
            HERO SECTION (1:1 MATCHING USER'S REFERENCE IMAGE)
           ═══════════════════════════════════════════════════════════ */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Clear Copy & Actions */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-black uppercase tracking-wider text-[#134233] dark:text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t('eyebrow', 'A CLEARER WAY FORWARD')}</span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                {profile.language === 'en' ? (
                  <>
                    Important services, <br />
                    <span className="text-[#134233] dark:text-emerald-400">made simple.</span>
                  </>
                ) : (
                  t('heroTitle', 'Important services, made simple.')
                )}
              </h1>
              
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                {t('heroSubtitle', 'Get help with banking, pensions and government services — in a language you understand, with guidance every step of the way.')}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/onboarding"
                className="px-6 py-3 rounded-full bg-[#134233] hover:bg-[#1a5542] text-white font-extrabold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
              >
                <span>{t('getStarted', 'Get Started →')}</span>
              </Link>

              <Link
                href="/services"
                className="px-5 py-3 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-white font-bold text-xs sm:text-sm shadow-2xs transition-all cursor-pointer"
              >
                {t('seeHowItWorks', 'See how it works')}
              </Link>
            </div>

            {/* Micro Tagline */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 pt-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{t('heroTagline', '✓ Simple. Guided. In your language.')}</span>
            </div>
          </div>

          {/* Right Column: Supportive Guidance Photo + Floating Assist Cards */}
          <div className="lg:col-span-6 relative flex justify-center items-center py-4 sm:py-6 px-2">
            
            {/* Main Photo Container */}
            <div className="relative w-full aspect-[4/3] rounded-[30px] overflow-hidden shadow-lg border border-slate-200/80 dark:border-white/10 bg-slate-100">
              <img
                src="/images/guidance-hero.jpg"
                alt="Digital counselor providing warm supportive guidance to citizen on laptop"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
            </div>

            {/* ── 🗣️ FLOATING CARD 1 (Top-Right): Kannada Language Card ── */}
            <div className="absolute top-2 sm:top-3 -right-1 sm:-right-3 bg-white/95 dark:bg-[#1E2028]/95 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xl max-w-[210px] space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-black text-slate-900 dark:text-white">ಕನ್ನಡ (Kannada)</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-snug">
                &ldquo;{t('voicePrompt', 'ನಿಮಗೆ ಏನು ಸಹಾಯ ಬೇಕು?')}&rdquo;
              </p>
            </div>

            {/* ── 🎙️ FLOATING CARD 2 (Middle-Left): Saathi Voice Guide ── */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-2 sm:-left-4 bg-white/95 dark:bg-[#1E2028]/95 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xl max-w-[220px] space-y-1 animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-[#134233] text-white flex items-center justify-center">
                  <Mic className="w-3 h-3" />
                </div>
                <span className="text-[11px] font-black text-slate-900 dark:text-white">
                  {t('voiceGuide', 'Saathi Voice Guide')}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-snug">
                &ldquo;{t('voiceGuideMsg', "I'll guide you through this step.")}&rdquo;
              </p>
            </div>

            {/* ── 📄 FLOATING CARD 3 (Bottom-Left): Document Snap-to-Form ── */}
            <div className="absolute bottom-2 sm:bottom-3 -left-1 sm:-left-2 bg-white/95 dark:bg-[#1E2028]/95 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xl max-w-[230px] space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  <Camera className="w-3 h-3" />
                </div>
                <span className="text-[11px] font-black text-slate-900 dark:text-white">
                  {t('docDetected', 'Document detected')}
                </span>
              </div>
              <p className="text-[10px] text-slate-600 dark:text-slate-300 font-medium leading-snug">
                {t('docDetectedMsg', 'Name, date of birth and address found')}
              </p>
            </div>

          </div>

        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION: 4 CLEAN KEY SERVICE PRESENTATION BOXES
           ═══════════════════════════════════════════════════════════ */}
        <section className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/5">
          
          <div className="flex justify-between items-center">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t('keyServicesTitle', 'Key Essential Services')}</span>
            </h2>
            <Link
              href="/services"
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>{t('seeHowItWorks', 'Explore all →')}</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Box 1: Pension Money */}
            <Link
              href="/services/ration-card"
              className="p-5 rounded-2xl bg-[#F4F8F6] dark:bg-[#18231E] border border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-md transition-all space-y-3 group cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/15 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                  💰
                </div>
                <span className="text-[9px] font-black text-emerald-800 dark:text-emerald-300 bg-white dark:bg-black/40 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Direct Benefit
                </span>
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {t('pensionTitle', 'Monthly Pension & Ration')}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium pt-1 leading-snug">
                  {t('pensionDesc', 'Direct ₹2,000 monthly benefit & food security')}
                </p>
              </div>
              <div className="pt-2 border-t border-emerald-500/10 flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <span>Start Application</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Box 2: Apply for Scholarship */}
            <Link
              href="/services/government-scholarship"
              className="p-5 rounded-2xl bg-[#F5F5FE] dark:bg-[#1E1C2B] border border-indigo-500/20 hover:border-indigo-500/50 hover:shadow-md transition-all space-y-3 group cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/15 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-black text-indigo-800 dark:text-indigo-300 bg-white dark:bg-black/40 px-2 py-0.5 rounded-full border border-indigo-500/20">
                  Marksheet Scan
                </span>
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {t('scholarshipTitle', 'National Scholarship')}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium pt-1 leading-snug">
                  {t('scholarshipDesc', 'Higher education grants with 5-step guided assist')}
                </p>
              </div>
              <div className="pt-2 border-t border-indigo-500/10 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <span>Snap Marksheet</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Box 3: Hospital Emergency Booking */}
            <Link
              href="/emergency"
              className="p-5 rounded-2xl bg-[#FFF4F4] dark:bg-[#2A1818] border border-red-500/20 hover:border-red-500/50 hover:shadow-md transition-all space-y-3 group cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-red-600/15 text-red-700 dark:text-red-300 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-black text-red-800 dark:text-red-300 bg-white dark:bg-black/40 px-2 py-0.5 rounded-full border border-red-500/20">
                  Live GPS Route
                </span>
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  {t('emergencyTitle', 'Emergency Hospital Route')}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium pt-1 leading-snug">
                  {t('emergencyDesc', 'Fastest OPD & trauma care navigation in 8 mins')}
                </p>
              </div>
              <div className="pt-2 border-t border-red-500/10 flex items-center justify-between text-xs font-bold text-red-600 dark:text-red-400">
                <span>View Route Map</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Box 4: Simplified Banking */}
            <Link
              href="/banking"
              className="p-5 rounded-2xl bg-[#EEF4FF] dark:bg-[#182030] border border-blue-500/20 hover:border-blue-500/50 hover:shadow-md transition-all space-y-3 group cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-blue-600/15 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-black text-blue-800 dark:text-blue-300 bg-white dark:bg-black/40 px-2 py-0.5 rounded-full border border-blue-500/20">
                  Voice Guided
                </span>
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {t('bankingTitle', 'Simplified Banking')}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium pt-1 leading-snug">
                  {t('bankingDesc', 'Check balance, send money & pay bills easily')}
                </p>
              </div>
              <div className="pt-2 border-t border-blue-500/10 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                <span>Open Banking</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

          </div>

        </section>

        {/* ═══════════════════════════════════════════════════════════
            SAME SERVICE. DIFFERENT EXPERIENCE. (COMPARISON SECTION)
           ═══════════════════════════════════════════════════════════ */}
        <section className="pt-2 space-y-6 text-center">
          
          <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
            {t('sameServiceDiffExp', 'Same service. Different experience.')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-11 gap-3 sm:gap-4 items-center max-w-3xl mx-auto">
            
            {/* Left: Traditional Interface Wireframe */}
            <div className="md:col-span-5 space-y-2">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#181A22] border border-slate-200 dark:border-white/10 shadow-xs text-left h-[175px] flex flex-col justify-between">
                {/* Header bar */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <div className="h-2 w-12 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                  <div className="flex gap-1">
                    <div className="h-2 w-4 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-2 w-4 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                </div>

                {/* Dashboard content blocks */}
                <div className="grid grid-cols-3 gap-1.5 py-1">
                  <div className="p-1.5 bg-slate-50 dark:bg-white/5 rounded border border-slate-100 dark:border-white/5 space-y-1">
                    <div className="h-1.5 w-6 bg-slate-300 dark:bg-slate-600 rounded" />
                    <div className="h-2 w-10 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                  <div className="p-1.5 bg-slate-50 dark:bg-white/5 rounded border border-slate-100 dark:border-white/5 space-y-1">
                    <div className="h-1.5 w-6 bg-slate-300 dark:bg-slate-600 rounded" />
                    <div className="h-2 w-10 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                  <div className="p-1.5 bg-slate-50 dark:bg-white/5 rounded border border-slate-100 dark:border-white/5 space-y-1">
                    <div className="h-1.5 w-6 bg-slate-300 dark:bg-slate-600 rounded" />
                    <div className="h-2 w-10 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                </div>

                {/* Complex form lines */}
                <div className="space-y-1 pt-1">
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-1.5 w-4/5 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-1.5 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
              </div>

              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block text-center">
                {t('traditionalInterface', 'Traditional Interface')}
              </span>
            </div>

            {/* Middle Arrow */}
            <div className="md:col-span-1 flex justify-center py-1">
              <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-xs">
                &rarr;
              </div>
            </div>

            {/* Right: Anukool Adapted Interface */}
            <div className="md:col-span-5 space-y-2">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#181A22] border border-slate-200 dark:border-white/10 shadow-xs h-[175px] flex items-center justify-center">
                <div className="grid grid-cols-2 gap-2 w-full">
                  
                  {/* Card 1: Check Balance */}
                  <button
                    onClick={() => router.push('/banking')}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all flex flex-col items-center justify-center cursor-pointer group"
                  >
                    <Wallet className="w-4 h-4 text-[#134233] dark:text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-[11px] text-slate-800 dark:text-white">
                      {t('checkBalance', 'Check Balance')}
                    </span>
                  </button>

                  {/* Card 2: Send Money */}
                  <button
                    onClick={() => router.push('/banking')}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all flex flex-col items-center justify-center cursor-pointer group"
                  >
                    <Send className="w-4 h-4 text-[#134233] dark:text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-[11px] text-slate-800 dark:text-white">
                      {t('sendMoney', 'Send Money')}
                    </span>
                  </button>

                  {/* Card 3: Pay Bills */}
                  <button
                    onClick={() => router.push('/banking')}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all flex flex-col items-center justify-center cursor-pointer group"
                  >
                    <Receipt className="w-4 h-4 text-[#134233] dark:text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-[11px] text-slate-800 dark:text-white">
                      {t('payBills', 'Pay Bills')}
                    </span>
                  </button>

                  {/* Card 4: Transactions */}
                  <button
                    onClick={() => router.push('/banking')}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all flex flex-col items-center justify-center cursor-pointer group"
                  >
                    <LayoutGrid className="w-4 h-4 text-[#134233] dark:text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-[11px] text-slate-800 dark:text-white">
                      {t('transactions', 'Transactions')}
                    </span>
                  </button>

                </div>
              </div>

              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block text-center">
                {t('anukoolAdaptedInterface', 'Anukool Adapted Interface')}
              </span>
            </div>

          </div>

        </section>

        {/* ═══════════════════════════════════════════════════════════
            FOOTER PILL
           ═══════════════════════════════════════════════════════════ */}
        <footer className="flex justify-center pt-2">
          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-white/5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{t('privacyControl', "Privacy first. You're always in control.")}</span>
          </div>
        </footer>

      </div>

    </div>
  );
}
