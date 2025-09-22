'use client';

import { createContext, useContext } from 'react';

const LocaleContext = createContext('en');

export function NextIntlClientProvider({
  locale,
  children
}: {
  locale: string;
  children: React.ReactNode;
}) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}
