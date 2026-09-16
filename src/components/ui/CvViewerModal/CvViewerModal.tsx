import { lazy, Suspense, useCallback, useEffect } from "react";
import { FileText } from "lucide-react";
import useBreakpoint from "@hooks/useBreakpoint";
import useFocusTrap from "@hooks/useFocusTrap";
import useLanguage from "@hooks/useLanguage";
import { t } from "@/i18n/ui";
import ModalShell from "@components/ui/ModalShell";
import ModalHeaderShell from "@components/ui/ModalHeaderShell";
import { CYAN, TEXT_PRIMARY } from "@/constants/theme";

// Kept lazy so the viewer code stays out of the initial bundle; the
// document iframe only loads when the modal opens.
const CvDocument = lazy(() => import("./CvDocument"));

interface CvViewerModalProps {
   isOpen: boolean;
   onClose: () => void;
}

const CvViewerModal = ({ isOpen, onClose }: CvViewerModalProps) => {
   const { isMobile } = useBreakpoint();
   const dialogRef = useFocusTrap<HTMLDivElement>(isOpen);
   const { language } = useLanguage();

   const onEsc = useCallback(
      (e: KeyboardEvent) => {
         if (e.key === "Escape") onClose();
      },
      [onClose],
   );

   useEffect(() => {
      if (!isOpen) return;
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", onEsc);
      return () => {
         document.body.style.overflow = "";
         document.removeEventListener("keydown", onEsc);
      };
   }, [isOpen, onEsc]);

   return (
      <ModalShell
         isOpen={isOpen}
         onClose={onClose}
         dialogRef={dialogRef}
         isMobile={isMobile}
         titleId="cv-viewer-title"
         wide
      >
         <ModalHeaderShell
            isMobile={isMobile}
            onClose={onClose}
            closeLabel={t(language, "cv.close")}
         >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
               <FileText
                  size={isMobile ? 16 : 18}
                  style={{ color: CYAN, flexShrink: 0 }}
               />
               <h2
                  id="cv-viewer-title"
                  style={{
                     fontSize: isMobile ? 15 : 18,
                     fontWeight: 700,
                     color: TEXT_PRIMARY,
                  }}
               >
                  {t(language, "cv.title")}
               </h2>
            </div>
         </ModalHeaderShell>

         {isOpen && (
            <Suspense
               fallback={
                  <div
                     className="skeleton"
                     style={{
                        margin: 16,
                        height: 420,
                        borderRadius: 8,
                     }}
                  />
               }
            >
               <CvDocument />
            </Suspense>
         )}
      </ModalShell>
   );
};

export default CvViewerModal;
