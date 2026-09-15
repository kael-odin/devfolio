import {
   useCallback,
   useEffect,
   useMemo,
   useState,
   type ReactNode,
} from "react";
import { LanguageContext, type Language } from "./languageContext";

const STORAGE_KEY = "devfolio-language";
const LANGUAGES = new Set<Language>(["zh", "en"]);

// Default to Chinese; anything else in storage (or no storage) reads as zh.
const readLanguage = (): Language => {
   if (globalThis.window == null) return "zh";
   try {
      const stored = globalThis.localStorage.getItem(STORAGE_KEY);
      return LANGUAGES.has(stored as Language) ? (stored as Language) : "zh";
   } catch {
      return "zh";
   }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
   const [language, setLanguage] = useState<Language>(readLanguage);

   const changeLanguage = useCallback((next: Language) => {
      setLanguage(next);
      try {
         globalThis.localStorage.setItem(STORAGE_KEY, next);
      } catch {
         // The in-memory language still works when storage is unavailable.
      }
   }, []);

   useEffect(() => {
      document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
   }, [language]);

   const value = useMemo(
      () => ({ language, setLanguage: changeLanguage }),
      [language, changeLanguage],
   );

   return <LanguageContext value={value}>{children}</LanguageContext>;
};
