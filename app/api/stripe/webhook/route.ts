import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get('stripe-signature');
  if (!secret || !signature) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const payload = await request.text();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2023-10-16'
  });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (error) {
    return new NextResponse(`Webhook Error: ${(error as Error).message}`, { status: 400 });
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      if (!userId) {
        break;
      }

      await prisma.subscription.upsert({
        where: { stripeSubscriptionId: subscription.id },
        update: {
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000)
            : null
        },
        create: {
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000)
            : null,
          user: {
            connect: {
              id: userId
            }
          }
        }
      });
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      await prisma.subscription.delete({
        where: { stripeSubscriptionId: subscription.id }
      }).catch(() => undefined);
      break;
    }
    default:
      break;
  }

  return new NextResponse('OK');
}
