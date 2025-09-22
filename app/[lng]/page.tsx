import Link from 'next/link';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { type AppLanguage } from '@/lib/i18n/settings';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const dynamic = 'force-static';

export default async function LandingPage({ params }: { params: { lng: AppLanguage } }) {
  const locale = params.lng;
  const dictionary = await getDictionary(locale);

  return (
    <div className="bg-white">
      <Hero dictionary={dictionary} locale={locale} />
      <HowItWorks dictionary={dictionary} />
      <Benefits dictionary={dictionary} />
      <DashboardPreview locale={locale} />
      <TestimonialsPlaceholder locale={locale} />
    </div>
  );
}

function Hero({ dictionary, locale }: { dictionary: any; locale: AppLanguage }) {
  const booking = process.env.NEXT_PUBLIC_BOOKING_URL ?? '#contact';
  return (
    <section className="bg-gradient-to-b from-slate-50 to-white pb-20 pt-16">
      <div className="container mx-auto grid gap-10 px-4 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            {dictionary.hero.title}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            {dictionary.hero.subtitle}
          </h1>
          <p className="text-lg text-slate-600">{dictionary.hero.line}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href={`/${locale}/free`}>{dictionary.hero.cta}</Link>
            </Button>
            <Button asChild variant="outline">
              <a href={booking} target="_blank" rel="noopener noreferrer">
                {dictionary.hero.ctaSecondary}
              </a>
            </Button>
          </div>
        </div>
        <div className="relative hidden h-full w-full overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xl md:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.08),transparent)]" />
          <div className="relative space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Mind · Soul · Body</h2>
            <p className="text-sm text-slate-600">
              Survival Mode / Existential Mode / Life Mode — visualised through accessible charts and summaries.
            </p>
            <div className="grid grid-cols-3 gap-3 text-xs">
              {['Mind', 'Soul', 'Body'].map((label) => (
                <div key={label} className="rounded-xl border border-slate-200 p-4 text-center shadow-sm">
                  <p className="font-semibold text-slate-700">{label}</p>
                  <p className="text-xs text-green-600">Life Mode</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-700">Global summary</p>
              <p className="text-xs text-slate-500">
                Track your evolution with radar and line charts powered by Chart.js.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks({ dictionary }: { dictionary: any }) {
  const steps = dictionary.how.steps as Array<{ title: string; description: string }>;
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto space-y-8 px-4">
        <h2 className="text-3xl font-semibold text-slate-900">{dictionary.how.title}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={step.title} className="h-full">
              <div className="space-y-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
                <p className="text-sm text-slate-600">{step.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Benefits({ dictionary }: { dictionary: any }) {
  const items = dictionary.benefits.items as Array<{ title: string; description: string }>;
  return (
    <section className="bg-slate-50 py-16">
      <div className="container mx-auto space-y-8 px-4">
        <h2 className="text-3xl font-semibold text-slate-900">{dictionary.benefits.title}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <Card key={item.title} className="h-full">
              <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm text-slate-600">{item.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardPreview({ locale }: { locale: AppLanguage }) {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto grid gap-10 px-4 md:grid-cols-2 md:items-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-slate-900">Dashboard</h2>
          <p className="text-sm text-slate-600">
            Visualise every domain with radar and line charts, download CSV/JSON and compare the last three entries.
          </p>
          <Button asChild>
            <Link href={`/${locale}/pro`}>Explore Pro</Link>
          </Button>
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-100 via-white to-slate-200 p-8 shadow-xl">
          <div className="grid gap-6">
            <div className="h-32 rounded-2xl bg-white/60 p-4 shadow-inner">
              <p className="text-xs uppercase tracking-wide text-slate-500">Radar chart</p>
              <div className="mt-4 h-20 rounded-full bg-gradient-to-r from-survival/60 via-existential/60 to-life/60" />
            </div>
            <div className="h-32 rounded-2xl bg-white/60 p-4 shadow-inner">
              <p className="text-xs uppercase tracking-wide text-slate-500">Timeline</p>
              <div className="mt-4 h-20 rounded-lg bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsPlaceholder({ locale }: { locale: AppLanguage }) {
  return (
    <section className="bg-slate-900 py-16 text-white">
      <div className="container mx-auto space-y-6 px-4 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-slate-300">Testimonials</p>
        <h2 className="text-3xl font-semibold">Coming soon</h2>
        <p className="mx-auto max-w-2xl text-sm text-slate-200">
          We are collecting stories from early users as they shift from Survival Mode to Life Mode. Want to contribute?
          <Link href={`/${locale}/contact`} className="ml-1 underline">
            Get in touch
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
