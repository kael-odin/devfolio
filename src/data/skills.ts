import type { SkillsData, SkillsFile, Language } from "@/types";
import skillsData from "../../data/skills.json";

const skillsFile = skillsData as SkillsFile;

export const getSkills = (_lang: Language = "zh"): SkillsData => skillsFile;

/** Ranked hero field names; the field renders as many as it has slots. */
export const getHeroStack = (_lang: Language = "zh"): string[] =>
   skillsFile.hero_stack ?? [];
