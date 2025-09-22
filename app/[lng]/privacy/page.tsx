import type { AppLanguage } from '@/lib/i18n/settings';

export default function PrivacyPage({ params }: { params: { lng: AppLanguage } }) {
  return (
    <section className="prose prose-slate mx-auto px-4 py-16">
      <h1>Privacy Policy</h1>
      <p>
        Life Script respects your privacy. We store only the diagnostic entries you explicitly save in your Pro account. You can
        export or delete your data at any time. Email support@lifescript.app for questions.
      </p>
      <h2>Data retention</h2>
      <p>
        Diagnostic entries are kept until you delete them or close your account. Free diagnostics never leave your device.
      </p>
      <h2>Cookies</h2>
      <p>Authentication cookies are required for the Pro dashboard. Analytics is optional and disabled by default.</p>
    </section>
  );
}
