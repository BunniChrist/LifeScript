import type { AppLanguage } from '@/lib/i18n/settings';

export default function TermsPage({ params }: { params: { lng: AppLanguage } }) {
  return (
    <section className="prose prose-slate mx-auto px-4 py-16">
      <h1>Terms & Conditions</h1>
      <p>Life Script offers guidance but does not replace professional medical or legal advice.</p>
      <h2>Subscriptions</h2>
      <p>
        Subscriptions renew monthly and can be cancelled anytime via the Stripe customer portal. Refunds follow local consumer
        laws.
      </p>
      <h2>Use of service</h2>
      <p>
        You are responsible for the accuracy of your answers. Misuse, scraping or reselling the platform is prohibited.
      </p>
    </section>
  );
}
