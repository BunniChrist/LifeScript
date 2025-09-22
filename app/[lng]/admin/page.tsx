import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { AppLanguage } from '@/lib/i18n/settings';
import { getDictionary } from '@/lib/i18n/get-dictionary';

export default async function AdminPage({ params }: { params: { lng: AppLanguage } }) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect(`/${params.lng}`);
  }

  const [counts, entries, dictionary] = await Promise.all([
    Promise.all([
      prisma.user.count(),
      prisma.subscription.count({ where: { status: { in: ['active', 'trialing'] } } })
    ]),
    prisma.entry.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
    getDictionary(params.lng)
  ]);

  const [userCount, subCount] = counts;

  return (
    <div className="space-y-10 px-4 py-10">
      <header className="container mx-auto">
        <h1 className="text-3xl font-semibold text-slate-900">{dictionary.admin.title}</h1>
      </header>
      <section className="container mx-auto grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">{dictionary.admin.users}</p>
          <p className="text-3xl font-semibold text-slate-900">{userCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">{dictionary.admin.subscriptions}</p>
          <p className="text-3xl font-semibold text-slate-900">{subCount}</p>
        </div>
      </section>
      <section className="container mx-auto">
        <h2 className="text-xl font-semibold text-slate-900">{dictionary.admin.latest}</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">ID</th>
                <th className="px-4 py-3 text-left font-semibold">User</th>
                <th className="px-4 py-3 text-left font-semibold">Score</th>
                <th className="px-4 py-3 text-left font-semibold">Mode</th>
                <th className="px-4 py-3 text-left font-semibold">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {entries.map((entry) => {
                const summary = entry.summary as any;
                return (
                  <tr key={entry.id}>
                    <td className="px-4 py-3">{entry.id}</td>
                    <td className="px-4 py-3">{entry.userId}</td>
                    <td className="px-4 py-3">{summary.score?.toFixed(2)}</td>
                    <td className="px-4 py-3">{summary.mode}</td>
                    <td className="px-4 py-3">{new Date(entry.createdAt).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
