import { Building2 } from "lucide-react";
import ModalHeaderShell from "@components/ui/ModalHeaderShell";
import { TEXT_PRIMARY, CYAN, MONO_FONT } from "@/constants/theme";
import { getOrgLogo } from "@utils/orgLogos";
import type { ProfessionalExperience } from "@/types";
import useLanguage from "@hooks/useLanguage";
import { st } from "@/i18n/sections";

interface ModalHeaderProps {
   experience: ProfessionalExperience;
   onClose: () => void;
   isMobile: boolean;
}

const ModalHeader = ({ experience, onClose, isMobile }: ModalHeaderProps) => {
   const { language } = useLanguage();
   return (
      <ModalHeaderShell
         isMobile={isMobile}
         onClose={onClose}
         closeLabel={st(language, "exp.close")}
      >
         <div
            style={{
               display: "flex",
               alignItems: "center",
               gap: 8,
               marginBottom: 4,
            }}
         >
            <span style={{ flexShrink: 0, display: "inline-flex" }}>
               {getOrgLogo(experience.company ?? "", isMobile ? 16 : 18) ?? (
                  <Building2
                     size={isMobile ? 16 : 18}
                     style={{ color: CYAN }}
                  />
               )}
            </span>
            <h2
               id="experience-modal-title"
               style={{
                  fontSize: isMobile ? 15 : 18,
                  fontWeight: 700,
                  color: TEXT_PRIMARY,
                  flex: 1,
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
               }}
            >
               {experience.company}
            </h2>
         </div>
         <p
            style={{
               fontSize: isMobile ? 11 : 13,
               color: CYAN,
               fontFamily: MONO_FONT,
               overflow: "hidden",
               textOverflow: "ellipsis",
               whiteSpace: "nowrap",
            }}
         >
            {experience.title} | {experience.date}
         </p>
      </ModalHeaderShell>
   );
};

export default ModalHeader;
