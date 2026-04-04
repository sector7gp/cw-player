"use client";

import { useState, useRef, useEffect } from 'react';
import { textToMorse } from '@/lib/morse';
import { CWAudioEngine } from '@/lib/audio';
import { useCWStore } from '@/store/cwStore';
import { CWConfigPanel } from '@/components/CWConfigPanel';
import { Play, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default function QuizPage() {
  const { config, isPlaying, setIsPlaying, t } = useCWStore();
  const engineRef = useRef<CWAudioEngine | null>(null);

  const [sequence, setSequence] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  const [stats, setStats] = useState<{
    correct: number;
    incorrect: number;
    total: number;
    accuracy: number;
    errorsByChar: Record<string, number>;
  } | null>(null);

  useEffect(() => {
    engineRef.current = new CWAudioEngine(config);
    generateNewQuiz();
    return () => engineRef.current?.stop();
  }, []);

  useEffect(() => {
    if (engineRef.current) engineRef.current.updateConfig(config);
  }, [config]);

  const generateNewQuiz = () => {
    let result = '';
    for (let i = 0; i < 5; i++) { // Default to 5 random characters
      result += LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
    }
    setSequence(result);
    setUserInput('');
    setIsEvaluating(false);
    setStats(null);
  };

  const handlePlayQuiz = async () => {
    if (!engineRef.current || !sequence) return;
    setIsPlaying(true);
    // Add spaces between letters so Farnsworth timing applies clearly in quiz
    const spacedSequenceText = sequence.split('').join(' ');
    
    await engineRef.current.playSequence(
      textToMorse(spacedSequenceText),
      () => {}, 
      () => setIsPlaying(false)
    );
  };

  const handleEvaluate = () => {
    const inputUpper = userInput.toUpperCase().replace(/\s+/g, '');
    let correctCount = 0;
    let incorrectCount = 0;
    const errors: Record<string, number> = {};

    for (let i = 0; i < sequence.length; i++) {
       const expected = sequence[i];
       const actual = inputUpper[i] || '-';
       
       if (expected === actual) {
         correctCount++;
       } else {
         incorrectCount++;
         errors[expected] = (errors[expected] || 0) + 1;
       }
    }

    setStats({
      correct: correctCount,
      incorrect: incorrectCount,
      total: sequence.length,
      accuracy: Math.round((correctCount / sequence.length) * 100),
      errorsByChar: errors
    });
    setIsEvaluating(true);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">
            {t.quiz.title}
          </h1>
          <p className="text-slate-400 mt-1">{t.quiz.subtitle}</p>
        </div>
      </div>

      <CWConfigPanel />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        {/* Quiz Controls and Input */}
        <div className="glass-panel bg-slate-900/60 rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
          
          <div className="z-10 flex flex-col gap-4">
            <button
              disabled={isPlaying}
              onClick={handlePlayQuiz}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl py-4 font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              <Play className="w-5 h-5 fill-current" /> {t.quiz.play}
            </button>

            <div className="flex flex-col gap-2 mt-4">
              <label className="text-sm font-medium text-slate-400">{t.quiz.answerLabel}</label>
              <input 
                type="text"
                value={userInput}
                onChange={e => setUserInput(e.target.value.toUpperCase())}
                disabled={isEvaluating}
                className="w-full bg-black/20 text-slate-200 font-mono text-2xl tracking-[0.5em] p-4 text-center rounded-xl border border-transparent focus:border-blue-500/50 outline-none uppercase transition-all"
                placeholder={t.quiz.answerPlaceholder}
              />
            </div>

            {!isEvaluating ? (
              <button
                onClick={handleEvaluate}
                disabled={!userInput || isPlaying}
                className="mt-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl py-3 font-semibold transition-all disabled:opacity-50"
              >
                {t.quiz.submit}
              </button>
            ) : (
              <button
                onClick={generateNewQuiz}
                className="mt-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl py-3 font-semibold transition-all flex justify-center items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> {t.quiz.next}
              </button>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="glass-panel bg-slate-900/60 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
          {!isEvaluating ? (
             <div className="text-slate-500 flex flex-col items-center gap-4">
               <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center">
                 <span className="text-2xl">?</span>
               </div>
               <p>{t.quiz.awaiting}</p>
             </div>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col w-full h-full text-center items-center justify-center z-10"
            >
              {stats?.accuracy === 100 ? (
                <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
              ) : (
                <XCircle className="w-16 h-16 text-red-500 mb-4" />
              )}
              
              <h2 className="text-4xl font-bold mb-2 text-slate-200">
                {stats?.accuracy}%
              </h2>
              <p className="text-slate-400 mb-6 border-b border-white/10 pb-6 w-full">
                {stats?.correct} {t.quiz.correct} {stats?.total}
              </p>

              <div className="w-full relative">
                <div className="flex font-mono text-xl justify-center gap-2 mb-2 text-slate-400">
                  <span className="w-24 text-right">{t.quiz.expected}</span>
                  <span className="tracking-[0.5em] text-white">{sequence}</span>
                </div>
                <div className="flex font-mono text-xl justify-center gap-2">
                  <span className="w-24 text-right">{t.quiz.typed}</span>
                  <span className="tracking-[0.5em]">
                    {sequence.split('').map((char, i) => {
                       const actual = userInput[i] || '_';
                       const isCorrect = char === actual;
                       return (
                         <span key={i} className={isCorrect ? 'text-green-500' : 'text-red-500'}>
                           {actual}
                         </span>
                       )
                    })}
                  </span>
                </div>
              </div>

              {Object.keys(stats?.errorsByChar || {}).length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2 justify-center">
                  <span className="text-sm text-slate-500 w-full mb-1">{t.quiz.mistakes}</span>
                  {Object.entries(stats!.errorsByChar).map(([char, count]) => (
                    <div key={char} className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-mono">
                      {char} (x{count})
                    </div>
                  ))}
                </div>
              )}

            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
