'use client';

import React, { useState } from 'react';
import { ServiceDefinition } from '@/types';
import { AlertCircle, FileText } from 'lucide-react';

interface StandardViewProps {
  service: ServiceDefinition;
  onComplete: () => void;
}

export function StandardView({ service, onComplete }: StandardViewProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});

  return (
    <div className="bg-white text-slate-900 border border-slate-300 rounded-lg p-6 font-sans text-xs space-y-6 shadow-xs max-w-4xl mx-auto">
      
      {/* Bureaucratic Header */}
      <div className="border-b border-slate-300 pb-4">
        <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">
          <span>Official Portal &bull; Form Ref: GOV-2026-X8</span>
        </div>
        <h2 className="text-base font-bold text-slate-900">
          {service.title} ({service.organization})
        </h2>
        <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
          {service.description}
        </p>
      </div>

      {/* Complex Bureaucratic Warning Box */}
      <div className="p-3 bg-amber-50 border border-amber-300 rounded text-amber-900 text-[11px] flex items-start gap-2">
        <AlertCircle className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
        <div>
          <span className="font-bold">MANDATORY NOTICE: </span>
          <span>{service.standardDenseNotice}</span>
        </div>
      </div>

      {/* Dense 15-Field Mock Bureaucratic Form Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {service.steps.map((step) => (
          <div key={step.stepNumber} className="space-y-1">
            <label className="block font-semibold text-slate-800 text-[11px]">
              {step.stepNumber}. {step.title} <span className="text-red-600">*</span>
            </label>
            <p className="text-[10px] text-slate-500 leading-tight">
              {step.description}
            </p>

            {step.fieldType === 'select' ? (
              <select
                value={formData[step.stepNumber] || ''}
                onChange={(e) => setFormData({ ...formData, [step.stepNumber]: e.target.value })}
                className="w-full p-1.5 border border-slate-300 rounded text-xs bg-slate-50"
              >
                <option value="">-- Select Option --</option>
                {step.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : step.fieldType === 'file' ? (
              <input
                type="file"
                className="w-full text-[10px] p-1 border border-slate-300 rounded bg-slate-50"
              />
            ) : (
              <input
                type={step.fieldType === 'date' ? 'date' : 'text'}
                value={formData[step.stepNumber] || ''}
                onChange={(e) => setFormData({ ...formData, [step.stepNumber]: e.target.value })}
                placeholder={step.placeholder || 'Enter value...'}
                className="w-full p-1.5 border border-slate-300 rounded text-xs bg-slate-50"
              />
            )}
            <span className="block text-[9px] text-slate-400">
              Ref Code: SEC-{step.stepNumber}A &bull; {step.helpText}
            </span>
          </div>
        ))}
      </div>

      {/* Complex Fine-Print Checkbox */}
      <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-600 space-y-2">
        <label className="flex items-start gap-2 cursor-pointer">
          <input type="checkbox" className="mt-0.5 text-xs" />
          <span>
            I hereby certify under penalty of administrative rejection that all submitted entries strictly align with Central Regulatory Code 409-B.
          </span>
        </label>
      </div>

      {/* Tiny Action Buttons */}
      <div className="flex justify-end gap-2 pt-2">
        <button className="px-3 py-1 bg-slate-200 text-slate-700 rounded text-xs hover:bg-slate-300">
          Save Draft
        </button>
        <button
          onClick={onComplete}
          className="px-4 py-1 bg-blue-700 text-white font-bold rounded text-xs hover:bg-blue-800"
        >
          Submit Form
        </button>
      </div>

    </div>
  );
}
