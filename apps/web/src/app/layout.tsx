import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Home, PlusSquare, FileText, LayoutTemplate, Network, Settings, Users, HelpCircle, Bell, Menu } from "lucide-react";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DocAutoFill BETA",
  description: "Automated document processing and generation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen flex antialiased`}>
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col shrink-0">
          <div className="h-16 flex items-center px-6 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                D
              </div>
              <div className="font-bold text-lg text-slate-900">
                DocAutoFill <span className="bg-indigo-100 text-indigo-700 text-[10px] px-1.5 py-0.5 rounded ml-1 font-semibold">BETA</span>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <a href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
              <Home className="w-5 h-5" />
              <span className="font-medium text-sm">Dashboard</span>
            </a>
            <a href="/processing/new" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-50 text-indigo-700 transition-colors">
              <PlusSquare className="w-5 h-5" />
              <span className="font-medium text-sm">New Processing</span>
            </a>
            <a href="/processed" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
              <FileText className="w-5 h-5" />
              <span className="font-medium text-sm">Processed Files</span>
            </a>
            <a href="/templates" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
              <LayoutTemplate className="w-5 h-5" />
              <span className="font-medium text-sm">Templates (Docs)</span>
            </a>
            <a href="/mapping" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
              <Network className="w-5 h-5" />
              <span className="font-medium text-sm">Field Mapping</span>
            </a>
            <a href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
              <Settings className="w-5 h-5" />
              <span className="font-medium text-sm">Settings</span>
            </a>
            <a href="/users" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
              <Users className="w-5 h-5" />
              <span className="font-medium text-sm">Users</span>
            </a>
          </nav>
          
          <div className="p-4">
            <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
              <h4 className="font-semibold text-sm text-slate-900 mb-1">Need Help?</h4>
              <p className="text-xs text-slate-500 mb-4">Check our guide or contact support.</p>
              <button className="w-full py-2 mb-2 bg-white text-indigo-600 font-medium text-sm rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
                View Guide
              </button>
              <button className="w-full py-2 bg-indigo-600 text-white font-medium text-sm rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                Contact Support
              </button>
            </div>
            <div className="mt-4 text-center text-xs text-slate-400">
              © 2024 DocAutoFill Beta
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50 h-screen overflow-hidden">
          {/* Top Header */}
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-4">
              <button className="lg:hidden text-slate-500 hover:text-slate-900">
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="font-semibold text-slate-900">New Registration Processing</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="text-slate-400 hover:text-slate-600 transition-colors">
                <HelpCircle className="w-5 h-5" />
              </button>
              <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">3</span>
              </button>
              <div className="h-8 w-px bg-slate-200 mx-2"></div>
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  SP
                </div>
                <div className="text-sm font-medium text-slate-700 hidden sm:block">
                  Sai Properties
                </div>
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-4 md:p-6 bg-slate-50">
            <div className="max-w-[1600px] mx-auto h-full">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
