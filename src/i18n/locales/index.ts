import en from './en.json';
import de from './de.json';

export const LOCALES = ['en', 'de'] as const;
export type LocaleCode = (typeof LOCALES)[number];
export type MessageSchema = typeof en;
export const messages: Record<LocaleCode, MessageSchema> = {
  en,
  de,
};

export const DEFAULT_LOCALE: LocaleCode = 'de';
export const FALLBACK_LOCALE: LocaleCode = 'en';
export default messages;
