'use client';

import React from 'react';
import { BankTransaction } from '@/types/banking';
import { 
  X, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard,
  Copy,
  Check
} from 'lucide-react';

interface TransactionDetailModalProps {
  transaction: BankTransaction | null;
  isOpen: boolean;
  onClose: () => void;
  onAskAnukool: (query: string) => void;
  language?: string;
}

export function TransactionDetailModal({
  transaction,
  isOpen,
  onClose,
  onAskAnukool,
  language = 'en',
}: TransactionDetailModalProps) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !transaction) return null;

  const isCredit = transaction.type === 'credit';

  const handleCopyRef = () => {
    if (transaction.referenceId) {
      navigator.clipboard.writeText(transaction.referenceId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleExplain = () => {
    onAskAnukool(`Explain this transaction of ₹${transaction.amount} with ${transaction.title}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border-2 border-[var(--border-color)] text-[var(--text-primary)] shadow-2xl space-y-6"
        role="dialog"
        aria-labelledby="tx-detail-title"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-widest">
            <CreditCard className="w-4 h-4" />
            <span>Transaction Details</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[var(--bg-surface-secondary)] text-[var(--text-secondary)]"
            aria-label="Close transaction details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount & Merchant Hero */}
        <div className="text-center space-y-2 pb-2">
          <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center ${
            isCredit ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'
          }`}>
            {isCredit ? <ArrowDownLeft className="w-7 h-7" /> : <ArrowUpRight className="w-7 h-7" />}
          </div>
          <h2 id="tx-detail-title" className="text-2xl font-black text-[var(--text-primary)]">
            {transaction.title}
          </h2>
          <div className={`text-4xl font-black ${isCredit ? 'text-emerald-500' : 'text-[var(--text-primary)]'}`}>
            {isCredit ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed Successfully</span>
          </div>
        </div>

        {/* Structured Info Grid */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] divide-y divide-[var(--border-color)] text-xs space-y-2">
          <div className="flex justify-between py-1.5">
            <span className="text-[var(--text-secondary)]">Merchant / Source</span>
            <span className="font-bold text-[var(--text-primary)]">{transaction.merchant || transaction.recipientOrSource}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-[var(--text-secondary)]">Date & Time</span>
            <span className="font-semibold text-[var(--text-primary)]">{transaction.timestamp}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-[var(--text-secondary)]">Category</span>
            <span className="font-bold uppercase tracking-wider text-blue-500">{transaction.category}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-[var(--text-secondary)]">Payment Method</span>
            <span className="font-semibold text-[var(--text-primary)]">{transaction.paymentMethod || 'ANUKOOL Direct Bank Transfer'}</span>
          </div>
          {transaction.referenceId && (
            <div className="flex justify-between items-center py-1.5">
              <span className="text-[var(--text-secondary)]">Reference ID</span>
              <button 
                onClick={handleCopyRef}
                className="font-mono font-bold text-[var(--text-primary)] flex items-center gap-1 hover:text-blue-500"
                title="Click to copy reference ID"
              >
                <span>{transaction.referenceId}</span>
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-[var(--text-secondary)]" />}
              </button>
            </div>
          )}
          {transaction.note && (
            <div className="flex justify-between py-1.5">
              <span className="text-[var(--text-secondary)]">Note</span>
              <span className="italic text-[var(--text-secondary)]">{transaction.note}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleExplain}
            className="flex-1 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask ANUKOOL to Explain</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3.5 rounded-2xl bg-[var(--bg-surface-secondary)] hover:opacity-80 border border-[var(--border-color)] text-[var(--text-secondary)] font-bold text-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
