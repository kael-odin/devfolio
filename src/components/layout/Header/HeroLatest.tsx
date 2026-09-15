import { useMemo } from "react";
import { motion } from "motion/react";
import {
   getOpenSourceContributions,
   getFeaturedProjects,
   getCollaborativeProjects,
   getOtherProjects,
   getCommunityProjects,
} from "@data/projects";
import { parseProjectDate, hasProjectUrl } from "@utils/projectMetadata";
import { MONO_FONT, TEXT_MUTED } from "@/constants/theme";
import useBreakpoint from "@hooks/useBreakpoint";
import useLanguage from "@hooks/useLanguage";
import { t } from "@/i18n/ui";
import { heroLatest } from "./heroMotion";

/* One derived line under the hero intro: the most recently merged upstream PR
   and the newest shipped project. Nothing is hand-written here, so it moves on
   its own whenever the data files are updated. The hero carries no numbers. */

const HeroLatest = () => {
   const { isMobile } = useBreakpoint();
   const { language } = useLanguage();

   const latest = useMemo(() => {
      const latestPr = getOpenSourceContributions()
         .filter((c) => c.status === "merged" && c.merged_at)
         .sort((a, b) =>
            (b.merged_at ?? "").localeCompare(a.merged_at ?? ""),
         )[0];
      const prText = latestPr
         ? t(language, "hero.latestMerged", {
              repo: latestPr.repo.split("/")[1],
              n: latestPr.url.split("/").pop() ?? "",
           })
         : null;

      const newestProject = [
         ...getFeaturedProjects(language),
         ...getCollaborativeProjects(language),
         ...getOtherProjects(language),
         ...getCommunityProjects(language),
      ]
         .filter((p) => hasProjectUrl(p.live))
         .sort(
            (a, b) =>
               parseProjectDate(b.date).getTime() -
               parseProjectDate(a.date).getTime(),
         )[0];
      const projectText = newestProject
         ? t(language, "hero.latestShipped", { title: newestProject.title })
         : null;

      const links: { text: string; href: string }[] = [];
      if (latestPr && prText) {
         links.push({ text: prText, href: latestPr.url });
      }
      if (newestProject && projectText && hasProjectUrl(newestProject.live)) {
         links.push({ text: projectText, href: newestProject.live });
      }
      return links;
   }, [language]);

   if (!latest.length) return null;

   return (
      <motion.div
         variants={heroLatest}
         style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            justifyContent: "center",
            gap: isMobile ? 4 : 14,
         }}
      >
         <span
            style={{
               fontFamily: MONO_FONT,
               fontSize: 10,
               fontWeight: 700,
               letterSpacing: "0.16em",
               textTransform: "uppercase",
               color: TEXT_MUTED,
               flexShrink: 0,
            }}
         >
            {t(language, "hero.latest")}
         </span>
         <div
            style={{
               display: "flex",
               flexWrap: "wrap",
               alignItems: "center",
               justifyContent: "center",
               gap: "0 12px",
               fontSize: 14,
               lineHeight: 1.6,
            }}
         >
            {latest.map(({ text, href }) => (
               <a
                  key={href}
                  href={href}
                  className="hero-latest-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t(language, "hero.opensNewTab", { text })}
               >
                  {text}
               </a>
            ))}
         </div>
      </motion.div>
   );
};

export default HeroLatest;
