'use client';

import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  ShieldAlert, 
  ShieldCheck, 
  X, 
  Send, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  PhoneCall, 
  AlertTriangle, 
  Lock, 
  Loader2,
  ExternalLink,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { TrustedContact, TrustedRequest, TrustedResponseAction } from '@/types/safety';

interface AskTrustedCircleModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: {
    transactionType?: string;
    amount?: number;
    recipientName?: string;
    detectedWarning?: string;
    actionDescription?: string;
  };
  onResolution?: (action: 'approved' | 'rejected' | 'cancelled') => void;
  language?: string;
}

export function AskTrustedCircleModal({
  isOpen,
  onClose,
  context,
  onResolution,
  language = 'en'
}: AskTrustedCircleModalProps) {
  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<TrustedContact | null>(null);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [createdRequest, setCreatedRequest] = useState<TrustedRequest | null>(null);
  const [isSimulatingResponse, setIsSimulatingResponse] = useState(false);
  const [simulatedResponse, setSimulatedResponse] = useState<TrustedResponseAction | null>(null);
  const [reasonNote, setReasonNote] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchContacts();
      setCreatedRequest(null);
      setSimulatedResponse(null);
    }
  }, [isOpen]);

  const fetchContacts = async () => {
    setIsLoadingContacts(true);
    try {
      const res = await fetch('/api/trusted-circle');
      const data = await res.json();
      if (data?.contacts && data.contacts.length > 0) {
        setContacts(data.contacts);
        setSelectedContact(data.contacts[0]);
      }
    } catch (e) {
      console.error('Failed to load trusted contacts:', e);
    } finally {
      setIsLoadingContacts(false);
    }
  };

  const handleSendRequest = async () => {
    if (!selectedContact) return;
    setIsSending(true);

    try {
      const res = await fetch('/api/trusted-circle/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trustedContactId: selectedContact.id,
          contactName: selectedContact.name,
          contactRelationship: selectedContact.relationship,
          reason: reasonNote || `Unusual payment request of ₹${context.amount?.toLocaleString('en-IN') || '0'} to ${context.recipientName || 'Unknown'}`,
          riskLevel: (context.amount || 0) > 10000 ? 'high_risk' : 'caution',
          minimalContext: context,
        }),
      });

      const data = await res.json();
      if (data?.request) {
        setCreatedRequest(data.request);
      }
    } catch (e) {
      console.error('Error dispatching request:', e);
    } finally {
      setIsSending(false);
    }
  };

  const handleSimulateRecipientResponse = async (action: TrustedResponseAction) => {
    if (!createdRequest) return;
    setIsSimulatingResponse(true);

    try {
      const res = await fetch(`/api/trusted-circle/request/${createdRequest.id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: action }),
      });

      if (res.ok) {
        setSimulatedResponse(action);
        if (action === 'looks_safe') {
          setTimeout(() => onResolution?.('approved'), 1500);
        } else if (action === 'dont_proceed') {
          setTimeout(() => onResolution?.('rejected'), 1500);
        }
      }
    } catch (e) {
      console.error('Error submitting simulated response:', e);
    } finally {
      setIsSimulatingResponse(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-[#1E2024] rounded-[32px] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        role="dialog"
        aria-labelledby="ask-trusted-circle-title"
      >
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-white/10 flex items-start justify-between bg-slate-50/50 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 id="ask-trusted-circle-title" className="text-lg font-black text-slate-900 dark:text-white">
                Ask Someone You Trust
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Get a private second opinion on this specific situation.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Active Situation Warning */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-extrabold text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>{context.detectedWarning || 'Something looks unusual about this request'}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-amber-200/60 dark:border-amber-800/30">
              {context.recipientName && (
                <div>
                  <span className="text-[10px] text-amber-700/80 dark:text-amber-400/80 block">Recipient</span>
                  <span className="font-bold text-amber-950 dark:text-amber-100">{context.recipientName}</span>
                </div>
              )}
              {context.amount !== undefined && (
                <div>
                  <span className="text-[10px] text-amber-700/80 dark:text-amber-400/80 block">Requested Amount</span>
                  <span className="font-bold text-base text-amber-950 dark:text-amber-100">₹{context.amount.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>
          </div>

          {!createdRequest ? (
            /* STEP 1: SELECT CONTACT & SEND */
            <div className="space-y-4">
              <div>
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
                  Select a Trusted Person
                </label>

                {isLoadingContacts ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                    Loading your Trusted Circle...
                  </div>
                ) : contacts.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center space-y-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      You have not added any trusted contacts yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {contacts.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedContact(c)}
                        className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                          selectedContact?.id === c.id 
                            ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20' 
                            : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-black text-sm shadow-sm"
                            style={{ backgroundColor: c.avatarColor || '#1E3A2F' }}
                          >
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                              <span>{c.name}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                                {c.relationship}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                              Via {c.contactMethod} &bull; {c.contactValue}
                            </span>
                          </div>
                        </div>

                        {selectedContact?.id === c.id && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Minimal Context Preview Explanation */}
              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                  <Lock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Privacy Pledge: What will be shared?</span>
                </div>
                <p className="leading-relaxed italic">
                  «“Nayan detected a potentially suspicious transaction of ₹{context.amount?.toLocaleString('en-IN') || '0'} to {context.recipientName || 'Recipient'}. Your opinion is requested before continuing.”»
                </p>
                <span className="text-[10px] text-slate-400 block pt-0.5">
                  Trusted Circle only receives the minimal context needed for this request. No balance or account history is shared.
                </span>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 py-3 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  Review Myself
                </button>
                <button
                  type="button"
                  onClick={handleSendRequest}
                  disabled={!selectedContact || isSending}
                  className="w-2/3 py-3 rounded-xl bg-[#1E3A2F] hover:bg-[#2B5443] text-white font-extrabold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Request...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Ask {selectedContact ? selectedContact.name : 'Trusted Person'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: REQUEST DISPATCHED & LIVE RECIPIENT SIMULATOR */
            <div className="space-y-4 animate-in fade-in duration-200">
              
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-xs">
                  <span className="font-extrabold text-emerald-900 dark:text-emerald-200 block">
                    Request sent to {createdRequest.contactName} ({createdRequest.contactRelationship})
                  </span>
                  <p className="text-emerald-800/80 dark:text-emerald-300/80">
                    A private verification alert has been sent. This request automatically expires in 2 hours.
                  </p>
                </div>
              </div>

              {/* SIMULATED RECIPIENT ACTION BAR (FOR DEMO & JUDGING) */}
              <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/15 pb-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
                    📱 {createdRequest.contactName}'s Phone (Simulated Recipient View)
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">Expires in 1:59:40</span>
                </div>

                <p className="text-xs text-zinc-300 italic">
                  «“Nayan alert: Yash is requesting your advice regarding a ₹{context.amount?.toLocaleString('en-IN') || '0'} payment to {context.recipientName || 'an unverified recipient'}.”»
                </p>

                {simulatedResponse ? (
                  <div className="p-3 rounded-2xl bg-white/10 border border-white/20 text-center animate-in zoom-in-95">
                    <span className="text-xs font-black block">
                      {simulatedResponse === 'looks_safe' && '✅ Response Received: "Looks safe, go ahead"'}
                      {simulatedResponse === 'dont_proceed' && '⚠️ Response Received: "Don\'t proceed! This looks like a scam."'}
                      {simulatedResponse === 'call_me' && '📞 Response Received: "Calling you in a minute!"'}
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <button
                      onClick={() => handleSimulateRecipientResponse('looks_safe')}
                      disabled={isSimulatingResponse}
                      className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-extrabold flex flex-col items-center gap-1 shadow-sm transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Looks safe</span>
                    </button>

                    <button
                      onClick={() => handleSimulateRecipientResponse('dont_proceed')}
                      disabled={isSimulatingResponse}
                      className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-extrabold flex flex-col items-center gap-1 shadow-sm transition-all"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Don't proceed</span>
                    </button>

                    <button
                      onClick={() => handleSimulateRecipientResponse('call_me')}
                      disabled={isSimulatingResponse}
                      className="p-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-extrabold flex flex-col items-center gap-1 shadow-sm transition-all"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Call me</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white text-xs font-bold transition-colors"
                >
                  Close & Wait
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
