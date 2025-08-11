import { i18n } from '@/i18n';
import { LOCALES, DEFAULT_LOCALE } from '@/i18n/locales';
import type { Ref } from 'vue';

export const useLanguageStore = defineStore('language', {
  state: () => ({
    currentLanguage: (localStorage.getItem('language') as string) || DEFAULT_LOCALE,
  }),
  actions: {
    setLanguage(lang: string) {
      this.currentLanguage = lang;
      const locale = i18n.global.locale as unknown as Ref;
      locale.value = lang;
      localStorage.setItem('language', lang);
    },
    toggleLanguage() {
      const newLang = this.currentLanguage === LOCALES[0] ? LOCALES[1] : LOCALES[0];
      this.setLanguage(newLang);
    },
    initLanguage() {
      const savedLanguage = localStorage.getItem('language') as string;
      if (savedLanguage) {
        this.setLanguage(savedLanguage);
        return;
      }
      const browserLang = navigator.language.split('-')[0] as string;
      const supportedLang = (LOCALES as readonly string[]).includes(browserLang)
        ? browserLang
        : DEFAULT_LOCALE;
      this.setLanguage(supportedLang);
    },
  },
  getters: {
    language: (state) => state.currentLanguage,
  },
});
