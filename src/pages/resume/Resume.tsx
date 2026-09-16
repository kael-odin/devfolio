import { useMemo } from "react";
import { motion } from "motion/react";
import { ExternalLink, Info } from "lucide-react";
import { getResume } from "@data/resume";
import useLanguage from "@hooks/useLanguage";
import { st } from "@/i18n/sections";
import { staggerContainer, staggerItem } from "@utils/animations";
import { CYAN, MAX_WIDTH, TEXT_MUTED, TEXT_SECONDARY } from "@/constants/theme";
import PageSection from "@components/layout/PageSection";

/**
 * Online resume section (vienne-ai-site style): the full resume lives in a
 * WPS Docs (kdocs.cn) / any embeddable online document and is shown in an
 * in-page iframe, with a one-click "open full document" fallback button.
 *
 * Configure the document in data/resume.*.json:
 *   resume.online_url  -> embedded preview URL (WPS/金山文档 share link)
 *   resume.pdf_url     -> optional direct PDF download link
 */
const Resume = () => {
   const { language } = useLanguage();
   const resume = useMemo(() => getResume(language), [language]);
   const embedUrl = resume.resume.online_url || resume.resume.pdf_url || "";
   const hasEmbed = embedUrl.length > 0;

   return (
      <PageSection
         id="resume"
         title={st(language, "resume.title")}
         subtitle={st(language, "resume.sub")}
         maxWidth={MAX_WIDTH}
      >
         <motion.div variants={staggerContainer}>
            {/* Document embed card */}
            <motion.div
               variants={staggerItem}
               style={{
                  borderRadius: 20,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(0,0,0,0.35)",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
               }}
            >
               {hasEmbed ? (
                  <iframe
                     src={embedUrl}
                     title={st(language, "resume.embedTitle")}
                     loading="lazy"
                     className="resume-embed"
                     style={{
                        display: "block",
                        width: "100%",
                        height: "72vh",
                        minHeight: 560,
                        border: "none",
                        background: "#fff",
                     }}
                  />
               ) : (
                  <div
                     style={{
                        height: 420,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 14,
                        padding: 24,
                        textAlign: "center",
                     }}
                  >
                     <Info size={30} style={{ color: CYAN }} />
                     <p
                        style={{
                           margin: 0,
                           maxWidth: 460,
                           fontSize: 13.5,
                           lineHeight: 1.8,
                           color: TEXT_SECONDARY,
                        }}
                     >
                        {resume.resume.note}
                     </p>
                     <a
                        href="https://www.kdocs.cn/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                           fontSize: 12,
                           fontFamily: "var(--font-mono)",
                           color: TEXT_MUTED,
                        }}
                     >
                        WPS Docs / kdocs.cn
                     </a>
                  </div>
               )}
            </motion.div>

            {/* Action row */}
            <motion.div
               variants={staggerItem}
               style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  marginTop: 16,
               }}
            >
               <p
                  style={{
                     margin: 0,
                     fontSize: 12.5,
                     color: TEXT_MUTED,
                  }}
               >
                  {st(language, "resume.embedTip")}
               </p>
               {embedUrl && (
                  <a
                     href={embedUrl}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="btn-outline"
                     style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        textDecoration: "none",
                        fontSize: 13,
                     }}
                  >
                     <ExternalLink size={15} aria-hidden="true" />
                     {st(language, "resume.openBtn")}
                  </a>
               )}
            </motion.div>
         </motion.div>
      </PageSection>
   );
};

export default Resume;
