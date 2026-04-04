"use client";

import { useState, useRef, useEffect } from 'react';
import { textToMorse } from '@/lib/morse';
import { CWAudioEngine } from '@/lib/audio';
import { useCWStore } from '@/store/cwStore';
import { Play, Square, BookOpen, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface Lesson {
  id: string;
  title: string;
  description: string;
  characters: string;
  content: string; // The practice text
}

const LESSONS_DB: Lesson[] = [
  { id: '1', title: 'Lesson 1', description: 'The basics: E, T, I, M', characters: 'E T I M', content: 'E E T T I I M M ET IE MI TM TIM MET EMT' },
  { id: '2', title: 'Lesson 2', description: 'Adding A, N, S, O', characters: 'A N S O', content: 'A A N N S S O O AS NO AN SO SAN SON NAS ONS EAS NET SON MAT' },
  { id: '3', title: 'Lesson 3', description: 'Adding U, R, W, D', characters: 'U R W D', content: 'U R W D RUN WAD SUR MUD RAW NOD DOW WUR MUDDER SURR' },
  { id: '4', title: 'Lesson 4', description: 'Adding K, G, C, P', characters: 'K G C P', content: 'K G C P PUCK MAKE GOING CAP PICK PEG CAG' },
  { id: '5', title: 'Lesson 5', description: 'Adding Q, X, Z, Y', characters: 'Q X Z Y', content: 'Q X Z Y QUIZ FOXY ZERO YES MIX LAZY QUE ZIM' },
];

export default function LessonsPage() {
  const { config, isPlaying, setIsPlaying, t } = useCWStore();
  const engineRef = useRef<CWAudioEngine | null>(null);

  const [activeLesson, setActiveLesson] = useState<Lesson>(LESSONS_DB[0]);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  useEffect(() => {
    engineRef.current = new CWAudioEngine(config);
    return () => engineRef.current?.stop();
  }, []);

  useEffect(() => {
    if (engineRef.current) engineRef.current.updateConfig(config);
  }, [config]);

  const handlePlayLesson = async () => {
    if (!engineRef.current) return;
    setIsPlaying(true);
    await engineRef.current.playSequence(
      textToMorse(activeLesson.content),
      () => {},
      () => {
        setIsPlaying(false);
        setCompletedLessons(prev => new Set([...Array.from(prev), activeLesson.id]));
      }
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            {t.lessons.title}
          </h1>
          <p className="text-slate-400 mt-1">{t.lessons.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        {/* Course List */}
        <div className="glass-panel bg-slate-900/60 rounded-2xl p-4 flex flex-col gap-2 relative overflow-hidden h-64 md:h-[500px]">
          <h3 className="text-lg font-medium text-slate-200 flex items-center gap-2 mb-2 p-2 border-b border-white/10">
            <BookOpen className="w-5 h-5 text-purple-400" /> {t.lessons.curriculum}
          </h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2">
            {LESSONS_DB.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => {
                  setActiveLesson(lesson);
                  handleStop();
                }}
                className={`p-4 rounded-xl text-left transition-all relative overflow-hidden ${
                  activeLesson.id === lesson.id 
                    ? 'bg-purple-500/20 border border-purple-500/50 shadow-lg shadow-purple-500/10' 
                    : 'bg-black/20 border border-transparent hover:border-white/10 hover:bg-black/40'
                }`}
              >
                {activeLesson.id === lesson.id && (
                  <motion.div layoutId="lessonActive" className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500" />
                )}
                <div className="flex justify-between items-start">
                  <span className={`font-bold ${activeLesson.id === lesson.id ? 'text-purple-300' : 'text-slate-300'}`}>
                    {lesson.title}
                  </span>
                  {completedLessons.has(lesson.id) && <Check className="w-4 h-4 text-green-500" />}
                </div>
                <div className="text-sm text-slate-500 mt-1">{lesson.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Lesson View */}
        <div className="lg:col-span-2 glass-panel bg-slate-900/60 rounded-2xl p-6 flex flex-col h-[400px] md:h-[500px] relative">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-4">
             <div>
               <h2 className="text-xl md:text-2xl font-bold text-slate-100">{activeLesson.title}</h2>
               <p className="text-sm text-slate-400 mt-1">{activeLesson.description}</p>
             </div>
             <div className="bg-black/30 px-3 md:px-4 py-2 rounded-lg border border-white/5 font-mono text-purple-300 font-bold tracking-widest text-sm md:text-base">
               {activeLesson.characters}
             </div>
          </div>

          <div className="flex-1 bg-black/20 rounded-xl p-4 md:p-6 text-xl md:text-2xl tracking-[0.3em] font-mono text-slate-200 leading-relaxed overflow-y-auto mb-4 custom-scrollbar shadow-inner break-words border border-white/5">
            {activeLesson.content}
          </div>

          <div className="flex gap-3">
            <button
              disabled={isPlaying}
              onClick={handlePlayLesson}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl py-3 md:py-4 font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
            >
              <Play className="w-5 h-5 fill-current" /> {t.lessons.startLesson}
            </button>
            <button
              disabled={!isPlaying}
              onClick={handleStop}
              className="px-6 md:px-8 bg-red-500/10 hover:bg-red-500/20 text-red-500 disabled:opacity-30 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 border border-red-500/20"
            >
              <Square className="w-5 h-5 fill-current" /> {t.lessons.stop}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
