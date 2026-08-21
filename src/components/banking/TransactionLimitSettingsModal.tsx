'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, Check, ArrowRight, Lock } from 'lucide-react';

interface TransactionLimitSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLimit: number;
  onSaveLimit: (newLimit: number) => void;
  language?: string;
}

export function TransactionLimitSettingsModal({
  isOpen,
  onClose,
  currentLimit,
  onSaveLimit,
  language = 'en',
}: TransactionLimitSettingsModalProps) {
  const [limitInput, setLimitInput] = useState<number>(currentLimit);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLimitInput(currentLimit);
  }, [currentLimit]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (limitInput > 0) {
      onSaveLimit(limitInput);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 1000);
    }
  };

  const presetAmounts = [2000, 5000, 10000, 25000, 50000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border-2 border-[var(--border-color)] text-[var(--text-primary)] shadow-2xl space-y-6"
        role="dialog"
        aria-labelledby="limit-settings-title"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-widest">
            <Lock className="w-4 h-4" />
            <span>Nayan Settings &bull; Security</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[var(--bg-surface-secondary)] text-[var(--text-secondary)]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-1.5">
          <h2 id="limit-settings-title" className="text-xl font-black tracking-tight">
            Transaction Warning Limit
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            Warn me and require explicit review whenever a transaction exceeds:
          </p>
        </div>

        {/* Input */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--bg-surface-secondary)] border-2 border-[var(--border-color)] focus-within:border-blue-500">
            <span className="text-2xl font-black text-[var(--text-secondary)]">₹</span>
            <input
              type="number"
              value={limitInput}
              onChange={(e) => setLimitInput(Number(e.target.value))}
              className="w-full bg-transparent text-2xl font-black text-[var(--text-primary)] outline-none"
              placeholder="5000"
              min="500"
              step="500"
            />
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2">
            {presetAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setLimitInput(amt)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  limitInput === amt
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                    : 'bg-[var(--bg-surface-secondary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:opacity-80'
                }`}
              >
                ₹{amt.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-1/3 py-3.5 rounded-2xl bg-[var(--bg-surface-secondary)] hover:opacity-80 font-extrabold text-xs text-[var(--text-secondary)] border border-[var(--border-color)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="w-2/3 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Limit Saved!</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Save Limit</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
