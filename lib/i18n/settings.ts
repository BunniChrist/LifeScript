export const languages = ['en', 'fr'] as const;
export type AppLanguage = (typeof languages)[number];

export const defaultLanguage: AppLanguage = 'en';
