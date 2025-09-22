'use client';

import { Check, X } from 'lucide-react';
import { CRITERIA, QUESTIONS } from '@/lib/diagnostic/data';
import { useFreeDiagnostic } from '@/store/free-diagnostic';
import { Badge } from '@/components/ui/badge';
import { MODE_LABELS } from '@/src/lib/scoring';
import { useLocale } from '@/components/providers/next-intl-provider';

const modeVariantMap = {
  survival: 'survival',
  existential: 'existential',
  life: 'life'
} as const;

export function DiagnosticTable() {
  const locale = useLocale();
  const answers = useFreeDiagnostic((state) => state.answers);
  const setAnswer = useFreeDiagnostic((state) => state.setAnswer);

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="sticky left-0 z-10 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase">
              Criterion
            </th>
            {QUESTIONS.map((question) => (
              <th key={question} scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase">
                {question}
              </th>
            ))}
            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase">
              Mode
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {CRITERIA.map((criterion) => {
            const criterionAnswers = answers[criterion.id];
            const yesCount = criterionAnswers.filter(Boolean).length;
            const mode = yesCount <= 1 ? 'survival' : yesCount === 2 ? 'existential' : 'life';
            return (
              <tr key={criterion.id} className="hover:bg-slate-50">
                <th scope="row" className="sticky left-0 z-10 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                  <div>{criterion.title}</div>
                  <p className="text-xs text-slate-500">{criterion.domainLabel}</p>
                </th>
                {criterionAnswers.map((value, index) => (
                  <td key={index} className="px-4 py-3">
                    <Toggle value={value} onChange={(next) => setAnswer(criterion.id, index, next)} />
                  </td>
                ))}
                <td className="px-4 py-3">
                  <Badge variant={modeVariantMap[mode]}>{MODE_LABELS[mode][locale]}</Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (next: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`flex w-full items-center justify-center gap-2 rounded-full border px-3 py-2 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${
        value ? 'border-life bg-life/10 text-life' : 'border-slate-200 bg-white text-slate-600'
      }`}
    >
      {value ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
      {value ? 'YES' : 'NO'}
    </button>
  );
}
