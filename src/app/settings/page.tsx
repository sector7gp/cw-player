"use client";

import { useCWStore } from '@/store/cwStore';
import { CWConfigPanel } from '@/components/CWConfigPanel';
import { Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  const { t, language } = useCWStore();

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-200 to-slate-500 bg-clip-text text-transparent">
            {t.settings.title}
          </h1>
          <p className="text-slate-400 mt-1">{t.settings.subtitle}</p>
        </div>
        <div className="p-3 bg-slate-800 rounded-2xl shadow-inner border border-white/5">
          <SettingsIcon className="w-6 h-6 text-slate-400" />
        </div>
      </div>

      <div className="mt-4">
        <CWConfigPanel />
      </div>

      <div className="glass-panel bg-slate-900/40 rounded-2xl p-8 border border-white/5 flex flex-col gap-4 mt-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <h3 className="text-lg font-medium text-slate-200">{t.settings.additionalInfo}</h3>
        <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
          {t.settings.description}
        </p>
      </div>
    </div>
  );
}
