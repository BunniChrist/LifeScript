import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { defaultLanguage } from '@/lib/i18n/settings';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Life Script',
  description:
    'The simple, fast and holistic life check-up to move from Survival Mode to Life Mode.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={defaultLanguage}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
