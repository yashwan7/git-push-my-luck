'use client';

import React, { useState } from 'react';
import { QrCode, Copy, Check, X, ArrowDownLeft, Sparkles } from 'lucide-react';

interface ReceiveMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateReceive: (amount: number, sender: string) => void;
  userUpiId?: string;
  userName?: string;
}

export function ReceiveMoneyModal({
  isOpen,
  onClose,
  onSimulateReceive,
  userUpiId = 'yashwanth@nayan',
  userName = 'Yashwanth Gowda',
}: ReceiveMoneyModalProps) {
  const [copied, setCopied] = useState(false);
  const [simulatedReceived, setSimulatedReceived] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(userUpiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSimulate = (amount: number, sender: string) => {
    setSimulatedReceived(true);
    onSimulateReceive(amount, sender);
    setTimeout(() => {
      setSimulatedReceived(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border-2 border-[var(--border-color)] text-[var(--text-primary)] shadow-2xl space-y-6 text-center"
        role="dialog"
        aria-labelledby="receive-money-title"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-widest">
            <ArrowDownLeft className="w-4 h-4" />
            <span>Receive Money &bull; UPI QR</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[var(--bg-surface-secondary)] text-[var(--text-secondary)]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-1">
          <h2 id="receive-money-title" className="text-xl font-black tracking-tight">
            Scan to Pay {userName}
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Instant settlement to primary savings account •••• 2734
          </p>
        </div>

        {/* QR Code Card */}
        <div className="p-6 rounded-3xl bg-white text-black max-w-[220px] mx-auto shadow-xl border-4 border-blue-500/20 relative">
          <div className="w-full aspect-square bg-slate-100 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300 relative overflow-hidden">
            {/* High visual QR Code simulation */}
            <div className="grid grid-cols-5 gap-1.5 p-3 w-full h-full">
              {Array.from({ length: 25 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`rounded-sm ${
                    i % 2 === 0 || i === 0 || i === 4 || i === 20 || i === 24 || i === 12 
                      ? 'bg-slate-900' 
                      : 'bg-slate-300'
                  }`} 
                />
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-md">
                N
              </div>
            </div>
          </div>
          <span className="text-[11px] font-bold text-slate-700 mt-2 block font-mono">
            {userUpiId}
          </span>
        </div>

        {/* UPI ID Copy Box */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] text-xs">
          <span className="font-mono text-[var(--text-primary)] font-bold">{userUpiId}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-blue-500 font-bold hover:underline"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy UPI'}</span>
          </button>
        </div>

        {/* Demo incoming transfer trigger */}
        <div className="pt-2 border-t border-[var(--border-color)] space-y-2">
          <span className="text-[11px] font-semibold text-[var(--text-secondary)] block">
            Hackathon Demo Helper:
          </span>
          <button
            onClick={() => handleSimulate(1500, 'Sunil Gavaskar')}
            disabled={simulatedReceived}
            className="w-full py-3 rounded-2xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{simulatedReceived ? 'Crediting ₹1,500...' : 'Simulate Incoming Transfer (+₹1,500 from Sunil)'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
