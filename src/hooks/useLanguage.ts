import { use } from "react";
import { LanguageContext } from "./languageContext";

const useLanguage = () => {
   const ctx = use(LanguageContext);
   if (!ctx)
      throw new Error("useLanguage must be used within LanguageProvider");
   return ctx;
};

export default useLanguage;
