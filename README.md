# Life Script

Life Script is a bilingual (EN/FR) life diagnostic platform built with Next.js 14, Prisma and Stripe. It provides a free self-assessment and a paid dashboard for long-term tracking.

## Features

- Mobile-first, WCAG AA conscious design.
- Free diagnostic (/free) with client-only state, CSV export and print stylesheet.
- Paid dashboard (/pro) gated by subscriptions (Stripe) with history, comparisons and exports.
- Internationalisation with next-i18next (English, French).
- GDPR consent handling and user deletion.
- Admin overview (/admin) for user and subscription insights.
- Vitest coverage for core scoring utilities.

## Getting started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

```bash
npm install
```

### Environment variables

Copy `.env.example` to `.env` and provide the following values:

```
DATABASE_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
EMAIL_SERVER_HOST=
EMAIL_SERVER_PORT=
EMAIL_SERVER_USER=
EMAIL_SERVER_PASSWORD=
EMAIL_FROM=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_BOOKING_URL=
NEXT_PUBLIC_SHOW_ADS=
```

### Prisma

Generate the Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate deploy
```

### Development

```bash
npm run dev
```

### Testing

```bash
npm run test
```

### Linting

```bash
npm run lint
```

### Production build

```bash
npm run build
```

## Deployment

The project is optimised for Vercel deployments. Configure the environment variables above and set up Stripe webhook forwarding.
