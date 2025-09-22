import { getDictionary } from '@/lib/i18n/get-dictionary';
import type { AppLanguage } from '@/lib/i18n/settings';

export default async function ContactPage({ params }: { params: { lng: AppLanguage } }) {
  const dictionary = await getDictionary(params.lng);
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">{dictionary.contact.title}</h1>
        <p className="mt-4 text-slate-600">{dictionary.contact.description}</p>
      </div>
    </section>
  );
}
