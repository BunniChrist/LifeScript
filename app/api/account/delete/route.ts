import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  await prisma.entry.deleteMany({ where: { userId: session.user.id } });
  await prisma.subscription.deleteMany({ where: { userId: session.user.id } });
  await prisma.user.delete({ where: { id: session.user.id } });

  return NextResponse.json({ success: true });
}
