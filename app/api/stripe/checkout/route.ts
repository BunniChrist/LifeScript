import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2023-10-16'
});

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) {
    return new NextResponse('Missing price', { status: 500 });
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: session.user.email ?? undefined,
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      metadata: {
        userId: session.user.id
      }
    },
    success_url: `${process.env.NEXTAUTH_URL}/pro?success=1`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pricing`
  });

  return NextResponse.json({ url: checkout.url });
}
