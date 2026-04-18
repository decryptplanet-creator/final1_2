import React, { useState } from 'react';
import { ArrowLeft, Shield, AlertCircle, Check } from 'lucide-react';

export default function LegalCompliance({ onBack, onSubmit }) {
  const [ppcAccepted, setPpcAccepted] = useState(false);
  const [policiesAccepted, setPoliciesAccepted] = useState(false);

  const isReady = ppcAccepted && policiesAccepted;

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-10">
      {/* --- BLUE HEADER --- */}
      <header className="bg-[#2563EB] text-white p-6 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center gap-6">
          <button onClick={onBack} className="hover:bg-white/10 p-2 rounded-full transition">
            <ArrowLeft size={24} />
          </button>
          <div className="bg-white/20 p-3 rounded-full">
            <Shield size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Legal Compliance</h1>
            <p className="text-blue-100 text-sm">Step 4: Accept Terms & Policies</p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 mt-8 space-y-6 text-[#1F2937]">
        
        {/* --- SECTION 1: PAKISTAN PENAL CODE --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Pakistan Penal Code (PPC) Law</h2>
            <p className="text-gray-600 mb-4">By registering on Skillora platform, you agree to comply with:</p>
            <ul className="space-y-3 mb-6">
              {[
                "All applicable provisions of Pakistan Penal Code (PPC)",
                "Labor laws and regulations of Pakistan",
                "Manufacturing standards and quality requirements",
                "Tax and business registration compliance",
                "Anti-fraud and anti-money laundering regulations",
                "Workplace safety and labor rights protection"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <div className="size-1.5 rounded-full bg-gray-400 mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            
            <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition border border-transparent hover:border-blue-200">
              <input 
                type="checkbox" 
                checked={ppcAccepted}
                onChange={() => setPpcAccepted(!ppcAccepted)}
                className="size-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
              />
              <span className="text-sm font-medium">I accept and agree to comply with PPC Law and all legal requirements</span>
            </label>
          </div>
        </div>

        {/* --- SECTION 2: PLATFORM POLICIES --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Skillora Platform Policies</h2>
            <ul className="space-y-3 mb-6">
              {[
                "Maintain honest and transparent communication",
                "Provide accurate information during registration",
                "Respect escrow payment terms and conditions",
                "Honor commitments and deadlines",
                "Report fraudulent activities immediately",
                "Maintain professional conduct at all times",
                "Accept platform's dispute resolution process",
                "Allow AI monitoring for quality assurance"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <div className="size-1.5 rounded-full bg-gray-400 mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition border border-transparent hover:border-blue-200">
              <input 
                type="checkbox" 
                checked={policiesAccepted}
                onChange={() => setPoliciesAccepted(!policiesAccepted)}
                className="size-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
              />
              <span className="text-sm font-medium">I accept and agree to all Skillora platform policies</span>
            </label>
          </div>
        </div>

        {/* --- WARNING BANNER --- */}
        {!isReady && (
          <div className="bg-[#FFFBEB] border border-[#FEF3C7] p-4 rounded-xl flex items-center gap-3 animate-pulse">
            <AlertCircle className="text-[#D97706]" size={24} />
            <p className="text-sm text-[#92400E] font-medium">
              You must accept both PPC Law and Platform Policies to proceed with registration.
            </p>
          </div>
        )}

        {/* --- SUBMIT BUTTON --- */}
        <button 
          disabled={!isReady}
          onClick={onSubmit}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
            isReady 
            ? 'bg-[#2563EB] text-white hover:bg-blue-700 cursor-pointer' 
            : 'bg-[#93C5FD] text-white cursor-not-allowed opacity-70'
          }`}
        >
          {isReady ? 'Submit for Verification' : 'Accept All Policies to Continue'}
        </button>
      </div>
    </div>
  );
}