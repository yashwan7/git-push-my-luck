'use client';

import React, { useState } from 'react';
import { BankCard } from '@/types/banking';
import { 
  X, 
  CreditCard, 
  Lock, 
  Unlock, 
  Wifi, 
  ShieldCheck, 
  Sliders, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

interface ManageCardsModalProps {
  card: BankCard;
  isOpen: boolean;
  onClose: () => void;
  onUpdateCard: (updated: Partial<BankCard>) => void;
}

export function ManageCardsModal({
  card,
  isOpen,
  onClose,
  onUpdateCard,
}: ManageCardsModalProps) {
  const [showFullNumber, setShowFullNumber] = useState(false);
  const [isFrozen, setIsFrozen] = useState(card.isFrozen);
  const [isContactless, setIsContactless] = useState(card.isContactless);
  const [dailyLimit, setDailyLimit] = useState(card.dailyLimit);

  if (!isOpen) return null;

  const handleToggleFreeze = () => {
    const next = !isFrozen;
    setIsFrozen(next);
    onUpdateCard({ isFrozen: next });
  };

  const handleToggleContactless = () => {
    const next = !isContactless;
    setIsContactless(next);
    onUpdateCard({ isContactless: next });
  };

  const handleLimitChange = (val: number) => {
    setDailyLimit(val);
    onUpdateCard({ dailyLimit: val });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border-2 border-[var(--border-color)] text-[var(--text-primary)] shadow-2xl space-y-6"
        role="dialog"
        aria-labelledby="manage-card-title"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-widest">
            <CreditCard className="w-4 h-4" />
            <span>Card Controls</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[var(--bg-surface-secondary)] text-[var(--text-secondary)]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Digital Card Preview */}
        <div className={`p-6 rounded-3xl text-white shadow-2xl relative overflow-hidden transition-all duration-300 ${
          isFrozen 
            ? 'bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 opacity-70' 
            : 'bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-950'
        }`}>
          <div className="flex justify-between items-start">
            <span className="text-xs font-black tracking-widest text-blue-200">
              {card.bankName}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-white/20 font-bold backdrop-blur-sm">
              DEMO
            </span>
          </div>

          <div className="my-6">
            <span className="font-mono text-lg sm:text-xl tracking-widest font-black block">
              {showFullNumber ? card.cardNumber : card.maskedCardNumber}
            </span>
            <button
              onClick={() => setShowFullNumber(!showFullNumber)}
              className="text-[11px] text-blue-200 hover:text-white mt-1 flex items-center gap-1 font-semibold"
            >
              {showFullNumber ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span>{showFullNumber ? 'Hide Details' : 'Show Details'}</span>
            </button>
          </div>

          <div className="flex justify-between items-end text-xs">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-blue-200 block">Cardholder</span>
              <span className="font-bold">{card.cardHolderName}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-blue-200 block">Expires</span>
              <span className="font-bold">{card.expiryDate}</span>
            </div>
            <span className="font-black text-base italic">{card.cardType}</span>
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="space-y-3">
          
          {/* Freeze Card Toggle */}
          <div className="p-4 rounded-2xl bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isFrozen ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'
              }`}>
                {isFrozen ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </div>
              <div>
                <span className="text-xs font-bold text-[var(--text-primary)] block">
                  {isFrozen ? 'Card is Frozen' : 'Card is Active'}
                </span>
                <span className="text-[11px] text-[var(--text-secondary)]">
                  Temporarily disable all transactions
                </span>
              </div>
            </div>
            <button
              onClick={handleToggleFreeze}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                isFrozen 
                  ? 'bg-red-600 text-white' 
                  : 'bg-slate-200 dark:bg-slate-800 text-[var(--text-primary)]'
              }`}
            >
              {isFrozen ? 'Unfreeze' : 'Freeze'}
            </button>
          </div>

          {/* Contactless Tap & Pay Toggle */}
          <div className="p-4 rounded-2xl bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Wifi className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[var(--text-primary)] block">
                  Contactless Payments
                </span>
                <span className="text-[11px] text-[var(--text-secondary)]">
                  Tap to pay up to ₹5,000 without PIN
                </span>
              </div>
            </div>
            <button
              onClick={handleToggleContactless}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                isContactless 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-200 dark:bg-slate-800 text-[var(--text-secondary)]'
              }`}
            >
              {isContactless ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Daily Limit Slider */}
          <div className="p-4 rounded-2xl bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[var(--text-primary)]">Daily Card Limit</span>
              <span className="font-black text-blue-500">₹{dailyLimit.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="100000"
              step="5000"
              value={dailyLimit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-xl"
        >
          Save & Close
        </button>

      </div>
    </div>
  );
}
