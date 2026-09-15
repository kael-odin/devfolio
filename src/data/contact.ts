import type { ContactOption, EmailConfig, Language } from "@/types";
import contactData from "../../data/contact.json";
import { t } from "@/i18n/ui";

const OPTION_I18N: Record<number, { titleKey: string; messageKey: string }> = {
   1: { titleKey: "contact.optEmail", messageKey: "contact.optEmailMsg" },
   2: { titleKey: "contact.optLinkedin", messageKey: "contact.optLinkedinMsg" },
   3: { titleKey: "contact.optGithub", messageKey: "contact.optGithubMsg" },
   4: { titleKey: "contact.optCall", messageKey: "contact.optCallMsg" },
};

export const getContactOptions = (lang: Language = "zh"): ContactOption[] =>
   (contactData.contact_options as ContactOption[]).map((o) => {
      const keys = OPTION_I18N[o.id];
      if (!keys) return o;
      return {
         ...o,
         title: t(lang, keys.titleKey),
         message: t(lang, keys.messageKey),
      };
   });
export const getEmailConfig = (): EmailConfig =>
   contactData.email_config as EmailConfig;
