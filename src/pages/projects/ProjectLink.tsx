import type { ComponentType, CSSProperties } from "react";
import { CYAN } from "@/constants/theme";
import useLanguage from "@hooks/useLanguage";
import { t } from "@/i18n/ui";

interface ProjectLinkProps {
   href: string;
   label: string;
   ariaLabel: string;
   icon: ComponentType<{ size?: number }>;
   accentColor?: string;
}

const ProjectLink = ({
   href,
   label,
   ariaLabel,
   icon: Icon,
   accentColor = CYAN,
}: ProjectLinkProps) => {
   const { language } = useLanguage();
   return (
      <a
         href={href}
         target="_blank"
         rel="noopener noreferrer"
         onClick={(e) => e.stopPropagation()}
         className="project-action"
         style={{ "--project-accent": accentColor } as CSSProperties}
         aria-label={t(language, "hero.opensNewTab", { text: ariaLabel })}
      >
         <span aria-hidden="true">
            <Icon size={16} />
         </span>
         {label}
      </a>
   );
};

export default ProjectLink;
