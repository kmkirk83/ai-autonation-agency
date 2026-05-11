# AI AutoNation Agency

A full-stack AI automation agency platform for selling AI voice agents and automation services to HVAC and home service businesses. Features lead management, Stripe payments, outreach tools, and an admin dashboard.

## Features

- **Agency Landing Page** — Conversion-optimized homepage with pricing tiers for AI automation services
- **Lead Management** — Capture, track, and nurture leads with built-in CRM
- **HVAC Templates** — Pre-built outreach templates tailored for HVAC and home service industries
- **Stripe Payments** — Full checkout flow with products, subscriptions, and webhook handling
- **Admin Dashboard** — Manage leads, orders, outreach assets, and business metrics
- **Outreach Assets** — Marketing materials and campaign management tools
- **Notification System** — Server-side notifications for lead activity and order updates
- **Database Migrations** — Drizzle ORM with versioned SQL migrations

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, TypeScript, Vite, Radix UI, Tailwind CSS |
| Backend | Node.js, Express (TSX), TypeScript |
| Database | PostgreSQL via Drizzle ORM |
| Payments | Stripe (checkout, products, webhooks) |
| Storage | AWS S3 |
| Testing | Vitest |
| Package Manager | pnpm |

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/          # Home, Pricing, AdminDashboard, Orders, OutreachAssets
│   │   └── components/     # Reusable UI components
├── server/                 # Express backend
│   ├── routers/            # API routes (payments)
│   ├── stripe/             # Stripe integration (checkout, products, webhooks)
│   ├── hvacTemplates.ts    # HVAC industry outreach templates
│   ├── storage.ts          # Data persistence
│   └── db.ts               # Database connection
├── drizzle/                # Database schema, relations, and migrations
├── scripts/                # Automation and job scripts
└── shared/                 # Shared types and constants
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Configure environment
cp .env.example .env
# Set: DATABASE_URL, STRIPE_SECRET_KEY, AWS credentials

# Run database migrations
pnpm db:push

# Start development server
pnpm dev

# Build for production
pnpm build && pnpm start
```

## Documentation

- [Deployment Runbook](./DEPLOYMENT_RUNBOOK.md)
- [Stripe Integration](./STRIPE_INTEGRATION.md)
- [Automation Setup](./AUTOMATION_SETUP.md)

## Testing

```bash
pnpm test
```

## License

MIT
