'use client';

import { DiagnosticTable } from '@/components/diagnostic/diagnostic-table';
import { DiagnosticResults } from '@/components/diagnostic/diagnostic-results';
import { Button } from '@/components/ui/button';
import { useFreeDiagnostic } from '@/store/free-diagnostic';
import type { AppLanguage } from '@/lib/i18n/settings';

interface Props {
  locale: AppLanguage;
  dictionary: any;
}

export function FreeDiagnosticExperience({ dictionary, locale }: Props) {
  const reset = useFreeDiagnostic((state) => state.reset);

  return (
    <div className="space-y-10 bg-white px-4 py-10">
      <div className="container mx-auto space-y-6">
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
          {dictionary.diagnostic.freeBanner}
        </div>
        <DiagnosticTable />
        <DiagnosticResults />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-x-3">
            <Button type="button" variant="outline" onClick={() => window.print()} className="no-print">
              {dictionary.diagnostic.print}
            </Button>
            <Button asChild variant="outline" className="no-print">
              <a href={process.env.NEXT_PUBLIC_BOOKING_URL ?? '#contact'} target="_blank" rel="noopener noreferrer">
                {dictionary.diagnostic.book}
              </a>
            </Button>
          </div>
          <Button type="button" variant="ghost" onClick={reset} className="no-print">
            Reset
          </Button>
        </div>
      </div>
      <Ads />
    </div>
  );
}

function Ads() {
  if (process.env.NEXT_PUBLIC_SHOW_ADS === 'false') return null;
  return (
    <aside className="container mx-auto grid gap-4 md:grid-cols-[minmax(0,1fr)_280px]">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
          Mobile ad placeholder
        </div>
        <div className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
          Coaching prompt
        </div>
      </div>
      <div className="hidden rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 md:block">
        Desktop rail ad placeholder
      </div>
    </aside>
  );
}
