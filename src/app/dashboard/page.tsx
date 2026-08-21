'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAccessibility } from '@/context/AccessibilityContext';
import { getTranslation, LANGUAGE_NAMES, getLocalizedService } from '@/lib/multilingualEngine';
import { MOCK_SERVICES } from '@/lib/servicesData';
import { 
  Building2, 
  Stethoscope, 
  CreditCard, 
  GraduationCap, 
  Search, 
  ArrowRight, 
  Clock, 
  Sparkles,
  Zap,
  HelpCircle,
  FileText
} from 'lucide-react';

export default function DashboardPage() {
  const { profile } = useAccessibility();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const t = (key: string, fallback?: string) => getTranslation(profile.language, key, fallback);

  const categories = [
    { id: 'all', label: t('allServices', 'All Services'), icon: Zap },
    { id: 'government', label: t('government', 'Government Services'), icon: Building2 },
    { id: 'healthcare', label: t('healthcare', 'Healthcare'), icon: Stethoscope },
    { id: 'banking', label: t('banking', 'Banking & Bills'), icon: CreditCard },
    { id: 'education', label: t('education', 'Education'), icon: GraduationCap },
  ];

  // Localize all services based on selected language
  const localizedServices = MOCK_SERVICES.map(service => getLocalizedService(profile.language, service));

  const filteredServices = localizedServices.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-10 py-4">
      
      {/* SECTION 1 — PERSONAL DIGITAL GATEWAY HEADER */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-acc-xs font-bold text-civic-blue uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-civic-amber" />
            <span>{t('personalGateway', 'NAYAN Personal Digital Gateway')}</span>
          </div>
          <div className="text-acc-xs font-semibold px-3 py-1 rounded-full bg-civic-navy text-white">
            {t('activeProfile')}: {LANGUAGE_NAMES[profile?.language || 'en']?.nativeName || LANGUAGE_NAMES[profile?.language || 'en']?.name || 'English'} &bull; {(profile?.textSize || 'normal').toUpperCase()}
          </div>
        </div>

        <h1 className="text-acc-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
          {t('goodMorning', 'Good morning.')} <span className="block text-civic-blue">{t('whatDoYouNeedToDo')}</span>
        </h1>
      </div>

      {/* SECTION 2 — TASK-ORIENTED SHORTCUTS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: t('payBill', 'Pay a bill'), href: '/services/electricity-bill', icon: CreditCard, color: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' },
          { label: t('applyScheme', 'Apply for scheme'), href: '/services/government-scholarship', icon: Building2, color: 'bg-blue-500/10 text-blue-700 border-blue-500/20' },
          { label: t('bookHospital', 'Book hospital'), href: '/services/hospital-appointment', icon: Stethoscope, color: 'bg-purple-500/10 text-purple-700 border-purple-500/20' },
          { label: t('simplifyText', 'Simplify text'), href: '/simplifier', icon: Sparkles, color: 'bg-amber-500/10 text-amber-700 border-amber-500/20' },
          { label: t('auditServiceShortcut', 'Audit service'), href: '/audit', icon: FileText, color: 'bg-cyan-500/10 text-cyan-700 border-cyan-500/20' },
          { label: t('emergencyHelp', 'Emergency help'), href: '/emergency', icon: HelpCircle, color: 'bg-red-500/10 text-red-700 border-red-500/20' },
        ].map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className={`p-4 rounded-2xl border ${item.color} hover:shadow-md transition-all flex flex-col items-start justify-between min-h-[100px] focus:ring-4 focus:ring-civic-blue`}
          >
            <item.icon className="w-6 h-6" />
            <span className="font-extrabold text-acc-sm text-[var(--text-primary)]">
              {item.label}
            </span>
          </Link>
        ))}
      </div>

      {/* SECTION 3 — SEARCH & CATEGORY FILTERING */}
      <div className="space-y-4">
        
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full p-4 pl-12 rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] font-semibold text-acc-base focus:border-civic-blue focus:ring-4 focus:ring-civic-blue outline-none"
          />
          <Search className="w-5 h-5 text-[var(--text-secondary)] absolute left-4 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl font-bold text-acc-sm whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-civic-blue text-white shadow-md'
                  : 'bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-black/5'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

      </div>

      {/* SECTION 4 — ACCESSIBLE SERVICE DIRECTORY LIST */}
      <div className="space-y-4">
        <h2 className="text-acc-xl font-extrabold text-[var(--text-primary)]">
          {t('services', 'Services')} ({filteredServices.length})
        </h2>

        {filteredServices.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-secondary)]">
            {t('noServicesFound', 'No services found matching your search.')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="p-6 rounded-3xl bg-[var(--bg-surface)] border-2 border-[var(--border-color)] hover:border-civic-blue transition-all space-y-4 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-civic-blue/10 text-civic-blue font-bold text-acc-xs">
                      {service.badge}
                    </span>
                    <span className="flex items-center gap-1 text-acc-xs text-[var(--text-secondary)] font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {service.estimatedTime}
                    </span>
                  </div>

                  <h3 className="text-acc-xl font-extrabold text-[var(--text-primary)] leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-acc-xs font-semibold text-civic-blue">
                    {service.organization}
                  </p>
                  <p className="text-acc-sm text-[var(--text-secondary)] leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Action Link */}
                <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                  <span className="text-acc-xs font-bold text-[var(--text-secondary)]">
                    {service.steps.length} {t('step', 'Steps')} &bull; {t('adaptWithNayan', 'Adapted View Available')}
                  </span>
                  <Link
                    href={`/services/${service.id}`}
                    className="px-5 py-2.5 rounded-xl bg-civic-blue text-white font-extrabold text-acc-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <span>{t('startService', 'Start Service')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
