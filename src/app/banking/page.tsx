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
  EyeOff
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
        userUpiId={`${userDisplayName.toLowerCase().replace(/\s+/g, '')}@nayan`}
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
            LEFT DARK SIDEBAR PILL (EXACT AS IN REFERENCE IMAGE)
           ═══════════════════════════════════════════════════════════ */}
        <aside className="hidden lg:flex flex-col justify-between w-16 py-5 rounded-[28px] bg-[#232428] text-white shrink-0 items-center shadow-md">
          
          {/* Top Icons */}
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => {
                setActiveSidebarTab('home');
                setCurrentView('dashboard');
              }}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                activeSidebarTab === 'home' 
                  ? 'bg-white text-[#232428] shadow-md scale-105' 
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Dashboard Home"
            >
              <Home className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                setActiveSidebarTab('history');
                setCurrentView('transactions');
              }}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                activeSidebarTab === 'history' 
                  ? 'bg-white text-[#232428] shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Transaction History"
            >
              <Clock className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                setActiveSidebarTab('users');
                setCurrentView('send_money');
              }}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                activeSidebarTab === 'users' 
                  ? 'bg-white text-[#232428] shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Beneficiaries"
            >
              <Users className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                setActiveSidebarTab('wallet');
                setIsCardModalOpen(true);
              }}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                activeSidebarTab === 'wallet' 
                  ? 'bg-white text-[#232428] shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Card Wallet"
            >
              <Wallet className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                setActiveSidebarTab('settings');
                setIsLimitModalOpen(true);
              }}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                activeSidebarTab === 'settings' 
                  ? 'bg-white text-[#232428] shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Security & Warning Limits"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Icons */}
          <div className="flex flex-col items-center gap-4">
            <Link
              href="/emergency"
              className="w-10 h-10 rounded-2xl text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              title="Help & Emergency"
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
            MAIN DASHBOARD CONTENT AREA
           ═══════════════════════════════════════════════════════════ */}
        <div className="flex-1 space-y-6">
          
          {/* TOP APP HEADER BAR */}
          <div className="flex items-center justify-end pb-1">

            {/* Right: Notification + Search + Avatar */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Notification Bell */}
              <button 
                onClick={() => speakCurrentStep(`You have 1 pending bill from BESCOM of ₹1,240.`)}
                className="w-10 h-10 rounded-full bg-white dark:bg-[#232428] border border-slate-300 dark:border-white/10 flex items-center justify-center text-[#1E2024] dark:text-white shadow-sm hover:scale-105 transition-transform"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
              </button>

              {/* Search Capsule */}
              <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-white dark:bg-[#232428] border border-slate-300 dark:border-white/10 shadow-sm text-xs text-[#8B929A]">
                <Search className="w-3.5 h-3.5 text-[#8B929A]" />
                <input 
                  type="text" 
                  placeholder="Search me..." 
                  className="bg-transparent outline-none w-24 md:w-32 text-xs text-[#1E2024] dark:text-white font-medium" 
                />
              </div>

              {/* Profile Avatar Initial Circle */}
              <div className="w-10 h-10 rounded-full bg-[#1E2024] text-white font-serif font-bold text-base flex items-center justify-center shadow-sm border border-slate-300 dark:border-white/20">
                {userInitial}
              </div>
            </div>

          </div>

          {currentView === 'dashboard' ? (
            <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-200">
              
              {/* ═══════════════════════════════════════════════════════════
                  GREETING + PEOPLE AVATAR CAPSULE ROW
                 ═══════════════════════════════════════════════════════════ */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Left: Hello, Alif Reza */}
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2024] dark:text-white tracking-tight">
                    Hello, <span className="text-[#8494B6] font-extrabold">{userDisplayName}</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-[#8B929A] font-medium mt-0.5">
                    View and control your finances here!
                  </p>
                </div>

                {/* Right: People Initial Circular Avatars Capsule */}
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white dark:bg-[#232428] border border-slate-200 dark:border-white/10 shadow-sm self-start md:self-auto overflow-x-auto">
                  <div className="flex items-center gap-2">
                    {beneficiaries.map((b) => {
                      const letter = b.name.charAt(0).toUpperCase();
                      return (
                        <button
                          key={b.id}
                          onClick={() => handleQuickSendTo(b, 2000)}
                          title={`Send money to ${b.name}`}
                          className="group relative focus:outline-none focus:ring-2 focus:ring-[#779AE6] rounded-full shrink-0"
                        >
                          <div 
                            style={{ backgroundColor: b.colorHex || '#4F46E5' }}
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full text-white font-black text-xs sm:text-sm flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform ring-2 ring-white dark:ring-[#232428]"
                          >
                            {letter}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentView('send_money')}
                    className="w-8 h-8 rounded-full bg-[#ECECEC] dark:bg-white/10 hover:bg-[#779AE6] hover:text-white text-[#1E2024] dark:text-white flex items-center justify-center transition-colors shrink-0"
                    title="Send money"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

              {/* ═══════════════════════════════════════════════════════════
                  MIDDLE 3 CARDS ROW: BALANCE STATS + CARD + ANALYTICS
                 ═══════════════════════════════════════════════════════════ */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                
                {/* 1. BALANCE STATISTICS CARD */}
                <div className="p-6 rounded-[28px] bg-white dark:bg-[#232428] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between min-h-[220px]">
                  <div>
                    <span className="text-xs font-bold text-[#71767B] dark:text-slate-400 block">
                      Balance Statistics
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <div className="text-3xl sm:text-4xl font-black text-[#1E2024] dark:text-white tracking-tight">
                        {isBalanceHidden ? '₹••,•••.••' : `₹${account.availableBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                      </div>
                      <span className="text-xs font-medium text-[#8B929A]">Total amount</span>
                      <button
                        onClick={() => setIsBalanceHidden(!isBalanceHidden)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
                        aria-label="Toggle balance visibility"
                      >
                        {isBalanceHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Sparkline wave + 5 rounded bar pillars */}
                  <div className="flex items-end justify-between pt-3">
                    {/* Left: Sparkline + 14% */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <svg className="w-14 h-6 text-[#779AE6]" viewBox="0 0 60 25" fill="none">
                          <path d="M 2 20 Q 15 5, 30 18 T 58 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                        <div className="w-6 h-6 rounded-full border border-slate-300 dark:border-white/20 flex items-center justify-center text-[10px] font-bold text-[#1E2024] dark:text-white">
                          ↑
                        </div>
                        <span className="text-xs font-bold text-[#1E2024] dark:text-white">
                          14%
                        </span>
                      </div>
                      <span className="text-[10px] text-[#8B929A] block leading-tight">
                        Always see your earning updates
                      </span>
                    </div>

                    {/* Right: 5 Monthly Bar Pillars (Nov, Dec, Jan, Feb, Mar) */}
                    <div className="flex items-end gap-1.5 pb-0.5">
                      {[
                        { m: 'Nov', h: 'h-3.5' },
                        { m: 'Dec', h: 'h-2' },
                        { m: 'Jan', h: 'h-6' },
                        { m: 'Feb', h: 'h-5' },
                        { m: 'Mar', h: 'h-7' },
                      ].map((bar, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-1">
                          <div className={`w-3 ${bar.h} rounded-full bg-[#779AE6]`} />
                          <span className="text-[9px] font-bold text-[#8B929A]">{bar.m}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. THE BANK OF ANYTHING DIGITAL CARD (SOFT SKY-BLUE THEME) */}
                <div className="p-6 rounded-[28px] bg-gradient-to-br from-[#779AE6] to-[#8FAEE8] text-white shadow-sm flex flex-col justify-between min-h-[220px] relative overflow-hidden">
                  
                  {/* Sheen effect */}
                  <div className="absolute top-0 right-0 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex justify-between items-start z-10">
                    <span className="text-[12px] font-bold tracking-wider text-white/90 uppercase">
                      Debit Card
                    </span>
                  </div>

                  {/* Golden Chip */}
                  <div className="my-1 z-10">
                    <div className="w-10 h-7 rounded-md bg-[#F4D068] border border-yellow-300 shadow-inner grid grid-cols-2 gap-0.5 p-1">
                      <div className="border-r border-b border-amber-600/30" />
                      <div className="border-b border-amber-600/30" />
                      <div className="border-r border-amber-600/30" />
                      <div />
                    </div>
                  </div>

                  {/* Card Number */}
                  <div className="z-10 font-mono text-lg sm:text-xl font-bold tracking-widest text-white drop-shadow-sm">
                    ••••  ••••  ••••  2734
                  </div>

                  {/* Expiry, Name & Dual-Circle Logo */}
                  <div className="flex justify-between items-end z-10 pt-1">
                    <div>
                      <div className="flex gap-4 text-[9px] text-white/80 font-mono mb-1">
                        <span>3/18</span>
                        <span>3/28</span>
                      </div>
                      <span className="text-xs font-bold text-white">{userDisplayName}</span>
                    </div>

                    {/* Dual circle logo (MasterCard style) */}
                    <div className="flex -space-x-2.5">
                      <div className="w-6 h-6 rounded-full bg-[#EB5757]" />
                      <div className="w-6 h-6 rounded-full bg-[#F2C94C]/90" />
                    </div>
                  </div>
                </div>

                {/* 3. ANALYTICS CARD (RADIAL GAUGE 90% DONE) */}
                <div className="p-6 rounded-[28px] bg-white dark:bg-[#232428] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between min-h-[220px]">
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#71767B] dark:text-slate-400">
                      Analytics
                    </span>
                    <button 
                      onClick={() => setIsLimitModalOpen(true)}
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Legend row */}
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-[#779AE6]">● Done</span>
                    <span className="text-[#F2C94C]">● In progres</span>
                    <span className="text-[#EB5757]">● To do</span>
                  </div>

                  {/* Semi-circle Gauge Meter (Exact Reference) */}
                  <div className="flex flex-col items-center justify-center pt-2">
                    <div className="relative w-36 h-20 overflow-hidden flex items-end justify-center">
                      <svg className="w-36 h-36 -rotate-90 transform" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#ECECEC" strokeWidth="10" />
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="40" 
                          fill="none" 
                          stroke="#779AE6" 
                          strokeWidth="10" 
                          strokeDasharray="251.2" 
                          strokeDashoffset="75"
                          strokeLinecap="round"
                        />
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="40" 
                          fill="none" 
                          stroke="#F2C94C" 
                          strokeWidth="10" 
                          strokeDasharray="251.2" 
                          strokeDashoffset="210"
                          strokeLinecap="round"
                        />
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="40" 
                          fill="none" 
                          stroke="#EB5757" 
                          strokeWidth="10" 
                          strokeDasharray="251.2" 
                          strokeDashoffset="235"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute bottom-1 text-center">
                        <div className="text-2xl font-black text-[#1E2024] dark:text-white leading-none">90%</div>
                        <span className="text-[10px] font-bold text-[#8B929A]">Done</span>
                      </div>
                    </div>
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

              {/* ═══════════════════════════════════════════════════════════
                  QUICK INTERACTIVE ACTIONS BAR
                 ═══════════════════════════════════════════════════════════ */}
              <div className="p-5 rounded-[28px] bg-white dark:bg-[#232428] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8B929A]">
                    Interactive Actions
                  </span>
                  <span className="text-xs text-[#779AE6] font-bold">Demo Settlement Active</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => setCurrentView('send_money')}
                    className="p-3.5 rounded-2xl bg-[#ECECEC] dark:bg-white/5 hover:bg-[#779AE6] hover:text-white border border-transparent font-bold text-xs flex items-center gap-2.5 transition-all group"
                  >
                    <Send className="w-4 h-4 text-[#779AE6] group-hover:text-white" />
                    <span>Send Money</span>
                  </button>

                  <button
                    onClick={() => setIsReceiveModalOpen(true)}
                    className="p-3.5 rounded-2xl bg-[#ECECEC] dark:bg-white/5 hover:bg-emerald-600 hover:text-white border border-transparent font-bold text-xs flex items-center gap-2.5 transition-all group"
                  >
                    <QrCode className="w-4 h-4 text-emerald-500 group-hover:text-white" />
                    <span>Receive QR</span>
                  </button>

                  <button
                    onClick={() => setIsBillModalOpen(true)}
                    className="p-3.5 rounded-2xl bg-[#ECECEC] dark:bg-white/5 hover:bg-[#F0DC9B] hover:text-[#1E2024] border border-transparent font-bold text-xs flex items-center gap-2.5 transition-all group"
                  >
                    <Receipt className="w-4 h-4 text-amber-500 group-hover:text-[#1E2024]" />
                    <span>Pay Bills</span>
                  </button>

                  <button
                    onClick={() => setIsCardModalOpen(true)}
                    className="p-3.5 rounded-2xl bg-[#ECECEC] dark:bg-white/5 hover:bg-[#8FAEE8] hover:text-[#1E2024] border border-transparent font-bold text-xs flex items-center gap-2.5 transition-all group"
                  >
                    <CreditCard className="w-4 h-4 text-[#779AE6] group-hover:text-[#1E2024]" />
                    <span>Card Controls</span>
                  </button>
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
