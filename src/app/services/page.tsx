'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAccessibility } from '@/context/AccessibilityContext';
import { useVoice } from '@/context/VoiceContext';
import { useAuth } from '@/context/AuthContext';
import { getTranslation, LANGUAGE_NAMES, getLocalizedService } from '@/lib/multilingualEngine';
import { MOCK_SERVICES } from '@/lib/servicesData';
import { ServiceDefinition } from '@/types';
import { ServiceDetailModal } from '@/components/services/ServiceDetailModal';
import { GoogleMapEmergency } from '@/components/emergency/GoogleMapEmergency';
import { ChangeEmergencyModal, EMERGENCY_PRESETS, EmergencyCase } from '@/components/emergency/ChangeEmergencyModal';
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
  AlertCircle,
  Phone,
  Navigation,
  MapPin,
  Siren,
  Headphones,
  Activity,
  KeyRound,
  History,
  Lock,
  Volume2
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
  const [activeSidebarTab, setActiveSidebarTab] = useState<'home' | 'services' | 'activity' | 'access' | 'history' | 'settings'>('services');

  // Emergency Router Interactive Real State
  const [currentEmergencyCase, setCurrentEmergencyCase] = useState<EmergencyCase>(EMERGENCY_PRESETS[0]);
  const [isChangeModalOpen, setIsChangeModalOpen] = useState<boolean>(false);
  const [isEmergencyNavigating, setIsEmergencyNavigating] = useState<boolean>(false);
  const [emergencyCallStatus, setEmergencyCallStatus] = useState<string | null>(null);

  const lang = profile.language;
  const t = (key: string, fallback?: string) => getTranslation(lang, key, fallback);

  // Dynamic User Greeting
  const userDisplayName = authProfile?.fullName || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const firstName = userDisplayName.split(' ')[0] || 'User';
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
    { id: 'emergency', label: 'Emergency', icon: Siren },
  ];

  // 🌟 THE 6 PREMIUM ELEVATED ACTION TILES (MATCHING REFERENCE IMAGE 1:1)
  const quickActions = [
    {
      id: 'qa-bill',
      title: 'Pay a Bill',
      description: 'Electricity, Mobile, DTH & more',
      href: '/services/electricity-bill',
      icon: CreditCard,
      accentBg: 'bg-gradient-to-br from-[#EEF4FF] via-[#F4F8FF] to-[#E0ECFD] dark:from-[#1E2638] dark:to-[#172030]',
      borderColor: 'border-[#BFDBFE]/60 dark:border-blue-500/20',
      iconBg: 'bg-[#3B82F6]/15 text-[#2563EB] dark:bg-blue-500/20 dark:text-blue-400',
      arrowBg: 'bg-white text-[#2563EB] shadow-sm hover:bg-[#2563EB] hover:text-white',
      badge: 'BBPS Demo',
      sparkleColor: 'text-blue-400',
    },
    {
      id: 'qa-scheme',
      title: 'Apply for Scheme',
      description: 'Government schemes & grants',
      href: '/services/government-scholarship',
      icon: FileText,
      accentBg: 'bg-gradient-to-br from-[#F5F3FF] via-[#FAF8FF] to-[#ECE8FC] dark:from-[#261F3D] dark:to-[#1C172E]',
      borderColor: 'border-[#DDD6FE]/60 dark:border-indigo-500/20',
      iconBg: 'bg-[#6366F1]/15 text-[#4F46E5] dark:bg-indigo-500/20 dark:text-indigo-400',
      arrowBg: 'bg-white text-[#4F46E5] shadow-sm hover:bg-[#4F46E5] hover:text-white',
      badge: '5-Step Guided',
      sparkleColor: 'text-indigo-400',
    },
    {
      id: 'qa-hospital',
      title: 'Book Hospital',
      description: 'Find & book appointments',
      href: '/services/hospital-appointment',
      icon: Stethoscope,
      accentBg: 'bg-gradient-to-br from-[#FFF1F2] via-[#FFF7F8] to-[#FCE3E6] dark:from-[#381F26] dark:to-[#2B171C]',
      borderColor: 'border-[#FECDD3]/60 dark:border-rose-500/20',
      iconBg: 'bg-[#E11D48]/15 text-[#E11D48] dark:bg-rose-500/20 dark:text-rose-400',
      arrowBg: 'bg-white text-[#E11D48] shadow-sm hover:bg-[#E11D48] hover:text-white',
      badge: 'Voice Assisted',
      sparkleColor: 'text-rose-400',
    },
    {
      id: 'qa-simplify',
      title: 'Simplify Text',
      description: 'Make complex content easy',
      href: '/simplifier',
      icon: Sparkles,
      accentBg: 'bg-gradient-to-br from-[#FFFBEB] via-[#FFFDF5] to-[#FEF3C7] dark:from-[#382F1E] dark:to-[#2A2317]',
      borderColor: 'border-[#FDE68A]/60 dark:border-amber-500/20',
      iconBg: 'bg-[#D97706]/15 text-[#D97706] dark:bg-amber-500/20 dark:text-amber-400',
      arrowBg: 'bg-white text-[#D97706] shadow-sm hover:bg-[#D97706] hover:text-white',
      badge: 'Plain Language',
      sparkleColor: 'text-amber-400',
    },
    {
      id: 'qa-audit',
      title: 'Audit Service',
      description: 'Check accessibility of any service',
      href: '/audit',
      icon: ShieldCheck,
      accentBg: 'bg-gradient-to-br from-[#F0FDF4] via-[#F7FEFA] to-[#DCFCE7] dark:from-[#1E382A] dark:to-[#172B20]',
      borderColor: 'border-[#BBF7D0]/60 dark:border-emerald-500/20',
      iconBg: 'bg-[#059669]/15 text-[#059669] dark:bg-emerald-500/20 dark:text-emerald-400',
      arrowBg: 'bg-white text-[#059669] shadow-sm hover:bg-[#059669] hover:text-white',
      badge: 'WCAG 2.2',
      sparkleColor: 'text-emerald-400',
    },
    {
      id: 'qa-emergency',
      title: 'Emergency Help',
      description: 'Get urgent support instantly',
      href: '/emergency',
      icon: Siren,
      accentBg: 'bg-gradient-to-br from-[#FEF2F2] via-[#FFF8F8] to-[#FEE2E2] dark:from-[#381E1E] dark:to-[#2B1717]',
      borderColor: 'border-[#FECACA]/60 dark:border-red-500/20',
      iconBg: 'bg-[#DC2626]/15 text-[#DC2626] dark:bg-red-500/20 dark:text-red-400',
      arrowBg: 'bg-white text-[#DC2626] shadow-sm hover:bg-[#DC2626] hover:text-white',
      badge: '24x7 Urgent',
      sparkleColor: 'text-red-400',
    },
  ];

  // Recommended 4 Services Carousel
  const recommendedItems = [
    {
      id: 'rec-1',
      title: 'Post-Matric Scholarship',
      org: 'Ministry of Education',
      category: 'Government',
      time: '6 min',
      icon: GraduationCap,
      iconColor: 'bg-emerald-500/10 text-emerald-600',
      description: 'Financial support for SC/ST/OBC students pursuing higher education.',
      tags: ['+ Voice', '+ Guided Steps'],
      serviceId: 'government-scholarship',
    },
    {
      id: 'rec-2',
      title: 'CityCare Hospital Appointment',
      org: 'Medical Department',
      category: 'Healthcare',
      time: '4 min',
      icon: Building2,
      iconColor: 'bg-blue-500/10 text-blue-600',
      description: 'Book OPD appointments at government hospitals.',
      tags: ['+ Voice', '+ Easy Booking'],
      serviceId: 'hospital-appointment',
    },
    {
      id: 'rec-3',
      title: 'Electricity Bill Payment',
      org: 'BESCOM Smart',
      category: 'Banking',
      time: '3 min',
      icon: Zap,
      iconColor: 'bg-indigo-500/10 text-indigo-600',
      description: 'Pay your electricity bill quickly and securely.',
      tags: ['Simplified'],
      serviceId: 'electricity-bill',
    },
    {
      id: 'rec-4',
      title: 'College Fee Payment',
      org: 'Education Smart',
      category: 'Education',
      time: '5 min',
      icon: FileText,
      iconColor: 'bg-amber-500/10 text-amber-600',
      description: 'Pay your college or university fees online.',
      tags: ['+ Voice', '+ Multi-language'],
      serviceId: 'government-scholarship',
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

  const speakText = (text: string) => {
    speak(text);
  };

  const [locationDenied, setLocationDenied] = useState<boolean>(false);

  // Live Google Places & Routes Nearby Hospitals Fetch
  useEffect(() => {
    let isMounted = true;
    const fetchLiveHospitals = async () => {
      try {
        let userLat = 12.9352;
        let userLng = 77.6245;

        if (typeof window !== 'undefined' && 'geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              userLat = pos.coords.latitude;
              userLng = pos.coords.longitude;
              if (isMounted) setLocationDenied(false);
              executeFetch(userLat, userLng);
            },
            (err) => {
              if (isMounted) setLocationDenied(true);
              executeFetch(userLat, userLng);
            },
            { timeout: 4000 }
          );
        } else {
          executeFetch(userLat, userLng);
        }

        async function executeFetch(lat: number, lng: number) {
          const res = await fetch(
            `/api/emergency/nearby-hospitals?lat=${lat}&lng=${lng}&category=${currentEmergencyCase.id}`
          );
          if (res.ok && isMounted) {
            const data = await res.json();
            if (data.hospitals && data.hospitals.length > 0) {
              const best = data.hospitals[0];
              const rest = data.hospitals.slice(1).map((h: any) => ({
                name: h.name,
                eta: `${h.etaMinutes} min`,
                distance: `${h.distanceKm} km`,
                status: h.demoAvailability || 'Emergency Active',
              }));

              setCurrentEmergencyCase((prev) => ({
                ...prev,
                hospitalName: best.name,
                address: best.address,
                lat: best.latitude,
                lng: best.longitude,
                eta: `${best.etaMinutes} min`,
                distance: `${best.distanceKm} km`,
                specialty: best.demoAvailability || prev.specialty,
                alternatives: rest.length > 0 ? rest : prev.alternatives,
              }));
            }
          }
        }
      } catch (err) {
        console.warn('Nearby hospital live fetch error:', err);
      }
    };

    fetchLiveHospitals();
    return () => {
      isMounted = false;
    };
  }, [currentEmergencyCase.id]);

  const handleSelectNewEmergency = (selectedCase: EmergencyCase) => {
    setCurrentEmergencyCase(selectedCase);
    speakText(`Emergency updated to ${selectedCase.condition}. Re-routing to ${selectedCase.hospitalName}. Estimated arrival ${selectedCase.eta}.`);
  };

  const handleStartEmergencyNav = () => {
    setIsEmergencyNavigating(true);
    speakText(`Navigating to ${currentEmergencyCase.hospitalName}. Estimated arrival ${currentEmergencyCase.eta}.`);
    
    // Open in Google Maps
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${currentEmergencyCase.lat},${currentEmergencyCase.lng}&travelmode=driving`;
    window.open(mapsUrl, '_blank');

    setTimeout(() => {
      setIsEmergencyNavigating(false);
    }, 3000);
  };

  const handleCallEmergency = () => {
    setEmergencyCallStatus('Calling 112 Emergency Dispatch...');
    speakText(`Connecting to 112 National Emergency Helpline for ${currentEmergencyCase.condition}.`);
    setTimeout(() => {
      setEmergencyCallStatus(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#ECECEC] dark:bg-[#121316] text-[#1E2024] dark:text-[#EAECEF] p-2 sm:p-4 md:p-6 font-sans transition-colors">
      
      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedServiceForModal}
        isOpen={Boolean(selectedServiceForModal)}
        onClose={() => setSelectedServiceForModal(null)}
        onAskAnukool={(query) => {
          speakText(`Explaining service: ${query}`);
        }}
        language={lang}
      />

      {/* Change Emergency Situation Modal */}
      <ChangeEmergencyModal
        isOpen={isChangeModalOpen}
        onClose={() => setIsChangeModalOpen(false)}
        currentCase={currentEmergencyCase}
        onSelectCase={handleSelectNewEmergency}
      />

      {/* ─────────────────────────────────────────────────────────────
          MAIN CANVAS SHELL (MATCHING REFERENCE IMAGE 1:1)
         ───────────────────────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto bg-[#ECECEC] dark:bg-[#18191D] rounded-[36px] p-3 sm:p-5 md:p-7 flex gap-5 sm:gap-6">
        
        {/* ═══════════════════════════════════════════════════════════
            LEFT DARK SIDEBAR PILL (EXACT ICONS AS SCREENSHOT)
           ═══════════════════════════════════════════════════════════ */}
        <aside className="hidden lg:flex flex-col justify-between w-16 py-6 rounded-[28px] bg-[#1A3328] dark:bg-[#13241D] text-white shrink-0 items-center shadow-lg border border-emerald-900/30">
          
          {/* Top Cluster */}
          <div className="flex flex-col items-center gap-4">
            <Link
              href="/"
              className="w-10 h-10 rounded-2xl text-emerald-200/60 hover:text-white flex items-center justify-center transition-colors"
              title="Home Dashboard"
            >
              <Home className="w-5 h-5" />
            </Link>

            {/* Active Services Icon Pill */}
            <button
              onClick={() => setActiveSidebarTab('services')}
              className="w-11 h-11 rounded-2xl bg-[#2D5A47] text-white shadow-md flex items-center justify-center transition-all scale-105 border border-emerald-400/30"
              title="Services Catalog"
            >
              <Layers className="w-5 h-5 text-emerald-300" />
            </button>

            <Link
              href="/audit"
              className="w-10 h-10 rounded-2xl text-emerald-200/60 hover:text-white flex items-center justify-center transition-colors"
              title="Activity & Audit"
            >
              <Activity className="w-5 h-5" />
            </Link>

            <Link
              href="/provider"
              className="w-10 h-10 rounded-2xl text-emerald-200/60 hover:text-white flex items-center justify-center transition-colors"
              title="My Access"
            >
              <KeyRound className="w-5 h-5" />
            </Link>

            <button
              onClick={() => router.push('/banking')}
              className="w-10 h-10 rounded-2xl text-emerald-200/60 hover:text-white flex items-center justify-center transition-colors"
              title="History"
            >
              <History className="w-5 h-5" />
            </button>

            <button
              onClick={() => router.push('/banking')}
              className="w-10 h-10 rounded-2xl text-emerald-200/60 hover:text-white flex items-center justify-center transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Support */}
          <div className="flex flex-col items-center gap-4">
            <Link
              href="/emergency"
              className="flex flex-col items-center gap-1 text-emerald-200/60 hover:text-white transition-colors"
              title="Support"
            >
              <Headphones className="w-5 h-5" />
              <span className="text-[9px] font-bold">Support</span>
            </Link>
          </div>

        </aside>

        {/* ═══════════════════════════════════════════════════════════
            MAIN 2-COLUMN SPLIT GRID
           ═══════════════════════════════════════════════════════════ */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* ═══════════════════════════════════════════════════════════
              LEFT PRIMARY COLUMN (8 COLS ON XL)
             ═══════════════════════════════════════════════════════════ */}
          <div className="xl:col-span-8 space-y-6">
            
            {/* UNIFIED HERO GREETING BANNER CARD WITH PHOTO */}
            <div className="relative rounded-[32px] bg-white dark:bg-[#232428] border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* Left Content Area */}
              <div className="flex-1 space-y-4 max-w-xl z-10">
                <div className="space-y-1">
                  <h1 className="text-3xl sm:text-4xl font-black text-[#1E2024] dark:text-white tracking-tight leading-tight">
                    {greetingTime}, <br className="hidden sm:inline" />
                    <span className="text-[#1E3A2F] dark:text-emerald-400">{firstName}.</span>
                  </h1>
                  
                  <div className="space-y-0.5 pt-1">
                    <p className="text-sm font-bold text-[#1E2024] dark:text-white">
                      What would you like to get done today?
                    </p>
                    <p className="text-xs text-[#8B929A] font-medium leading-relaxed">
                      ANUKOOL helps you discover and complete digital services in the way that works best for you.
                    </p>
                  </div>
                </div>

                {/* Embedded ANUKOOL Adaptive Intelligence Sub-Card */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-1.5 max-w-md">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-black text-[#1E2024] dark:text-white">
                      ANUKOOL Adaptive Intelligence
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] dark:text-slate-300 leading-relaxed">
                    Based on your accessibility profile, we prioritize services that are easier to navigate with voice and simplified steps.
                  </p>
                  <button
                    onClick={() => speakText('Recommended services prioritized for your profile are displayed below.')}
                    className="text-xs font-black text-[#1E3A2F] dark:text-emerald-400 hover:underline flex items-center gap-1 pt-0.5"
                  >
                    <span>Explore recommended</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Right Side: Senior Citizen Illustration Photo */}
              <div className="relative w-full md:w-64 sm:h-56 h-48 shrink-0 rounded-2xl overflow-hidden flex items-center justify-center">
                <img
                  src="/images/senior-hero.jpg"
                  alt="Senior citizen using smartphone with ANUKOOL"
                  className="w-full h-full object-cover object-center rounded-2xl shadow-inner"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent dark:from-[#232428] opacity-60 hidden md:block" />
              </div>

            </div>

            {/* ═══════════════════════════════════════════════════════════
                SECTION: QUICK ACTIONS (THE 6 ELEVATED PASTEL ACTION TILES)
               ═══════════════════════════════════════════════════════════ */}
            <div className="space-y-3">
              
              {/* Header with Title and 'View all actions ->' */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-black text-[#1E2024] dark:text-white flex items-center gap-1.5">
                    <span>Quick Actions</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                  </h3>
                  <p className="text-xs text-[#8B929A] font-medium">
                    Popular tasks you can do right away
                  </p>
                </div>

                <Link
                  href="/services"
                  className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1"
                >
                  <span>View all actions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* 6 Action Tiles Grid (1 Row on Desktop, 3x2 on Tablet, 2x3 on Mobile) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {quickActions.map((qa) => {
                  const Icon = qa.icon;
                  return (
                    <Link
                      key={qa.id}
                      href={qa.href}
                      className={`group p-4 rounded-[26px] ${qa.accentBg} border ${qa.borderColor} shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between min-h-[175px] relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#2563EB]`}
                      aria-label={`${qa.title}. ${qa.description}`}
                    >
                      {/* Top Row: Floating Squircle Icon + Sparkle */}
                      <div className="flex justify-between items-start">
                        <div className={`w-11 h-11 rounded-2xl ${qa.iconBg} flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <Sparkles className={`w-3 h-3 ${qa.sparkleColor} opacity-40 group-hover:opacity-100 transition-opacity`} />
                      </div>

                      {/* Middle: Title & Description */}
                      <div className="my-2 space-y-1">
                        <h4 className="font-black text-sm text-[#1E2024] dark:text-white leading-tight">
                          {qa.title}
                        </h4>
                        <p className="text-[11px] text-[#8B929A] font-medium leading-snug line-clamp-2">
                          {qa.description}
                        </p>
                      </div>

                      {/* Bottom-Right: Circular Arrow Button */}
                      <div className="flex justify-end pt-1">
                        <div className={`w-7 h-7 rounded-full ${qa.arrowBg} flex items-center justify-center text-xs font-bold transition-all group-hover:translate-x-0.5`}>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

            </div>

            {/* ═══════════════════════════════════════════════════════════
                SEARCH BAR (PILL SHAPE WITH MIC ICON)
               ═══════════════════════════════════════════════════════════ */}
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8B929A] pointer-events-none">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services, schemes, hospitals, bills, scholarships..."
                className="w-full p-3.5 pl-12 pr-12 rounded-full bg-white dark:bg-[#232428] border border-slate-200/90 dark:border-white/10 shadow-xs text-xs font-semibold text-[#1E2024] dark:text-white outline-none focus:ring-2 focus:ring-[#2563EB] transition-all"
              />
              <button
                onClick={() => speakText('Voice search active. Speak what you need.')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-[#2563EB]"
                aria-label="Voice Search"
                title="Voice Search"
              >
                <Mic className="w-4 h-4" />
              </button>
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
                    className={`px-4 py-2 rounded-full font-bold text-xs transition-all shrink-0 flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#1E3A2F] dark:bg-emerald-700 text-white shadow-xs'
                        : 'bg-white dark:bg-[#232428] text-[#1E2024] dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-[#1E3A2F]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ═══════════════════════════════════════════════════════════
                SECTION: RECOMMENDED FOR YOU (4 HORIZONTAL CARDS)
               ═══════════════════════════════════════════════════════════ */}
            {!searchQuery && selectedCategory === 'all' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-base text-[#1E2024] dark:text-white">
                    Recommended for you
                  </h3>
                  <button 
                    onClick={() => speakText('Displaying recommended scholarships, hospital booking, and utility bills.')}
                    className="text-xs font-bold text-[#2563EB] hover:underline"
                  >
                    View all &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {recommendedItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          const s = localizedServices.find(x => x.id === item.serviceId) || localizedServices[0];
                          setSelectedServiceForModal(s);
                        }}
                        className="p-4 rounded-[24px] bg-white dark:bg-[#232428] border border-slate-200/80 dark:border-white/10 shadow-xs hover:border-[#2563EB] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="text-[9px] font-bold text-[#2563EB] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-white/10 border border-blue-100 dark:border-white/10">
                              {item.category}
                            </span>
                            <span className="text-[10px] text-[#8B929A] flex items-center gap-1 font-medium">
                              <Clock className="w-3 h-3" />
                              <span>{item.time}</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-xl ${item.iconColor} flex items-center justify-center shrink-0`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-black text-xs text-[#1E2024] dark:text-white leading-tight group-hover:text-[#2563EB] transition-colors">
                                {item.title}
                              </h4>
                              <span className="text-[10px] text-[#8B929A] block font-medium">
                                {item.org}
                              </span>
                            </div>
                          </div>

                          <p className="text-[11px] text-[#8B929A] line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-1 flex-wrap">
                            {item.tags.map((t, idx) => (
                              <span key={idx} className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-[#2563EB] group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════
                SECTION: ALL SERVICES (24 ITEMS)
               ═══════════════════════════════════════════════════════════ */}
            <div className="space-y-3.5 pt-1">
              
              <div className="flex justify-between items-center">
                <h3 className="font-black text-base text-[#1E2024] dark:text-white">
                  All Services (24)
                </h3>
                <span className="text-xs text-[#8B929A] font-bold">
                  Sort: Most Relevant ▾
                </span>
              </div>

              {/* 4-column / 2-column Grid of Services */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedServiceForModal(service)}
                    className="p-4 rounded-[24px] bg-white dark:bg-[#232428] border border-slate-200/80 dark:border-white/10 shadow-xs hover:border-[#2563EB] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-bold text-[#2563EB] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-white/10 border border-blue-100 dark:border-white/10">
                          {service.badge || service.category}
                        </span>
                        <span className="text-[10px] text-[#8B929A] flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3" />
                          <span>{service.estimatedTime}</span>
                        </span>
                      </div>

                      <h4 className="font-black text-xs text-[#1E2024] dark:text-white group-hover:text-[#2563EB] transition-colors leading-tight">
                        {service.title}
                      </h4>

                      <p className="text-[10px] font-bold text-[#8B929A]">
                        {service.organization}
                      </p>

                      <p className="text-[11px] text-[#8B929A] line-clamp-2 leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[10px] font-bold text-[#2563EB]">
                      <span className="text-[#059669]">Voice Supported</span>
                      <span className="flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

          {/* ═══════════════════════════════════════════════════════════
              RIGHT SECONDARY COLUMN (4 COLS ON XL) — EMERGENCY AI ROUTER
             ═══════════════════════════════════════════════════════════ */}
          <div className="xl:col-span-4 space-y-4">
            
            {/* Top Search / Notification Bar matching screenshot */}
            <div className="flex items-center justify-end gap-2.5 pb-1">
              <button 
                onClick={() => speakText('Emergency AI Router is active with live Google Maps data and hospital routing.')}
                className="w-9 h-9 rounded-full bg-white dark:bg-[#232428] border border-slate-200 dark:border-white/10 flex items-center justify-center text-[#1E2024] dark:text-white shadow-xs relative"
                aria-label="Alerts"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-red-500 absolute top-2 right-2 ring-2 ring-white" />
              </button>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#232428] border border-slate-200 dark:border-white/10 shadow-xs text-xs text-[#8B929A]">
                <Search className="w-3.5 h-3.5" />
                <input 
                  type="text" 
                  placeholder="Search me..." 
                  className="bg-transparent outline-none w-20 text-xs font-medium text-[#1E2024] dark:text-white"
                />
              </div>

              <div className="w-9 h-9 rounded-full bg-[#1E2024] text-white font-serif font-bold text-sm flex items-center justify-center shadow-xs">
                {userInitial}
              </div>
            </div>

            {/* 🚨 THE EMERGENCY AI ROUTER CARD (REAL GOOGLE MAPS + INTERACTIVE CHANGE) */}
            <div className="p-5 rounded-[28px] bg-white dark:bg-[#232428] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
              
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500 font-bold text-base">🚨</span>
                    <h3 className="font-black text-base text-[#1E2024] dark:text-white">
                      Emergency AI Router
                    </h3>
                  </div>
                  <p className="text-xs text-[#8B929A] font-medium mt-0.5">
                    Fast care navigation when every minute matters.
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                    LIVE
                  </span>
                  <button 
                    onClick={() => setIsChangeModalOpen(true)}
                    className="text-slate-400 hover:text-slate-600"
                    title="Change Emergency Option"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* High Priority Prompt Box with FULLY FUNCTIONAL "Change" BUTTON */}
              <div className="p-3.5 rounded-2xl bg-red-50/70 dark:bg-red-950/20 border border-red-200/80 dark:border-red-900/30 space-y-1">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                    {currentEmergencyCase.priority}
                  </span>
                  
                  {/* FUNCTIONAL CHANGE BUTTON */}
                  <button 
                    onClick={() => setIsChangeModalOpen(true)}
                    className="text-slate-600 dark:text-slate-300 hover:text-[#2563EB] font-extrabold underline cursor-pointer transition-colors"
                  >
                    Change
                  </button>
                </div>

                <p className="text-xs font-bold text-[#1E2024] dark:text-white">
                  &ldquo;{currentEmergencyCase.query}&rdquo;
                </p>
              </div>

              {/* REAL GOOGLE MAPS ROUTE COMPONENT */}
              <GoogleMapEmergency
                hospital={{
                  name: currentEmergencyCase.hospitalName,
                  lat: currentEmergencyCase.lat,
                  lng: currentEmergencyCase.lng,
                  address: currentEmergencyCase.address,
                  eta: currentEmergencyCase.eta,
                  distance: currentEmergencyCase.distance,
                }}
                alternativeHospitals={currentEmergencyCase.alternatives.map((alt: any) => ({
                  name: alt.name,
                  lat: alt.latitude || currentEmergencyCase.lat + 0.015,
                  lng: alt.longitude || currentEmergencyCase.lng + 0.015,
                  eta: alt.eta,
                  distance: alt.distance,
                }))}
                onSelectHospital={(selected) => {
                  setCurrentEmergencyCase((prev) => ({
                    ...prev,
                    hospitalName: selected.name,
                    lat: selected.lat,
                    lng: selected.lng,
                    eta: selected.eta || prev.eta,
                    distance: selected.distance || prev.distance,
                  }));
                  speakText(`Route updated to ${selected.name}. Estimated arrival ${selected.eta || '15 min'}.`);
                }}
              />

              {/* Recommended Care Option Card (Dynamic based on selected case) */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#1E2024] dark:text-white">Recommended Care Option</span>
                  <button 
                    onClick={() => speakText(`${currentEmergencyCase.hospitalName} is the closest specialized hospital for ${currentEmergencyCase.condition} with ${currentEmergencyCase.specialty}.`)}
                    className="text-[11px] font-bold text-[#2563EB] hover:underline"
                  >
                    Why this?
                  </button>
                </div>

                {/* Main Best Match Hospital */}
                <div className="p-3.5 rounded-2xl bg-[#F0FDF4] dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 space-y-1.5 shadow-xs">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold text-xs">
                        🏥
                      </div>
                      <div>
                        <h4 className="font-black text-xs text-[#1E2024] dark:text-white">
                          {currentEmergencyCase.hospitalName}
                        </h4>
                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 block">
                          {currentEmergencyCase.specialty}
                        </span>
                      </div>
                    </div>

                    <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 rounded-full">
                      Best Match &rarr;
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] text-[#8B929A] font-bold pt-1">
                    <span>⏱ {currentEmergencyCase.eta}</span>
                    <span>&bull; {currentEmergencyCase.distance}</span>
                    <span className="text-emerald-600 dark:text-emerald-400">&bull; Open 24x7</span>
                  </div>
                </div>

                {/* Dynamic Alternative Hospitals List (Interactive click-to-route) */}
                <div className="space-y-1.5 pt-1">
                  {currentEmergencyCase.alternatives.map((alt: any, idx: number) => (
                    <div 
                      key={idx}
                      onClick={() => {
                        const newAltList = [
                          {
                            name: currentEmergencyCase.hospitalName,
                            eta: currentEmergencyCase.eta,
                            distance: currentEmergencyCase.distance,
                            status: 'Alternative Option',
                            latitude: currentEmergencyCase.lat,
                            longitude: currentEmergencyCase.lng,
                          },
                          ...currentEmergencyCase.alternatives.filter((_, i) => i !== idx),
                        ];

                        setCurrentEmergencyCase((prev) => ({
                          ...prev,
                          hospitalName: alt.name,
                          lat: alt.latitude || prev.lat + 0.012,
                          lng: alt.longitude || prev.lng + 0.012,
                          eta: alt.eta,
                          distance: alt.distance,
                          specialty: alt.status || 'Emergency Active',
                          alternatives: newAltList,
                        }));
                        speakText(`Route changed to ${alt.name}. ETA ${alt.eta}.`);
                      }}
                      className="p-3 rounded-2xl bg-[#ECECEC]/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-[#2563EB] hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-all cursor-pointer flex justify-between items-center text-xs group"
                      title="Click to view route on map"
                    >
                      <div>
                        <span className="font-bold text-[#1E2024] dark:text-white block text-xs group-hover:text-[#2563EB] transition-colors">
                          {alt.name}
                        </span>
                        <span className="text-[10px] text-[#8B929A]">
                          {alt.eta} &bull; {alt.distance} &bull; {alt.status}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  ))}
                </div>

              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleStartEmergencyNav}
                  className="w-full py-3.5 rounded-2xl bg-[#2563EB] hover:bg-blue-600 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  <span>{isEmergencyNavigating ? 'Opening Google Maps...' : 'Start Navigation (Live GPS)'}</span>
                </button>

                <button
                  onClick={handleCallEmergency}
                  className="w-full py-3.5 rounded-2xl bg-white dark:bg-[#1E2024] border border-slate-200 dark:border-white/10 hover:bg-red-50 hover:text-red-600 text-[#1E2024] dark:text-white font-extrabold text-xs shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-red-500" />
                  <span>{emergencyCallStatus || 'Call Emergency Services (112)'}</span>
                </button>

                {locationDenied && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-800 dark:text-amber-300 flex items-center justify-between">
                    <span>Location access needed. Using current regional area (Bengaluru).</span>
                  </div>
                )}

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-[9px] text-[#8B929A] leading-tight space-y-1">
                  <p className="font-bold text-slate-700 dark:text-slate-300">
                    &bull; ANUKOOL provides care-navigation assistance. It does not diagnose medical conditions.
                  </p>
                  <p>
                    Demo / simulated availability. For life-threatening emergencies, immediately call emergency dispatch (112).
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ═══════════════════════════════════════════════════════════
          FLOATING ANUKOOL VOICE AI BAR (AS PICTURED IN SCREENSHOT)
         ═══════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-4 right-4 sm:right-6 z-40 flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#181920] border-2 border-blue-500/40 text-white shadow-2xl backdrop-blur-md">
        <button
          onClick={() => speakText('Anukool Voice AI is listening. How can I help you?')}
          className="px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-600 font-black text-xs flex items-center gap-2 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Anukool Voice AI</span>
        </button>

        <button
          onClick={() => speakText('Listening for your command...')}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          title="Voice Mic"
        >
          <Mic className="w-4 h-4" />
        </button>

        <button
          onClick={() => speakText('Reading aloud active screen information.')}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          title="Audio Playback"
        >
          <Volume2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => speakText('ಕನ್ನಡ ಭಾಷೆಯಲ್ಲಿ ಸಹಾಯ ಲಭ್ಯವಿದೆ.')}
          className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-bold text-blue-300"
          title="Kannada"
        >
          ಕನ್ನಡ
        </button>

        <button
          onClick={() => speakText('हिंदी भाषा में सहायता उपलब्ध है।')}
          className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-bold text-amber-300"
          title="Hindi"
        >
          हिंदी
        </button>
      </div>

    </div>
  );
}
