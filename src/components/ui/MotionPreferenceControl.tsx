import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Accessibility, Sparkles } from "lucide-react";
import { GLASS_BORDER, MONO_FONT, TEXT_PRIMARY } from "@/constants/theme";
import useBreakpoint from "@hooks/useBreakpoint";
import useMotionPreference from "@hooks/useMotionPreference";
import useLanguage from "@hooks/useLanguage";
import { t } from "@/i18n/ui";
import type { MotionPreference } from "@hooks/motionPreferenceContext";

// On phones the control would sit on the hero CTAs at the fold, so it waits
// for the first real scroll (same threshold as BackToTop). Desktop shows it at once.
const PHONE_REVEAL_PX = 120;

const ORDER: MotionPreference[] = ["full", "reduced"];
const labelFor = (language: "zh" | "en", p: MotionPreference) =>
   t(language, p === "full" ? "ctrl.motionFull" : "ctrl.motionReduced");

const PreferenceIcon = ({ preference }: { preference: MotionPreference }) => {
   if (preference === "reduced") return <Accessibility size={16} />;
   return <Sparkles size={16} />;
};

const MotionPreferenceControl = () => {
   const { isMobile } = useBreakpoint();
   const { preference, setPreference } = useMotionPreference();
   const { language } = useLanguage();
   const LABELS: Record<MotionPreference, string> = {
      full: labelFor(language, "full"),
      reduced: labelFor(language, "reduced"),
   };
   const [pastFold, setPastFold] = useState(
      () => globalThis.window != null && window.scrollY > PHONE_REVEAL_PX,
   );

   useEffect(() => {
      const onScroll = () => setPastFold(window.scrollY > PHONE_REVEAL_PX);
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
   }, []);

   const shown = !isMobile || pastFold;
   const currentIndex = ORDER.indexOf(preference);
   const nextPreference = ORDER[(currentIndex + 1) % ORDER.length];

   return (
      <motion.button
         type="button"
         onClick={() => setPreference(nextPreference)}
         initial={false}
         animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 12 }}
         transition={{ duration: 0.25 }}
         aria-hidden={!shown}
         tabIndex={shown ? 0 : -1}
         whileHover={{ y: -2, scale: 1.02 }}
         whileTap={{ scale: 0.96 }}
         aria-label={t(language, "ctrl.motionMode", {
            cur: LABELS[preference],
            next: LABELS[nextPreference],
         })}
         title={t(language, "ctrl.motionTitle", {
            cur: LABELS[preference],
            next: LABELS[nextPreference],
         })}
         style={{
            position: "fixed",
            pointerEvents: shown ? "auto" : "none",
            left: isMobile ? 20 : 32,
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
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
         }}
      >
         <PreferenceIcon preference={preference} />
         {!isMobile && (
            <span>
               {LABELS[preference]} {t(language, "ctrl.motionSuffix")}
            </span>
         )}
      </motion.button>
   );
};

export default MotionPreferenceControl;
