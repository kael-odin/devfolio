import type { ResumeFile } from "@/types";
import type { Language } from "@hooks/languageContext";
import resumeDataZh from "../../data/resume.zh.json";
import resumeDataEn from "../../data/resume.en.json";

const pickResume = (lang: Language) =>
   (lang === "en" ? resumeDataEn : resumeDataZh) as ResumeFile;

export const getResume = (lang: Language = "zh"): ResumeFile =>
   pickResume(lang);
