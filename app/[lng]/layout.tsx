import type { Metadata } from 'next';
import { dir } from 'i18next';
import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import { languages } from '@/lib/i18n/settings';
import { NextIntlClientProvider } from '@/components/providers/next-intl-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Life Script',
  description:
    'The simple, fast and holistic life check-up to move from Survival Mode to Life Mode.'
};

export function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export default function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { lng: string };
}) {
  const { lng } = params;

  if (!languages.includes(lng as (typeof languages)[number])) {
    notFound();
  }

  return (
    <html lang={lng} dir={dir(lng)}>
      <body className={`${inter.className} bg-white text-slate-900`}>
        <NextIntlClientProvider locale={lng}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <div className="flex min-h-screen flex-col">
              {/* @ts-expect-error Async Server Component */}
              <Header locale={lng} />
              <main className="flex-1">{children}</main>
              <Footer locale={lng} />
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
