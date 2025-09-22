import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { AppLanguage } from '@/lib/i18n/settings';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { ProDashboard } from '@/components/pro/pro-dashboard';

export const dynamic = 'force-dynamic';

export default async function ProPage({ params }: { params: { lng: AppLanguage } }) {
  const session = await auth();
  if (!session?.user) {
    redirect(`/api/auth/signin?callbackUrl=/${params.lng}/pro`);
  }

  const [subscription, entries, dictionary] = await Promise.all([
    prisma.subscription.findUnique({ where: { userId: session.user.id } }),
    prisma.entry.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    }),
    getDictionary(params.lng)
  ]);

  const activeStatuses = ['active', 'trialing'];
  const isActive = subscription ? activeStatuses.includes(subscription.status) : false;

  return (
    <ProDashboard
      locale={params.lng}
      userId={session.user.id}
      entries={entries}
      subscription={subscription}
      dictionary={dictionary}
      isActive={isActive}
    />
  );
}
