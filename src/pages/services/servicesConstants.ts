import { Code, Brain, Bot, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* Keyed by service `id` (1..4), NOT by title: data titles are localized
   (zh titles differ from en), so a title-keyed lookup resolves to the
   fallback icon for every non-English locale. */
export const iconMap: Record<number, LucideIcon> = {
   1: Code,
   2: Brain,
   3: Sparkles,
   4: Bot,
};

export interface AccentColor {
   iconBg: string;
   icon: string;
   dot: string;
}

export const ACCENT_COLORS: AccentColor[] = [
   {
      iconBg: "rgba(96,165,250,0.1)",
      icon: "#60a5fa",
      dot: "#60a5fa",
   },
   {
      iconBg: "rgba(56,189,248,0.1)",
      icon: "#38bdf8",
      dot: "#38bdf8",
   },
   {
      iconBg: "rgba(34,197,94,0.1)",
      icon: "#22c55e",
      dot: "#22c55e",
   },
   {
      iconBg: "rgba(245,158,11,0.1)",
      icon: "#f59e0b",
      dot: "#f59e0b",
   },
   {
      iconBg: "rgba(96,165,250,0.1)",
      icon: "#60a5fa",
      dot: "#60a5fa",
   },
   {
      iconBg: "rgba(56,189,248,0.1)",
      icon: "#38bdf8",
      dot: "#38bdf8",
   },
];
