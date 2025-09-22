import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2023-10-16'
});

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id }
  });
  if (!subscription) {
    return new NextResponse('Subscription not found', { status: 404 });
  }
  const portal = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${process.env.NEXTAUTH_URL}/pro`
  });
  return NextResponse.json({ url: portal.url });
}
