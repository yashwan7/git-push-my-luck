'use client';

import React, { useState } from 'react';
import { BillItem } from '@/types/banking';
import { MOCK_BILLS } from '@/lib/bankingMockData';
import { 
  X, 
  Zap, 
  Smartphone, 
  Wifi, 
  Droplet, 
  Flame, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Loader2,
  Receipt
} from 'lucide-react';

interface BillPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPayBill: (bill: BillItem) => void;
  language?: string;
}

export function BillPaymentModal({
  isOpen,
  onClose,
  onPayBill,
  language = 'en',
}: BillPaymentModalProps) {
  const [bills, setBills] = useState<BillItem[]>(MOCK_BILLS);
  const [selectedBill, setSelectedBill] = useState<BillItem | null>(MOCK_BILLS[0]);
  const [isPaying, setIsPaying] = useState(false);
  const [successBill, setSuccessBill] = useState<BillItem | null>(null);

  if (!isOpen) return null;

  const getIcon = (cat: string) => {
    switch (cat) {
      case 'electricity': return Zap;
      case 'mobile': return Smartphone;
      case 'internet': return Wifi;
      case 'water': return Droplet;
      default: return Flame;
    }
  };

  const handleExecutePayment = () => {
    if (!selectedBill) return;
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setSuccessBill(selectedBill);
      onPayBill(selectedBill);
    }, 1000);
  };

  const handleReset = () => {
    setSuccessBill(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border-2 border-[var(--border-color)] text-[var(--text-primary)] shadow-2xl space-y-6"
        role="dialog"
        aria-labelledby="bill-pay-title"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-widest">
            <Receipt className="w-4 h-4" />
            <span>Bill Payment &bull; BBPS Demo</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[var(--bg-surface-secondary)] text-[var(--text-secondary)]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successBill ? (
          /* Payment Success State */
          <div className="text-center space-y-5 py-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-[var(--text-primary)]">
                Bill Payment Successful!
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                ₹{successBill.amount.toLocaleString('en-IN')} paid to <strong>{successBill.billerName}</strong>
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono pt-1">
                Receipt #BBPS-NAYAN-{Date.now().toString().slice(-6)}
              </p>
            </div>
            <button
              onClick={handleReset}
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-xl"
            >
              Done & Return to Dashboard
            </button>
          </div>
        ) : (
          /* Bill Selection & Pay View */
          <div className="space-y-5">
            <div className="space-y-1">
              <h2 id="bill-pay-title" className="text-xl font-black tracking-tight">
                Select a Bill to Pay
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Choose any pending utility or recharge bill for instant demo settlement.
              </p>
            </div>

            {/* Biller List */}
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {bills.map((bill) => {
                const Icon = getIcon(bill.category);
                const isSelected = selectedBill?.id === bill.id;

                return (
                  <button
                    key={bill.id}
                    type="button"
                    onClick={() => setSelectedBill(bill)}
                    className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-blue-500/10 border-blue-500 shadow-md'
                        : 'bg-[var(--bg-surface-secondary)] border-[var(--border-color)] hover:opacity-80'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-blue-500 text-white' : 'bg-slate-500/10 text-blue-500'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-extrabold text-sm text-[var(--text-primary)]">
                          {bill.billerName}
                        </div>
                        <div className="text-xs text-[var(--text-secondary)]">
                          {bill.title} &bull; {bill.consumerNumber}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-black text-sm text-[var(--text-primary)]">
                        ₹{bill.amount.toLocaleString('en-IN')}
                      </div>
                      <div className={`text-[11px] font-bold ${bill.isDueToday ? 'text-amber-500' : 'text-[var(--text-secondary)]'}`}>
                        {bill.dueDate}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Payment Summary Footer */}
            {selectedBill && (
              <div className="p-4 rounded-2xl bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[var(--text-secondary)] block">Selected Bill:</span>
                  <strong className="text-[var(--text-primary)]">{selectedBill.billerName} ({selectedBill.title})</strong>
                </div>
                <div className="text-right">
                  <span className="text-[var(--text-secondary)] block">Total Debit:</span>
                  <span className="text-base font-black text-blue-500">₹{selectedBill.amount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            )}

            {/* Pay Button */}
            <button
              onClick={handleExecutePayment}
              disabled={isPaying || !selectedBill}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-extrabold text-sm sm:text-base shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            >
              {isPaying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing BBPS Settlement...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Pay Now (Demo Settlement)</span>
                </>
              )}
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
