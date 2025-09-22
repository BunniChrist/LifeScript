export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'fr'],
  localeDetection: true
};

export default {
  i18n,
  defaultNS: 'common',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  react: { useSuspense: false }
};
