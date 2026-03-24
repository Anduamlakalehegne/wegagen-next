import { en } from "./messages/en";
import { am } from "./messages/am";

export const SUPPORTED_LOCALES = ["en", "am"];
export const DEFAULT_LOCALE = "en";

const messagesByLocale = { en, am };

export function getMessages(locale) {
  return messagesByLocale[locale] || messagesByLocale[DEFAULT_LOCALE];
}

export function isSupportedLocale(locale) {
  return SUPPORTED_LOCALES.includes(locale);
}
