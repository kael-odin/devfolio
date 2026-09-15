import type { PositionOfResponsibility, ProfessionalExperience } from "@/types";
import type { Language } from "@hooks/languageContext";
import experienceDataZh from "../../data/experience.zh.json";
import experienceDataEn from "../../data/experience.en.json";

const pickExp = (lang: Language) =>
   lang === "en" ? experienceDataEn : experienceDataZh;

export const getExperience = (
   lang: Language = "zh",
): ProfessionalExperience[] =>
   pickExp(lang).professional_experience as ProfessionalExperience[];
export const getPositionsOfResponsibility = (
   lang: Language = "zh",
): PositionOfResponsibility[] =>
   pickExp(lang).positions_of_responsibility as PositionOfResponsibility[];
