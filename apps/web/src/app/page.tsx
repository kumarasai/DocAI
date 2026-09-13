import { BarChart3, Clock, CheckCircle2, ShieldCheck, ArrowUpRight, TrendingUp } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Dashboard Overview
        </h2>
        <p className="text-slate-500">
          Here's what's happening with your property documents today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1 */}
        <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(99,102,241,0.1)] transition-all duration-300">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-500 mb-1">Total Cases</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 tracking-tight">1,248</span>
              <span className="flex items-center text-sm font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> 12%
              </span>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(244,63,94,0.1)] transition-all duration-300">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all"></div>
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-500 mb-1">Pending Review</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 tracking-tight">42</span>
              <span className="flex items-center text-sm font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> 4
              </span>
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(16,185,129,0.1)] transition-all duration-300">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-500 mb-1">Generated Docs</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 tracking-tight">8,492</span>
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(14,165,233,0.1)] transition-all duration-300">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition-all"></div>
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-500 mb-1">AI Extraction Accuracy</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 tracking-tight">98.2%</span>
              <span className="flex items-center text-sm font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3 mr-0.5" /> 0.4%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        {/* Recent Activity */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h3 className="font-bold text-lg text-slate-900 mb-6 flex items-center">
            <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
            Recent Activity
          </h3>
          <div className="space-y-6">
            {[
              { case: "CASE-2026-00182", action: "AI extracted fields from Sale Deed", time: "10 mins ago", colorClass: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" },
              { case: "CASE-2026-00181", action: "Validation conflict detected in EC", time: "1 hr ago", colorClass: "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]" },
              { case: "CASE-2026-00179", action: "Affidavit generated successfully", time: "2 hrs ago", colorClass: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" },
              { case: "CASE-2026-00178", action: "Manager approved document pack", time: "3 hrs ago", colorClass: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 group">
                <div className={`mt-1.5 w-2.5 h-2.5 rounded-full ${item.colorClass} group-hover:scale-125 transition-transform`}></div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">{item.action}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">{item.case}</span>
                    <span className="text-xs font-medium text-slate-400">{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Pending Review */}
        <div className="lg:col-span-3 p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <h3 className="font-bold text-lg mb-6 flex items-center">
            <span className="w-2 h-2 rounded-full bg-rose-500 mr-2 animate-pulse"></span>
            Pending Your Review
          </h3>
          <div className="flex flex-col gap-4">
             <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer backdrop-blur-md">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-sm">Ravi Kumar - House Purchase</div>
                    <div className="text-xs text-slate-300 mt-1 opacity-80">Conflict in Survey Number</div>
                  </div>
                  <span className="px-2.5 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg text-[10px] font-black uppercase tracking-wider">HIGH PRIORITY</span>
                </div>
             </div>
             <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer backdrop-blur-md">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-sm">Suresh Patel - Mortgage</div>
                    <div className="text-xs text-slate-300 mt-1 opacity-80">Low OCR confidence on PAN</div>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-[10px] font-black uppercase tracking-wider">MEDIUM</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
