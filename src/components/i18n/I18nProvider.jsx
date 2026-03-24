"use client";

import { createContext, useContext, useMemo } from "react";

const I18nContext = createContext({
  locale: "en",
  messages: {},
  t: (key) => key,
});

function getByPath(obj, path) {
  return path.split(".").reduce((acc, part) => {
    if (acc && typeof acc === "object" && part in acc) return acc[part];
    return undefined;
  }, obj);
}

export function I18nProvider({ locale, messages, children }) {
  const value = useMemo(() => {
    const t = (key) => {
      const v = getByPath(messages, key);
      return typeof v === "string" ? v : key;
    };

    return { locale, messages, t };
  }, [locale, messages]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
