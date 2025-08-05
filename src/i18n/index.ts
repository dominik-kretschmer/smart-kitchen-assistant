import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import de from './locales/de.json';

// Type definition for messages
type MessageSchema = typeof en;

// Create i18n instance
export const i18n = createI18n<[MessageSchema], 'en' | 'de'>({
  legacy: false, // Use Composition API
  locale: 'de', // Default language
  fallbackLocale: 'en', // Fallback language
  messages: {
    en,
    de
  }
});

// Export a composable to use i18n in components
export function useI18n() {
  return i18n.global;
}
