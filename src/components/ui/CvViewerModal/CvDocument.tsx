import { useMemo } from "react";
import { Download, ExternalLink, FileText, Info } from "lucide-react";
import { getResume } from "@data/resume";
import useLanguage from "@hooks/useLanguage";
import { t } from "@/i18n/ui";
import { CYAN, TEXT_MUTED, TEXT_SECONDARY } from "@/constants/theme";

/**
 * CV modal body: an in-page iframe embed of the owner's WPS Docs
 * (kdocs.cn) / any embeddable online document — the vienne-ai-site
 * pattern. Falls back to a setup hint when no document URL is
 * configured in data/resume.*.json.
 */
const CvDocument = () => {
   const { language } = useLanguage();
   const resume = useMemo(() => getResume(language), [language]);

   const embedUrl = resume.resume.online_url || resume.resume.pdf_url || "";
   const hasEmbed = embedUrl.length > 0;

   return (
      <div
         style={{
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            flex: 1,
         }}
      >
         {hasEmbed ? (
            <>
               <iframe
                  src={embedUrl}
                  title={t(language, "cv.title")}
                  className="resume-embed"
                  style={{
                     display: "block",
                     width: "100%",
                     height: "72vh",
                     minHeight: 480,
                     border: "none",
                     background: "#fff",
                  }}
               />
               <div
                  style={{
                     display: "flex",
                     flexWrap: "wrap",
                     alignItems: "center",
                     justifyContent: "space-between",
                     gap: 8,
                     padding: "10px 16px",
                     borderTop: "1px solid rgba(255,255,255,0.06)",
                  }}
               >
                  <span
                     style={{
                        fontSize: 11.5,
                        color: TEXT_MUTED,
                     }}
                  >
                     {t(language, "cv.embedTip")}
                  </span>
                  <div style={{ display: "flex", gap: 8 }}>
                     {resume.resume.pdf_url.trim() && (
                        <a
                           href={resume.resume.pdf_url}
                           download
                           className="btn-outline"
                           style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              fontSize: 12,
                              textDecoration: "none",
                           }}
                        >
                           <Download size={13} />
                           {t(language, "cv.download")}
                        </a>
                     )}
                     <a
                        href={embedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                        style={{
                           display: "inline-flex",
                           alignItems: "center",
                           gap: 6,
                           fontSize: 12,
                           textDecoration: "none",
                        }}
                     >
                        <ExternalLink size={13} />
                        {t(language, "cv.openBtn")}
                     </a>
                  </div>
               </div>
            </>
         ) : (
            <div
               style={{
                  minHeight: 320,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 14,
                  padding: 32,
                  textAlign: "center",
               }}
            >
               <FileText size={32} style={{ color: CYAN }} />
               <p
                  style={{
                     margin: 0,
                     maxWidth: 440,
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
                     textDecoration: "none",
                  }}
               >
                  WPS Docs / kdocs.cn
               </a>
               <span
                  style={{
                     display: "inline-flex",
                     alignItems: "center",
                     gap: 6,
                     fontSize: 11,
                     color: TEXT_MUTED,
                  }}
               >
                  <Info size={12} aria-hidden="true" />
                  data/resume.*.json → resume.online_url
               </span>
            </div>
         )}
      </div>
   );
};

export default CvDocument;
