import type { Education } from "@/types";
import type { Language } from "@hooks/languageContext";
import educationDataZh from "../../data/education.zh.json";
import educationDataEn from "../../data/education.en.json";

const pickEdu = (lang: Language) =>
   lang === "en" ? educationDataEn : educationDataZh;

export const getEducation = (lang: Language = "zh"): Education[] =>
   pickEdu(lang) as Education[];
