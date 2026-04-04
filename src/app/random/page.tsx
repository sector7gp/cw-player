"use client";

import { useState, useRef, useEffect } from 'react';
import { textToMorse } from '@/lib/morse';
import { CWAudioEngine } from '@/lib/audio';
import { useCWStore } from '@/store/cwStore';
import { CWConfigPanel } from '@/components/CWConfigPanel';
import { Play, Square, RefreshCw, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';

export default function RandomGeneratorPage() {
  const { config, isPlaying, setIsPlaying, t } = useCWStore();

  const [randomConfig, setRandomConfig] = useState({
    groupSize: 5,
    numGroups: 10,
    type: 'mixed' // letters | numbers | mixed
  });
  const [generatedText, setGeneratedText] = useState('');
  
  const engineRef = useRef<CWAudioEngine | null>(null);

  useEffect(() => {
    engineRef.current = new CWAudioEngine(config);
    generateRandom();
    return () => engineRef.current?.stop();
  }, []);

  useEffect(() => {
    if (engineRef.current) engineRef.current.updateConfig(config);
  }, [config]);

  const generateRandom = () => {
    let charset = LETTERS;
    if (randomConfig.type === 'numbers') charset = NUMBERS;
    if (randomConfig.type === 'mixed') charset = LETTERS + NUMBERS;

    let result = '';
    for (let i = 0; i < randomConfig.numGroups; i++) {
      let group = '';
      for (let j = 0; j < randomConfig.groupSize; j++) {
        group += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      result += group + (i < randomConfig.numGroups - 1 ? ' ' : '');
    }
    setGeneratedText(result);
  };

  const handlePlay = async () => {
    if (!engineRef.current || !generatedText) return;
    setIsPlaying(true);
    await engineRef.current.playSequence(
      textToMorse(generatedText),
      () => {}, // progress
      () => setIsPlaying(false)
    );
  };

  const handleStop = () => {
    engineRef.current?.stop();
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
            {t.randomGen.title}
          </h1>
          <p className="text-slate-400 mt-1">{t.randomGen.subtitle}</p>
        </div>
      </div>

      <CWConfigPanel />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
        {/* Settings Panel */}
        <div className="glass-panel bg-slate-900/60 rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="text-lg font-medium text-slate-200 flex items-center gap-2 border-b border-white/10 pb-2">
            <Settings className="w-5 h-5 text-green-400" /> {t.randomGen.options}
          </h3>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-400 font-medium">{t.randomGen.type}</label>
            <select 
              value={randomConfig.type}
              onChange={(e) => setRandomConfig({...randomConfig, type: e.target.value})}
              className="bg-black/20 rounded-xl p-3 text-slate-200 outline-none border border-transparent focus:border-green-500/50"
            >
              <option value="letters">{t.randomGen.types.letters}</option>
              <option value="numbers">{t.randomGen.types.numbers}</option>
              <option value="mixed">{t.randomGen.types.mixed}</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-400 font-medium flex justify-between">
              <span>{t.randomGen.groupSize}</span>
              <span className="text-green-400">{randomConfig.groupSize} chars</span>
            </label>
            <input 
              type="range" min="1" max="10" step="1"
              value={randomConfig.groupSize}
              onChange={(e) => setRandomConfig({...randomConfig, groupSize: Number(e.target.value)})}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-400 font-medium flex justify-between">
              <span>{t.randomGen.numGroups}</span>
              <span className="text-green-400">{randomConfig.numGroups} groups</span>
            </label>
            <input 
              type="range" min="1" max="50" step="1"
              value={randomConfig.numGroups}
              onChange={(e) => setRandomConfig({...randomConfig, numGroups: Number(e.target.value)})}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
          </div>

          <button
            onClick={generateRandom}
            className="mt-auto bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-xl py-3 flex justify-center items-center gap-2 transition-all font-semibold"
          >
            <RefreshCw className="w-5 h-5" /> {t.randomGen.generate}
          </button>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-2 glass-panel bg-slate-900/60 rounded-2xl p-6 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl" />
          
          <h3 className="text-lg font-medium text-slate-200 mb-4 z-10">{t.randomGen.outputLabel}</h3>
          <div className="flex-1 bg-black/20 rounded-xl p-6 text-xl tracking-widest font-mono text-slate-200 leading-relaxed overflow-y-auto mb-4 custom-scrollbar z-10 break-words border border-white/5 shadow-inner">
            <AnimatePresence mode="popLayout">
              {generatedText ? (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={generatedText}>
                  {generatedText}
                </motion.span>
              ) : ''}
            </AnimatePresence>
          </div>

          <div className="flex gap-3 z-10">
            <button
              disabled={isPlaying || !generatedText}
              onClick={handlePlay}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-xl py-3 font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
            >
              <Play className="w-5 h-5 fill-current" /> {t.randomGen.play}
            </button>
            <button
              disabled={!isPlaying}
              onClick={handleStop}
              className="px-8 bg-red-500/10 hover:bg-red-500/20 text-red-500 disabled:opacity-30 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Square className="w-5 h-5 fill-current" /> {t.randomGen.stop}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
