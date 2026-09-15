import { useRef } from "react";
import useFreezeAnimations from "@hooks/useFreezeAnimations";
import useMotionPreference from "@hooks/useMotionPreference";
import StackAnim from "./animations/StackAnim";
import PipelineAnim from "./animations/PipelineAnim";
import AgentChatAnim from "./animations/AgentChatAnim";
import ArchitectureAnim from "./animations/ArchitectureAnim";

interface ServiceAnimationProps {
   serviceId: number;
   color: string;
   /** Phone strip is 100 px tall; the desktop column is 150 px. */
   compact?: boolean;
}

/* The 80 px canvas scales to 144 px beside the copy on desktop and to 96 px
 * inside the 100 px phone strip, so nothing is clipped at either size. */
const SCALE_DESKTOP = 1.8;
const SCALE_COMPACT = 1.2;

/* Keyed by service `id`, not title: data titles are localized. */
const ANIM_MAP: Record<number, React.FC<{ color: string }>> = {
   1: StackAnim,
   2: AgentChatAnim,
   3: ArchitectureAnim,
   4: PipelineAnim,
};

const ServiceAnimation = ({
   serviceId,
   color,
   compact = false,
}: ServiceAnimationProps) => {
   const AnimComponent = ANIM_MAP[serviceId];
   const frameRef = useRef<HTMLDivElement>(null);
   const { preference } = useMotionPreference();
   useFreezeAnimations(frameRef);

   if (!AnimComponent) return null;

   return (
      <div
         ref={frameRef}
         aria-hidden="true"
         style={{
            transform: `scale(${compact ? SCALE_COMPACT : SCALE_DESKTOP})`,
            transformOrigin: "center",
         }}
      >
         <AnimComponent key={preference} color={color} />
      </div>
   );
};

export default ServiceAnimation;
