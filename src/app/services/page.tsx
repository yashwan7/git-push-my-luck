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
import { DocumentAssistModal } from '@/components/anukool/DocumentAssistModal';
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
  Camera,
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
  const { speak, isSpeaking, setIsAssistantModalOpen, startListening } = useVoice();
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
  const [isDocAssistModalOpen, setIsDocAssistModalOpen] = useState<boolean>(false);
  const [isBankingSubmenuOpen, setIsBankingSubmenuOpen] = useState<boolean>(false);

  const lang = profile.language;

  // Dynamic User Greeting
  const userDisplayName = authProfile?.fullName || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const firstName = userDisplayName.split(' ')[0] || 'User';
  const userInitial = userDisplayName.charAt(0).toUpperCase();

  // Time of day calculation & multilingual greeting
  const hour = new Date().getHours();
  const getGreeting = () => {
    if (lang === 'kn') {
      return hour < 12 ? 'ಶುಭೋದಯ' : hour < 17 ? 'ಶುಭ ಅಪರಾಹ್ನ' : 'ಶುಭ ಸಂಜೆ';
    }
    if (lang === 'hi') {
      return hour < 12 ? 'शुभ प्रभात' : hour < 17 ? 'शुभ दोपहर' : 'शुभ संध्या';
    }
    if (lang === 'ta') {
      return hour < 12 ? 'காலை வணக்கம்' : hour < 17 ? 'மதிய வணக்கம்' : 'மாலை வணக்கம்';
    }
    if (lang === 'te') {
      return hour < 12 ? 'శుభోదయం' : hour < 17 ? 'శుభ మధ్యాహ్నం' : 'శుభ సాయంత్రం';
    }
    return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  };

  // Comprehensive localized text mapping for services dashboard
  const t = (key: string, fallback: string) => {
    const dict: Record<string, Record<string, string>> = {
      kn: {
        hero_question: 'ಇಂದು ನೀವು ಯಾವ ಸೇವೆಯನ್ನು ಬಳಸಲು ಬಯಸುತ್ತೀರಿ?',
        hero_subtitle: 'ಅನುಕೂಲವು ನಿಮ್ಮ ಸಾಮರ್ಥ್ಯ ಮತ್ತು ಆದ್ಯತೆಗಳಿಗೆ ತಕ್ಕಂತೆ ಡಿಜಿಟಲ್ ಸೇವೆಗಳನ್ನು ಸುಲಭವಾಗಿ ಪೂರ್ಣಗೊಳಿಸಲು ನೆರವಾಗುತ್ತದೆ.',
        adaptive_intel: 'ಅನುಕೂಲ ಹೊಂದಿಕೊಳ್ಳುವ ಬುದ್ಧಿವಂತಿಕೆ',
        adaptive_desc: 'ನಿಮ್ಮ ಪ್ರವೇಶಿಸುವಿಕೆ ಪ್ರೊಫೈಲ್ ಆಧಾರದ ಮೇಲೆ, ಧ್ವನಿ ಮತ್ತು ಸರಳ ಹಂತಗಳೊಂದಿಗೆ ಬಳಸಲು ಸುಲಭವಾದ ಸೇವೆಗಳಿಗೆ ಆದ್ಯತೆ ನೀಡಲಾಗಿದೆ.',
        explore_rec: 'ಶಿಫಾರಸು ಮಾಡಿದ ಸೇವೆಗಳನ್ನು ನೋಡಿ',
        quick_actions: 'ತ್ವರಿತ ಕಾರ್ಯಗಳು',
        quick_actions_sub: 'ತಕ್ಷಣವೇ ಮಾಡಬಹುದಾದ ಜನಪ್ರಿಯ ಸೇವೆಗಳು',
        view_all_actions: 'ಎಲ್ಲಾ ಸೇವೆಗಳು',
        search_placeholder: 'ಸೇವೆಗಳು, ಯೋಜನೆಗಳು, ಆಸ್ಪತ್ರೆ, ಬಿಲ್‌ಗಳನ್ನು ಹುಡುಕಿ...',
        recommended_for_you: 'ನಿಮಗಾಗಿ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ',
        view_all: 'ಎಲ್ಲಾ ನೋಡಿ',
        all_services_catalog: 'ಎಲ್ಲಾ ಸೇವೆಗಳ ಪಟ್ಟಿ',
        all_services_sub: 'ಯಾವುದೇ ಸಾರ್ವಜನಿಕ ಅಥವಾ ನಾಗರಿಕ ಸೇವೆಯನ್ನು ಪ್ರವೇಶಿಸಿ',
        emergency_router: 'ತುರ್ತು AI ಮಾರ್ಗದರ್ಶಿ',
        emergency_sub: 'ಪ್ರತಿ ನಿಮಿಷವೂ ಮುಖ್ಯವಾದಾಗ ವೇಗದ ಆರೈಕೆ ಮಾರ್ಗ.',
        high_priority: 'ಹೆಚ್ಚಿನ ಆದ್ಯತೆ',
        change: 'ಬದಲಾಯಿಸಿ',
        recommended_care: 'ಶಿಫಾರಸು ಮಾಡಿದ ಆರೈಕೆ ಆಯ್ಕೆ',
        why_this: 'ಏಕೆ ಇದು?',
        voice_supported: 'ಧ್ವನಿ ಬೆಂಬಲಿತ',
        view: 'ನೋಡಿ',
        start_action: 'ಆರಂಭಿಸಿ',
        cat_all: 'ಎಲ್ಲಾ ಸೇವೆಗಳು',
        cat_govt: 'ಸರ್ಕಾರಿ ಸೇವೆಗಳು',
        cat_health: 'ಆರೋಗ್ಯ ಸೇವೆಗಳು',
        cat_bank: 'ಬ್ಯಾಂಕಿಂಗ್ ಮತ್ತು ಬಿಲ್‌ಗಳು',
        cat_edu: 'ಶಿಕ್ಷಣ',
        cat_emergency: 'ತುರ್ತು ಸೇವೆ',
        qa_bill_title: 'ಬಿಲ್ ಪಾವತಿಸಿ',
        qa_bill_desc: 'ವಿದ್ಯುತ್, ಮೊಬೈಲ್, ಡಿಟಿಎಚ್ ಮತ್ತು ಇನ್ನಷ್ಟು',
        qa_scheme_title: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗೆ ಅರ್ಜಿ',
        qa_scheme_desc: 'ವಿದ್ಯಾರ್ಥಿವೇತನ ಮತ್ತು ಅನುದಾನಗಳು',
        qa_hospital_title: 'ಆಸ್ಪತ್ರೆ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್',
        qa_hospital_desc: 'ವೈದ್ಯರ ಭೇಟಿಯ ಸಮಯ ಕಾಯ್ದಿರಿಸಿ',
        qa_simplify_title: 'ಪಠ್ಯ ಸರಳಗೊಳಿಸಿ',
        qa_simplify_desc: 'ಕಠಿಣ ವಿಷಯವನ್ನು ಸುಲಭವಾಗಿಸಿ',
        qa_audit_title: 'ಸೇವೆಯ ಗುಣಮಟ್ಟ ಪರಿಶೀಲಿಸಿ',
        qa_audit_desc: 'ಯಾವುದೇ ಪೋರ್ಟಲ್‌ನ ಸುಲಭತೆ ಪರೀಕ್ಷಿಸಿ',
        qa_emergency_title: 'ತುರ್ತು ಸಹಾಯ',
        qa_emergency_desc: 'ತಕ್ಷಣ ತುರ್ತು ಬೆಂಬಲ ಪಡೆಯಿರಿ',
        simulated_beds: 'ಲಭ್ಯವಿರುವ ಹಾಸಿಗೆಗಳು: 12',
      },
      hi: {
        hero_question: 'आज आप क्या करना चाहते हैं?',
        hero_subtitle: 'अनुकूल आपकी प्राथमिकताओं के अनुसार डिजिटल सेवाओं को सरल बनाता है।',
        adaptive_intel: 'अनुकूल एडैप्टिव इंटेलिजेंस',
        adaptive_desc: 'आपकी एक्सेसिबिलिटी प्रोफ़ाइल के आधार पर, हमने उपयोग में आसान सेवाओं को प्राथमिकता दी है।',
        explore_rec: 'अनुशंसित सेवाएं देखें',
        quick_actions: 'त्वरित सेवाएं',
        quick_actions_sub: 'लोकप्रिय कार्य जो आप तुरंत कर सकते हैं',
        view_all_actions: 'सभी कार्य देखें',
        search_placeholder: 'सेवाएं, योजनाएं, अस्पताल, बिल, छात्रवृत्ति खोजें...',
        recommended_for_you: 'आपके लिए अनुशंसित',
        view_all: 'सभी देखें',
        all_services_catalog: 'सभी सेवाओं की सूची',
        all_services_sub: 'नागरिक एवं आवश्यक सेवाओं तक आसानी से पहुंचें',
        emergency_router: 'आपातकालीन AI राउटर',
        emergency_sub: 'जब हर मिनट महत्वपूर्ण हो, त्वरित सहायता और मार्ग।',
        high_priority: 'उच्च प्राथमिकता',
        change: 'बदलें',
        recommended_care: 'अनुशंसित अस्पताल',
        why_this: 'यह क्यों?',
        voice_supported: 'वॉयस समर्थित',
        view: 'देखें',
        start_action: 'शुरू करें',
        cat_all: 'सभी सेवाएं',
        cat_govt: 'सरकारी सेवाएं',
        cat_health: 'स्वास्थ्य सेवाएं',
        cat_bank: 'बैंकिंग और बिल',
        cat_edu: 'शिक्षा',
        cat_emergency: 'आपातकाल',
        qa_bill_title: 'बिल भरें',
        qa_bill_desc: 'बिजली, मोबाइल, डीटीएच और अन्य',
        qa_scheme_title: 'योजना के लिए आवेदन',
        qa_scheme_desc: 'सरकारी योजनाएं और छात्रवृत्ति',
        qa_hospital_title: 'अस्पताल अपॉइंटमेंट',
        qa_hospital_desc: 'डॉक्टर से परामर्श बुक करें',
        qa_simplify_title: 'सरल भाषा में समझें',
        qa_simplify_desc: 'कठिन सरकारी नियमों को सरल बनाएं',
        qa_audit_title: 'सेवा की सुगमता जांचें',
        qa_audit_desc: 'किसी भी पोर्टल का ऑडिट करें',
        qa_emergency_title: 'आपातकालीन सहायता',
        qa_emergency_desc: 'तत्काल 112 सहायता प्राप्त करें',
        simulated_beds: 'उपलब्ध बेड: 12',
      },
    };

    if (dict[lang] && dict[lang][key]) {
      return dict[lang][key];
    }
    return getTranslation(lang, key, fallback);
  };

  // Localize all services based on active language
  const localizedServices: ServiceDefinition[] = useMemo(() => {
    return MOCK_SERVICES.map(service => getLocalizedService(lang, service));
  }, [lang]);

  // Categories Definition
  const categories = [
    { id: 'all', label: t('cat_all', 'All Services'), icon: Zap },
    { id: 'government', label: t('cat_govt', 'Government Services'), icon: Building2 },
    { id: 'healthcare', label: t('cat_health', 'Healthcare'), icon: Stethoscope },
    { id: 'banking', label: t('cat_bank', 'Banking & Bills'), icon: CreditCard },
    { id: 'education', label: t('cat_edu', 'Education'), icon: GraduationCap },
    { id: 'emergency', label: t('cat_emergency', 'Emergency'), icon: Siren },
  ];

  // 🌟 THE 6 PREMIUM ELEVATED ACTION TILES (MATCHING REFERENCE IMAGE 1:1)
  const quickActions = [
    {
      id: 'qa-bill',
      title: t('qa_bill_title', 'Pay a Bill'),
      description: t('qa_bill_desc', 'Electricity, Mobile, DTH & more'),
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
      title: t('qa_scheme_title', 'Apply for Scheme'),
      description: t('qa_scheme_desc', 'Government schemes & grants'),
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
      title: t('qa_hospital_title', 'Book Hospital'),
      description: t('qa_hospital_desc', 'Find & book appointments'),
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
      title: t('qa_simplify_title', 'Simplify Text'),
      description: t('qa_simplify_desc', 'Make complex content easy'),
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
      title: t('qa_audit_title', 'Audit Service'),
      description: t('qa_audit_desc', 'Check accessibility of any service'),
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
      title: t('qa_emergency_title', 'Emergency Help'),
      description: t('qa_emergency_desc', 'Get urgent support instantly'),
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

      {/* Document Snap-to-Form Assist Modal */}
      <DocumentAssistModal
        isOpen={isDocAssistModalOpen}
        onClose={() => setIsDocAssistModalOpen(false)}
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
      <div className="w-full bg-white dark:bg-[#18191D] rounded-[36px] p-4 sm:p-6 md:p-7 flex gap-5 sm:gap-6 shadow-sm border border-slate-200/80 dark:border-white/10">
        
        {/* ═══════════════════════════════════════════════════════════
            LEFT DARK SIDEBAR PILL (CLEAN: HOME, SERVICES, BANKING, DOC ASSIST, SUPPORT)
           ═══════════════════════════════════════════════════════════ */}
        <aside className="hidden lg:flex flex-col justify-between w-16 py-6 rounded-[28px] bg-[#1A3328] dark:bg-[#13241D] text-white shrink-0 items-center shadow-lg border border-emerald-900/30 relative">
          
          {/* Top Cluster */}
          <div className="flex flex-col items-center gap-4">
            <Link
              href="/"
              className="w-10 h-10 rounded-2xl text-emerald-200/60 hover:text-white flex items-center justify-center hover:bg-white/10 transition-all"
              title="Home Dashboard"
            >
              <Home className="w-5 h-5" />
            </Link>

            {/* Active Services Icon Pill */}
            <Link
              href="/services"
              className="w-11 h-11 rounded-2xl bg-[#2D5A47] text-white shadow-md flex items-center justify-center transition-all scale-105 border border-emerald-400/30"
              title="Services Catalog"
            >
              <Layers className="w-5 h-5 text-emerald-300" />
            </Link>

            {/* 🏦 Banking Main Icon Button (Direct Navigation to /banking Dashboard) */}
            <Link
              href="/banking"
              className="w-10 h-10 rounded-2xl text-emerald-200/60 hover:text-white flex items-center justify-center hover:bg-white/10 transition-all cursor-pointer"
              title="Inclusive Banking Dashboard"
            >
              <Wallet className="w-5 h-5 text-emerald-300" />
            </Link>

            {/* 📷 Dedicated Document Assist Slot (Smoothly shifts down when Banking expands) */}
            <button
              onClick={() => {
                setIsBankingSubmenuOpen(false); // Roll back banking on selecting other option
                setIsDocAssistModalOpen(true);
              }}
              className="w-10 h-10 rounded-2xl text-emerald-300 hover:text-white flex items-center justify-center hover:bg-white/10 transition-all cursor-pointer relative group"
              title="Document Snap-to-Form Assist"
            >
              <Camera className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-1.5 right-1.5 ring-2 ring-[#1A3328]" />
            </button>
          </div>

          {/* Bottom Support / Emergency */}
          <div className="flex flex-col items-center gap-4">
            <Link
              href="/emergency"
              onClick={() => setIsBankingSubmenuOpen(false)} // Roll back banking on selecting other option
              className="flex flex-col items-center gap-1 text-emerald-200/60 hover:text-white transition-colors"
              title="Emergency & Support"
            >
              <Headphones className="w-5 h-5" />
              <span className="text-[9px] font-bold">Support</span>
            </Link>
          </div>

        </aside>

        {/* ═══════════════════════════════════════════════════════════
            MAIN FULL-WIDTH EXPANSIVE CONTENT CONTAINER
           ═══════════════════════════════════════════════════════════ */}
        <div className="flex-1 space-y-6 max-w-[1400px]">
            
          {/* UNIFIED HERO GREETING BANNER CARD WITH PHOTO */}
          <div className="relative rounded-[32px] bg-white dark:bg-[#232428] border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* Left Content Area */}
              <div className="flex-1 space-y-4 max-w-xl z-10">
                <div className="space-y-1">
                  <h1 className="text-3xl sm:text-4xl font-black text-[#1E2024] dark:text-white tracking-tight leading-tight">
                    {getGreeting()}, <br className="hidden sm:inline" />
                    <span className="text-[#1E3A2F] dark:text-emerald-400">{firstName}.</span>
                  </h1>
                  
                  <div className="space-y-0.5 pt-1">
                    <p className="text-sm font-bold text-[#1E2024] dark:text-white">
                      {t('hero_question', 'What would you like to get done today?')}
                    </p>
                    <p className="text-xs text-[#8B929A] font-medium leading-relaxed">
                      {t('hero_subtitle', 'ANUKOOL helps you discover and complete digital services in the way that works best for you.')}
                    </p>
                  </div>
                </div>

                {/* Embedded ANUKOOL Adaptive Intelligence Sub-Card */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-1.5 max-w-md">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-black text-[#1E2024] dark:text-white">
                      {t('adaptive_intel', 'ANUKOOL Adaptive Intelligence')}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] dark:text-slate-300 leading-relaxed">
                    {t('adaptive_desc', 'Based on your accessibility profile, we prioritize services that are easier to navigate with voice and simplified steps.')}
                  </p>
                  <button
                    onClick={() => speakText('Recommended services prioritized for your profile are displayed below.')}
                    className="text-xs font-black text-[#1E3A2F] dark:text-emerald-400 hover:underline flex items-center gap-1 pt-0.5"
                  >
                    <span>{t('explore_rec', 'Explore recommended')}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Right Side: Senior Citizen Photo (1:1 Matching User Screenshot) */}
              <div className="relative w-full md:w-72 lg:w-80 h-52 sm:h-60 shrink-0 rounded-[26px] overflow-hidden shadow-sm border border-slate-200/80 dark:border-white/10 bg-slate-100 dark:bg-zinc-800">
                <img
                  src="/images/senior-hero.jpg"
                  alt="Senior citizen using smartphone with ANUKOOL digital assistance"
                  className="w-full h-full object-cover object-center hover:scale-102 transition-transform duration-300"
                />
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
                    <span>{t('quick_actions', 'Quick Actions')}</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                  </h3>
                  <p className="text-xs text-[#8B929A] font-medium">
                    {t('quick_actions_sub', 'Popular tasks you can do right away')}
                  </p>
                </div>

                <Link
                  href="/services"
                  className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1"
                >
                  <span>{t('view_all_actions', 'View all actions')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* 6 Prominent Big Action Cards (3 in a row on desktop) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {quickActions.map((qa) => {
                  const Icon = qa.icon;
                  return (
                    <Link
                      key={qa.id}
                      href={qa.href}
                      className={`group p-5 sm:p-6 rounded-[28px] ${qa.accentBg} border ${qa.borderColor} shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between min-h-[190px] sm:min-h-[205px] relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#2563EB]`}
                      aria-label={`${qa.title}. ${qa.description}`}
                    >
                      {/* Top Row: Floating Squircle Icon + Sparkle Badge */}
                      <div className="flex justify-between items-start">
                        <div className={`w-13 h-13 rounded-2xl ${qa.iconBg} flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/70 dark:bg-black/40 border border-white/40 text-[10px] font-extrabold text-slate-700 dark:text-slate-200 shadow-2xs">
                          <Sparkles className={`w-3 h-3 ${qa.sparkleColor}`} />
                          <span>{qa.badge}</span>
                        </div>
                      </div>

                      {/* Middle: Title & Description */}
                      <div className="my-3 space-y-1.5">
                        <h4 className="font-black text-base sm:text-lg text-[#1E2024] dark:text-white leading-tight">
                          {qa.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-[#8B929A] dark:text-slate-300 font-medium leading-relaxed">
                          {qa.description}
                        </p>
                      </div>

                      {/* Bottom-Right: Circular Arrow Button */}
                      <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5">
                        <span className="text-[11px] font-bold text-[#1E2024]/70 dark:text-white/70 group-hover:text-[#2563EB] transition-colors">
                          Start Action →
                        </span>
                        <div className={`w-8 h-8 rounded-full ${qa.arrowBg} flex items-center justify-center text-xs font-bold transition-all group-hover:scale-110 shadow-xs`}>
                          <ArrowRight className="w-4 h-4" />
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
                placeholder={t('search_placeholder', 'Search services, schemes, hospitals, bills, scholarships...')}
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
                    {t('recommended_for_you', 'Recommended for you')}
                  </h3>
                  <button 
                    onClick={() => speakText('Displaying recommended scholarships, hospital booking, and utility bills.')}
                    className="text-xs font-bold text-[#2563EB] hover:underline"
                  >
                    {t('view_all', 'View all')} &rarr;
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
                          <div className="flex gap-1 flex-wrap">
                            {item.tags.map((tg, i) => (
                              <span key={i} className="text-[9px] font-extrabold text-[#059669] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-md">
                                {tg}
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
                  {t('all_services_catalog', 'All Services')} ({filteredServices.length})
                </h3>
                <span className="text-xs text-[#8B929A] font-bold">
                  {t('all_services_sub', 'Explore public services')}
                </span>
              </div>

              {/* 4-column Grid of Services */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
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
                      <span className="text-[#059669]">{t('voice_supported', 'Voice Supported')}</span>
                      <span className="flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        <span>{t('view', 'View')}</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>

      {/* ═══════════════════════════════════════════════════════════
          FLOATING ANUKOOL VOICE AI BAR (AS PICTURED IN SCREENSHOT)
         ═══════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-4 right-4 sm:right-6 z-40 flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#181920] border-2 border-emerald-500/40 text-white shadow-2xl backdrop-blur-md">
        <button
          onClick={() => setIsAssistantModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-[#1E3A2F] hover:bg-[#2D5A47] text-white font-black text-xs flex items-center gap-2 transition-all shadow-md"
          title="Open ANUKOOL Voice AI Assistant"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
          <span>Anukool Voice AI</span>
        </button>

        <button
          onClick={() => {
            setIsAssistantModalOpen(true);
            startListening();
          }}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          title="Voice Mic"
        >
          <Mic className="w-4 h-4 text-emerald-400" />
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
