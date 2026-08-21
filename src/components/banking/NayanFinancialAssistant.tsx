'use client';

import React, { useState } from 'react';
import { useVoice } from '@/context/VoiceContext';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  HelpCircle, 
  Bot, 
  ArrowRight,
  TrendingUp,
  MessageSquare
} from 'lucide-react';

interface NayanFinancialAssistantProps {
  balance: number;
  foodExpense: number;
  language?: string;
  onTriggerTransfer?: (recipientName: string, amount: number) => void;
  onOpenBills?: () => void;
}

export function NayanFinancialAssistant({
  balance,
  foodExpense = 6420,
  language = 'en',
  onTriggerTransfer,
  onOpenBills,
}: NayanFinancialAssistantProps) {
  const { speak, isSpeaking } = useVoice();
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState<Array<{ role: 'user' | 'assistant'; text: string; action?: string }>>([
    {
      role: 'assistant',
      text: language === 'kn'
        ? 'ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಬ್ಯಾಂಕಿಂಗ್ ಅಥವಾ ಖರ್ಚುಗಳ ಬಗ್ಗೆ ನಾನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?'
        : language === 'hi'
        ? 'नमस्ते! मैं आपके बैंकिंग या खर्चों के बारे में कैसे मदद कर सकता हूँ?'
        : 'Hello! I can explain your spending, check balances, or guide you through transfers in plain language.',
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const quickPrompts = [
    { label: 'How much on food?', query: 'How much did I spend on food this month?' },
    { label: 'Send ₹500 to Rohan', query: 'Send ₹500 to Rohan' },
    { label: 'Explain my spending', query: 'Why did my spending increase this month?' },
    { label: 'What is my biggest expense?', query: 'What is my biggest expense category?' },
  ];

  const handleAsk = (textToAsk?: string) => {
    const finalQuery = (textToAsk || query).trim();
    if (!finalQuery) return;

    setConversation((prev) => [...prev, { role: 'user', text: finalQuery }]);
    setQuery('');
    setIsProcessing(true);

    setTimeout(() => {
      let reply = '';
      let actionType: string | undefined = undefined;

      const lower = finalQuery.toLowerCase();

      if (lower.includes('food') || lower.includes('dining')) {
        reply = language === 'kn'
          ? `ಈ ತಿಂಗಳು ನೀವು ಆಹಾರಕ್ಕಾಗಿ ₹${foodExpense.toLocaleString('en-IN')} ಖರ್ಚು ಮಾಡಿದ್ದೀರಿ. ಇದು ನಿಮ್ಮ ಸಾಮಾನ್ಯ ಸರಾಸರಿಗಿಂತ ಸುಮಾರು 18% ಹೆಚ್ಚಾಗಿದೆ.`
          : language === 'hi'
          ? `आपने इस महीने भोजन पर ₹${foodExpense.toLocaleString('en-IN')} खर्च किए हैं। यह आपके सामान्य औसत से लगभग 18% अधिक है।`
          : `You spent ₹${foodExpense.toLocaleString('en-IN')} on food and dining this month. That's about 18% higher than your usual monthly average.`;
      } else if (lower.includes('rohan') || lower.includes('send') || lower.includes('transfer')) {
        reply = language === 'kn'
          ? `ಖಂಡಿತ. ನೀವು ರೋಹನ್ ಶರ್ಮಾ ಅವರಿಗೆ ₹500 ಕಳುಹಿಸಲು ಹೊರಟಿದ್ದೀರಿ. ವರ್ಗಾವಣೆ ಪರದೆಯನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇವೆ.`
          : language === 'hi'
          ? `जरूर। आप रोहन शर्मा को ₹500 भेजने जा रहे हैं। स्थानांतरण स्क्रीन खोली जा रही है।`
          : `I can help with that. You're preparing to send ₹500 to Rohan Sharma. Opening the transfer screen for your review.`;
        actionType = 'TRANSFER_ROHAN';
        if (onTriggerTransfer) {
          setTimeout(() => onTriggerTransfer('Rohan Sharma', 500), 1200);
        }
      } else if (lower.includes('balance') || lower.includes('how much money')) {
        reply = language === 'kn'
          ? `ನಿಮ್ಮ ಖಾತೆಯಲ್ಲಿ ಒಟ್ಟು ₹${balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })} ಲಭ್ಯವಿದೆ.`
          : language === 'hi'
          ? `आपके खातों में कुल ₹${balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })} उपलब्ध हैं।`
          : `You currently have ₹${balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })} available across your Savings and Current accounts.`;
      } else if (lower.includes('bill') || lower.includes('electricity') || lower.includes('bescom')) {
        reply = language === 'kn'
          ? `ನಿಮ್ಮ BESCOM ವಿದ್ಯುತ್ ಬಿಲ್ ₹1,240 ಇಂದೇ ಪಾವತಿಸಬೇಕಾಗಿದೆ. ಬಿಲ್ ಪಾವತಿ ಪರದೆಯನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇವೆ.`
          : language === 'hi'
          ? `आपका BESCOM बिजली बिल ₹1,240 आज देय है। बिल भुगतान स्क्रीन खोली जा रही है।`
          : `You have a BESCOM electricity bill of ₹1,240 due today. Opening bill pay.`;
        if (onOpenBills) {
          setTimeout(() => onOpenBills(), 1200);
        }
      } else if (lower.includes('biggest') || lower.includes('highest')) {
        reply = `Your biggest expense category this month is Food & Dining at ₹6,420 (38% of total spending), followed by Shopping at ₹4,200.`;
      } else {
        reply = `Your overall spending is ₹11,913 this month. You have saved 40% of your earnings, keeping your budget in great health!`;
      }

      setConversation((prev) => [...prev, { role: 'assistant', text: reply, action: actionType }]);
      setIsProcessing(false);
      speak(reply);
    }, 800);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border-2 border-blue-500/30 shadow-2xl space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-500 border border-blue-500/30 flex items-center justify-center shadow-inner">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-[var(--text-primary)] flex items-center gap-2">
              <span>NAYAN Financial Assistant</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                VOICE & TEXT
              </span>
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Plain-language insights &bull; Understand where your money goes
            </p>
          </div>
        </div>

        <button
          onClick={() => handleAsk('Why did my spending increase this month?')}
          className="px-3.5 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-xs border border-blue-500/30 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Explain Spending Summary</span>
        </button>
      </div>

      {/* Conversation Thread */}
      <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
        {conversation.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 text-xs sm:text-sm ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                N
              </div>
            )}
            <div
              className={`p-4 rounded-2xl max-w-[85%] leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none shadow-md font-semibold'
                  : 'bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-bl-none shadow-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex gap-2 items-center text-xs text-blue-500 font-semibold italic">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            <span>NAYAN is analyzing your financial data...</span>
          </div>
        )}
      </div>

      {/* Quick Question Chips */}
      <div className="flex flex-wrap gap-2 pt-1">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleAsk(p.query)}
            className="px-3 py-1.5 rounded-xl bg-[var(--bg-surface-secondary)] hover:border-blue-500 border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <span>{p.label}</span>
            <ArrowRight className="w-3 h-3 text-blue-500" />
          </button>
        ))}
      </div>

      {/* Input Box with Voice Trigger */}
      <div className="flex items-center gap-2 p-2 rounded-2xl bg-[var(--bg-surface-secondary)] border-2 border-[var(--border-color)] focus-within:border-blue-500">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          placeholder="Ask anything: 'What did I spend on food?' or 'Send ₹500 to Rohan'"
          className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm font-semibold text-[var(--text-primary)] outline-none"
        />
        <button
          onClick={() => handleAsk()}
          disabled={!query.trim()}
          className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold disabled:opacity-40 transition-all"
          aria-label="Send Question"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
