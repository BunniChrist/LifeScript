import { getDictionary } from '@/lib/i18n/get-dictionary';
import type { AppLanguage } from '@/lib/i18n/settings';
import { Button } from '@/components/ui/button';

export default async function PricingPage({ params }: { params: { lng: AppLanguage } }) {
  const dictionary = await getDictionary(params.lng);
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">{dictionary.pricing.title}</h1>
        <p className="mt-4 text-slate-600">{dictionary.pricing.trial}</p>
        <div className="mt-8 rounded-2xl border border-slate-200 p-6">
          <p className="text-2xl font-semibold text-slate-900">{dictionary.pricing.monthly}</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {dictionary.pricing.features.map((feature: string) => (
              <li key={feature}>• {feature}</li>
            ))}
          </ul>
          <form action="/api/stripe/checkout" method="post" className="mt-6">
            <Button type="submit" className="w-full">
              {dictionary.pricing.cta}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
