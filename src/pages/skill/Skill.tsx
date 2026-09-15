import { useMemo } from "react";
import {
   BookOpen,
   Braces,
   Brain,
   Cloud,
   Compass,
   Database,
   HeartHandshake,
   PanelsTopLeft,
   Wrench,
} from "lucide-react";
import { getSkills } from "@data/skills";
import type { SkillsData } from "@/types";
import { MAX_WIDTH } from "@/constants/theme";
import useLanguage from "@hooks/useLanguage";
import { st } from "@/i18n/sections";
import PageSection from "@components/layout/PageSection";
import SkillCategory, { type CategoryGlyph } from "./SkillCategory";
import SecondarySkills from "./SecondarySkills";

interface CategoryConfig {
   i18nKey: string;
   glyph: CategoryGlyph;
}

// Display order leads with the strongest positioning (DevOps/MLOps @ AWS),
// mirroring the hero badge -- not alphabetical, not stack-conventional.
const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
   cloud_devops: { i18nKey: "skill.cloud", glyph: Cloud },
   ai_ml: { i18nKey: "skill.ai", glyph: Brain },
   languages: { i18nKey: "skill.lang", glyph: Braces },
   backend: { i18nKey: "skill.backend", glyph: Database },
   frontend: { i18nKey: "skill.frontend", glyph: PanelsTopLeft },
   tools_platforms: { i18nKey: "skill.tools", glyph: Wrench },
};

// Labels derive from the key; only the glyph is configured.
const SECONDARY_GLYPHS: Record<string, CategoryGlyph> = {
   cs_fundamentals: BookOpen,
   soft_skills: HeartHandshake,
   areas_of_interest: Compass,
};

const Skill = () => {
   const { language } = useLanguage();
   const skills: SkillsData = useMemo(() => getSkills(language), [language]);

   const primaryCategories = useMemo(
      () =>
         Object.entries(CATEGORY_CONFIG)
            .filter(([key]) => key in skills)
            .map(([key, { i18nKey, glyph }]) => ({
               key,
               label: st(language, i18nKey),
               glyph,
               items: skills[key as keyof SkillsData],
            })),
      [skills, language],
   );

   const secondaryCategories = useMemo(
      () =>
         Object.entries(SECONDARY_GLYPHS)
            .filter(([key]) => key in skills)
            .map(([key, glyph]) => ({
               key,
               label: key
                  .replaceAll("_", " ")
                  .replaceAll(/\b\w/g, (c) => c.toUpperCase()),
               glyph,
               items: skills[key as keyof SkillsData],
            })),
      [skills],
   );

   return (
      <PageSection
         id="skills"
         title={st(language, "skill.title")}
         subtitle={st(language, "skill.sub")}
      >
         <div style={{ maxWidth: MAX_WIDTH, margin: "0 auto" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
               {primaryCategories.map(({ key, label, glyph, items }, index) => (
                  <SkillCategory
                     key={key}
                     label={label}
                     glyph={glyph}
                     items={items}
                     index={index}
                     breathe
                  />
               ))}
            </div>

            <SecondarySkills categories={secondaryCategories} />
         </div>
      </PageSection>
   );
};

export default Skill;
