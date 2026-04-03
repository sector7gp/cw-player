"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { morseToText } from '@/lib/morse';
import { CWAudioEngine } from '@/lib/audio';
import { useCWStore } from '@/store/cwStore';
import { CWConfigPanel } from '@/components/CWConfigPanel';
import { RotateCcw, Keyboard as KeyboardIcon, Hand } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function KeyingPage() {
  const { config, t } = useCWStore();
  const engineRef = useRef<CWAudioEngine | null>(null);
  
  const [currentSymbol, setCurrentSymbol] = useState(''); // e.g., '.-.'
  const [decodedText, setDecodedText] = useState('');
  const [isPressing, setIsPressing] = useState(false);

  // Timing tracking
  const pressStartTime = useRef<number>(0);
  const releaseTime = useRef<number>(0);
  const processTimer = useRef<NodeJS.Timeout | null>(null);
  const wordTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    engineRef.current = new CWAudioEngine(config);
    return () => {
      engineRef.current?.stop();
      if (processTimer.current) clearTimeout(processTimer.current);
      if (wordTimer.current) clearTimeout(wordTimer.current);
    };
  }, []);

  useEffect(() => {
    if (engineRef.current) engineRef.current.updateConfig(config);
  }, [config]);

  const getWpmUnitMs = useCallback(() => {
    return (1200 / config.wpm);
  }, [config.wpm]);

  const handlePress = useCallback(() => {
    if (isPressing) return;
    setIsPressing(true);
    engineRef.current?.playToneStart();
    pressStartTime.current = performance.now();
    
    // Clear processing timers when pressing again
    if (processTimer.current) clearTimeout(processTimer.current);
    if (wordTimer.current) clearTimeout(wordTimer.current);
  }, [isPressing]);

  const handleRelease = useCallback(() => {
    if (!isPressing) return;
    setIsPressing(false);
    engineRef.current?.playToneStop();

    const duration = performance.now() - pressStartTime.current;
    releaseTime.current = performance.now();
    
    const unitMs = getWpmUnitMs();

    // Determine dot or dash (threshold typically 1.5 - 2 units)
    let newSymbol = currentSymbol;
    if (duration > unitMs * 2) {
      newSymbol += '-';
    } else if (duration > 20) { // debounce very short accidental taps
      newSymbol += '.';
    }
    setCurrentSymbol(newSymbol);

    // Schedule char parsing
    const charGapThresholdMs = unitMs * 2.5; // roughly 3 units
    processTimer.current = setTimeout(() => {
      // Decode character
      if (newSymbol) {
        const decoded = morseToText(newSymbol);
        if (decoded) {
          setDecodedText(prev => prev + decoded);
        } else {
          setDecodedText(prev => prev + '?');
        }
        setCurrentSymbol('');
      }
    }, charGapThresholdMs);

    // Schedule word space
    const wordGapThresholdMs = unitMs * 6; // roughly 7 units
    wordTimer.current = setTimeout(() => {
      setDecodedText(prev => {
        if (!prev.endsWith(' ')) return prev + ' ';
        return prev;
      });
    }, wordGapThresholdMs);

  }, [isPressing, currentSymbol, getWpmUnitMs]);

  // Keyboard events
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && e.target === document.body) {
        e.preventDefault();
        handlePress();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleRelease();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [handlePress, handleRelease]);

  const handleClear = () => {
    setDecodedText('');
    setCurrentSymbol('');
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">
            {t.keying.title}
          </h1>
          <p className="text-slate-400 mt-1">{t.keying.subtitle}</p>
        </div>
      </div>

      <CWConfigPanel />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        {/* Input Area */}
        <div className="glass-panel bg-slate-900/60 rounded-2xl p-6 flex flex-col justify-center items-center relative overflow-hidden h-96">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl" />
          
          <h3 className="text-lg font-medium text-slate-200 mb-8 absolute top-6 left-6 z-10 flex items-center gap-2">
            <KeyboardIcon className="w-5 h-5 text-orange-400" /> {t.keying.tapInput}
          </h3>

          <div
            className={`w-40 h-40 rounded-full flex justify-center items-center cursor-pointer transition-all duration-75 select-none shadow-xl ${
              isPressing 
                ? 'bg-orange-500 shadow-orange-500/50 scale-95' 
                : 'bg-slate-800 hover:bg-slate-700 shadow-black/50 scale-100'
            }`}
            onMouseDown={handlePress}
            onMouseUp={handleRelease}
            onMouseLeave={handleRelease}
            onTouchStart={(e) => { e.preventDefault(); handlePress(); }}
            onTouchEnd={(e) => { e.preventDefault(); handleRelease(); }}
          >
            <Hand className={`w-16 h-16 ${isPressing ? 'text-white' : 'text-slate-400'}`} />
          </div>

          <p className="text-slate-500 mt-8 text-center text-sm px-8">
            {t.keying.instruction}
          </p>

          <button
            onClick={handleClear}
            className="absolute bottom-6 right-6 p-3 text-slate-400 hover:text-orange-400 hover:bg-orange-500/10 rounded-xl transition-colors"
            title={t.keying.clear}
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Decoder Output Area */}
        <div className="glass-panel bg-slate-900/60 rounded-2xl p-6 flex flex-col h-96">
           <h3 className="text-lg font-medium text-slate-200 mb-4">{t.keying.decodedOutput}</h3>
           
           <div className="text-orange-400 font-mono text-2xl h-10 mb-4 font-bold flex items-center">
             {currentSymbol || <span className="text-slate-700">_</span>}
           </div>

           <div className="flex-1 bg-black/20 rounded-xl p-6 font-mono text-xl text-slate-200 leading-relaxed overflow-y-auto mb-4 custom-scrollbar whitespace-pre-wrap shadow-inner border border-white/5">
             {decodedText}
             <span className="animate-pulse text-orange-400">_</span>
           </div>
        </div>
      </div>
    </div>
  );
}
