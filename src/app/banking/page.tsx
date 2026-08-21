'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAccessibility } from '@/context/AccessibilityContext';
import { useVoice } from '@/context/VoiceContext';
import { getTranslation, LANGUAGE_NAMES } from '@/lib/multilingualEngine';
import { SteadyTapShield } from '@/components/banking/SteadyTapShield';
import { 
  BankAccount, 
  Beneficiary, 
  BankTransaction, 
  TransferPreview, 
  RiskAssessment,
  VoiceIntent 
} from '@/types/banking';
import { 
  MOCK_BANK_ACCOUNT, 
  MOCK_BENEFICIARIES, 
  MOCK_TRANSACTIONS, 
  evaluateTransferRisk 
} from '@/lib/bankingMockData';
import { 
  Send, 
  CreditCard, 
  Clock, 
  HelpCircle, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles, 
  ArrowRight, 
  User, 
  Info, 
  Layers, 
  RefreshCw,
  Play,
  RotateCcw
} from 'lucide-react';

export default function AdaptiveBankingPage() {
  const { profile, updateProfileKey } = useAccessibility();
  const { speak, stopSpeaking, isSpeaking } = useVoice();

  // State Machine for Banking Demo Flow
  const [currentView, setCurrentView] = useState<'dashboard' | 'send_money' | 'review' | 'confirm' | 'success' | 'transactions'>('dashboard');
  
  // Banking data
  const [account, setAccount] = useState<BankAccount>(MOCK_BANK_ACCOUNT);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(MOCK_BENEFICIARIES);
  const [transactions, setTransactions] = useState<BankTransaction[]>(MOCK_TRANSACTIONS);

  // Form / Transaction state
  const [selectedRecipient, setSelectedRecipient] = useState<Beneficiary>(MOCK_BENEFICIARIES[0]);
  const [transferAmount, setTransferAmount] = useState<number>(5000);
  const [transferPreview, setTransferPreview] = useState<TransferPreview | null>(null);
  const [transferReceipt, setTransferReceipt] = useState<any>(null);

  // Voice Interaction state
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [interpretedIntent, setInterpretedIntent] = useState<VoiceIntent | null>(null);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);

  // Motor assistance active indicator
  const isMotorAssist = profile.buttonTargetSize === 'large' || profile.buttonTargetSize === 'extra-large' || profile.interactionMode === 'large-controls';
  const lang = profile.language;

  // Translation helper
  const t = (key: string, fallback?: string) => getTranslation(lang, key, fallback);

  // 1. Initial Account Load
  useEffect(() => {
    fetch('/api/bank/account')
      .then((res) => res.json())
      .then((data) => {
        if (data.account) setAccount(data.account);
      })
      .catch(() => {});
  }, []);

  // 2. Automated Spoken Guidance on view transition
  const speakCurrentStep = (text: string) => {
    speak(text);
  };

  // 3. Trigger 90-Second Golden Demo Scenario
  const launchGoldenDemo = () => {
    updateProfileKey('language', 'kn');
    updateProfileKey('interactionMode', 'voice');
    updateProfileKey('textSize', 'large');
    updateProfileKey('buttonTargetSize', 'extra-large');
    updateProfileKey('motionReduction', true);
    
    setCurrentView('send_money');
    setSelectedRecipient(MOCK_BENEFICIARIES[0]);
    setTransferAmount(5000);

    // Simulate Golden Demo Voice Input in Kannada
    setTimeout(() => {
      handleSimulateKannadaSpeech();
    }, 600);
  };

  // 4. Simulate / Execute Kannada Speech Command
  const handleSimulateKannadaSpeech = async (customSpeech?: string) => {
    const text = customSpeech || 'ರಮೇಶ್ಗೆ 5000 ರೂಪಾಯಿ ಕಳುಹಿಸಬೇಕು';
    setIsVoiceListening(true);
    setSpokenTranscript('ಆಲಿಸಲಾಗುತ್ತಿದೆ... (Listening...)');

    setTimeout(async () => {
      setIsVoiceListening(false);
      setSpokenTranscript(text);
      setIsProcessingVoice(true);

      try {
        const res = await fetch('/api/bank/intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ speechText: text, language: lang }),
        });
        const data = await res.json();
        if (data.voiceIntent) {
          setInterpretedIntent(data.voiceIntent);
          if (data.voiceIntent.amount) setTransferAmount(data.voiceIntent.amount);
          if (data.voiceIntent.recipient) {
            const found = MOCK_BENEFICIARIES.find(b => b.name.toLowerCase() === data.voiceIntent.recipient?.toLowerCase());
            if (found) setSelectedRecipient(found);
          }
        }
      } catch (e) {
        console.error('Intent error:', e);
      } finally {
        setIsProcessingVoice(false);
      }
    }, 1200);
  };

  // 5. Preview Transfer & Evaluate Adaptive Friction
  const handleInitiateReview = async () => {
    try {
      const res = await fetch('/api/bank/transfer/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: transferAmount,
          recipientName: selectedRecipient.name,
          recipientAccount: selectedRecipient.maskedAccountNumber,
          language: lang,
        }),
      });

      const data = await res.json();
      if (data.preview) {
        setTransferPreview(data.preview);
        setCurrentView('review');

        // Speak Adaptive Warning
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

  // 6. Execute Final Transfer Confirmation
  const handleExecuteTransfer = async () => {
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
        setCurrentView('success');

        const successSpoken = lang === 'kn'
          ? `ರಮೇಶ್ ಅವರಿಗೆ ₹${transferAmount} ಯಶಸ್ವಿಯಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ.`
          : lang === 'hi'
          ? `रमेश को ₹${transferAmount} सफलतापूर्वक भेज दिया गया है।`
          : `Payment of ₹${transferAmount.toLocaleString('en-IN')} completed successfully to Ramesh.`;
        speakCurrentStep(successSpoken);
      }
    } catch (e) {
      console.error('Confirm transfer error:', e);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2 text-white font-sans">
      
      {/* ─────────────────────────────────────────────────────────────
          TOP BAR: GOLDEN DEMO PRESET & PERSPECTIVE SWITCHER
         ───────────────────────────────────────────────────────────── */}
      <div className="p-3.5 rounded-2xl bg-zinc-950/90 border border-blue-500/30 flex flex-wrap items-center justify-between gap-3 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white">NAYAN Adaptive Banking Experience</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Hackathon Golden Demo
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              {lang === 'kn' ? 'ಒಂದೇ ಸೇವೆ • ಬಳಕೆದಾರರಿಗೆ ತಕ್ಕಂತೆ ವಿಭಿನ್ನ ಅನುಭವ' : 'Same banking service • Different adaptive experience'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick 90s Golden Demo Preset Button */}
          <button
            onClick={launchGoldenDemo}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg flex items-center gap-1.5 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>90s Golden Demo (Kannada + Voice)</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          STEADYTAP MOTOR ASSISTANCE INDICATOR (If active)
         ───────────────────────────────────────────────────────────── */}
      <SteadyTapShield enabled={isMotorAssist} stabilizationLevel={100} language={lang} />

      {/* ─────────────────────────────────────────────────────────────
          SUB-VIEW 1: ADAPTIVE BANKING DASHBOARD
         ───────────────────────────────────────────────────────────── */}
      {currentView === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Account Balance Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border-2 border-blue-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-1">
                  {lang === 'kn' ? 'ಶುಭ ಮುಂಜಾನೆ, ರಮೇಶ್' : lang === 'hi' ? 'शुभ प्रभात, रमेश' : 'GOOD MORNING, RAMESH'}
                </span>
                <p className="text-sm text-zinc-400 font-medium">
                  {lang === 'kn' ? 'ಉಳಿತಾಯ ಖಾತೆ' : 'Savings Account'} &bull; {account.maskedAccountNumber}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => speakCurrentStep(`Your available account balance is ${account.availableBalance} rupees.`)}
                  className="p-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white"
                  title="Read balance aloud"
                >
                  <Volume2 className="w-4 h-4 text-blue-400" />
                </button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-800/80">
              <span className="text-xs font-semibold text-zinc-400 block mb-1">
                {lang === 'kn' ? 'ಲಭ್ಯವಿರುವ ಬ್ಯಾಲೆನ್ಸ್' : lang === 'hi' ? 'उपलब्ध शेष राशि' : 'Available Balance'}
              </span>
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                ₹{account.availableBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* PRIMARY 4 ADAPTIVE ACTIONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* SEND MONEY */}
            <button
              onClick={() => {
                setCurrentView('send_money');
                speakCurrentStep(lang === 'kn' ? 'ಹಣ ಕಳುಹಿಸುವ ಪರದೆ. ನೀವು ಯಾರಿಗೆ ಕಳುಹಿಸಬೇಕು?' : 'Send money screen. Who would you like to send to?');
              }}
              className={`p-6 rounded-3xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold shadow-xl transition-all flex flex-col justify-between ${
                isMotorAssist ? 'min-h-[140px] text-xl ring-4 ring-blue-400/30' : 'min-h-[120px] text-lg'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <Send className="w-6 h-6" />
              </div>
              <div className="text-left mt-4">
                <span>{lang === 'kn' ? 'ಹಣ ಕಳುಹಿಸಿ' : lang === 'hi' ? 'पैसे भेजें' : 'SEND MONEY'}</span>
                <p className="text-xs text-blue-100 font-medium mt-0.5">
                  {lang === 'kn' ? 'ಧ್ವನಿ ಅಥವಾ ಸ್ಪರ್ಶದ ಮೂಲಕ' : 'Via Voice or Tap'}
                </p>
              </div>
            </button>

            {/* CHECK BALANCE */}
            <button
              onClick={() => speakCurrentStep(`Your available balance is ${account.availableBalance} rupees.`)}
              className={`p-6 rounded-3xl bg-zinc-900 hover:bg-zinc-800 border-2 border-zinc-800 text-white font-extrabold shadow-md transition-all flex flex-col justify-between ${
                isMotorAssist ? 'min-h-[140px] text-xl' : 'min-h-[120px] text-lg'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <div className="text-left mt-4">
                <span>{lang === 'kn' ? 'ಬ್ಯಾಲೆನ್ಸ್ ಪರಿಶೀಲಿಸಿ' : lang === 'hi' ? 'बैलेंस चेक करें' : 'CHECK BALANCE'}</span>
                <p className="text-xs text-zinc-400 font-medium mt-0.5">
                  {lang === 'kn' ? 'ಧ್ವನಿ ಓದುವಿಕೆ' : 'Audio read-aloud'}
                </p>
              </div>
            </button>

            {/* RECENT PAYMENTS */}
            <button
              onClick={() => setCurrentView('transactions')}
              className={`p-6 rounded-3xl bg-zinc-900 hover:bg-zinc-800 border-2 border-zinc-800 text-white font-extrabold shadow-md transition-all flex flex-col justify-between ${
                isMotorAssist ? 'min-h-[140px] text-xl' : 'min-h-[120px] text-lg'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div className="text-left mt-4">
                <span>{lang === 'kn' ? 'ಇತ್ತೀಚಿನ ವಹಿವಾಟು' : lang === 'hi' ? 'हाल के भुगतान' : 'RECENT PAYMENTS'}</span>
                <p className="text-xs text-zinc-400 font-medium mt-0.5">
                  {lang === 'kn' ? 'ಕಳೆದ 4 ಖರ್ಚುಗಳು' : 'Last 4 transactions'}
                </p>
              </div>
            </button>

            {/* GET HELP */}
            <button
              onClick={() => speakCurrentStep('NAYAN Voice Assistant is here. You can speak in Kannada, Hindi, or English.')}
              className={`p-6 rounded-3xl bg-zinc-900 hover:bg-zinc-800 border-2 border-zinc-800 text-white font-extrabold shadow-md transition-all flex flex-col justify-between ${
                isMotorAssist ? 'min-h-[140px] text-xl' : 'min-h-[120px] text-lg'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div className="text-left mt-4">
                <span>{lang === 'kn' ? 'ಸಹಾಯ ಪಡೆಯಿರಿ' : lang === 'hi' ? 'सहायता लें' : 'GET HELP'}</span>
                <p className="text-xs text-zinc-400 font-medium mt-0.5">
                  {lang === 'kn' ? 'ನೇರ ಮಾರ್ಗದರ್ಶನ' : 'Direct Assistance'}
                </p>
              </div>
            </button>

          </div>

          {/* RECENT TRANSACTIONS SNIPPET */}
          <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-zinc-200">
                {lang === 'kn' ? 'ಇತ್ತೀಚಿನ ಪಾವತಿಗಳು' : 'Recent Transactions'}
              </h3>
              <button
                onClick={() => setCurrentView('transactions')}
                className="text-xs text-blue-400 hover:text-blue-300 font-bold"
              >
                {lang === 'kn' ? 'ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ' : 'View All'} &rarr;
              </button>
            </div>

            <div className="divide-y divide-zinc-800/80">
              {transactions.slice(0, 3).map((tx) => (
                <div key={tx.id} className="py-3.5 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm text-white">
                      {lang === 'kn' ? tx.titleKannada : tx.title}
                    </p>
                    <p className="text-xs text-zinc-400">{tx.timestamp} &bull; {tx.recipientOrSource}</p>
                  </div>
                  <div className={`font-extrabold text-sm ${tx.type === 'credit' ? 'text-emerald-400' : 'text-zinc-200'}`}>
                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SUB-VIEW 2: SEND MONEY & VOICE INPUT (THE KANNADA HERO DEMO)
         ───────────────────────────────────────────────────────────── */}
      {currentView === 'send_money' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <button
            onClick={() => setCurrentView('dashboard')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'kn' ? 'ಹಿಂದಕ್ಕೆ ಹೋಗಿ' : 'Back to Dashboard'}</span>
          </button>

          {/* VOICE INPUT HERO BANNER */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-blue-950/60 to-zinc-950 border-2 border-blue-500/50 shadow-2xl space-y-6 text-center">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block">
              {lang === 'kn' ? 'ಧ್ವನಿ ಬ್ಯಾಂಕಿಂಗ್ (ವಾಯ್ಸ್ ಇನ್ಪುಟ್)' : 'Multilingual Voice Banking'}
            </span>

            <div className="relative inline-flex items-center justify-center">
              <button
                onClick={() => handleSimulateKannadaSpeech()}
                className={`w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-300 ${
                  isVoiceListening
                    ? 'bg-rose-600 animate-pulse ring-8 ring-rose-500/40 text-white'
                    : isProcessingVoice
                    ? 'bg-amber-600 text-white animate-spin'
                    : 'bg-blue-600 hover:bg-blue-500 text-white hover:scale-105 shadow-blue-500/50'
                }`}
                aria-label="Voice Input"
              >
                <Mic className="w-10 h-10" />
              </button>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">
                {isVoiceListening 
                  ? (lang === 'kn' ? 'ಆಲಿಸಲಾಗುತ್ತಿದೆ... (LISTENING...)' : 'LISTENING...')
                  : isProcessingVoice 
                  ? (lang === 'kn' ? 'ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲಾಗುತ್ತಿದೆ...' : 'Processing Intent with Gemini...')
                  : (lang === 'kn' ? 'ಧ್ವನಿ ಮೂಲಕ ಕಳುಹಿಸಿ' : 'Speak your command')}
              </h2>
              <p className="text-sm text-zinc-300 max-w-md mx-auto">
                {lang === 'kn' 
                  ? 'ಉದಾಹರಣೆಗೆ ಹೀಗೆ ಹೇಳಿ: "ರಮೇಶ್ಗೆ 5000 ರೂಪಾಯಿ ಕಳುಹಿಸಬೇಕು"'
                  : 'Example: "Send five thousand rupees to Ramesh"'}
              </p>
            </div>

            {/* Quick Kannada Voice Trigger Shortcut Button */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                onClick={() => handleSimulateKannadaSpeech('ರಮೇಶ್ಗೆ 5000 ರೂಪಾಯಿ ಕಳುಹಿಸಬೇಕು')}
                className="px-4 py-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-200 text-xs font-extrabold transition-all"
              >
                🗣️ Say: &ldquo;ರಮೇಶ್ಗೆ 5000 ರೂಪಾಯಿ ಕಳುಹಿಸಬೇಕು&rdquo;
              </button>
              <button
                onClick={() => handleSimulateKannadaSpeech('Send 5000 rupees to Ramesh')}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-semibold transition-all"
              >
                🗣️ Say: &ldquo;Send ₹5,000 to Ramesh&rdquo;
              </button>
            </div>

            {/* SPEECH TRANSCRIPTION & INTENT DISPLAY */}
            {spokenTranscript && (
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-blue-400/40 text-left max-w-lg mx-auto space-y-2 animate-in fade-in">
                <div className="text-[11px] font-bold text-zinc-400 uppercase">
                  {lang === 'kn' ? 'ನೀವು ಹೇಳಿದ್ದು (Spoken Text)' : 'Captured Speech'}
                </div>
                <p className="text-base font-bold text-yellow-300">&ldquo;{spokenTranscript}&rdquo;</p>
                
                {interpretedIntent && (
                  <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs font-bold text-emerald-400">
                    <span>✓ Understood: Send ₹{interpretedIntent.amount?.toLocaleString('en-IN')} to {interpretedIntent.recipient}</span>
                    <span className="text-zinc-400 font-mono text-[10px]">{selectedRecipient.maskedAccountNumber}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* BENEFICIARY & MANUAL AMOUNT SELECTOR */}
          <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-6">
            <h3 className="text-lg font-extrabold text-white">
              {lang === 'kn' ? 'ಸ್ವೀಕರಿಸುವವರನ್ನು ಆಯ್ಕೆಮಾಡಿ' : 'Select Recipient'}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {beneficiaries.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedRecipient(b)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    selectedRecipient.id === b.id
                      ? 'border-blue-500 bg-blue-500/10 shadow-lg'
                      : 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl ${b.avatarColor} text-white flex items-center justify-center font-bold mb-2`}>
                    {b.name.charAt(0)}
                  </div>
                  <div className="font-extrabold text-sm text-white">
                    {lang === 'kn' ? b.nameKannada : b.name}
                  </div>
                  <div className="text-xs text-zinc-400 font-mono">{b.maskedAccountNumber}</div>
                </button>
              ))}
            </div>

            {/* Amount Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-extrabold text-zinc-300">
                {lang === 'kn' ? 'ವರ್ಗಾವಣೆ ಮೊತ್ತ (ರೂಪಾಯಿಗಳಲ್ಲಿ)' : 'Transfer Amount (INR)'}
              </label>

              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-zinc-400">₹</span>
                <input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(Number(e.target.value))}
                  className="w-full p-4 rounded-2xl bg-zinc-900 border-2 border-zinc-700 text-white font-black text-2xl focus:border-blue-500 outline-none"
                />
              </div>

              {/* Quick Amount Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[500, 1000, 5000, 10000, 25000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setTransferAmount(amt)}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs border transition-all ${
                      transferAmount === amt
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800'
                    }`}
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            {/* CONTINUE CTA */}
            <div className="pt-4 flex items-center gap-3">
              <button
                onClick={handleInitiateReview}
                className={`flex-1 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-lg shadow-xl flex items-center justify-center gap-2 transition-all ${
                  isMotorAssist ? 'min-h-[68px] text-xl' : ''
                }`}
              >
                <span>{lang === 'kn' ? 'ಪಾವತಿ ಪರಿಶೀಲಿಸಿ (Review Payment)' : 'Review Payment'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SUB-VIEW 3: ADAPTIVE FRICTION REVIEW SCREEN (SIGNATURE FEATURE)
         ───────────────────────────────────────────────────────────── */}
      {currentView === 'review' && transferPreview && (
        <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-200">
          
          <button
            onClick={() => setCurrentView('send_money')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'kn' ? 'ಬದಲಾಯಿಸಿ (Edit)' : 'Back to Edit'}</span>
          </button>

          <div className="p-8 rounded-3xl bg-zinc-950 border-2 border-zinc-800 shadow-2xl space-y-6">
            
            {/* Header */}
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block">
                {lang === 'kn' ? 'ಹಣ ಕಳುಹಿಸುವ ವಿವರ' : 'SEND MONEY REVIEW'}
              </span>
              <div className="text-4xl sm:text-5xl font-black text-white">
                {transferPreview.formattedAmount}
              </div>
              <p className="text-sm font-semibold text-zinc-400">
                {lang === 'kn' ? 'ಸ್ವೀಕರಿಸುವವರು:' : 'To:'} <span className="text-white font-bold">{transferPreview.recipientName}</span> ({transferPreview.recipientAccount})
              </p>
            </div>

            {/* ADAPTIVE FRICTION WARNING BANNER */}
            {transferPreview.riskAssessment.level === 'elevated' || transferPreview.riskAssessment.level === 'high' ? (
              <div className="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-200 space-y-3">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-black text-base text-amber-300">
                      ⚠ {lang === 'kn' ? transferPreview.riskAssessment.warningTitleKannada : transferPreview.riskAssessment.warningTitle}
                    </h4>
                    <p className="text-sm text-amber-200/90 font-medium mt-1">
                      {lang === 'kn' ? transferPreview.riskAssessment.warningDescriptionKannada : transferPreview.riskAssessment.warningDescription}
                    </p>
                  </div>
                </div>

                {/* "WHY THIS CHECK?" TRANSPARENT REASONS */}
                <div className="p-3.5 rounded-xl bg-black/40 border border-amber-500/20 text-xs text-zinc-300 space-y-1.5">
                  <span className="font-extrabold text-amber-400 block uppercase tracking-wider text-[10px]">
                    {lang === 'kn' ? 'ಈ ಪರಿಶೀಲನೆ ಏಕೆ? (WHY THIS CHECK?)' : 'WHY THIS CHECK?'}
                  </span>
                  <p>
                    {lang === 'kn' 
                      ? `ಈ ಮೊತ್ತವು ನಿಮ್ಮ ಸಾಮಾನ್ಯ ಸರಾಸರಿ ವಹಿವಾಟು (₹${transferPreview.riskAssessment.averageAmount}) ಕ್ಕಿಂತ ${transferPreview.riskAssessment.multiplier} ಪಟ್ಟು ಹೆಚ್ಚಾಗಿದೆ.`
                      : `Amount is ${transferPreview.riskAssessment.multiplier}× your usual transaction size (₹${transferPreview.riskAssessment.averageAmount}).`}
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    NAYAN Adaptive Friction Prototype &bull; Contextual Protection Layer
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-300 text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Transaction matches your standard spending profile.</span>
              </div>
            )}

            {/* AUDIO PROMPT REPLAY BUTTON */}
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-zinc-300 font-medium">
                  {lang === 'kn' ? transferPreview.spokenPromptKannada : transferPreview.spokenPromptText}
                </span>
              </div>
              <button
                onClick={() => speakCurrentStep(lang === 'kn' ? transferPreview.spokenPromptKannada : transferPreview.spokenPromptText)}
                className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-blue-400"
              >
                {lang === 'kn' ? 'ಮತ್ತೆ ಆಲಿಸಿ' : 'Replay Voice'}
              </button>
            </div>

            {/* ACTIONS */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => {
                  setCurrentView('confirm');
                  speakCurrentStep(lang === 'kn' ? 'ದಯವಿಟ್ಟು ಅಂತಿಮವಾಗಿ ದೃಢೀಕರಿಸಿ.' : 'Please confirm your transfer.');
                }}
                className={`w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-lg shadow-xl transition-all ${
                  isMotorAssist ? 'min-h-[68px] text-xl' : ''
                }`}
              >
                {lang === 'kn' ? 'ಮುಂದುವರಿಯಿರಿ (Continue)' : 'Continue'}
              </button>

              <button
                onClick={() => setCurrentView('send_money')}
                className="w-full py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-sm"
              >
                {lang === 'kn' ? 'ರದ್ದುಮಾಡಿ (Cancel)' : 'Cancel'}
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SUB-VIEW 4: EXPLICIT CONFIRMATION SCREEN
         ───────────────────────────────────────────────────────────── */}
      {currentView === 'confirm' && transferPreview && (
        <div className="space-y-6 max-w-xl mx-auto animate-in fade-in duration-200">
          
          <div className="p-8 rounded-3xl bg-zinc-950 border-2 border-blue-500/50 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8 text-blue-400" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">
                {lang === 'kn' ? 'ಅಂತಿಮ ದೃಢೀಕರಣ' : 'Final Explicit Confirmation'}
              </h2>
              <p className="text-base text-zinc-300 font-medium leading-relaxed">
                {lang === 'kn'
                  ? `ನೀವು ${transferPreview.recipientName} ಅವರಿಗೆ ${transferPreview.formattedAmount} ಕಳುಹಿಸಲು ಖಚಿತಪಡಿಸುತ್ತೀರಾ?`
                  : `You are sending ${transferPreview.formattedAmount} to ${transferPreview.recipientName} (${transferPreview.recipientAccount}). Please confirm.`}
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <button
                onClick={handleExecuteTransfer}
                className={`w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xl shadow-2xl transition-all flex items-center justify-center gap-2 ${
                  isMotorAssist ? 'min-h-[68px]' : ''
                }`}
              >
                <CheckCircle2 className="w-6 h-6" />
                <span>{lang === 'kn' ? 'ಖಚಿತಪಡಿಸಿ (Confirm Payment)' : 'Confirm Payment'}</span>
              </button>

              <button
                onClick={() => setCurrentView('dashboard')}
                className="w-full py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-bold text-sm"
              >
                {lang === 'kn' ? 'ರದ್ದುಮಾಡಿ (Cancel)' : 'Cancel'}
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SUB-VIEW 5: SUCCESS RECEIPT SCREEN
         ───────────────────────────────────────────────────────────── */}
      {currentView === 'success' && transferReceipt && (
        <div className="space-y-6 max-w-xl mx-auto animate-in zoom-in-95 duration-300">
          
          <div className="p-8 rounded-3xl bg-zinc-950 border-2 border-emerald-500/60 shadow-2xl text-center space-y-6">
            
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
                {lang === 'kn' ? 'ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ' : 'Payment Completed'}
              </span>
              <div className="text-4xl sm:text-5xl font-black text-white">
                {transferReceipt.formattedAmount}
              </div>
              <p className="text-sm font-semibold text-zinc-300">
                {lang === 'kn' ? 'ಸ್ವೀಕರಿಸಿದವರು:' : 'Sent to:'} <span className="text-white font-bold">{transferReceipt.recipientName}</span> ({transferReceipt.recipientAccount})
              </p>
            </div>

            {/* RECEIPT DETAILS */}
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-left text-xs space-y-2">
              <div className="flex justify-between text-zinc-400">
                <span>Transaction ID:</span>
                <span className="font-mono text-white font-bold">{transferReceipt.transactionId}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Timestamp:</span>
                <span className="text-white">{transferReceipt.timestamp}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>New Available Balance:</span>
                <span className="text-emerald-400 font-bold">₹{transferReceipt.remainingBalance.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-base shadow-xl"
              >
                {lang === 'kn' ? 'ಮುಗಿದಿದೆ (Done)' : 'Done'}
              </button>

              <button
                onClick={() => setCurrentView('transactions')}
                className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs"
              >
                {lang === 'kn' ? 'ಇತಿಹಾಸ ನೋಡಿ (View Transactions)' : 'View Transactions'}
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SUB-VIEW 6: TRANSACTIONS LIST
         ───────────────────────────────────────────────────────────── */}
      {currentView === 'transactions' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4">
            <h2 className="text-xl font-extrabold text-white">Transaction History</h2>

            <div className="divide-y divide-zinc-800">
              {transactions.map((tx) => (
                <div key={tx.id} className="py-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-base text-white">
                      {lang === 'kn' ? tx.titleKannada : tx.title}
                    </p>
                    <p className="text-xs text-zinc-400">{tx.timestamp} &bull; {tx.recipientOrSource}</p>
                  </div>
                  <div className={`font-black text-lg ${tx.type === 'credit' ? 'text-emerald-400' : 'text-zinc-200'}`}>
                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
