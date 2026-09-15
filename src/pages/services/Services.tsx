import { useMemo } from "react";
import { motion } from "motion/react";
import { getServices } from "@data/services";
import useLanguage from "@hooks/useLanguage";
import { st } from "@/i18n/sections";
import { staggerContainer } from "@utils/animations";
import { MAX_WIDTH } from "@/constants/theme";
import PageSection from "@components/layout/PageSection";
import ServiceCard from "./ServiceCard";
import "./services.css";

const Services = () => {
   const { language } = useLanguage();
   const services = useMemo(() => getServices(language), [language]);

   return (
      <PageSection
         id="services"
         title={st(language, "svc.title")}
         subtitle={st(language, "svc.sub")}
      >
         <motion.div
            className="service-grid"
            style={{
               maxWidth: MAX_WIDTH,
               margin: "0 auto",
            }}
            variants={staggerContainer}
         >
            {services.map((service, i) => (
               <ServiceCard key={service.id} service={service} index={i} />
            ))}
         </motion.div>
      </PageSection>
   );
};

export default Services;
