import { useMemo } from "react";
import { motion } from "motion/react";
import {
   getAchievements,
   getCertifications,
   getLearningBadges,
} from "@data/achievements";
import { getExperience } from "@data/experience";
import { getImpact } from "@data/personal";
import {
   getCommunityDiscussions,
   getOpenSourceContributions,
   getFeaturedProjects,
   getCollaborativeProjects,
   getOtherProjects,
   getCommunityProjects,
} from "@data/projects";
import { staggerContainer, staggerItem } from "@utils/animations";
import { MONO_FONT, TEXT_MUTED, TEXT_SECONDARY } from "@/constants/theme";
import AnimatedCounter from "@components/ui/AnimatedCounter";
import useBreakpoint from "@hooks/useBreakpoint";
import useLanguage from "@hooks/useLanguage";
import { st } from "@/i18n/sections";

/* The site's only numeric summary -- the hero deliberately carries no figures.
   Coding-platform numbers are NOT here: they live with the platform cards below
   (CodingProfiles), which show them per platform with profile links. Every value
   is derived from data/*.json rather than written here, so the counts cannot
   drift away from the underlying entries. */

interface Stat {
   value: string;
   label: string;
   note?: string;
}

const BIG_REPO_STARS = 10_000;

/** 234448 -> "234k+", 442 -> "442". AnimatedCounter keeps "k+" as suffix. */
const formatStars = (n: number): string =>
   n >= 1000 ? `${Math.floor(n / 1000)}k+` : String(n);

const StatTile = ({ stat, isMobile }: { stat: Stat; isMobile: boolean }) => (
   <motion.div
      variants={staggerItem}
      style={{
         display: "flex",
         flexDirection: "column",
         gap: 6,
         padding: isMobile ? "16px 14px" : "20px 18px",
         borderRadius: 16,
         border: "1px solid rgb(255 255 255 / 0.06)",
         background: "var(--color-bg-card)",
         minWidth: 0,
      }}
   >
      <AnimatedCounter value={stat.value} />
      <span
         style={{
            fontFamily: MONO_FONT,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: TEXT_SECONDARY,
         }}
      >
         {stat.label}
      </span>
      {stat.note && (
         <span style={{ fontSize: 12, color: TEXT_MUTED, lineHeight: 1.4 }}>
            {stat.note}
         </span>
      )}
   </motion.div>
);

const StatGroup = ({
   heading,
   stats,
   isMobile,
}: {
   heading: string;
   stats: Stat[];
   isMobile: boolean;
}) => (
   <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h3 className="dashed-rule">{heading}</h3>
      <motion.div
         variants={staggerContainer}
         initial="hidden"
         whileInView="visible"
         viewport={{ once: true, margin: "0px 0px -60px 0px" }}
         style={{
            display: "grid",
            // minmax(0, 1fr) on mobile so long mono values can shrink instead
            // of blowing the track out (see CLAUDE.md mobile-grid gotcha).
            gridTemplateColumns: isMobile
               ? "repeat(2, minmax(0, 1fr))"
               : "repeat(auto-fit, minmax(170px, 1fr))",
            gap: isMobile ? 12 : 16,
         }}
      >
         {stats.map((stat) => (
            <StatTile key={stat.label} stat={stat} isMobile={isMobile} />
         ))}
      </motion.div>
   </div>
);

const StatsBand = () => {
   const { language } = useLanguage();
   const { isMobile } = useBreakpoint();

   const { impact, delivery, openSource } = useMemo(() => {
      const certs = getCertifications(language);
      const badges = getLearningBadges(language);
      const impactData = getImpact(language);

      // Talks and published patterns are tagged by `type` on the experience
      // entries, so this count tracks the timeline instead of restating it.
      const internal = getExperience(language).flatMap(
         (job) => job.internal_contributions ?? [],
      );
      const speakingCount = internal.filter(
         (c) => c.type === "talk" || c.type === "publication",
      ).length;

      const projectCount =
         getFeaturedProjects(language).length +
         getCollaborativeProjects(language).length +
         getOtherProjects(language).length +
         getCommunityProjects(language).length;
      const featuredCount = getFeaturedProjects(language).length;

      // Podium = 1st/2nd/3rd place entries in the Awards data.
      const podium = getAchievements(language).filter((a) =>
         /^(1st|2nd|3rd) Place/.test(a.title),
      );
      const place = (n: string) =>
         podium.filter((a) => a.title.startsWith(n)).length;

      // Open source: "merged" entries can be PRs or a credited commit, so the
      // PR count is the strict figure and co-authored fixes are noted separately.
      const oss = getOpenSourceContributions(language);
      const merged = oss.filter((c) => c.status === "merged");
      const mergedPrs = merged.filter((c) => c.url.includes("/pull/")).length;
      const mergedRepos = new Set(merged.map((c) => c.repo));
      const coAuthored = merged.length - mergedPrs;
      let mergedNote = st(language, "stats.mergedAcross", {
         n: mergedRepos.size,
      });
      if (coAuthored === 1) mergedNote = st(language, "stats.mergedPlus1");
      else if (coAuthored > 1)
         mergedNote = st(language, "stats.mergedPlusN", { n: coAuthored });
      const repoStars = new Map<string, number>();
      for (const contribution of oss) {
         if (!repoStars.has(contribution.repo)) {
            repoStars.set(contribution.repo, contribution.stars);
         }
      }
      const starsReached = [...mergedRepos].reduce(
         (sum, repo) => sum + (repoStars.get(repo) ?? 0),
         0,
      );
      const bigRepos = [...repoStars.values()].filter(
         (s) => s >= BIG_REPO_STARS,
      ).length;
      const discussions = getCommunityDiscussions(language);
      const accepted = discussions.filter(
         (d) => d.status === "accepted",
      ).length;

      return {
         impact: [
            {
               value: impactData.clients_served,
               label: st(language, "stats.clients"),
               note: impactData.clients_note,
            },
            {
               value: impactData.workloads_migrated,
               label: st(language, "stats.workloads"),
               note: impactData.workloads_note ?? impactData.aws_accounts,
            },
            {
               value: impactData.aws_accounts,
               label: st(language, "stats.templates"),
               note: impactData.aws_note ?? "",
            },
            {
               value: impactData.security_controls,
               label: st(language, "stats.controls"),
               note:
                  impactData.security_note ??
                  st(language, "stats.controlsFallback"),
            },
            {
               value: String(speakingCount),
               label: st(language, "stats.talks"),
               note: st(language, "stats.talksNote"),
            },
         ] satisfies Stat[],
         delivery: [
            {
               value: String(projectCount),
               label: st(language, "stats.shipped"),
               note: st(language, "stats.featuredNote", { n: featuredCount }),
            },
            {
               value: String(certs.length),
               label: st(language, "stats.certs"),
               note: st(language, "stats.certsNote"),
            },
            {
               value: String(badges.length),
               label: st(language, "stats.badges"),
               note: st(language, "stats.badgesNote"),
            },
            {
               value: String(podium.length),
               label: st(language, "stats.podium"),
               note: st(language, "stats.podiumNote", {
                  a: place("1st"),
                  b: place("2nd"),
                  c: place("3rd"),
               }),
            },
         ] satisfies Stat[],
         openSource: [
            {
               value: String(mergedPrs),
               label: st(language, "stats.merged"),
               note: mergedNote,
            },
            {
               value: formatStars(starsReached),
               label: st(language, "stats.stars"),
               note: st(language, "stats.starsNote"),
            },
            {
               value: String(repoStars.size),
               label: st(language, "stats.repos"),
               note: st(language, "stats.reposNote", { n: bigRepos }),
            },
            {
               value: String(discussions.length),
               label: st(language, "stats.answers"),
               note: st(language, "stats.answersNote", {
                  a: accepted,
                  h: discussions.length - accepted,
               }),
            },
         ] satisfies Stat[],
      };
   }, [language]);

   return (
      <div
         style={{
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? 32 : 44,
            marginBottom: isMobile ? 48 : 64,
         }}
      >
         {/* Consulting impact leads: it is the work clients and recruiters
             are actually assessing. */}
         <StatGroup
            heading={st(language, "stats.impact")}
            stats={impact}
            isMobile={isMobile}
         />
         <StatGroup
            heading={st(language, "stats.delivery")}
            stats={delivery}
            isMobile={isMobile}
         />
         <StatGroup
            heading={st(language, "stats.oss")}
            stats={openSource}
            isMobile={isMobile}
         />
      </div>
   );
};

export default StatsBand;
