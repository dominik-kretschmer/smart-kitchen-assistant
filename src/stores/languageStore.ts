import { i18n } from '@/i18n';
import type { Ref } from 'vue';

export const useLanguageStore = defineStore('language', {
  state: () => ({
    currentLanguage: (localStorage.getItem('language') as string) || 'de',
  }),
  actions: {
    setLanguage(lang: string) {
      this.currentLanguage = lang;
      const locale = i18n.global.locale as unknown as Ref;
      locale.value = lang;
      localStorage.setItem('language', lang);
    },
    toggleLanguage() {
      const newLang = this.currentLanguage === 'de' ? 'en' : 'de';
      this.setLanguage(newLang);
    },
    initLanguage() {
      const savedLanguage = localStorage.getItem('language') as string;
      if (savedLanguage) {
        this.setLanguage(savedLanguage);
        return;
      }
      const browserLang = navigator.language.split('-')[0] as string;
      const supportedLang = ['en', 'de'].includes(browserLang) ? browserLang : 'de';
      this.setLanguage(supportedLang);
    },
  },
  getters: {
    language: (state) => state.currentLanguage,
  },
});
