import type { Language } from "@hooks/languageContext";
import { secDictEn } from "./sections-en";
import { secDictZh } from "./sections-zh";

export const secDict: Record<Language, Record<string, string>> = {
   en: secDictEn,
   zh: secDictZh,
};

export function st(
   lang: Language,
   key: string,
   vars?: Record<string, string | number>,
): string {
   let s = secDict[lang][key] ?? secDict.en[key] ?? key;
   if (vars) {
      for (const [k, v] of Object.entries(vars))
         s = s.replaceAll("{" + k + "}", String(v));
   }
   return s;
}
