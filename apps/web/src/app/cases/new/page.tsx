"use client";

import { useState } from "react";

export default function NewCase() {
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create New Case</h2>
        <p className="text-zinc-400 mt-1">Start a new property registration or loan documentation workflow.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-800 -z-10 -translate-y-1/2"></div>
        {[
          { num: 1, label: "Basic Details" },
          { num: 2, label: "Upload Documents" },
          { num: 3, label: "AI Extraction" }
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors ${
              step >= s.num ? "bg-indigo-600 border-indigo-600 text-white" : "bg-zinc-950 border-zinc-700 text-zinc-500"
            }`}>
              {s.num}
            </div>
            <span className={`text-xs font-medium ${step >= s.num ? "text-zinc-200" : "text-zinc-500"}`}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="border border-zinc-800 rounded-2xl bg-zinc-900/50 p-6 md:p-8 backdrop-blur-sm">
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
            <h3 className="text-xl font-semibold border-b border-zinc-800 pb-4">Transaction Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Customer Name</label>
                <input type="text" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="e.g. Ravi Kumar" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Transaction Type</label>
                <select className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-zinc-300">
                  <option>House Purchase</option>
                  <option>Mortgage</option>
                  <option>Plot Purchase</option>
                  <option>Construction Loan</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">State</label>
                <select className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-zinc-300">
                  <option>Andhra Pradesh</option>
                  <option>Telangana</option>
                  <option>Maharashtra</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Registration Office (SRO)</label>
                <input type="text" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="e.g. Bhimavaram" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Bank (If applicable)</label>
                <select className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-zinc-300">
                  <option>None / Self-funded</option>
                  <option>Example Bank</option>
                  <option>National Bank</option>
                </select>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button onClick={() => setStep(2)} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                Next: Upload Documents
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
            <h3 className="text-xl font-semibold border-b border-zinc-800 pb-4">Source Documents</h3>
            <p className="text-zinc-400 text-sm">Upload the required KYC and property documents. The AI will automatically classify them and extract required fields.</p>
            
            <div className="border-2 border-dashed border-zinc-700 rounded-xl p-12 flex flex-col items-center justify-center text-center bg-zinc-950/30 hover:bg-zinc-800/30 transition-colors cursor-pointer relative overflow-hidden group">
              <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              </div>
              <h4 className="font-medium text-zinc-200">Click to upload or drag and drop</h4>
              <p className="text-zinc-500 text-sm mt-1">PDF, PNG, JPG up to 10MB each</p>
            </div>

            <div className="pt-6 flex justify-between">
              <button onClick={() => setStep(1)} className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg font-medium transition-colors">
                Back
              </button>
              <button onClick={() => {
                setUploading(true);
                setTimeout(() => setStep(3), 1500);
              }} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)] flex items-center gap-2">
                {uploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Uploading & Processing...
                  </>
                ) : "Upload & Process"}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <h3 className="text-xl font-semibold">AI Extraction Review</h3>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-medium flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                Processing Complete
              </span>
            </div>
            
            <p className="text-zinc-400 text-sm">Please review the extracted fields. Low confidence items require manual confirmation.</p>
            
            <div className="space-y-4">
              {[
                { label: "Buyer Name", value: "Ravi Kumar", conf: "HIGH", confColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
                { label: "Survey Number", value: "123/4", conf: "MEDIUM", confColor: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
                { label: "Property Extent", value: "240 Sq.Yds", conf: "HIGH", confColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
              ].map((f, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-zinc-950/50 border border-zinc-800 rounded-xl">
                  <div className="w-1/3 text-sm font-medium text-zinc-400">{f.label}</div>
                  <div className="w-1/3 mt-2 md:mt-0 font-medium text-zinc-100">{f.value}</div>
                  <div className="w-1/3 mt-2 md:mt-0 flex justify-end">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider border ${f.confColor}`}>
                      {f.conf} CONFIDENCE
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 flex justify-between">
              <button onClick={() => setStep(2)} className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg font-medium transition-colors">
                Back
              </button>
              <button onClick={() => window.location.href = "/cases"} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                Confirm & Create Case
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
