import { motion } from "motion/react";
import { Languages } from "lucide-react";
import { MONO_FONT, GLASS_BORDER, TEXT_PRIMARY } from "@/constants/theme";
import useLanguage from "@hooks/useLanguage";
import useBreakpoint from "@hooks/useBreakpoint";
import { t } from "@/i18n/ui";

/* 中/EN 切换：固定在右下角，与动效开关并排。默认中文，偏好存 localStorage。 */
const LanguageSwitch = () => {
   const { isMobile } = useBreakpoint();
   const { language, setLanguage } = useLanguage();
   const next = language === "zh" ? "en" : "zh";

   return (
      <motion.button
         type="button"
         onClick={() => setLanguage(next)}
         whileHover={{ y: -2, scale: 1.02 }}
         whileTap={{ scale: 0.96 }}
         aria-label={
            language === "zh"
               ? t(language, "lang.toEn")
               : t(language, "lang.toZh")
         }
         title={language === "zh" ? "English" : "中文"}
         style={{
            position: "fixed",
            right: isMobile ? 20 : 32,
            bottom: isMobile ? 20 : 32,
            zIndex: 30,
            minWidth: 44,
            height: 44,
            padding: isMobile ? 0 : "0 14px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            borderRadius: 12,
            border: `1px solid ${GLASS_BORDER}`,
            background: "var(--color-bg-card)",
            boxShadow: "0 6px 24px rgba(0,0,0,0.35)",
            color: TEXT_PRIMARY,
            cursor: "pointer",
            fontFamily: MONO_FONT,
            fontSize: 12,
            fontWeight: 700,
         }}
      >
         <Languages size={16} />
         {!isMobile && <span>{language === "zh" ? "EN" : "中文"}</span>}
      </motion.button>
   );
};

export default LanguageSwitch;
