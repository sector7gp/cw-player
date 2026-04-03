"use client";

import { useState, useRef, useEffect } from 'react';
import { textToMorse } from '@/lib/morse';
import { CWAudioEngine } from '@/lib/audio';
import { useCWStore } from '@/store/cwStore';
import { CWConfigPanel } from '@/components/CWConfigPanel';
import { Play, Square, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TextGeneratorPage() {
  const [text, setText] = useState('CQ CQ CQ DE NODE');
  const morseCode = textToMorse(text);
  
  const { config, isPlaying, setIsPlaying, t } = useCWStore();
  const engineRef = useRef<CWAudioEngine | null>(null);
  
  // Real-time tracking
  const [activeCharIdx, setActiveCharIdx] = useState<number>(-1);

  // Initialize engine cleanly
  useEffect(() => {
    engineRef.current = new CWAudioEngine(config);
    return () => {
      engineRef.current?.stop();
    };
  }, []);

  // Update engine config when store config changes
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.updateConfig(config);
    }
  }, [config]);

  const handlePlay = () => {
    if (!engineRef.current) return;
    setIsPlaying(true);
    setActiveCharIdx(-1);
    
    // Convert to strict morse ignoring unknown chars, but preserving spaces visually
    const morseToPlay = textToMorse(text);

    engineRef.current.playSequence(
      morseToPlay,
      (idx) => {
        // Map morse string index back to word index or visual index if needed
      },
      () => {
        setIsPlaying(false);
        setActiveCharIdx(-1);
      }
    );
  };

  const handleStop = () => {
    engineRef.current?.stop();
    setIsPlaying(false);
    setActiveCharIdx(-1);
  };

  const handleClear = () => {
    setText('');
    handleStop();
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t.textGen.title}
          </h1>
          <p className="text-slate-400 mt-1">{t.textGen.subtitle}</p>
        </div>
      </div>

      <CWConfigPanel />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        {/* Text Input Section */}
        <div className="glass-panel bg-slate-900/60 rounded-2xl p-6 flex flex-col h-96">
          <h3 className="text-lg font-medium text-slate-200 mb-4 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-primary" /> {t.textGen.inputLabel}
          </h3>
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value.toUpperCase())}
            spellCheck={false}
            className="flex-1 bg-black/20 rounded-xl p-4 text-slate-200 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all placeholder:text-slate-600"
            placeholder={t.textGen.inputPlaceholder}
          />
          <div className="flex gap-3 mt-4">
            <button
              disabled={isPlaying || !text.trim()}
              onClick={handlePlay}
              className="flex-1 bg-primary hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl py-3 px-4 font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              <Play className="w-5 h-5 fill-current" /> {t.textGen.play}
            </button>
            <button
              disabled={!isPlaying}
              onClick={handleStop}
              className="px-6 bg-red-500/10 hover:bg-red-500/20 text-red-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Square className="w-5 h-5 fill-current" /> {t.textGen.stop}
            </button>
            <button
              onClick={handleClear}
              className="px-4 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-all flex items-center justify-center"
              title={t.textGen.clear}
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Morse Output Section */}
        <div className="glass-panel bg-slate-900/60 rounded-2xl p-6 flex flex-col h-96 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
          
           <h3 className="text-lg font-medium text-slate-200 mb-4">{t.textGen.outputLabel}</h3>
           <div className="flex-1 overflow-y-auto bg-black/20 rounded-xl p-6 font-mono text-xl tracking-widest text-slate-300 leading-relaxed custom-scrollbar whitespace-pre-wrap">
              <AnimatePresence mode="popLayout">
                {morseCode ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`transition-opacity duration-300 ${isPlaying ? 'text-primary' : ''}`}
                  >
                    {morseCode}
                  </motion.div>
                ) : (
                  <div className="text-slate-600">...</div>
                )}
              </AnimatePresence>
           </div>
        </div>
      </div>
    </div>
  );
}
