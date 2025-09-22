'use client';

import Link from 'next/link';
import { useTranslation } from '@/hooks/use-translation';
import { LocaleToggle } from '@/components/locale-toggle';

export function Footer({ locale }: { locale: string }) {
  const { t } = useTranslation(locale);

  return (
    <footer className="border-t border-slate-200 bg-white py-8">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-sm md:flex-row">
        <p className="text-center text-slate-500 md:text-left">
          © {new Date().getFullYear()} Life Script. {t('footer.rights')}
        </p>
        <div className="flex items-center gap-4">
          <Link href={`/${locale}/privacy`} className="text-slate-600 hover:text-slate-900">
            {t('footer.privacy')}
          </Link>
          <Link href={`/${locale}/terms`} className="text-slate-600 hover:text-slate-900">
            {t('footer.terms')}
          </Link>
          <Link href={`/${locale}/contact`} className="text-slate-600 hover:text-slate-900">
            {t('footer.contact')}
          </Link>
          <LocaleToggle currentLocale={locale} />
        </div>
      </div>
    </footer>
  );
}
