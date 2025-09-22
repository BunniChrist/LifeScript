'use client';

import { useMemo, useState, useTransition } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MODE_LABELS } from '@/src/lib/scoring';

const LineChart = dynamic(() => import('@/components/diagnostic/line-chart'), { ssr: false });
const RadarChart = dynamic(() => import('@/components/diagnostic/radar-chart'), { ssr: false });

type EntryLike = {
  id: string;
  userId: string;
  createdAt: string | Date;
  answers: any;
  summary: any;
};

type SubscriptionLike = {
  id: string;
  status: string;
  currentPeriodEnd: string | Date | null;
};

interface Props {
  locale: string;
  userId: string;
  entries: EntryLike[];
  subscription: SubscriptionLike | null;
  dictionary: any;
  isActive: boolean;
}

export function ProDashboard({ locale, entries, subscription, dictionary, isActive }: Props) {
  const [uploading, startUpload] = useTransition();
  const [status, setStatus] = useState<string | null>(null);
  const [deleting, startDelete] = useTransition();
  const [consent, setConsent] = useState(false);

  const latestSummary = entries[0]?.summary as any;
  const weakDomain = latestSummary
    ? [...latestSummary.domains].sort((a, b) => a.score - b.score)[0]
    : null;

  const charts = useMemo(() => buildChartData(entries), [entries]);

  const handleUpload = (formData: FormData) => {
    if (!consent) {
      setStatus('Please consent to data storage.');
      return;
    }
    const raw = formData.get('answers');
    if (typeof raw !== 'string' || !raw.trim()) {
      setStatus('Please paste answers JSON.');
      return;
    }
    startUpload(async () => {
      try {
        const res = await fetch('/api/pro/entries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: JSON.parse(raw) })
        });
        if (!res.ok) throw new Error(await res.text());
        setStatus('Entry saved. Refresh to view latest insights.');
      } catch (error) {
        setStatus((error as Error).message);
      }
    });
  };

  const handleBilling = async () => {
    const res = await fetch('/api/stripe/portal', { method: 'POST' });
    if (!res.ok) return;
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  const handleDelete = () => {
    startDelete(async () => {
      await fetch('/api/account/delete', { method: 'POST' });
      window.location.href = '/';
    });
  };

  const handleExport = (format: 'json' | 'csv') => {
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'life-script-entries.json';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const header = 'id,createdAt,mode,score\n';
      const rows = entries.map((entry) => {
        const summary = entry.summary as any;
        return `${entry.id},${entry.createdAt.toISOString()},${summary.mode},${summary.score}`;
      });
      const blob = new Blob([header + rows.join('\n')], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'life-script-entries.csv';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (!isActive) {
    return (
      <section className="px-4 py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">{dictionary.pricing.title}</h1>
          <p className="mt-4 text-slate-600">
            Unlock the Pro dashboard for history, comparisons and exports.
          </p>
          <Button asChild size="lg" className="mt-6">
            <a href={`/${locale}/pricing`}>{dictionary.pricing.cta}</a>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-10 px-4 py-10">
      <header className="container mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Life Script Pro</h1>
          {subscription && (
            <p className="text-sm text-slate-500">
              Status: {subscription.status} · Next renewal:{' '}
              {subscription.currentPeriodEnd
                ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                : '—'}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => handleExport('csv')}>
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport('json')}>
            Export JSON
          </Button>
          <Button variant="ghost" onClick={handleBilling}>
            Manage billing
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            Delete account
          </Button>
        </div>
      </header>

      <section className="container mx-auto space-y-6">
        <h2 className="text-xl font-semibold text-slate-900">Import entries</h2>
        <p className="text-sm text-slate-600">
          Paste the JSON export from your free diagnostic to store and track it over time.
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            handleUpload(formData);
          }}
          className="space-y-4"
        >
          <label className="flex items-start gap-3 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              className="mt-1"
            />
            <span>{dictionary.diagnostic.consent}</span>
          </label>
          <textarea
            name="answers"
            className="min-h-[160px] w-full rounded-2xl border border-slate-300 p-4 text-sm"
            placeholder='{"mission":[true,false,true],...}'
            aria-label="Answers JSON"
          />
          <Button type="submit" disabled={uploading}>
            {uploading ? 'Saving…' : 'Save entry'}
          </Button>
          {status && <p className="text-sm text-slate-500">{status}</p>}
        </form>
      </section>

      <section className="container mx-auto space-y-6">
        <h2 className="text-xl font-semibold text-slate-900">Timeline</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {entries.map((entry) => {
            const summary = entry.summary as any;
            return (
              <div key={entry.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-slate-500">
                      Score {summary.score.toFixed(2)}
                    </p>
                  </div>
                  <Badge variant={summary.mode}>{MODE_LABELS[summary.mode][locale]}</Badge>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {entries.length > 0 && (
        <section className="container mx-auto grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Global evolution</h3>
            <LineChart data={charts.line} />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Domain radar</h3>
            <RadarChart data={charts.radar} />
          </div>
        </section>
      )}

      {weakDomain && (
        <section className="container mx-auto rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          <p>
            Coaching focus suggestion: {weakDomain.title} · currently {weakDomain.score.toFixed(2)} — consider booking a call to
            move toward Life Mode.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <a href={`${process.env.NEXT_PUBLIC_BOOKING_URL ?? '#contact'}?domain=${encodeURIComponent(weakDomain.title)}`}>
              Book a coaching call
            </a>
          </Button>
        </section>
      )}
    </div>
  );
}

function buildChartData(entries: EntryLike[]) {
  const reversed = [...entries].reverse();
  const labels = reversed.map((entry) => new Date(entry.createdAt).toLocaleDateString());
  const scores = reversed.map((entry) => (entry.summary as any).score);
  const last = entries[0]?.summary as any;
  return {
    line: {
      labels,
      datasets: [
        {
          label: 'Global score',
          data: scores,
          borderColor: '#0f172a',
          backgroundColor: 'rgba(15,23,42,0.3)'
        }
      ]
    },
    radar: last
      ? {
          labels: last.domains.map((domain: any) => domain.title),
          datasets: [
            {
              label: 'Latest entry',
              data: last.domains.map((domain: any) => domain.score),
              backgroundColor: 'rgba(21, 128, 61, 0.3)',
              borderColor: '#15803d'
            }
          ]
        }
      : { labels: [], datasets: [] }
  };
}
