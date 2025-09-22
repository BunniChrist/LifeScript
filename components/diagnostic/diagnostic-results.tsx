'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useLocale } from '@/components/providers/next-intl-provider';
import { useFreeDiagnostic, computeSummary } from '@/store/free-diagnostic';
import {
  aggregateDomain,
  toChartData,
  MODE_LABELS,
  type DiagnosticSummary,
  type CriterionResult
} from '@/src/lib/scoring';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const Radar = dynamic(() => import('@/components/diagnostic/radar-chart'), { ssr: false });
const Line = dynamic(() => import('@/components/diagnostic/line-chart'), { ssr: false });

export function DiagnosticResults() {
  const locale = useLocale();
  const answers = useFreeDiagnostic((state) => state.answers);
  const summary = useMemo(() => buildSummary(answers), [answers]);

  const chartData = useMemo(() => toChartData(summary), [summary]);

  const handleCsv = () => {
    const rows = summary.domains.flatMap((domain) =>
      domain.criteria.map((criterion) => [
        domain.title,
        criterion.title,
        criterion.answers.map((answer) => (answer ? 'YES' : 'NO')).join(','),
        criterion.mode
      ])
    );
    const header = 'Domain,Criterion,Satisfied/Know/Commit,Mode\n';
    const csv = header + rows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'life-script-diagnostic.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleJson = () => {
    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'life-script-diagnostic.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">Summary</h2>
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="outline" onClick={handleCsv} className="no-print">
            <Download className="mr-2 h-4 w-4" /> CSV
          </Button>
          <Button type="button" variant="outline" onClick={handleJson} className="no-print">
            <Download className="mr-2 h-4 w-4" /> JSON
          </Button>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {summary.domains.map((domain) => (
          <div key={domain.key} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">{domain.title}</h3>
              <Badge variant={domain.mode}>{MODE_LABELS[domain.mode][locale]}</Badge>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Average score: {domain.score.toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Radar</h3>
          <Radar data={chartData.radar} />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Evolution</h3>
          <Line data={chartData.line} />
        </div>
      </div>
    </section>
  );
}

function buildSummary(answers: ReturnType<typeof useFreeDiagnostic.getState>['answers']): DiagnosticSummary {
  const criteria = computeSummary(answers) as CriterionResult[];
  const grouped = criteria.reduce<Record<string, CriterionResult[]>>((acc, result) => {
    acc[result.domain] = acc[result.domain] ?? [];
    acc[result.domain].push(result);
    return acc;
  }, {});
  const domains = Object.values(grouped).map((items) => aggregateDomain(items));
  const totalScore = domains.reduce((acc, domain) => acc + domain.score, 0);
  const average = domains.length ? totalScore / domains.length : 0;
  const mode = average < 1.5 ? 'survival' : average < 2.5 ? 'existential' : 'life';
  return { domains, score: average, mode };
}
