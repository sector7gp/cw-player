export interface CWConfig {
  wpm: number;
  farnsworthWpm?: number;
  frequency: number; // Hz
  volume: number; // 0.0 to 1.0
  drift?: number; // Hz drift for realism
  qrm?: number; // noise level
}

export const DEFAULT_CW_CONFIG: CWConfig = {
  wpm: Number(process.env.NEXT_PUBLIC_CW_DEFAULT_WPM) || 20,
  farnsworthWpm: Number(process.env.NEXT_PUBLIC_CW_FARNSWORTH_WPM) || 20,
  frequency: Number(process.env.NEXT_PUBLIC_CW_DEFAULT_FREQ) || 600,
  volume: Number(process.env.NEXT_PUBLIC_CW_DEFAULT_VOL) || 0.8,
  drift: 0,
};

export class CWAudioEngine {
  private audioCtx: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  public analyser: AnalyserNode | null = null;
  private isPlaying = false;
  private config: CWConfig;

  constructor(config: Partial<CWConfig> = {}) {
    this.config = { ...DEFAULT_CW_CONFIG, ...config };
  }

  public updateConfig(newConfig: Partial<CWConfig>) {
    this.config = { ...this.config, ...newConfig };
    if (this.oscillator) {
      this.oscillator.frequency.setValueAtTime(this.config.frequency, this.audioCtx!.currentTime);
    }
  }

  private initAudio() {
    if (typeof window === 'undefined') return;
    
    if (!this.audioCtx) {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
      if (this.audioCtx) {
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 2048;
      }
    }
  }

  public async resume(): Promise<void> {
    this.initAudio();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }
  }

  // Returns base unit length in seconds
  private getUnitLength(wpm: number) {
    // 1200 / WPM gives unit length in milliseconds. Convert to seconds.
    return (1200 / wpm) / 1000;
  }

  // Farnsworth calculation
  private getTiming() {
    const charWpm = this.config.wpm;
    const effWpm = this.config.farnsworthWpm && this.config.farnsworthWpm < charWpm 
      ? this.config.farnsworthWpm 
      : charWpm;

    const unit = this.getUnitLength(charWpm);
    const effUnit = this.getUnitLength(effWpm);

    // standard gaps
    const dot = unit;
    const dash = unit * 3;
    const elementGap = unit; 
    
    // Farnsworth gap calculation
    // "PARIS" is 50 units total.
    // 43 units are elements + element gaps, 7 units are inter-word gap.
    // If farnsworth, we stretch the inter-character (3 units std) and inter-word (7 std).
    // An easy approximation is multiplying the gaps by the ratio.
    const delayFactor = charWpm / effWpm;
    const charGap = unit * 3 * delayFactor;
    const wordGap = unit * 7 * delayFactor;

    return { dot, dash, elementGap, charGap, wordGap };
  }

  public async playSequence(morse: string, onProgress?: (index: number) => void, onComplete?: () => void) {
    await this.resume();
    if (this.isPlaying) this.stop();
    this.isPlaying = true;

    this.oscillator = this.audioCtx!.createOscillator();
    this.gainNode = this.audioCtx!.createGain();

    // Use sine wave for CW tone
    this.oscillator.type = 'sine';
    this.oscillator.frequency.setValueAtTime(this.config.frequency, this.audioCtx!.currentTime);

    // Initial gain 0
    this.gainNode.gain.setValueAtTime(0, this.audioCtx!.currentTime);

    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.analyser!);
    this.analyser!.connect(this.audioCtx!.destination);

    this.oscillator.start(this.audioCtx!.currentTime);

    const timing = this.getTiming();
    let time = this.audioCtx!.currentTime + 0.1; // small buffer

    const rampTime = 0.005; // 5ms ramp to avoid clicks

    for (let i = 0; i < morse.length; i++) {
      const symbol = morse[i];
      // schedule progress callback (using setTimeout approximation)
      if (onProgress) {
        const timeToWait = (time - this.audioCtx!.currentTime) * 1000;
        setTimeout(() => { if (this.isPlaying) onProgress(i); }, timeToWait);
      }

      if (symbol === '.') {
        this.gainNode.gain.setTargetAtTime(this.config.volume, time, rampTime);
        time += timing.dot;
        this.gainNode.gain.setTargetAtTime(0, time, rampTime);
        time += timing.elementGap;
      } else if (symbol === '-') {
        this.gainNode.gain.setTargetAtTime(this.config.volume, time, rampTime);
        time += timing.dash;
        this.gainNode.gain.setTargetAtTime(0, time, rampTime);
        time += timing.elementGap;
      } else if (symbol === ' ') {
        // Space between characters is charGap - elementGap (since elementGap was just added)
        time += (timing.charGap - timing.elementGap);
      } else if (symbol === '/') {
        // Space between words
        time += (timing.wordGap - timing.charGap); // Word includes char space already
      }
    }

    if (onComplete) {
      const timeToWait = (time - this.audioCtx!.currentTime) * 1000;
      setTimeout(() => {
        if (this.isPlaying) {
          this.stop();
          onComplete();
        }
      }, timeToWait);
    }
  }

  public async playToneStart() {
    await this.resume();
    if (!this.oscillator) {
      this.oscillator = this.audioCtx!.createOscillator();
      this.gainNode = this.audioCtx!.createGain();
      this.oscillator.type = 'sine';
      this.oscillator.frequency.value = this.config.frequency;
      this.gainNode.gain.value = 0;
      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.analyser!);
      this.analyser!.connect(this.audioCtx!.destination);
      this.oscillator.start();
    }
    this.gainNode!.gain.setTargetAtTime(this.config.volume, this.audioCtx!.currentTime, 0.005);
  }

  public playToneStop() {
    if (this.gainNode && this.audioCtx) {
      this.gainNode.gain.setTargetAtTime(0, this.audioCtx.currentTime, 0.005);
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.gainNode) {
      this.gainNode.gain.cancelScheduledValues(this.audioCtx!.currentTime);
      this.gainNode.gain.setValueAtTime(0, this.audioCtx!.currentTime);
    }
    if (this.oscillator) {
      try {
        this.oscillator.stop(this.audioCtx!.currentTime + 0.1);
      } catch (e) {
        // ignore errors if already stopped
      }
      this.oscillator.disconnect();
      this.oscillator = null;
    }
  }
}
