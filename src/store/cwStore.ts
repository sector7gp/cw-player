import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CWConfig, DEFAULT_CW_CONFIG } from '@/lib/audio';
import { Language, TRANSLATIONS } from '@/lib/i18n';

interface State {
  config: CWConfig;
  setConfig: (newConfig: Partial<CWConfig>) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  // UI State
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
  t: typeof TRANSLATIONS.en;
}

export const useCWStore = create<State>()(
  persist(
    (set) => ({
      config: DEFAULT_CW_CONFIG,
      setConfig: (newConfig) => set((state) => ({ 
        config: { ...state.config, ...newConfig } 
      })),
      language: 'en',
      setLanguage: (lang) => set({ language: lang, t: TRANSLATIONS[lang] }),
      isPlaying: false,
      setIsPlaying: (val) => set({ isPlaying: val }),
      t: TRANSLATIONS.en,
    }),
    {
      name: 'cw-player-storage', // saves to localstorage for persistence (Req 13)
      partialize: (state) => ({ config: state.config, language: state.language }), // Only persist configuration and language
    }
  )
);
