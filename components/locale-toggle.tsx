'use client';

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { languages } from '@/lib/i18n/settings';

export function LocaleToggle({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const alternate = languages.find((lng) => lng !== currentLocale) ?? 'en';

  const handleToggle = () => {
    if (!pathname) return;
    const segments = pathname.split('/');
    segments[1] = alternate;
    const nextPath = '/' + segments.filter(Boolean).join('/');
    router.push(nextPath);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium uppercase text-slate-600 hover:bg-slate-100"
    >
      {alternate}
    </button>
  );
}
