import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { NeedSlug } from "../lib/types";
import { detectInitialLang, type Lang } from "../i18n/translations";

export type Mode = "patient" | "caretaker";

interface AppState {
  mode: Mode;
  language: Lang;
  /** When the caretaker arms a question, the patient view shows it. */
  armedQuestion: NeedSlug | null;
  /** Last yes/no answer the patient gave to the most recent armed question. */
  lastAnswer: { slug: NeedSlug; response: "yes" | "no"; at: string } | null;
  /** Speaks the question on confirm/question screens via SpeechSynthesis. */
  voiceEnabled: boolean;
  /** Plays chimes + triggers vibration on confirm/question taps. */
  soundsEnabled: boolean;

  setMode: (mode: Mode) => void;
  setLanguage: (lang: Lang) => void;
  setVoiceEnabled: (enabled: boolean) => void;
  setSoundsEnabled: (enabled: boolean) => void;
  armQuestion: (slug: NeedSlug) => void;
  clearArmedQuestion: () => void;
  setLastAnswer: (slug: NeedSlug, response: "yes" | "no") => void;
  clearLastAnswer: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      mode: "caretaker",
      language: detectInitialLang(),
      armedQuestion: null,
      lastAnswer: null,
      voiceEnabled: true,
      soundsEnabled: true,

      setMode: (mode) => set({ mode }),
      setLanguage: (language) => set({ language }),
      setVoiceEnabled: (voiceEnabled) => set({ voiceEnabled }),
      setSoundsEnabled: (soundsEnabled) => set({ soundsEnabled }),
      armQuestion: (slug) => set({ armedQuestion: slug, mode: "patient" }),
      clearArmedQuestion: () => set({ armedQuestion: null }),
      setLastAnswer: (slug, response) =>
        set({
          lastAnswer: { slug, response, at: new Date().toISOString() },
          armedQuestion: null,
        }),
      clearLastAnswer: () => set({ lastAnswer: null }),
    }),
    {
      name: "care-companion-app",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        mode: state.mode,
        language: state.language,
        voiceEnabled: state.voiceEnabled,
        soundsEnabled: state.soundsEnabled,
      }),
    }
  )
);
