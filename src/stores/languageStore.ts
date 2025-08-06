import { defineStore } from 'pinia';
import { i18n } from '@/i18n';
type Language = 'en' | 'de';

export const useLanguageStore = defineStore('language', {
  state: () => ({
    currentLanguage: (localStorage.getItem('language') as Language) || 'de',
  }),

  actions: {
    setLanguage(lang: Language) {
      this.currentLanguage = lang;
      i18n.global.locale.value = lang;
      localStorage.setItem('language', lang);
    },

    toggleLanguage() {
      const newLang = this.currentLanguage === 'de' ? 'en' : 'de';
      this.setLanguage(newLang);
    },

    initLanguage() {
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage) {
        this.setLanguage(savedLanguage);
      } else {
        const browserLang = navigator.language.split('-')[0] as Language;
        const supportedLang = ['en', 'de'].includes(browserLang) ? browserLang : 'de';
        this.setLanguage(supportedLang);
      }
    },
  },

  getters: {
    language: (state) => state.currentLanguage,
    isEnglish: (state) => state.currentLanguage === 'en',
    isGerman: (state) => state.currentLanguage === 'de',
  },
});
