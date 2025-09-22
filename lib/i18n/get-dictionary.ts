import type { AppLanguage } from './settings';

const dictionaries = {
  en: () => import('@/public/locales/en/common.json').then((module) => module.default),
  fr: () => import('@/public/locales/fr/common.json').then((module) => module.default)
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)['en']>>;

export async function getDictionary(locale: AppLanguage): Promise<Dictionary> {
  const loader = dictionaries[locale];
  return loader();
}
