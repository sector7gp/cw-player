"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Keyboard, 
  Dices, 
  GraduationCap, 
  Target, 
  Waves,
  Activity,
  Code,
  Award,
  Info,
  X,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCWStore } from '@/store/cwStore';
import { useState } from 'react';

export function Sidebar() {
  const pathname = usePathname();
  const { language, setLanguage, t, isSidebarOpen, setIsSidebarOpen } = useCWStore();
  const [showCopyright, setShowCopyright] = useState(false);

  const NAV_ITEMS = [
    { href: '/', label: t.sidebar.textGenerator, icon: Keyboard },
    { href: '/random', label: t.sidebar.randomGenerator, icon: Dices },
    { href: '/lessons', label: t.sidebar.lessons, icon: GraduationCap },
    { href: '/quiz', label: t.sidebar.quizMode, icon: Target },
    { href: '/keying', label: t.sidebar.keyingPractice, icon: Waves },
    { href: '/monitor', label: t.sidebar.signalMonitor, icon: Activity },
  ];

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-3 bg-slate-900 border border-white/10 rounded-xl text-primary lg:hidden shadow-lg"
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 h-screen border-r border-white/10 glass-panel bg-slate-900/50 flex flex-col p-4 shrink-0 
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center gap-3 px-2 mb-8 mt-2 lg:mt-2 mt-12 text-primary font-bold text-xl uppercase tracking-wider">
          <Waves className="w-6 h-6 text-accent" />
          CW Player Node
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className="relative"
                onClick={closeSidebar}
              >
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-primary/20 rounded-xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className={`relative flex items-center gap-3 px-3 py-3 rounded-xl transition-colors duration-200 ${
                  isActive ? 'text-primary font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}>
                  <Icon className="w-5 h-5" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-[11px] text-slate-500 font-mono opacity-80">{t.sidebar.footer.version}</span>
            
            <div className="flex items-center gap-2">
              <div className="flex bg-black/20 rounded-lg p-0.5 border border-white/5">
                <button 
                  onClick={() => setLanguage('en')}
                  className={`w-5 h-5 flex items-center justify-center rounded text-[10px] transition-all ${
                    language === 'en' ? 'bg-primary/20 text-primary grayscale-0' : 'text-slate-500 grayscale opacity-40 hover:grayscale-0 hover:opacity-100'
                  }`}
                  title="English"
                >
                  🇺🇸
                </button>
                <button 
                  onClick={() => setLanguage('es')}
                  className={`w-5 h-5 flex items-center justify-center rounded text-[10px] transition-all ${
                    language === 'es' ? 'bg-primary/20 text-primary grayscale-0' : 'text-slate-500 grayscale opacity-40 hover:grayscale-0 hover:opacity-100'
                  }`}
                  title="Español"
                >
                  🇪🇸
                </button>
              </div>

              <div className="h-4 w-px bg-white/10 mx-0.5" />

              <div className="flex gap-1.5">
                <a href="https://github.com/sector7gp/cw-player" target="_blank" rel="noopener noreferrer" title={t.sidebar.footer.repo}>
                  <Code className="w-4 h-4 text-slate-500 hover:text-primary transition-colors" />
                </a>
                <button onClick={() => setShowCopyright(true)} title={t.copyright.title}>
                  <Info className="w-4 h-4 text-slate-500 hover:text-primary transition-colors" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="px-2 py-2 bg-black/20 rounded-lg flex flex-col gap-1.5 border border-white/5">
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <Award className="w-3 h-3 text-accent" />
              {t.sidebar.footer.credits}
            </div>
            
            <a 
              href="http://lu4aao.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 group"
            >
              <div className="w-5 h-5 bg-white/10 rounded flex-shrink-0 overflow-hidden group-hover:bg-red-500/20 transition-all">
                <img 
                  src="/lu4aao_logo.gif" 
                  alt="LU4AAO"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[9px] text-slate-500 group-hover:text-primary transition-colors truncate">
                {t.sidebar.footer.qrmBelgrano}
              </span>
            </a>

            <a 
              href="https://www.f1orl.org/cwpEA.htm" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[9px] text-slate-600 hover:text-primary transition-colors truncate italic border-t border-white/5 pt-1 mt-0.5"
            >
              {t.sidebar.footer.basedOn}
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Modal */}
      <AnimatePresence>
        {showCopyright && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCopyright(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md glass-panel bg-slate-900 rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />
              
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Info className="w-6 h-6 text-accent" />
                {t.copyright.title}
              </h2>
              
              <div className="space-y-4 text-slate-300 relative z-10 leading-relaxed">
                <p>{t.copyright.content}</p>
                <div className="h-px bg-white/10 my-4" />
                
                <div className="flex items-center gap-3 py-2">
                  <img src="/lu4aao_logo.gif" alt="LU4AAO" className="w-8 h-8 rounded shadow-lg" />
                  <div>
                    <p className="text-sm font-semibold text-white">{t.sidebar.footer.qrmBelgrano} (LU4AAO)</p>
                    <a href="http://lu4aao.org/" target="_blank" className="text-xs text-primary hover:underline">lu4aao.org</a>
                  </div>
                </div>

                <p className="font-medium text-slate-400">{t.copyright.owner}</p>
                
                <div className="flex flex-col gap-2 pt-2">
                  <a 
                    href="https://github.com/sector7gp/cw-player" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex justify-between items-center bg-black/20 hover:bg-black/40 p-3 rounded-xl border border-white/5 text-sm transition-all"
                  >
                    {t.copyright.repoLink}
                    <Code className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <button 
                onClick={() => setShowCopyright(false)}
                className="mt-8 w-full py-3 bg-primary hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-primary/20 transition-all"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
