import { getDictionary } from '@/lib/i18n/get-dictionary';
import type { AppLanguage } from '@/lib/i18n/settings';
import { FreeDiagnosticExperience } from '@/components/free/free-diagnostic';

export default async function FreePage({ params }: { params: { lng: AppLanguage } }) {
  const dictionary = await getDictionary(params.lng);
  return <FreeDiagnosticExperience locale={params.lng} dictionary={dictionary} />;
}
