'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  X, 
  Wallet, 
  CreditCard, 
  Send, 
  QrCode, 
  Receipt, 
  Eye, 
  EyeOff, 
  Volume2, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  ChevronRight
} from 'lucide-react';
import { useAccessibility } from '@/context/AccessibilityContext';
import { useVoice } from '@/context/VoiceContext';
import { getTranslation } from '@/lib/multilingualEngine';
import { MOCK_BANK_ACCOUNT, MOCK_TRANSACTIONS, MOCK_BENEFICIARIES } from '@/lib/bankingMockData';

interface BankingAssistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BankingAssistModal({ isOpen, onClose }: BankingAssistModalProps) {
  const router = useRouter();
  const { profile } = useAccessibility();
  const { speak } = useVoice();
  const t = (key: string, fallback?: string) => getTranslation(profile.language, key, fallback);

  const [isBalanceHidden, setIsBalanceHidden] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'quick_send' | 'history'>('overview');
  const [quickSendAmount, setQuickSendAmount] = useState<string>('500');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(MOCK_BENEFICIARIES[0]);
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const balance = MOCK_BANK_ACCOUNT.availableBalance;
  const formattedBalance = isBalanceHidden 
    ? '••••••' 
    : `₹${balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  const handleReadBalance = () => {
    speak(`Your available balance in State Bank of India is ${balance.toLocaleString('en-IN')} Rupees.`);
  };

  const handleQuickSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSendSuccess(true);
    speak(`Payment of ${quickSendAmount} Rupees sent successfully to ${selectedBeneficiary.name}.`);
    setTimeout(() => {
      setSendSuccess(false);
      setActiveTab('overview');
    }, 1800);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/75 backdrop-blur-md overflow-y-auto font-sans animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="banking-assist-title"
    >
      <div className="relative w-full max-w-xl bg-white dark:bg-[#14161D] rounded-[32px] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[88vh]">
        
        {/* ═══════════════════════════════════════════════════════════
            TOP HEADER
           ═══════════════════════════════════════════════════════════ */}
        <header className="px-6 py-4.5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/80 dark:bg-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#134233] text-white flex items-center justify-center shadow-md">
              <Wallet className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="banking-assist-title" className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
                  {t('bankingOverview', 'Banking & Direct Benefit')}
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                  DBT Linked
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                State Bank of India • Acc {MOCK_BANK_ACCOUNT.maskedAccountNumber}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/60 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* ═══════════════════════════════════════════════════════════
            MODAL BODY CONTENT
           ═══════════════════════════════════════════════════════════ */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* ── 💳 ELEVATED DEBIT / BENEFIT CARD BANNER ── */}
          <div className="p-5 rounded-[26px] bg-gradient-to-br from-[#134233] to-[#0A261D] text-white shadow-lg relative overflow-hidden space-y-4">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black tracking-wider uppercase text-emerald-300/90 block">
                  Savings & Benefit Account
                </span>
                <span className="text-xs font-bold text-emerald-100/80">
                  {MOCK_BANK_ACCOUNT.accountHolderName}
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/25 px-2.5 py-1 rounded-full border border-white/10 text-[10px] font-bold text-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Safe Guarded</span>
              </div>
            </div>

            {/* Balance Display */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-emerald-200/70 block">Available Balance</span>
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono">
                  {formattedBalance}
                </span>
                <button
                  onClick={() => setIsBalanceHidden(!isBalanceHidden)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-200 transition-colors"
                  title={isBalanceHidden ? 'Show Balance' : 'Hide Balance'}
                >
                  {isBalanceHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleReadBalance}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-200 transition-colors"
                  title="Read balance aloud"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card Footer Details */}
            <div className="flex justify-between items-center text-[11px] text-emerald-200/80 pt-1 border-t border-white/10">
              <span>Aadhaar Link: Active</span>
              <span className="font-mono tracking-wider font-bold">RuPay • 8824</span>
            </div>
          </div>

          {/* ── ⚡ 4 QUICK ACTION TILES ── */}
          <div className="grid grid-cols-4 gap-2.5">
            <button
              onClick={() => setActiveTab('quick_send')}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'quick_send'
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500/50 text-blue-700 dark:text-blue-300 shadow-xs'
                  : 'bg-slate-50 dark:bg-white/5 border-slate-200/80 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                <Send className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold">Send</span>
            </button>

            <button
              onClick={() => {
                speak('Displaying your UPI QR code to receive money.');
                router.push('/banking');
                onClose();
              }}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <QrCode className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold">QR Code</span>
            </button>

            <button
              onClick={() => {
                router.push('/banking');
                onClose();
              }}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold">Bills</span>
            </button>

            <button
              onClick={() => setActiveTab(activeTab === 'history' ? 'overview' : 'history')}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500/50 text-purple-700 dark:text-purple-300 shadow-xs'
                  : 'bg-slate-50 dark:bg-white/5 border-slate-200/80 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold">Passbook</span>
            </button>
          </div>

          {/* ── 💸 QUICK SEND TAB ── */}
          {activeTab === 'quick_send' && (
            <form onSubmit={handleQuickSend} className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 space-y-3.5 animate-in fade-in duration-200">
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold text-blue-950 dark:text-blue-200">Quick Safe Transfer</span>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">Warning Limit: ₹5,000</span>
              </div>

              {/* Beneficiary picker */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">Select Beneficiary</label>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {MOCK_BENEFICIARIES.map((ben) => (
                    <button
                      key={ben.id}
                      type="button"
                      onClick={() => setSelectedBeneficiary(ben)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border shrink-0 transition-all flex items-center gap-2 cursor-pointer ${
                        selectedBeneficiary.id === ben.id
                          ? 'bg-[#134233] text-white border-[#134233] shadow-xs'
                          : 'bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/10'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                        {ben.name.charAt(0)}
                      </span>
                      <span>{ben.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Picker */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">Amount (₹)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={quickSendAmount}
                    onChange={(e) => setQuickSendAmount(e.target.value)}
                    min="1"
                    max="50000"
                    required
                    className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-[#1C1E26] border border-slate-200 dark:border-white/10 text-sm font-black text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {['200', '500', '1000'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setQuickSendAmount(amt)}
                      className="px-2.5 py-2 rounded-xl bg-white dark:bg-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 hover:bg-slate-100 cursor-pointer"
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              {sendSuccess ? (
                <div className="p-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 animate-in zoom-in-95">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Transfer Successful to {selectedBeneficiary.name}!</span>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send ₹{quickSendAmount} to {selectedBeneficiary.name}</span>
                </button>
              )}
            </form>
          )}

          {/* ── 🕒 RECENT PASSBOOK MINI-STATEMENT ── */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                Recent Transactions
              </h3>
              <button
                onClick={() => {
                  router.push('/banking');
                  onClose();
                }}
                className="text-[11px] font-bold text-[#2563EB] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>Full Passbook</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2">
              {MOCK_TRANSACTIONS.slice(0, 3).map((tx) => {
                const isCredit = tx.type === 'credit';
                return (
                  <div
                    key={tx.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-between shadow-2xs hover:bg-slate-100/60 dark:hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isCredit 
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400' 
                          : 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                      }`}>
                        {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <span className="font-bold text-xs text-slate-900 dark:text-white block leading-snug">
                          {tx.recipientOrSource || tx.title}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          {tx.category} • {tx.dateFormatted || 'Recently'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`font-mono font-extrabold text-xs block ${
                        isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                      }`}>
                        {isCredit ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 capitalize">
                        {tx.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* ═══════════════════════════════════════════════════════════
            FOOTER: DIRECT FULL DASHBOARD LINK
           ═══════════════════════════════════════════════════════════ */}
        <footer className="px-6 py-4 border-t border-slate-100 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>256-bit Encrypted Banking Link</span>
          </div>

          <button
            onClick={() => {
              router.push('/banking');
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-[#134233] hover:bg-[#1a5542] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <span>Open Full Banking Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </footer>

      </div>
    </div>
  );
}
