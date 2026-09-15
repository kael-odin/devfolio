import type { ImpactStats, SiteConfig, SocialProfile } from "@/types";
import type { Language } from "@hooks/languageContext";
import personalDataZh from "../../data/personal.zh.json";
import personalDataEn from "../../data/personal.en.json";

const pick = (lang: Language) =>
   lang === "en" ? personalDataEn : personalDataZh;

export const getName = (lang: Language = "zh"): string => pick(lang).name;
export const getRole = (lang: Language = "zh"): string => pick(lang).role;
export const getEmployer = (lang: Language = "zh"): string =>
   pick(lang).employer;
export const getLocation = (lang: Language = "zh"): string =>
   pick(lang).location;
export const getTimezone = (lang: Language = "zh"): string =>
   pick(lang).timezone;
export const getAvailability = (lang: Language = "zh"): string =>
   pick(lang).availability;
export const getLanguages = (
   lang: Language = "zh",
): { name: string; level: string }[] => pick(lang).languages;
export const getAbout = (lang: Language = "zh"): Record<string, string> =>
   pick(lang).about;
export const getSocialProfiles = (lang: Language = "zh"): SocialProfile[] =>
   pick(lang).social_profiles;
export const getGitHubUsername = (_lang: Language = "zh"): string =>
   personalDataZh.contact.github;
export const getImpact = (lang: Language = "zh"): ImpactStats =>
   pick(lang).impact as ImpactStats;
export const getIntro = (lang: Language = "zh"): string => pick(lang).intro;
export const getRoleLabel = (lang: Language = "zh"): string =>
   pick(lang).role_label;
export const getHeadline = (lang: Language = "zh"): string =>
   pick(lang).headline;
export const getSiteConfig = (_lang: Language = "zh"): SiteConfig =>
   (personalDataZh.site ?? {}) as SiteConfig;
