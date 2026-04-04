"use client";

import { useState, useRef, useEffect } from 'react';
import { textToMorse } from '@/lib/morse';
import { CWAudioEngine } from '@/lib/audio';
import { useCWStore } from '@/store/cwStore';
import { Activity, Play, Square } from 'lucide-react';

export default function MonitorPage() {
  const { config, isPlaying, setIsPlaying, t } = useCWStore();
  const engineRef = useRef<CWAudioEngine | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    engineRef.current = new CWAudioEngine(config);
    startMonitor();

    return () => {
      engineRef.current?.stop();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  useEffect(() => {
    if (engineRef.current) engineRef.current.updateConfig(config);
  }, [config]);

  const drawScope = () => {
    if (!canvasRef.current || !engineRef.current || !engineRef.current.analyser) {
      animationRef.current = requestAnimationFrame(drawScope);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const analyser = engineRef.current.analyser;
    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    analyser.getByteTimeDomainData(dataArray);

    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 3;
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#38bdf8');
    gradient.addColorStop(0.5, '#818cf8');
    gradient.addColorStop(1, '#c084fc');
    ctx.strokeStyle = gradient;

    ctx.beginPath();
    const sliceWidth = canvas.width * 1.0 / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = v * (canvas.height / 2);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    animationRef.current = requestAnimationFrame(drawScope);
  };

  const startMonitor = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    drawScope();
  };

  const [testText, setTestText] = useState('VVV DE SECTOR 7G');

  const handlePlayTone = async () => {
    if (!engineRef.current) return;
    setIsPlaying(true);
    await engineRef.current.playSequence(
      textToMorse(testText),
      () => {},
      () => setIsPlaying(false)
    );
  };

  const handleStopTone = () => {
    engineRef.current?.stop();
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
            {t.monitor.title}
          </h1>
          <p className="text-slate-400 mt-1">{t.monitor.subtitle}</p>
        </div>
      </div>

      <div className="glass-panel bg-slate-900/60 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden mt-4">
        <h3 className="text-lg font-medium text-slate-200 w-full flex items-center gap-2 mb-4 z-10">
          <Activity className="w-5 h-5 text-cyan-400" /> {t.monitor.oscilloscope}
        </h3>

        <div className="w-full relative bg-slate-950/80 rounded-xl overflow-hidden shadow-inner border border-white/5 h-48 md:h-64 mb-6">
          <canvas 
            ref={canvasRef} 
            width={1200} 
            height={400} 
            className="w-full h-full block" 
          />
          <div className="absolute inset-0 pointer-events-none opacity-20"
               style={{ 
                 backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                 backgroundSize: '40px 40px' 
               }} 
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full justify-between items-center z-10">
          <div className="flex-1 w-full flex gap-3 items-center">
            <span className="text-sm font-medium text-slate-400 whitespace-nowrap">{t.monitor.testString}</span>
            <input 
              value={testText}
              onChange={(e) => setTestText(e.target.value.toUpperCase())}
              className="bg-black/30 w-full md:w-64 rounded-xl px-4 py-2 text-slate-200 outline-none focus:ring-2 focus:ring-cyan-500/50 shadow-inner border border-white/5"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button
              disabled={isPlaying || !testText}
              onClick={handlePlayTone}
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white rounded-xl px-6 py-3 font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <Play className="w-5 h-5 fill-current" /> {t.monitor.toneTest}
            </button>
            <button
              disabled={!isPlaying}
              onClick={handleStopTone}
              className="px-6 bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 border border-white/5"
            >
              <Square className="w-5 h-5 fill-current" /> {t.monitor.stop}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
