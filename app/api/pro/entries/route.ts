import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { buildSummaryFromAnswers } from '@/lib/diagnostic/summary';

const answersSchema = z.record(z.tuple([z.boolean(), z.boolean(), z.boolean()]));

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = await request.json();
  const parseResult = answersSchema.safeParse(body.answers ?? {});
  if (!parseResult.success) {
    return new NextResponse('Invalid payload', { status: 400 });
  }

  const subscription = await prisma.subscription.findUnique({ where: { userId: session.user.id } });
  const activeStatuses = ['active', 'trialing'];
  if (!subscription || !activeStatuses.includes(subscription.status)) {
    return new NextResponse('Subscription required', { status: 403 });
  }

  const summary = buildSummaryFromAnswers(parseResult.data);
  const entry = await prisma.entry.create({
    data: {
      userId: session.user.id,
      answers: parseResult.data,
      summary
    }
  });
  return NextResponse.json(entry);
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const entries = await prisma.entry.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(entries);
}
