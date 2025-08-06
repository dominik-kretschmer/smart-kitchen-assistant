import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import de from './locales/de.json';

type MessageSchema = typeof en;

export const i18n = createI18n<[MessageSchema], 'en' | 'de'>({
  legacy: false,
  locale: 'de',
  fallbackLocale: 'en',
  messages: {
    en,
    de,
  },
});

export function useI18n() {
  return i18n.global;
}
