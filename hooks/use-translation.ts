'use client';

import { useMemo } from 'react';
import commonEn from '@/public/locales/en/common.json';
import commonFr from '@/public/locales/fr/common.json';

type ResourceKey = keyof typeof commonEn | string;

const resources = {
  en: { common: commonEn },
  fr: { common: commonFr }
};

export function useTranslation(locale: string) {
  const fallback = locale in resources ? locale : 'en';
  const translations = useMemo(() => resources[fallback], [fallback]);
  const t = (key: ResourceKey) => {
    const parts = key.split('.');
    let current: any = translations.common;
    for (const part of parts) {
      current = current?.[part];
      if (current === undefined) {
        return key;
      }
    }
    return current as string;
  };

  return { t };
}
