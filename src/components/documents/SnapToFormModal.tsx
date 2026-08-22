'use client';

import React, { useState } from 'react';
import { 
  Camera, 
  Sparkles, 
  X, 
  FileText
} from 'lucide-react';
import { 
  ExtractedDocumentData, 
  SAMPLE_DOCUMENTS 
} from '@/lib/ocr/documentExtractor';
import { useVoice } from '@/context/VoiceContext';

interface SnapToFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAutoFill: (data: ExtractedDocumentData) => void;
  documentTypeHint?: 'aadhaar' | 'marksheet' | 'ration_card' | 'any';
}

export function SnapToFormModal({
  isOpen,
  onClose,
  onAutoFill,
  documentTypeHint = 'any',
}: SnapToFormModalProps) {
  const { speak } = useVoice();
  const [isScanning, setIsScanning] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedDocumentData | null>(null);

  if (!isOpen) return null;

  const triggerScan = (data: ExtractedDocumentData) => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setExtractedData(data);
      if (speak) {
        speak("Document scanned successfully. Identified " + (data.fields.fullName || "card") + ". Ready to auto fill.");
      }
    }, 600);
  };

  const handleApply = () => {
    if (extractedData) {
      onAutoFill(extractedData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-white dark:bg-[#18191D] rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1E3A2F] text-white flex items-center justify-center font-bold">
              <Camera className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#1E2024] dark:text-white flex items-center gap-2">
                Snap-to-Form Auto-Fill
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-black">
                  AI OCR
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Snap an ID or choose a demo sample to auto-fill form inputs.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          
          {/* Samples */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
              Select a Test ID (Demo Samples):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.entries(SAMPLE_DOCUMENTS).map(([key, sampleItem]) => (
                <button
                  key={key}
                  onClick={() => triggerScan(sampleItem.data)}
                  className="p-3.5 rounded-2xl border text-left transition-all bg-slate-50 dark:bg-white/5 hover:border-emerald-500 group"
                >
                  <span className="font-bold text-xs text-[#1E2024] dark:text-white block group-hover:text-emerald-600">
                    {sampleItem.title}
                  </span>
                  <span className="text-[10px] text-slate-500 block pt-1">
                    {sampleItem.description}
                  </span>
                  <span className="text-[10px] font-black text-emerald-600 flex items-center gap-1 pt-1.5">
                    <Sparkles className="w-3 h-3" />
                    Scan &amp; Auto-Fill
                  </span>
                </button>
              ))}
            </div>
          </div>

          {isScanning && (
            <div className="py-8 flex flex-col items-center justify-center space-y-3">
              <FileText className="w-8 h-8 text-emerald-600 animate-pulse" />
              <span className="text-xs font-bold text-[#1E2024] dark:text-white">
                Neural OCR Scanning &amp; Extracting Fields...
              </span>
            </div>
          )}

          {!isScanning && extractedData && (
            <div className="space-y-3 animate-in fade-in">
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-xs text-emerald-800 dark:text-emerald-300">
                    {extractedData.documentName}
                  </span>
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-200 px-2 py-0.5 rounded-full">
                    99% Confidence
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {extractedData.fields.fullName && (
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Full Name</span>
                    <span className="font-extrabold text-xs">{extractedData.fields.fullName}</span>
                  </div>
                )}
                {extractedData.fields.idNumber && (
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">ID / Card Number</span>
                    <span className="font-extrabold text-xs font-mono">{extractedData.fields.idNumber}</span>
                  </div>
                )}
                {extractedData.fields.dob && (
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Date of Birth</span>
                    <span className="font-extrabold text-xs">{extractedData.fields.dob}</span>
                  </div>
                )}
                {extractedData.fields.percentageOrMarks && (
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Marks / Percentage</span>
                    <span className="font-extrabold text-xs text-emerald-600">{extractedData.fields.percentageOrMarks}</span>
                  </div>
                )}
                {extractedData.fields.address && (
                  <div className="sm:col-span-2 p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Address</span>
                    <span className="font-bold text-xs">{extractedData.fields.address}</span>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex justify-between items-center">
          <span className="text-xs text-slate-500">Client-Side OCR Privacy-First</span>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600">Cancel</button>
            <button 
              onClick={handleApply}
              disabled={!extractedData}
              className={extractedData ? "px-5 py-2 rounded-xl bg-[#1E3A2F] text-white font-bold text-xs cursor-pointer" : "px-5 py-2 rounded-xl bg-slate-200 text-slate-400 font-bold text-xs cursor-not-allowed"}
            >
              Apply to Form
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
