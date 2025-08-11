import { createI18n } from 'vue-i18n';
import {
  type MessageSchema,
  type LocaleCode,
  DEFAULT_LOCALE,
  FALLBACK_LOCALE,
  messages,
} from './locales';

export const i18n = createI18n<[MessageSchema], LocaleCode>({
  legacy: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: FALLBACK_LOCALE,
  messages,
});

export function useI18n() {
  return i18n.global;
}

export type { MessageSchema, LocaleCode };
