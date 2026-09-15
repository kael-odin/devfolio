import type {
   Achievement,
   Certification,
   CodingPlatformStats,
   LearningBadge,
} from "@/types";
import type { Language } from "@hooks/languageContext";
import achievementsDataZh from "../../data/achievements.zh.json";
import achievementsDataEn from "../../data/achievements.en.json";

const pickAch = (lang: Language) =>
   lang === "en" ? achievementsDataEn : achievementsDataZh;

export const getCertifications = (lang: Language = "zh"): Certification[] =>
   pickAch(lang).certifications as Certification[];
export const getLearningBadges = (lang: Language = "zh"): LearningBadge[] =>
   (pickAch(lang).learning_badges ?? []) as LearningBadge[];
export const getAchievements = (lang: Language = "zh"): Achievement[] =>
   pickAch(lang).achievements as Achievement[];
export const getCodingPlatformStats = (
   lang: Language = "zh",
): CodingPlatformStats =>
   (pickAch(lang).coding_platform_stats ?? {}) as CodingPlatformStats;
