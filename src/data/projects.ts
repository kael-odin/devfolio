import type {
   CommunityDiscussion,
   OpenSourceContribution,
   Project,
   ProjectsFile,
} from "@/types";
import type { Language } from "@hooks/languageContext";
import projectsDataZh from "../../data/projects.zh.json";
import projectsDataEn from "../../data/projects.en.json";

const pickProj = (lang: Language) =>
   (lang === "en" ? projectsDataEn : projectsDataZh) as ProjectsFile;

export const getSpotlightProjectId = (lang: Language = "zh"): number | null =>
   pickProj(lang).spotlight_project_id ?? null;
export const getFeaturedProjects = (lang: Language = "zh"): Project[] =>
   pickProj(lang).featured_projects;
export const getCollaborativeProjects = (lang: Language = "zh"): Project[] =>
   pickProj(lang).collaborative_projects;
export const getOtherProjects = (lang: Language = "zh"): Project[] =>
   pickProj(lang).other_projects;
export const getCommunityProjects = (lang: Language = "zh"): Project[] =>
   pickProj(lang).community_projects ?? [];
export const getOpenSourceContributions = (
   _lang: Language = "zh",
): OpenSourceContribution[] => pickProj("zh").open_source_contributions ?? [];
export const getCommunityDiscussions = (
   _lang: Language = "zh",
): CommunityDiscussion[] => pickProj("zh").community_discussions ?? [];
