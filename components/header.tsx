import Link from 'next/link';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import type { AppLanguage } from '@/lib/i18n/settings';
import { Button } from '@/components/ui/button';

export async function Header({ locale }: { locale: AppLanguage }) {
  const dictionary = await getDictionary(locale);
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href={`/${locale}`} className="text-lg font-semibold text-slate-900">
          Life Script
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          <Link href={`/${locale}/free`} className="hover:text-slate-900">
            {dictionary.nav.free}
          </Link>
          <Link href={`/${locale}/pro`} className="hover:text-slate-900">
            {dictionary.nav.pro}
          </Link>
          <Link href={`/${locale}/pricing`} className="hover:text-slate-900">
            {dictionary.nav.pricing}
          </Link>
          <Link href={`/${locale}/contact`} className="hover:text-slate-900">
            {dictionary.nav.contact}
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Button asChild size="sm">
            <Link href={`/${locale}/free`}>{dictionary.hero.cta}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
