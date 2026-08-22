'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAccessibility } from '@/context/AccessibilityContext';
import { useVoice } from '@/context/VoiceContext';
import { useAuth } from '@/context/AuthContext';
import { getTranslation } from '@/lib/multilingualEngine';
import { SteadyTapShield } from '@/components/banking/SteadyTapShield';
import { TransactionSecurityCheck } from '@/components/banking/TransactionSecurityCheck';
import { TransactionLimitSettingsModal } from '@/components/banking/TransactionLimitSettingsModal';
import { TransactionDetailModal } from '@/components/banking/TransactionDetailModal';
import { BillPaymentModal } from '@/components/banking/BillPaymentModal';
import { ReceiveMoneyModal } from '@/components/banking/ReceiveMoneyModal';
import { ManageCardsModal } from '@/components/banking/ManageCardsModal';
import { AnukoolFinancialAssistant } from '@/components/banking/NayanFinancialAssistant';
import { 
  BankAccount, 
  BankCard,
  Beneficiary, 
  BankTransaction, 
  BillItem,
  TransferPreview, 
  TransactionState
} from '@/types/banking';
import { 
  MOCK_BANK_ACCOUNT, 
  MOCK_SECONDARY_ACCOUNT,
  MOCK_PRIMARY_CARD,
  MOCK_BENEFICIARIES, 
  MOCK_TRANSACTIONS, 
} from '@/lib/bankingMockData';
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
  Eye,
  EyeOff,
  Layers,
  Camera,
  Headphones,
  History
} from 'lucide-react';

export default function AdaptiveBankingPage() {
  const { profile } = useAccessibility();
  const { speak } = useVoice();
  const { user, profile: authProfile } = useAuth();

  // State Machine for Banking Demo Flow
  const [currentView, setCurrentView] = useState<'dashboard' | 'send_money' | 'review' | 'confirm' | 'success' | 'transactions'>('dashboard');
  const [transactionState, setTransactionState] = useState<TransactionState>('DRAFT');
  
  // Banking data state
  const [account, setAccount] = useState<BankAccount>(MOCK_BANK_ACCOUNT);
  const [primaryCard, setPrimaryCard] = useState<BankCard>(MOCK_PRIMARY_CARD);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(MOCK_BENEFICIARIES);
  const [transactions, setTransactions] = useState<BankTransaction[]>(MOCK_TRANSACTIONS);
  const [isBalanceHidden, setIsBalanceHidden] = useState<boolean>(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'home' | 'history' | 'users' | 'wallet' | 'settings'>('home');

  // Security Configuration
  const [userWarningLimit, setUserWarningLimit] = useState<number>(5000);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState<boolean>(false);

  // Modals state
  const [selectedTxForDetail, setSelectedTxForDetail] = useState<BankTransaction | null>(null);
  const [isBillModalOpen, setIsBillModalOpen] = useState<boolean>(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState<boolean>(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState<boolean>(false);

  // Transfer Form state
  const [selectedRecipient, setSelectedRecipient] = useState<Beneficiary>(MOCK_BENEFICIARIES[0]);
  const [transferAmount, setTransferAmount] = useState<number>(5000);
  const [transferNote, setTransferNote] = useState<string>('Lunch split');
  const [transferPreview, setTransferPreview] = useState<TransferPreview | null>(null);
  const [transferReceipt, setTransferReceipt] = useState<any>(null);

  const isMotorAssist = profile.buttonTargetSize === 'large' || profile.buttonTargetSize === 'extra-large' || profile.interactionMode === 'large-controls';
  const lang = profile.language;

  // Extract User Name
  const userDisplayName = authProfile?.fullName || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Account User';
  const userInitial = userDisplayName.charAt(0).toUpperCase();

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const urlLimit = params.get('limit');
        if (urlLimit) {
          const parsedUrlLimit = Number(urlLimit);
          if (!isNaN(parsedUrlLimit) && parsedUrlLimit > 0) {
            setUserWarningLimit(parsedUrlLimit);
            localStorage.setItem('nayan_transaction_limit', String(parsedUrlLimit));
            return;
          }
        }
      }
      const stored = localStorage.getItem('nayan_transaction_limit');
      if (stored) {
        const parsed = Number(stored);
        if (!isNaN(parsed) && parsed > 0) setUserWarningLimit(parsed);
      }
    } catch (e) {}
  }, []);

  const handleSaveLimit = (newLimit: number) => {
    setUserWarningLimit(newLimit);
    try {
      localStorage.setItem('nayan_transaction_limit', String(newLimit));
    } catch (e) {}
    setTransferPreview(null);
  };

  const speakCurrentStep = (text: string) => {
    speak(text);
  };

  const handleQuickSendTo = (b: Beneficiary, defaultAmt: number = 2000) => {
    setSelectedRecipient(b);
    setTransferAmount(defaultAmt);
    setCurrentView('send_money');
    speakCurrentStep(`Send money to ${b.name}.`);
  };

  const handleAmountChange = (amt: number) => {
    setTransferAmount(amt);
    setTransferPreview(null);
    setTransactionState('DRAFT');
  };

  const handleRecipientChange = (rec: Beneficiary) => {
    setSelectedRecipient(rec);
    setTransferPreview(null);
    setTransactionState('DRAFT');
  };

  // Execute Demo Bill Payment
  const handlePayBill = (bill: BillItem) => {
    const newTx: BankTransaction = {
      id: `tx-bill-${Date.now()}`,
      title: `${bill.billerName}`,
      titleKannada: `${bill.billerName} ಬಿಲ್`,
      titleHindi: `${bill.billerName} बिल`,
      merchant: bill.billerName,
      category: 'utility',
      amount: bill.amount,
      type: 'debit',
      timestamp: 'Today',
      dateFormatted: 'Today',
      status: 'completed',
      recipientOrSource: bill.billerName,
      paymentMethod: 'BBPS Instant Settlement',
      referenceId: `BBPS-${Date.now().toString().slice(-6)}`,
      note: `${bill.title} payment`,
    };

    setTransactions(prev => [newTx, ...prev]);
    setAccount(prev => ({ ...prev, availableBalance: prev.availableBalance - bill.amount }));
    speakCurrentStep(`Payment of ₹${bill.amount} to ${bill.billerName} completed.`);
  };

  // Execute Demo Simulated Incoming Transfer
  const handleSimulateReceive = (amount: number, sender: string) => {
    const newTx: BankTransaction = {
      id: `tx-rec-${Date.now()}`,
      title: `Received from ${sender}`,
      titleKannada: `${sender} ಅವರಿಂದ ಸ್ವೀಕರಿಸಲಾಗಿದೆ`,
      titleHindi: `${sender} से प्राप्त हुआ`,
      merchant: sender,
      category: 'transfer',
      amount,
      type: 'credit',
      timestamp: 'Today',
      dateFormatted: 'Today',
      status: 'completed',
      recipientOrSource: sender,
      paymentMethod: 'UPI Instant Credit',
      referenceId: `UPI-REC-${Date.now().toString().slice(-6)}`,
      note: 'UPI Payment Settlement',
    };

    setTransactions(prev => [newTx, ...prev]);
    setAccount(prev => ({ ...prev, availableBalance: prev.availableBalance + amount }));
    speakCurrentStep(`₹${amount} credited from ${sender}.`);
  };

  // Preview Transfer & Evaluate Adaptive Friction
  const handleInitiateReview = async () => {
    setTransactionState('PENDING_REVIEW');
    try {
      const res = await fetch('/api/bank/transfer/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: transferAmount,
          recipientName: selectedRecipient.name,
          recipientAccount: selectedRecipient.maskedAccountNumber,
          language: lang,
          userConfiguredLimit: userWarningLimit,
          note: transferNote,
        }),
      });

      const data = await res.json();
      if (data.preview) {
        setTransferPreview(data.preview);
        setCurrentView('review');

        if (data.preview.riskAssessment.isLimitExceeded) {
          setTransactionState('LIMIT_WARNING');
        } else {
          setTransactionState('USER_CONFIRMATION');
        }

        const spokenText = lang === 'kn' 
          ? data.preview.spokenPromptKannada 
          : lang === 'hi' 
          ? data.preview.spokenPromptHindi 
          : data.preview.spokenPromptText;
        
        speakCurrentStep(spokenText);
      }
    } catch (e) {
      console.error('Transfer preview error:', e);
    }
  };

  // Execute Final Transfer Confirmation
  const handleExecuteTransfer = async () => {
    setTransactionState('AUTHENTICATION');
    try {
      const res = await fetch('/api/bank/transfer/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: transferAmount,
          recipientName: selectedRecipient.name,
          recipientAccount: selectedRecipient.maskedAccountNumber,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTransferReceipt(data);
        setAccount(prev => ({ ...prev, availableBalance: data.remainingBalance }));

        const newTx: BankTransaction = {
          id: data.transactionId || `tx-${Date.now()}`,
          title: `Transfer to ${selectedRecipient.name}`,
          titleKannada: `${selectedRecipient.nameKannada} ಅವರಿಗೆ ವರ್ಗಾವಣೆ`,
          titleHindi: `${selectedRecipient.nameHindi} को स्थानांतरण`,
          merchant: selectedRecipient.name,
          category: 'transfer',
          amount: transferAmount,
          type: 'debit',
          timestamp: 'Today',
          dateFormatted: 'Today',
          status: 'completed',
          recipientOrSource: selectedRecipient.name,
          paymentMethod: 'ANUKOOL Direct Bank Transfer',
          referenceId: data.transactionId,
          note: transferNote,
        };
        setTransactions(prev => [newTx, ...prev]);

        setCurrentView('success');
        setTransactionState('COMPLETED');

        const successSpoken = `Payment of ₹${transferAmount.toLocaleString('en-IN')} completed successfully to ${selectedRecipient.name}.`;
        speakCurrentStep(successSpoken);
      }
    } catch (e) {
      console.error('Confirm transfer error:', e);
    }
  };

  return (
    <div className="min-h-screen bg-[#ECECEC] dark:bg-[#121316] text-[#1E2024] dark:text-[#EAECEF] p-2 sm:p-4 md:p-6 font-sans transition-colors">
      
      {/* SteadyTap Motor Assistance Shield */}
      <SteadyTapShield enabled={isMotorAssist} stabilizationLevel={100} language={lang} />

      {/* Modals */}
      <TransactionLimitSettingsModal
        isOpen={isLimitModalOpen}
        onClose={() => setIsLimitModalOpen(false)}
        currentLimit={userWarningLimit}
        onSaveLimit={handleSaveLimit}
        language={lang}
      />

      <TransactionDetailModal
        transaction={selectedTxForDetail}
        isOpen={Boolean(selectedTxForDetail)}
        onClose={() => setSelectedTxForDetail(null)}
        onAskAnukool={(query) => {
          speakCurrentStep(`Explaining transaction: ${query}`);
        }}
        language={lang}
      />

      <BillPaymentModal
        isOpen={isBillModalOpen}
        onClose={() => setIsBillModalOpen(false)}
        onPayBill={handlePayBill}
        language={lang}
      />

      <ReceiveMoneyModal
        isOpen={isReceiveModalOpen}
        onClose={() => setIsReceiveModalOpen(false)}
        onSimulateReceive={handleSimulateReceive}
        userUpiId={`${userDisplayName.toLowerCase().replace(/\s+/g, '')}@anukool`}
        userName={userDisplayName}
      />

      <ManageCardsModal
        card={primaryCard}
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        onUpdateCard={(updated: Partial<BankCard>) => setPrimaryCard(prev => ({ ...prev, ...updated }))}
      />

      {/* ─────────────────────────────────────────────────────────────
          MAIN FENCO DASHBOARD CANVAS CONTAINER
         ───────────────────────────────────────────────────────────── */}
      <div className="max-w-[1340px] mx-auto bg-[#ECECEC] dark:bg-[#18191D] rounded-[36px] p-3 sm:p-5 md:p-7 flex gap-5 sm:gap-7">
        
        {/* ═══════════════════════════════════════════════════════════
            LEFT DARK SIDEBAR PILL (UNIFIED ANUKOOL SIDEBAR)
           ═══════════════════════════════════════════════════════════ */}
        <aside className="hidden lg:flex flex-col justify-between w-16 py-6 rounded-[28px] bg-[#1A3328] dark:bg-[#13241D] text-white shrink-0 items-center shadow-lg border border-emerald-900/30">
          
          {/* Top Cluster */}
          <div className="flex flex-col items-center gap-4">
            <Link
              href="/"
              className="w-10 h-10 rounded-2xl text-emerald-200/60 hover:text-white flex items-center justify-center hover:bg-white/10 transition-all"
              title="Home Dashboard"
            >
              <Home className="w-5 h-5" />
            </Link>

            <Link
              href="/services"
              className="w-10 h-10 rounded-2xl text-emerald-200/60 hover:text-white flex items-center justify-center hover:bg-white/10 transition-all"
              title="Services Catalog"
            >
              <Layers className="w-5 h-5" />
            </Link>

            {/* Active Banking Pill */}
            <button
              onClick={() => {
                setCurrentView('dashboard');
                setActiveSidebarTab('home');
              }}
              className="w-11 h-11 rounded-2xl bg-[#2D5A47] text-white shadow-md flex items-center justify-center transition-all scale-105 border border-emerald-400/30 cursor-pointer relative"
              title="Inclusive Banking Dashboard"
            >
              <Wallet className="w-5 h-5 text-emerald-300" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-1.5 right-1.5 ring-2 ring-[#1A3328]" />
            </button>

            {/* 🔽 IN-SIDEBAR VERTICAL SUB-FEATURES (Active while on Banking) */}
            <div className="flex flex-col items-center gap-2 py-1">
              
              {/* 1. Send Money */}
              <button
                onClick={() => {
                  setActiveSidebarTab('users');
                  setCurrentView('send_money');
                }}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shadow-xs group cursor-pointer ${
                  currentView === 'send_money' || currentView === 'review' || currentView === 'confirm'
                    ? 'bg-[#2563EB] text-white ring-2 ring-blue-400/40' 
                    : 'bg-white/10 hover:bg-[#2563EB] text-emerald-200 hover:text-white'
                }`}
                title="Send Money (UPI Transfer)"
              >
                <Send className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              </button>

              {/* 2. Receive QR Code */}
              <button
                onClick={() => setIsReceiveModalOpen(true)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-[#059669] text-emerald-200 hover:text-white flex items-center justify-center transition-all shadow-xs group cursor-pointer"
                title="Receive / Show QR Code"
              >
                <QrCode className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              </button>

              {/* 3. Pay Bills */}
              <button
                onClick={() => setIsBillModalOpen(true)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-[#D97706] text-emerald-200 hover:text-white flex items-center justify-center transition-all shadow-xs group cursor-pointer"
                title="Pay Electricity & Utility Bills"
              >
                <Receipt className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              </button>

              {/* 4. Passbook / History */}
              <button
                onClick={() => {
                  setActiveSidebarTab('history');
                  setCurrentView('transactions');
                }}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shadow-xs group cursor-pointer ${
                  currentView === 'transactions'
                    ? 'bg-[#7C3AED] text-white ring-2 ring-purple-400/40' 
                    : 'bg-white/10 hover:bg-[#7C3AED] text-emerald-200 hover:text-white'
                }`}
                title="Passbook & Recent Transactions"
              >
                <History className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              </button>

            </div>

            {/* 📷 Dedicated Document Assist Slot (Positioned below expanded banking sub-features) */}
            <Link
              href="/services"
              className="w-10 h-10 rounded-2xl text-emerald-300 hover:text-white flex items-center justify-center hover:bg-white/10 transition-all cursor-pointer relative group"
              title="Document Snap-to-Form Assist"
            >
              <Camera className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-1.5 right-1.5 ring-2 ring-[#1A3328]" />
            </Link>
          </div>

          {/* Bottom Support / Emergency */}
          <div className="flex flex-col items-center gap-4">
            <Link
              href="/emergency"
              className="flex flex-col items-center gap-1 text-emerald-200/60 hover:text-white transition-colors"
              title="Emergency & Support"
            >
              <Headphones className="w-5 h-5" />
              <span className="text-[9px] font-bold">Support</span>
            </Link>
          </div>

        </aside>

        {/* ═══════════════════════════════════════════════════════════
            MAIN DASHBOARD CONTENT AREA
           ═══════════════════════════════════════════════════════════ */}
        <div className="flex-1 space-y-6">

          {currentView === 'dashboard' ? (
            <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-200">
              
              {/* ═══════════════════════════════════════════════════════════
                  GREETING TITLE
                 ═══════════════════════════════════════════════════════════ */}
              <div className="pt-1">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2024] dark:text-white tracking-tight">
                  Hello, <span className="text-[#8494B6] font-extrabold">{userDisplayName}</span>
                </h1>
                <p className="text-xs sm:text-sm text-[#8B929A] font-medium mt-0.5">
                  View and control your finances here!
                </p>
              </div>

              {/* ═══════════════════════════════════════════════════════════
                  1. TOP LINEUP: INTERACTIVE ACTIONS FLASH CARDS
                 ═══════════════════════════════════════════════════════════ */}
              <div className="p-6 sm:p-7 rounded-[32px] bg-white dark:bg-[#232428] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-[#1E2024] dark:text-white">
                      Interactive Actions
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-xs text-[#2563EB] dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-full border border-blue-200/50 dark:border-blue-800/50">
                    Demo Settlement Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* 1. Send Money */}
                  <button
                    onClick={() => setCurrentView('send_money')}
                    className="p-5 rounded-[24px] bg-gradient-to-br from-blue-50/90 to-blue-100/50 dark:from-blue-950/40 dark:to-[#172033] hover:from-blue-100 hover:to-blue-200/60 dark:hover:from-blue-900/50 dark:hover:to-blue-800/40 border border-blue-200/70 dark:border-blue-800/40 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all text-left flex flex-col justify-between min-h-[115px] group cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-11 h-11 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                        <Send className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/80 dark:bg-black/40 text-blue-700 dark:text-blue-300">
                        Fast UPI
                      </span>
                    </div>
                    <div>
                      <div className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                        Send Money
                      </div>
                      <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        Transfer to beneficiaries
                      </div>
                    </div>
                  </button>

                  {/* 2. Receive QR */}
                  <button
                    onClick={() => setIsReceiveModalOpen(true)}
                    className="p-5 rounded-[24px] bg-gradient-to-br from-emerald-50/90 to-emerald-100/50 dark:from-emerald-950/40 dark:to-[#112920] hover:from-emerald-100 hover:to-emerald-200/60 dark:hover:from-emerald-900/50 dark:hover:to-emerald-800/40 border border-emerald-200/70 dark:border-emerald-800/40 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all text-left flex flex-col justify-between min-h-[115px] group cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-11 h-11 rounded-2xl bg-[#059669] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/80 dark:bg-black/40 text-emerald-700 dark:text-emerald-300">
                        Scan & Pay
                      </span>
                    </div>
                    <div>
                      <div className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                        Receive QR
                      </div>
                      <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        Show personal UPI QR
                      </div>
                    </div>
                  </button>

                  {/* 3. Pay Bills */}
                  <button
                    onClick={() => setIsBillModalOpen(true)}
                    className="p-5 rounded-[24px] bg-gradient-to-br from-amber-50/90 to-amber-100/50 dark:from-amber-950/40 dark:to-[#2B2314] hover:from-amber-100 hover:to-amber-200/60 dark:hover:from-amber-900/50 dark:hover:to-amber-800/40 border border-amber-200/70 dark:border-amber-800/40 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all text-left flex flex-col justify-between min-h-[115px] group cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-11 h-11 rounded-2xl bg-[#D97706] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                        <Receipt className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/80 dark:bg-black/40 text-amber-700 dark:text-amber-300">
                        BBPS Direct
                      </span>
                    </div>
                    <div>
                      <div className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                        Pay Bills
                      </div>
                      <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        Electricity, Mobile, DTH
                      </div>
                    </div>
                  </button>

                  {/* 4. Card Controls */}
                  <button
                    onClick={() => setIsCardModalOpen(true)}
                    className="p-5 rounded-[24px] bg-gradient-to-br from-purple-50/90 to-purple-100/50 dark:from-purple-950/40 dark:to-[#221B2F] hover:from-purple-100 hover:to-purple-200/60 dark:hover:from-purple-900/50 dark:hover:to-purple-800/40 border border-purple-200/70 dark:border-purple-800/40 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all text-left flex flex-col justify-between min-h-[115px] group cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-11 h-11 rounded-2xl bg-[#7C3AED] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/80 dark:bg-black/40 text-purple-700 dark:text-purple-300">
                        RuPay Safe
                      </span>
                    </div>
                    <div>
                      <div className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                        Card Controls
                      </div>
                      <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        Limits & Freeze card
                      </div>
                    </div>
                  </button>

                </div>
              </div>

              {/* ═══════════════════════════════════════════════════════════
                  2. BELOW THAT: SPATIAL BALANCE STATISTICS STATUS CARD
                 ═══════════════════════════════════════════════════════════ */}
              <div className="p-6 sm:p-7 rounded-[32px] bg-white dark:bg-[#232428] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="text-xs font-bold text-[#71767B] dark:text-slate-400 block uppercase tracking-wider">
                    Balance Statistics
                  </span>
                  <div className="flex items-baseline gap-3 mt-2">
                    <div className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1E2024] dark:text-white tracking-tight">
                      {isBalanceHidden ? '₹••,•••.••' : `₹${account.availableBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                    </div>
                    <span className="text-xs font-semibold text-[#8B929A]">Total available</span>
                    <button
                      onClick={() => setIsBalanceHidden(!isBalanceHidden)}
                      className="p-1.5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                      aria-label="Toggle balance visibility"
                    >
                      {isBalanceHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Account Status: Active & Protected
                    </span>
                  </div>
                </div>

                {/* Right side: Sparkline wave + 5 rounded bar pillars */}
                <div className="flex items-center gap-6 sm:gap-8 pt-2 md:pt-0">
                  {/* Growth Indicator */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <svg className="w-16 h-7 text-[#2563EB]" viewBox="0 0 60 25" fill="none">
                        <path d="M 2 20 Q 15 5, 30 18 T 58 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                      <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-xs font-black text-emerald-600 dark:text-emerald-400 shadow-2xs">
                        ↑
                      </div>
                      <span className="text-sm font-black text-[#1E2024] dark:text-white">
                        14%
                      </span>
                    </div>
                    <span className="text-[11px] text-[#8B929A] block leading-tight font-medium">
                      Always see your earning updates
                    </span>
                  </div>

                  {/* Monthly Bar Pillars */}
                  <div className="flex items-end gap-2 pb-0.5 border-l border-slate-200 dark:border-white/10 pl-6">
                    {[
                      { m: 'Nov', h: 'h-4' },
                      { m: 'Dec', h: 'h-3' },
                      { m: 'Jan', h: 'h-8' },
                      { m: 'Feb', h: 'h-6' },
                      { m: 'Mar', h: 'h-10', active: true },
                    ].map((bar, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1">
                        <div className={`w-3.5 ${bar.h} rounded-full ${bar.active ? 'bg-[#2563EB] shadow-xs' : 'bg-slate-200 dark:bg-white/20'}`} />
                        <span className="text-[9px] font-bold text-[#8B929A]">{bar.m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ═══════════════════════════════════════════════════════════
                  BOTTOM 2 CARDS ROW: LAST TRANSACTIONS + EXPENSES & INCOME
                 ═══════════════════════════════════════════════════════════ */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                
                {/* 4. LAST TRANSACTIONS CARD (WITH CLEAN BLACK/AVATAR BADGES) */}
                <div className="p-6 sm:p-7 rounded-[28px] bg-white dark:bg-[#232428] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
                  
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold text-base text-[#1E2024] dark:text-white">
                      Last Transactions
                    </h3>
                    <button 
                      onClick={() => setCurrentView('transactions')}
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Transactions List */}
                  <div className="space-y-4">
                    
                    {/* 1. Apple */}
                    <div 
                      onClick={() => setSelectedTxForDetail(transactions[0])}
                      className="flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 p-2 rounded-2xl transition-colors"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-full bg-[#1E2024] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                          
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[#1E2024] dark:text-white">Apple</div>
                          <div className="text-xs text-[#8B929A]">03 April, 2024</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-black text-sm text-[#1E2024] dark:text-white">₹653</span>
                        <MoreVertical className="w-3.5 h-3.5 text-slate-300" />
                      </div>
                    </div>

                    {/* 2. Ralph Edwards */}
                    <div 
                      onClick={() => setSelectedTxForDetail(transactions[2])}
                      className="flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 p-2 rounded-2xl transition-colors"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-full bg-[#D97706] text-white font-black text-sm shadow-sm flex items-center justify-center">
                          R
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[#1E2024] dark:text-white">Ralph Edwards</div>
                          <div className="text-xs text-[#8B929A]">01 April, 2024</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-black text-sm text-[#1E2024] dark:text-white">₹2,643</span>
                        <MoreVertical className="w-3.5 h-3.5 text-slate-300" />
                      </div>
                    </div>

                    {/* 3. Jerome Bell */}
                    <div 
                      onClick={() => setSelectedTxForDetail(transactions[3])}
                      className="flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 p-2 rounded-2xl transition-colors"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-full bg-[#E11D48] text-white font-black text-sm shadow-sm flex items-center justify-center">
                          J
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[#1E2024] dark:text-white">Jerome Bell</div>
                          <div className="text-xs text-[#8B929A]">27 March, 2024</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-black text-sm text-[#1E2024] dark:text-white">₹520</span>
                        <MoreVertical className="w-3.5 h-3.5 text-slate-300" />
                      </div>
                    </div>

                  </div>

                </div>

                {/* 5. EXPENSES & INCOME + BOTTOM DARK PILL BANNER */}
                <div className="p-6 sm:p-7 rounded-[28px] bg-white dark:bg-[#232428] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between space-y-6">
                  
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-extrabold text-base text-[#1E2024] dark:text-white">
                        Expenses & Income
                      </h3>
                      <button className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Big Numbers Header */}
                    <div className="flex justify-between items-baseline mb-3">
                      <div>
                        <div className="text-2xl sm:text-3xl font-black text-[#1E2024] dark:text-white">60%</div>
                        <span className="text-xs font-semibold text-[#8B929A]">Expenses</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl sm:text-3xl font-black text-[#1E2024] dark:text-white">40%</div>
                        <span className="text-xs font-semibold text-[#8B929A]">Income</span>
                      </div>
                    </div>

                    {/* Rounded Wide Horizontal Bar (Exact 60/40 colors from reference) */}
                    <div className="w-full h-7 rounded-full flex gap-1.5 overflow-hidden">
                      <div className="bg-[#789DEC] h-full rounded-l-full" style={{ width: '60%' }} />
                      <div className="bg-[#F0DC9B] h-full rounded-r-full" style={{ width: '40%' }} />
                    </div>
                  </div>

                  {/* 📊 EXPENDITURE GRAPH & CATEGORY BREAKDOWN */}
                  <div className="pt-2 space-y-4">
                    
                    {/* Weekly Expenditure Pillars */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-[#1E2024] dark:text-white">
                          Weekly Expenditure
                        </span>
                        <span className="text-[11px] font-bold text-[#779AE6]">
                          Avg. ₹1,700 / day
                        </span>
                      </div>

                      {/* 7-Day Pillars Chart */}
                      <div className="flex items-end justify-between h-20 pt-2 px-1 border-b border-slate-100 dark:border-white/5 pb-2">
                        {[
                          { day: 'Mon', amt: '₹1.2k', h: 'h-8', val: 40 },
                          { day: 'Tue', amt: '₹2.4k', h: 'h-14', val: 70 },
                          { day: 'Wed', amt: '₹950', h: 'h-6', val: 30 },
                          { day: 'Thu', amt: '₹3.1k', h: 'h-16', val: 85 },
                          { day: 'Fri', amt: '₹2.8k', h: 'h-14', val: 75 },
                          { day: 'Sat', amt: '₹4.2k', h: 'h-20', val: 100, active: true },
                          { day: 'Sun', amt: '₹1.8k', h: 'h-10', val: 50 },
                        ].map((item, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
                            <span className="text-[8px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              {item.amt}
                            </span>
                            <div 
                              className={`w-4 sm:w-5 ${item.h} rounded-full transition-all duration-300 ${
                                item.active 
                                  ? 'bg-[#789DEC] shadow-sm scale-105' 
                                  : 'bg-[#789DEC]/40 group-hover:bg-[#789DEC]'
                              }`} 
                            />
                            <span className="text-[9px] font-bold text-[#8B929A]">{item.day}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Top Expense Categories Mini Grid */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="p-2.5 rounded-2xl bg-[#ECECEC]/60 dark:bg-white/5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#789DEC]" />
                          <span className="font-bold text-[#1E2024] dark:text-white">Food & Dining</span>
                        </div>
                        <span className="font-black text-[#1E2024] dark:text-white">₹6,420</span>
                      </div>

                      <div className="p-2.5 rounded-2xl bg-[#ECECEC]/60 dark:bg-white/5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#F0DC9B]" />
                          <span className="font-bold text-[#1E2024] dark:text-white">Shopping</span>
                        </div>
                        <span className="font-black text-[#1E2024] dark:text-white">₹2,800</span>
                      </div>
                    </div>

                  </div>

                </div>

              </div>

              {/* ANUKOOL CONVERSATIONAL ASSISTANT */}
              <AnukoolFinancialAssistant
                balance={account.availableBalance}
                foodExpense={6420}
                language={lang}
                onTriggerTransfer={(name: string, amt: number) => {
                  const found = beneficiaries.find(b => b.name.toLowerCase().includes(name.toLowerCase())) || beneficiaries[0];
                  setSelectedRecipient(found);
                  setTransferAmount(amt);
                  setCurrentView('send_money');
                }}
                onOpenBills={() => setIsBillModalOpen(true)}
              />

            </div>
          ) : currentView === 'send_money' ? (
            /* SEND MONEY VIEW */
            <div className="space-y-6 animate-in fade-in duration-200 max-w-2xl mx-auto py-2">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#232428] border border-slate-200 dark:border-white/10 text-xs font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </button>

              <div className="p-7 rounded-[28px] bg-white dark:bg-[#232428] border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
                <div>
                  <span className="text-xs font-bold text-[#779AE6] uppercase tracking-widest block">
                    Step 1: Choose Recipient & Amount
                  </span>
                  <h2 className="text-2xl font-black text-[#1E2024] dark:text-white mt-1">
                    Send Money
                  </h2>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#8B929A] uppercase tracking-wider">
                    Select Beneficiary
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {beneficiaries.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => handleRecipientChange(b)}
                        className={`p-3.5 rounded-2xl border-2 text-left flex items-center gap-3 transition-all ${
                          selectedRecipient.id === b.id
                            ? 'border-[#779AE6] bg-blue-50/80 dark:bg-white/10 shadow-sm'
                            : 'border-slate-200 dark:border-white/10 bg-[#ECECEC] dark:bg-white/5'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-full ${b.avatarColor} text-white font-black text-xs flex items-center justify-center shrink-0`}>
                          {b.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-extrabold text-sm text-[#1E2024] dark:text-white block">
                            {b.name}
                          </span>
                          <span className="text-[11px] text-[#8B929A]">{b.maskedAccountNumber}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#8B929A] uppercase tracking-wider">
                    Enter Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-[#8B929A]">₹</span>
                    <input
                      type="number"
                      value={transferAmount || ''}
                      onChange={(e) => handleAmountChange(Number(e.target.value))}
                      placeholder="5000"
                      className="w-full p-4 pl-10 rounded-2xl bg-[#ECECEC] dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 text-[#1E2024] dark:text-white font-black text-2xl outline-none focus:border-[#779AE6]"
                    />
                  </div>
                </div>

                <button
                  onClick={handleInitiateReview}
                  className="w-full py-4 rounded-2xl bg-[#779AE6] hover:bg-[#688FE8] text-white font-extrabold text-base shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <span>Review Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : currentView === 'review' && transferPreview ? (
            /* REVIEW / LIMIT WARNING VIEW */
            <div className="max-w-2xl mx-auto py-2">
              {transferPreview.riskAssessment.isLimitExceeded ? (
                <TransactionSecurityCheck
                  preview={transferPreview}
                  language={lang}
                  onVerified={handleExecuteTransfer}
                  onCancel={() => setCurrentView('send_money')}
                />
              ) : (
                <div className="p-8 rounded-[28px] bg-white dark:bg-[#232428] border border-slate-200 dark:border-white/10 shadow-sm space-y-6 text-center">
                  <span className="text-xs font-bold text-[#779AE6] uppercase tracking-widest block">
                    Payment Review
                  </span>
                  <div className="text-4xl font-black text-[#1E2024] dark:text-white">
                    ₹{transferPreview.amount.toLocaleString('en-IN')}
                  </div>
                  <p className="text-sm font-semibold text-[#8B929A]">
                    To: <strong className="text-[#1E2024] dark:text-white">{transferPreview.recipientName}</strong>
                  </p>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setCurrentView('send_money')}
                      className="w-1/3 py-3.5 rounded-2xl bg-[#ECECEC] dark:bg-white/5 text-xs font-bold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleExecuteTransfer}
                      className="w-2/3 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Send</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : currentView === 'success' && transferReceipt ? (
            /* SUCCESS VIEW */
            <div className="max-w-md mx-auto p-8 rounded-[28px] bg-white dark:bg-[#232428] border border-emerald-500/30 shadow-md text-center space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest block">
                  Payment Completed
                </span>
                <div className="text-3xl font-black text-[#1E2024] dark:text-white">
                  ₹{transferReceipt.amount || transferAmount}
                </div>
                <p className="text-xs text-[#8B929A]">
                  Sent to <strong>{transferReceipt.recipientName}</strong>
                </p>
              </div>
              <button
                onClick={() => setCurrentView('dashboard')}
                className="w-full py-3.5 rounded-2xl bg-[#779AE6] hover:bg-[#688FE8] text-white font-extrabold text-sm shadow-md"
              >
                Done
              </button>
            </div>
          ) : (
            /* TRANSACTIONS STATEMENT VIEW */
            <div className="max-w-3xl mx-auto space-y-4 py-2">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#232428] border border-slate-200 dark:border-white/10 text-xs font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </button>

              <div className="p-7 rounded-[28px] bg-white dark:bg-[#232428] border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
                <h2 className="text-xl font-black text-[#1E2024] dark:text-white">All Transactions</h2>
                <div className="divide-y divide-slate-200 dark:divide-white/10">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="py-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          style={{ backgroundColor: tx.type === 'credit' ? '#059669' : '#2563EB' }}
                          className="w-9 h-9 rounded-full text-white font-black text-xs flex items-center justify-center"
                        >
                          {tx.title.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[#1E2024] dark:text-white">{tx.title}</p>
                          <p className="text-xs text-[#8B929A]">{tx.timestamp}</p>
                        </div>
                      </div>
                      <span className="font-black text-sm text-[#1E2024] dark:text-white">
                        {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
