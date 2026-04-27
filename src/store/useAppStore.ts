import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { NeedSlug } from "../lib/types";

export type Mode = "patient" | "caretaker";

interface AppState {
  mode: Mode;
  /** When the caretaker arms a question, the patient view shows it. */
  armedQuestion: NeedSlug | null;
  /** Last yes/no answer the patient gave to the most recent armed question. */
  lastAnswer: { slug: NeedSlug; response: "yes" | "no"; at: string } | null;

  setMode: (mode: Mode) => void;
  armQuestion: (slug: NeedSlug) => void;
  clearArmedQuestion: () => void;
  setLastAnswer: (slug: NeedSlug, response: "yes" | "no") => void;
  clearLastAnswer: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      mode: "caretaker",
      armedQuestion: null,
      lastAnswer: null,

      setMode: (mode) => set({ mode }),
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
      }),
    }
  )
);
