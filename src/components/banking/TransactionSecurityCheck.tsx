'use client';

import React, { useState } from 'react';
import { TransferPreview, TransactionState } from '@/types/banking';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  AlertTriangle, 
  ArrowLeft, 
  Check, 
  Info, 
  Fingerprint, 
  KeyRound,
  Loader2
} from 'lucide-react';

interface TransactionSecurityCheckProps {
  preview: TransferPreview;
  language: string;
  onVerified: () => void;
  onCancel: () => void;
}

export function TransactionSecurityCheck({
  preview,
  language,
  onVerified,
  onCancel,
}: TransactionSecurityCheckProps) {
  const [authStep, setAuthStep] = useState<'review' | 'authenticate' | 'authenticating'>('review');

  const { amount, recipientName, recipientAccount, riskAssessment } = preview;
  const { configuredLimit, isLimitExceeded, exceededBy } = riskAssessment;

  const handleStartAuth = () => {
    setAuthStep('authenticate');
  };

  const handleCompleteAuth = () => {
    setAuthStep('authenticating');
    setTimeout(() => {
      onVerified();
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Back to Edit */}
      <button
        onClick={onCancel}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] font-bold text-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>
          {language === 'kn' ? 'ವಹಿವಾಟು ರದ್ದುಮಾಡಿ' : language === 'hi' ? 'लेनदेन रद्द करें' : 'Cancel & Edit'}
        </span>
      </button>

      {/* ─────────────────────────────────────────────────────────────
          PHASE 1: REVIEW & LIMIT EXCEEDED WARNING
         ───────────────────────────────────────────────────────────── */}
      {authStep === 'review' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border-2 border-amber-500/40 shadow-2xl space-y-6">
          
          {/* Warning Banner */}
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-black text-[var(--text-primary)] flex items-center gap-2">
                <span>⚠️ {language === 'kn' ? 'ವಹಿವಾಟು ಮಿತಿ ಮೀರಿದೆ' : language === 'hi' ? 'लेनदेन सीमा पार हो गई है' : 'Transaction Limit Exceeded'}</span>
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                {language === 'kn'
                  ? `ನೀವು ₹${amount.toLocaleString('en-IN')} ಕಳುಹಿಸಲು ಪ್ರಯತ್ನಿಸುತ್ತಿದ್ದೀರಿ. ನಿಮ್ಮ ಸುರಕ್ಷತಾ ಮಿತಿ ₹${configuredLimit.toLocaleString('en-IN')} ಆಗಿದೆ. ಈ ವಹಿವಾಟು ನೀವು ನಿಗದಿಪಡಿಸಿದ ಮಿತಿಗಿಂತ ಹೆಚ್ಚಾಗಿದೆ.`
                  : language === 'hi'
                  ? `आप ₹${amount.toLocaleString('en-IN')} भेजने का प्रयास कर रहे हैं। आपकी सुरक्षा सीमा ₹${configuredLimit.toLocaleString('en-IN')} है। यह लेनदेन आपकी निर्धारित सीमा से अधिक है।`
                  : `You're attempting to send ₹${amount.toLocaleString('en-IN')}. Your warning limit is ₹${configuredLimit.toLocaleString('en-IN')}. This transaction is above the limit you configured for additional verification.`
                }
              </p>
              <div className="pt-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                Note: This is your user-defined safety threshold, not a block.
              </div>
            </div>
          </div>

          {/* AI Assistant Explanation Box */}
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3 text-xs sm:text-sm text-[var(--text-primary)]">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-blue-600 dark:text-blue-400 mb-0.5">
                NAYAN Assistant Explanation
              </span>
              <p className="italic text-[var(--text-secondary)]">
                {language === 'kn'
                  ? `"ಈ ಪಾವತಿಯು ನಿಮ್ಮ ₹${configuredLimit.toLocaleString('en-IN')} ಸುರಕ್ಷತಾ ಮಿತಿಗಿಂತ ಹೆಚ್ಚಾಗಿದೆ. ಮುಂದುವರಿಯುವ ಮೊದಲು ನೀವು ಇದನ್ನು ಪರಿಶೀಲಿಸಬೇಕು."`
                  : language === 'hi'
                  ? `"यह भुगतान आपकी ₹${configuredLimit.toLocaleString('en-IN')} सुरक्षा सीमा से अधिक है। आगे बढ़ने से पहले कृपया इसका सत्यापन करें।"`
                  : `"This payment is above your ₹${configuredLimit.toLocaleString('en-IN')} safety limit. I'll ask you to verify the transaction before it can continue."`
                }
              </p>
            </div>
          </div>

          {/* Transparent Transaction Details Breakdown */}
          <div className="p-5 rounded-2xl bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              {language === 'kn' ? 'ವಹಿವಾಟು ಪರಿಶೀಲನೆ ವಿವರ' : language === 'hi' ? 'लेनदेन समीक्षा विवरण' : 'Review Transaction Details'}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div>
                <span className="text-xs text-[var(--text-secondary)] block">Recipient</span>
                <span className="font-black text-sm text-[var(--text-primary)]">{recipientName}</span>
              </div>
              <div>
                <span className="text-xs text-[var(--text-secondary)] block">Account</span>
                <span className="font-mono text-sm text-[var(--text-primary)]">{recipientAccount}</span>
              </div>
              <div>
                <span className="text-xs text-[var(--text-secondary)] block">Requested Amount</span>
                <span className="font-black text-base text-[var(--text-primary)]">₹{amount.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-xs text-[var(--text-secondary)] block">Your Safety Limit</span>
                <span className="font-bold text-sm text-amber-600 dark:text-amber-400">₹{configuredLimit.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs">
              <span className="text-[var(--text-secondary)]">Reason for verification:</span>
              <span className="font-bold text-[var(--text-primary)]">
                Amount exceeds your configured safety limit by ₹{exceededBy.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onCancel}
              className="w-full sm:w-1/3 py-4 rounded-2xl bg-[var(--bg-surface-secondary)] hover:opacity-80 border border-[var(--border-color)] text-[var(--text-secondary)] font-extrabold text-sm transition-all"
            >
              {language === 'kn' ? 'ರದ್ದುಮಾಡಿ (Cancel)' : language === 'hi' ? 'रद्द करें' : 'Cancel Transaction'}
            </button>

            <button
              onClick={handleStartAuth}
              className="w-full sm:w-2/3 py-4 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-sm sm:text-base shadow-xl flex items-center justify-center gap-2 transition-all focus:ring-4 focus:ring-amber-400"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>{language === 'kn' ? 'ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಮುಂದುವರಿಯಿರಿ' : language === 'hi' ? 'सत्यापित करें और आगे बढ़ें' : 'Verify & Continue'}</span>
            </button>
          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          PHASE 2: SECURE AUTHENTICATION BOUNDARY (SIMULATED FOR DEMO)
         ───────────────────────────────────────────────────────────── */}
      {(authStep === 'authenticate' || authStep === 'authenticating') && (
        <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border-2 border-blue-500 shadow-2xl space-y-6 text-center max-w-lg mx-auto">
          
          <div className="w-16 h-16 rounded-3xl bg-blue-500/10 border border-blue-500/30 text-blue-500 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-[var(--text-primary)]">
              🔒 {language === 'kn' ? 'ಸುರಕ್ಷಿತ ದೃಢೀಕರಣ ಅಗತ್ಯವಿದೆ' : language === 'hi' ? 'सुरक्षित सत्यापन आवश्यक है' : 'Secure Verification Required'}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-sm mx-auto">
              {language === 'kn'
                ? `ದಯವಿಟ್ಟು ₹${amount.toLocaleString('en-IN')} ವರ್ಗಾವಣೆಯನ್ನು ಬ್ಯಾಂಕಿನ ಸುರಕ್ಷಿತ ವಿಧಾನದ ಮೂಲಕ ಅಧಿಕೃತಗೊಳಿಸಿ.`
                : language === 'hi'
                ? `कृपया बैंक के सुरक्षित प्रमाणीकरण के साथ ₹${amount.toLocaleString('en-IN')} के हस्तांतरण को अधिकृत करें।`
                : `Please verify this transfer of ₹${amount.toLocaleString('en-IN')} to ${recipientName} using the bank's secure authentication method.`
              }
            </p>
          </div>

          {/* Verification Shield Notice */}
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Privacy Boundary: Zero UPI PINs or passwords exposed to AI</span>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={handleCompleteAuth}
              disabled={authStep === 'authenticating'}
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-extrabold text-base shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 focus:ring-4 focus:ring-blue-400"
            >
              {authStep === 'authenticating' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Authorizing Secure Transfer...</span>
                </>
              ) : (
                <>
                  <Fingerprint className="w-5 h-5" />
                  <span>Authenticate & Execute Transfer</span>
                </>
              )}
            </button>

            <button
              onClick={() => setAuthStep('review')}
              disabled={authStep === 'authenticating'}
              className="w-full py-2.5 text-xs text-[var(--text-secondary)] hover:underline font-bold"
            >
              Back to Review
            </button>
          </div>

          <p className="text-[10px] text-[var(--text-secondary)] font-mono">
            Simulated Banking Auth Gateway &bull; NAYAN Security Shield
          </p>

        </div>
      )}

    </div>
  );
}
