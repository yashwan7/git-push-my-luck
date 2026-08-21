'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAccessibility } from '@/context/AccessibilityContext';
import { useVoice } from '@/context/VoiceContext';
import { useAuth } from '@/context/AuthContext';
import { getTranslation, LANGUAGE_NAMES, getLocalizedService } from '@/lib/multilingualEngine';
import { MOCK_SERVICES } from '@/lib/servicesData';
import { ServiceDefinition } from '@/types';
import { ServiceDetailModal } from '@/components/services/ServiceDetailModal';
import { 
  Home,
  Clock,
  Users,
  Wallet,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  Search,
  ChevronRight,
  MoreVertical,
  ArrowLeft,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Send,
  QrCode,
  Receipt,
  CreditCard,
  Building2,
  Stethoscope,
  GraduationCap,
  FileText,
  Zap,
  Mic,
  Languages,
  ShieldCheck,
  Layers,
  X,
  AlertCircle
} from 'lucide-react';

export default function ServicesPage() {
  const router = useRouter();
  const { profile, activePersonaName } = useAccessibility();
  const { speak, isSpeaking } = useVoice();
  const { user, profile: authProfile } = useAuth();

  // State Management
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<ServiceDefinition | null>(null);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'home' | 'history' | 'services' | 'wallet' | 'settings'>('services');

  const lang = profile.language;
  const t = (key: string, fallback?: string) => getTranslation(lang, key, fallback);

  // Dynamic User Greeting
  const userDisplayName = authProfile?.fullName || user?.user_metadata?.full_name || 'Yashwanth';
  const firstName = userDisplayName.split(' ')[0] || 'there';
  const userInitial = userDisplayName.charAt(0).toUpperCase();

  // Time of day calculation
  const hour = new Date().getHours();
  const greetingTime = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Localize all services based on active language
  const localizedServices: ServiceDefinition[] = useMemo(() => {
    return MOCK_SERVICES.map(service => getLocalizedService(lang, service));
  }, [lang]);

  // Categories Definition
  const categories = [
    { id: 'all', label: 'All Services', icon: Zap },
    { id: 'government', label: 'Government Services', icon: Building2 },
    { id: 'healthcare', label: 'Healthcare', icon: Stethoscope },
    { id: 'banking', label: 'Banking & Bills', icon: CreditCard },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'emergency', label: 'Emergency', icon: AlertCircle },
  ];

  // Quick Action Tiles Definition (Banking Dashboard Style)
  const quickActions = [
    {
      id: 'qa-bill',
      title: 'Pay a Bill',
      description: 'Electricity, Jio & utilities',
      href: '/services/electricity-bill',
      icon: CreditCard,
      color: '#779AE6',
      badge: 'BBPS Demo',
    },
    {
      id: 'qa-scheme',
      title: 'Apply for Scheme',
      description: 'Scholarship & grants',
      href: '/services/government-scholarship',
      icon: Building2,
      color: '#4F46E5',
      badge: '5-Step Guided',
    },
    {
      id: 'qa-hospital',
      title: 'Book Hospital',
      description: 'OPD & doctor appointment',
      href: '/services/hospital-appointment',
      icon: Stethoscope,
      color: '#059669',
      badge: 'Voice Assisted',
    },
    {
      id: 'qa-simplify',
      title: 'Simplify Text',
      description: 'Make notices easy to read',
      href: '/simplifier',
      icon: Sparkles,
      color: '#D97706',
      badge: 'Plain Language',
    },
    {
      id: 'qa-audit',
      title: 'Audit Service',
      description: 'Verify accessibility score',
      href: '/audit',
      icon: FileText,
      color: '#0D9488',
      badge: 'WCAG 2.2',
    },
    {
      id: 'qa-emergency',
      title: 'Emergency Help',
      description: 'Instant civic emergency',
      href: '/emergency',
      icon: AlertCircle,
      color: '#E11D48',
      badge: '24x7 Urgent',
    },
  ];

  // Filtered Services Logic
  const filteredServices = useMemo(() => {
    return localizedServices.filter(service => {
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        service.title.toLowerCase().includes(q) ||
        service.description.toLowerCase().includes(q) ||
        service.organization.toLowerCase().includes(q) ||
        (service.badge && service.badge.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [localizedServices, selectedCategory, searchQuery]);

  // Curated Recommended Services (Top 3-4)
  const recommendedServices = useMemo(() => {
    return localizedServices.slice(0, 3);
  }, [localizedServices]);

  const speakText = (text: string) => {
    speak(text);
  };

  const handleServiceClick = (service: ServiceDefinition) => {
    setSelectedServiceForModal(service);
  };

  return (
    <div className="min-h-screen bg-[#ECECEC] dark:bg-[#121316] text-[#1E2024] dark:text-[#EAECEF] p-2 sm:p-4 md:p-6 font-sans transition-colors">
      
      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedServiceForModal}
        isOpen={Boolean(selectedServiceForModal)}
        onClose={() => setSelectedServiceForModal(null)}
        onAskNayan={(query) => {
          speakText(`Explaining service: ${query}`);
        }}
        language={lang}
      />

      {/* ─────────────────────────────────────────────────────────────
          MAIN CANVAS CONTAINER (IDENTICAL SHELL AS BANKING)
         ───────────────────────────────────────────────────────────── */}
      <div className="max-w-[1340px] mx-auto bg-[#ECECEC] dark:bg-[#18191D] rounded-[36px] p-3 sm:p-5 md:p-7 flex gap-5 sm:gap-7">
        
        {/* ═══════════════════════════════════════════════════════════
            LEFT DARK SIDEBAR PILL (CONSISTENT WITH BANKING)
           ═══════════════════════════════════════════════════════════ */}
        <aside className="hidden lg:flex flex-col justify-between w-16 py-5 rounded-[28px] bg-[#232428] text-white shrink-0 items-center shadow-md">
          
          {/* Top Navigation Cluster */}
          <div className="flex flex-col items-center gap-4">
            <Link
              href="/banking"
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                activeSidebarTab === 'home' 
                  ? 'bg-white text-[#232428] shadow-md scale-105' 
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Banking Dashboard"
            >
              <Home className="w-5 h-5" />
            </Link>

            <Link
              href="/services"
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                activeSidebarTab === 'services' 
                  ? 'bg-white text-[#232428] shadow-md scale-105' 
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Services Catalog"
            >
              <Layers className="w-5 h-5" />
            </Link>

            <Link
              href="/audit"
              className="w-10 h-10 rounded-2xl text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              title="Audit a Service"
            >
              <Clock className="w-5 h-5" />
            </Link>

            <Link
              href="/provider"
              className="w-10 h-10 rounded-2xl text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              title="Provider Mode"
            >
              <Users className="w-5 h-5" />
            </Link>

            <button
              onClick={() => router.push('/banking')}
              className="w-10 h-10 rounded-2xl text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              title="Banking Wallet"
            >
              <Wallet className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Navigation Cluster */}
          <div className="flex flex-col items-center gap-4">
            <Link
              href="/emergency"
              className="w-10 h-10 rounded-2xl text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              title="Emergency Help"
            >
              <HelpCircle className="w-5 h-5" />
            </Link>

            <Link
              href="/"
              className="w-10 h-10 rounded-2xl text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              title="Exit to Portal"
            >
              <LogOut className="w-5 h-5" />
            </Link>
          </div>

        </aside>

        {/* ═══════════════════════════════════════════════════════════
            MAIN SERVICES CONTENT AREA
           ═══════════════════════════════════════════════════════════ */}
        <div className="flex-1 space-y-6">
          
          {/* TOP APP HEADER BAR (RIGHT ACTION CONTROLS) */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#779AE6] uppercase tracking-wider px-3 py-1 rounded-full bg-white dark:bg-[#232428] border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F0DC9B]" />
                <span>NAYAN Digital Services &bull; Active Profile: {activePersonaName || 'Adaptive'}</span>
              </span>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3">
              <button 
                onClick={() => speakText(`You are on the NAYAN Services page. There are ${localizedServices.length} digital services available.`)}
                className="w-10 h-10 rounded-full bg-white dark:bg-[#232428] border border-slate-300 dark:border-white/10 flex items-center justify-center text-[#1E2024] dark:text-white shadow-sm hover:scale-105 transition-transform"
                aria-label="Audio Summary"
                title="Speak page summary"
              >
                <Bell className="w-4 h-4" />
              </button>

              <div className="w-10 h-10 rounded-full bg-[#1E2024] text-white font-serif font-bold text-base flex items-center justify-center shadow-sm border border-slate-300 dark:border-white/20">
                {userInitial}
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              HERO GREETING ROW (DASHBOARD-FIRST)
             ═══════════════════════════════════════════════════════════ */}
          <div className="space-y-1 pt-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2024] dark:text-white tracking-tight">
              {greetingTime}, <span className="text-[#8494B6] font-extrabold">{firstName}.</span>
            </h1>
            <p className="text-sm sm:text-base font-bold text-[#1E2024] dark:text-white">
              What would you like to get done today?
            </p>
            <p className="text-xs sm:text-sm text-[#8B929A] font-medium">
              NAYAN helps you discover and complete digital services in the way that works best for you.
            </p>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              NAYAN CONTEXTUAL PERSONALIZATION PANEL
             ═══════════════════════════════════════════════════════════ */}
          <div className="p-5 sm:p-6 rounded-[28px] bg-gradient-to-r from-[#779AE6]/15 via-[#8FAEE8]/10 to-transparent border border-[#779AE6]/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#779AE6] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-[#779AE6] uppercase tracking-wider block">
                  ✦ NAYAN Adaptive Intelligence
                </span>
                <p className="text-xs sm:text-sm font-semibold text-[#1E2024] dark:text-white">
                  Based on your active accessibility profile, we&apos;ve prioritized services that are easier to navigate with voice and simplified steps.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedCategory('all');
                speakText('Showing all recommended services suited for your profile.');
              }}
              className="px-4 py-2.5 rounded-full bg-white dark:bg-[#232428] hover:bg-[#779AE6] hover:text-white text-[#1E2024] dark:text-white font-bold text-xs shadow-sm border border-slate-200 dark:border-white/10 transition-all shrink-0 self-start sm:self-auto flex items-center gap-1.5"
            >
              <span>Explore Recommended</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              QUICK SERVICE ACTIONS ROW (BANKING ACTION TILES)
             ═══════════════════════════════════════════════════════════ */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8B929A]">
                Quick Actions
              </span>
              <span className="text-xs font-semibold text-[#779AE6]">Instant Access</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {quickActions.map((qa) => {
                const Icon = qa.icon;
                return (
                  <Link
                    key={qa.id}
                    href={qa.href}
                    className="p-4 rounded-[24px] bg-white dark:bg-[#232428] hover:bg-[#779AE6] hover:text-white border border-slate-200/80 dark:border-white/10 shadow-sm transition-all flex flex-col justify-between min-h-[125px] group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#ECECEC] dark:bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-colors" style={{ color: qa.color }}>
                      <Icon className="w-5 h-5 group-hover:text-white" />
                    </div>

                    <div className="mt-2 space-y-0.5">
                      <span className="font-extrabold text-xs sm:text-sm text-[#1E2024] dark:text-white group-hover:text-white block leading-tight">
                        {qa.title}
                      </span>
                      <span className="text-[10px] text-[#8B929A] group-hover:text-white/80 block line-clamp-1">
                        {qa.description}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              SEARCH BAR COMPONENT (LARGE ROUNDED DASHBOARD SEARCH)
             ═══════════════════════════════════════════════════════════ */}
          <div className="relative">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8B929A] pointer-events-none">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services, schemes, hospitals, bills, scholarships..."
              className="w-full p-4 pl-14 pr-12 rounded-full bg-white dark:bg-[#232428] border border-slate-200/90 dark:border-white/10 shadow-sm text-xs sm:text-sm font-semibold text-[#1E2024] dark:text-white outline-none focus:ring-2 focus:ring-[#779AE6] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════
              COMPACT CATEGORY FILTER PILLS
             ═══════════════════════════════════════════════════════════ */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-full font-bold text-xs transition-all shrink-0 flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#779AE6] text-white shadow-sm'
                      : 'bg-white dark:bg-[#232428] text-[#1E2024] dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-[#779AE6]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* ═══════════════════════════════════════════════════════════
              SECTION: RECOMMENDED FOR YOU (3 CARDS)
             ═══════════════════════════════════════════════════════════ */}
          {!searchQuery && selectedCategory === 'all' && (
            <div className="space-y-3 pt-1">
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-base text-[#1E2024] dark:text-white">
                  Recommended for you
                </h3>
                <span className="text-xs font-semibold text-[#779AE6]">
                  Personalized for your profile
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedServices.map((service, idx) => (
                  <div
                    key={`rec-${service.id}`}
                    onClick={() => handleServiceClick(service)}
                    className="p-5 rounded-[26px] bg-white dark:bg-[#232428] border border-slate-200/80 dark:border-white/10 shadow-sm hover:border-[#779AE6] transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#779AE6]/10 text-[#779AE6] border border-[#779AE6]/20">
                          {service.badge || 'Recommended'}
                        </span>
                        <span className="text-[11px] font-medium text-[#8B929A]">
                          {service.estimatedTime}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-[#1E2024] dark:text-white group-hover:text-[#779AE6] transition-colors leading-tight">
                        {service.title}
                      </h4>

                      <p className="text-xs text-[#8B929A] line-clamp-2 leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
                      <span className="text-[10px] font-semibold text-[#059669] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Voice · Guided</span>
                      </span>

                      <span className="text-xs font-bold text-[#779AE6] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>View service</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              MAIN SERVICES SECTION & 2-COLUMN GRID (BANKING SYSTEM)
             ═══════════════════════════════════════════════════════════ */}
          <div className="space-y-4 pt-2">
            
            <div className="flex justify-between items-baseline">
              <div>
                <h2 className="text-xl font-black text-[#1E2024] dark:text-white tracking-tight">
                  Services
                </h2>
                <p className="text-xs text-[#8B929A] font-medium">
                  Everything you need, organized around the way you use digital services.
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-[#8B929A]">
                {filteredServices.length} services available
              </span>
            </div>

            {filteredServices.length === 0 ? (
              /* EMPTY STATE (FENCO STYLE) */
              <div className="p-10 rounded-[32px] bg-white dark:bg-[#232428] border border-slate-200 dark:border-white/10 shadow-sm text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#779AE6]/15 text-[#779AE6] flex items-center justify-center mx-auto">
                  <Search className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#1E2024] dark:text-white">
                    No services found
                  </h3>
                  <p className="text-xs text-[#8B929A] max-w-sm mx-auto">
                    Try searching with different keywords like &quot;scholarship&quot;, &quot;hospital&quot;, &quot;electricity&quot; or ask NAYAN to help you.
                  </p>
                </div>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#ECECEC] dark:bg-white/10 font-bold text-xs hover:opacity-80"
                  >
                    Clear Search
                  </button>
                  <button
                    onClick={() => speakText('I can help you find scholarships, hospital appointments, or utility bills.')}
                    className="px-4 py-2 rounded-xl bg-[#779AE6] text-white font-bold text-xs hover:bg-[#688FE8] shadow-sm flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask NAYAN</span>
                  </button>
                </div>
              </div>
            ) : (
              /* 2-COLUMN SERVICE CARDS GRID */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => handleServiceClick(service)}
                    className="p-6 sm:p-7 rounded-[28px] bg-white dark:bg-[#232428] border border-slate-200/80 dark:border-white/10 shadow-sm hover:border-[#779AE6] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-5 group"
                  >
                    {/* Top Metadata & Category */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-[#ECECEC] dark:bg-white/10 text-[#779AE6] border border-slate-200 dark:border-white/10">
                          {service.badge || service.category}
                        </span>
                        <span className="text-xs font-semibold text-[#8B929A] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{service.estimatedTime}</span>
                        </span>
                      </div>

                      {/* Title & Organization */}
                      <div>
                        <h3 className="text-lg font-black text-[#1E2024] dark:text-white group-hover:text-[#779AE6] transition-colors tracking-tight">
                          {service.title}
                        </h3>
                        <span className="text-xs font-bold text-[#8B929A] block mt-0.5">
                          {service.organization}
                        </span>
                      </div>

                      {/* Short Description */}
                      <p className="text-xs text-[#8B929A] leading-relaxed line-clamp-2">
                        {service.description}
                      </p>
                    </div>

                    {/* Footer: Accessibility Pills & Action CTA */}
                    <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-[#8B929A]">
                        <span className="px-2 py-0.5 rounded-md bg-[#ECECEC] dark:bg-white/5 text-[#059669]">
                          🎙 Voice supported
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#ECECEC] dark:bg-white/5 text-[#4F46E5]">
                          👁 Simplified steps
                        </span>
                      </div>

                      <span className="font-extrabold text-xs text-[#779AE6] flex items-center gap-1 group-hover:translate-x-1 transition-transform self-end sm:self-auto">
                        <span>View service</span>
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
