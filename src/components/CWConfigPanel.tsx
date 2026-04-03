"use client";

import { useCWStore } from "@/store/cwStore";
import { Settings2 } from "lucide-react";

export function CWConfigPanel() {
  const { config, setConfig, t } = useCWStore();

  return (
    <div className="glass-panel rounded-2xl p-6 bg-slate-900/60 mt-4 relative overflow-hidden group">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-48 h-48 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors duration-500" />
      
      <div className="flex items-center gap-2 mb-6">
        <Settings2 className="w-5 h-5 text-accent" />
        <h2 className="text-lg font-semibold text-slate-200">{t.config.title}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        
        {/* WPM */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-400 font-medium flex justify-between">
            <span>{t.config.speed}</span>
            <span className="text-primary font-bold">{config.wpm}</span>
          </label>
          <input 
            type="range" 
            min="5" max="60" step="1"
            value={config.wpm}
            onChange={(e) => setConfig({ wpm: Number(e.target.value) })}
            className="w-full accent-primary h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Farnsworth WPM */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-400 font-medium flex justify-between">
            <span>{t.config.farnsworth}</span>
            <span className="text-primary font-bold">{config.farnsworthWpm || config.wpm}</span>
          </label>
          <input 
            type="range" 
            min="5" max="60" step="1"
            value={config.farnsworthWpm || config.wpm}
            onChange={(e) => setConfig({ farnsworthWpm: Number(e.target.value) })}
            className="w-full accent-accent h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-[10px] text-slate-500">{t.config.effectiveWpm}</span>
        </div>

        {/* Frequency */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-400 font-medium flex justify-between">
            <span>{t.config.frequency}</span>
            <span className="text-primary font-bold">{config.frequency} Hz</span>
          </label>
          <input 
            type="range" 
            min="300" max="1200" step="10"
            value={config.frequency}
            onChange={(e) => setConfig({ frequency: Number(e.target.value) })}
            className="w-full accent-primary h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Volume */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-400 font-medium flex justify-between">
            <span>{t.config.volume}</span>
            <span className="text-primary font-bold">{Math.round(config.volume * 100)}%</span>
          </label>
          <input 
            type="range" 
            min="0" max="1" step="0.05"
            value={config.volume}
            onChange={(e) => setConfig({ volume: Number(e.target.value) })}
            className="w-full accent-accent h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>

      </div>
    </div>
  );
}
