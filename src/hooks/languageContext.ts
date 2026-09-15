import { createContext } from "react";

export type Language = "zh" | "en";

export interface LanguageValue {
   language: Language;
   setLanguage: (language: Language) => void;
}

export const LanguageContext = createContext<LanguageValue | null>(null);
