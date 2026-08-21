'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  Mic, 
  Send, 
  CreditCard, 
  Clock, 
  HelpCircle,
  ShieldCheck,
  Zap,
  Globe,
  Hand
} from 'lucide-react';

export default function BankingComparePage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4 text-white font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/banking"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Adaptive Banking</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Signature Comparison View
          </span>
        </div>
      </div>

      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
          Same banking service. <span className="text-blue-400 block sm:inline">Different experience.</span>
        </h1>
        <p className="text-sm text-zinc-400 font-medium">
          Technology should adapt to people. People should not have to adapt to technology.
        </p>
      </div>

      {/* SIDE-BY-SIDE SPLIT SCREEN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* LEFT: STANDARD BANKING (BEFORE) */}
        <div className="p-8 rounded-3xl bg-zinc-950 border-2 border-red-500/30 shadow-2xl flex flex-col justify-between space-y-6 relative opacity-85">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <h3 className="text-lg font-black text-white">STANDARD BANKING PORTAL</h3>
              </div>
              <span className="text-[11px] font-bold text-red-400 uppercase bg-red-500/10 px-2.5 py-0.5 rounded-full">
                Fixed Interface
              </span>
            </div>

            {/* Simulated Cluttered 12-Item Dense UI */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3 font-sans">
              <div className="text-[11px] font-mono text-zinc-500">SAVINGS A/C: 123456781234 | CIF: 998822</div>
              <div className="text-2xl font-bold text-zinc-300">₹42,850.00</div>

              <div className="grid grid-cols-3 gap-1.5 pt-2 text-[10px] text-zinc-400">
                {[
                  'Fund Transfer (NEFT/RTGS)',
                  'IMPS P2P Transfer',
                  'UPI AutoPay Mandates',
                  'Fixed Deposit (FD/RD)',
                  'Bill Presentment (BBPS)',
                  'Credit Card Portal',
                  'Mutual Funds & IPOs',
                  'Cheque Book Request',
                  'Form 16A / TDS Tax',
                  'Nominee Registry Update',
                  'Forex Remittance Service',
                  'Customer Grievance Form',
                ].map((item, i) => (
                  <div key={i} className="p-2 rounded bg-black/40 border border-zinc-800 text-center truncate">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Friction Points Checklist */}
            <div className="space-y-2 pt-2 text-xs">
              {[
                { text: '12-15 cluttered menu options on main screen', status: 'fail' },
                { text: 'Tiny 11px font with high visual density', status: 'fail' },
                { text: 'English-heavy terminology (NEFT, CIF, Mandates)', status: 'fail' },
                { text: 'Strict touch precision required (zero motor assist)', status: 'fail' },
                { text: 'No voice banking or native language speech translation', status: 'fail' },
                { text: 'Blanket transaction blocking instead of contextual guidance', status: 'fail' },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-zinc-300">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/20 text-center">
            <span className="text-xs font-bold text-red-300">
              High cognitive load &bull; Excludes millions of citizens
            </span>
          </div>

        </div>

        {/* RIGHT: NAYAN ADAPTIVE BANKING (AFTER) */}
        <div className="p-8 rounded-3xl bg-gradient-to-b from-blue-950/40 via-zinc-950 to-black border-2 border-blue-500/80 shadow-2xl flex flex-col justify-between space-y-6 relative ring-4 ring-blue-500/20">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-blue-500/30 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <h3 className="text-lg font-black text-white">NAYAN ADAPTIVE EXPERIENCE</h3>
              </div>
              <span className="text-[11px] font-bold text-blue-300 uppercase bg-blue-500/20 px-2.5 py-0.5 rounded-full border border-blue-500/30">
                Persona Adapted
              </span>
            </div>

            {/* Simulated Clean 4-Action Adaptive UI */}
            <div className="p-5 rounded-2xl bg-zinc-900 border-2 border-blue-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-blue-400">GOOD MORNING, RAMESH</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                  SteadyTap 100%
                </span>
              </div>
              <div className="text-3xl font-black text-white">₹42,850.00</div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="p-3 rounded-xl bg-blue-600 text-white font-extrabold text-xs flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  <span>ಹಣ ಕಳುಹಿಸಿ (Send)</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-800 text-white font-extrabold text-xs flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>ಬ್ಯಾಲೆನ್ಸ್ (Balance)</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-800 text-white font-extrabold text-xs flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span>ಇತ್ತೀಚಿನ ಪಾವತಿ (Recent)</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-800 text-white font-extrabold text-xs flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>ಸಹಾಯ (Help)</span>
                </div>
              </div>
            </div>

            {/* Key Advantages Checklist */}
            <div className="space-y-2 pt-2 text-xs">
              {[
                { text: '4 relevant primary actions tailored to active user intent', status: 'pass' },
                { text: 'Generous 68px hit targets with SteadyTap™ anti-tremor dampening', status: 'pass' },
                { text: 'Complete Kannada/Hindi native voice translation & speech input', status: 'pass' },
                { text: 'Adaptive Friction Engine protects against accidental high-value transfers', status: 'pass' },
                { text: 'Zero space clutter — respects cognitive load & digital literacy', status: 'pass' },
                { text: 'Accessible to elderly, low-literacy, visual, and motor-impaired users', status: 'pass' },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-zinc-200 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/banking"
              className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>Experience NAYAN Adaptive Banking Now</span>
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
