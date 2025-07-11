import { createI18n } from "vue-i18n";
import de from "@/locales/de.json";

const i18n = createI18n({
  useScope: "global",
  locale: "de",
  fallbackLocale: "de",
  messages: {
    de,
  },
});

export default i18n;
