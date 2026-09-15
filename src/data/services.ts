import type { Service } from "@/types";
import type { Language } from "@hooks/languageContext";
import servicesDataZh from "../../data/services.zh.json";
import servicesDataEn from "../../data/services.en.json";

const pickSvc = (lang: Language) =>
   lang === "en" ? servicesDataEn : servicesDataZh;

export const getServices = (lang: Language = "zh"): Service[] =>
   pickSvc(lang) as Service[];
