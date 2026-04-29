import { useAppStore } from "../store/useAppStore";
import { LOCALES, TRANSLATIONS } from "./translations";

/**
 * Reactive hook that returns the current strings dictionary and BCP-47 locale
 * for the active language.
 */
export function useTranslation() {
  const lang = useAppStore((s) => s.language);
  return {
    t: TRANSLATIONS[lang],
    lang,
    locale: LOCALES[lang],
  };
}
