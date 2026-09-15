import { useMemo } from "react";
import { motion } from "motion/react";
import { getEducation } from "@data/education";
import { staggerContainer } from "@utils/animations";
import { PURPLE, MAX_WIDTH_NARROW } from "@/constants/theme";
import useBreakpoint from "@hooks/useBreakpoint";
import useLanguage from "@hooks/useLanguage";
import { st } from "@/i18n/sections";
import PageSection from "@components/layout/PageSection";
import TimelineSpine from "@components/ui/TimelineSpine";
import EducationCard from "./EducationCard";

const Education = () => {
   const { language } = useLanguage();
   const education = useMemo(() => getEducation(language), [language]);
   const { isMobile } = useBreakpoint();

   return (
      <PageSection
         id="education"
         title={st(language, "edu.title")}
         subtitle={st(language, "edu.sub")}
         maxWidth={MAX_WIDTH_NARROW}
      >
         <motion.div variants={staggerContainer}>
            <TimelineSpine accentColor={PURPLE} count={education.length}>
               {education.map((item, index) => (
                  <EducationCard
                     key={item.id}
                     item={item}
                     index={index}
                     isMobile={isMobile}
                  />
               ))}
            </TimelineSpine>
         </motion.div>
      </PageSection>
   );
};

export default Education;
