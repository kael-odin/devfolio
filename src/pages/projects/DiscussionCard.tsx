import type { CSSProperties } from "react";
import { ArrowUpRight, BadgeCheck, MessageCircle } from "lucide-react";
import type { CommunityDiscussion } from "@/types";
import { CYAN, PURPLE } from "@/constants/theme";
import useLanguage from "@hooks/useLanguage";
import { st } from "@/i18n/sections";

interface DiscussionCardProps {
   discussion: CommunityDiscussion;
}

const STATUS_KEYS = {
   accepted: "proj.accepted",
   helpful: "proj.helpful",
} as const;

const STATUS_CONFIG = {
   accepted: { color: CYAN, Icon: BadgeCheck },
   helpful: { color: PURPLE, Icon: MessageCircle },
} as const;

const DiscussionCard = ({ discussion }: DiscussionCardProps) => {
   const { language } = useLanguage();
   const config =
      STATUS_CONFIG[discussion.status as keyof typeof STATUS_CONFIG] ??
      STATUS_CONFIG.helpful;
   const { color, Icon } = config;
   const statusKey =
      STATUS_KEYS[discussion.status as keyof typeof STATUS_KEYS] ??
      STATUS_KEYS.helpful;
   const label = st(language, statusKey);

   return (
      <a
         href={discussion.url}
         target="_blank"
         rel="noopener noreferrer"
         title={`${discussion.repo}: ${discussion.title}`}
         className="contribution-link"
         style={{ "--contribution-accent": color } as CSSProperties}
      >
         <Icon size={14} className="contribution-icon" aria-hidden="true" />
         <div style={{ minWidth: 0, flex: 1 }}>
            <div className="contribution-meta">
               <span className="contribution-repo">{discussion.repo}</span>
               <span className="contribution-status">{label}</span>
            </div>
            <p className="contribution-title">{discussion.title}</p>
         </div>
         <ArrowUpRight
            size={14}
            className="contribution-icon action-arrow action-arrow--external"
            aria-hidden="true"
         />
      </a>
   );
};

export default DiscussionCard;
