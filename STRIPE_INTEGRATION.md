# Stripe Payment Integration Guide

This document describes the complete Stripe payment integration for the AI Automation Agency landing page.

## Architecture Overview

The payment system consists of:

1. **Frontend**: Pricing page and checkout UI
2. **Backend**: tRPC procedures for payment operations
3. **Database**: Orders and subscriptions tables
4. **Webhooks**: Stripe event handlers for payment confirmations

## Products & Pricing

### One-Time Services ($2,500 each)
- AI Voice Receptionist
- Lead Reactivation Bot
- Customer Support Automation

### Subscription Plans (Monthly)
- Starter Plan: $999/month
- Professional Plan: $1,999/month
- Enterprise Plan: $4,999/month

## Setup Instructions

### 1. Configure Stripe Keys

Go to **Settings → Payment** in the Management UI and add:
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Your webhook signing secret
- `VITE_STRIPE_PUBLISHABLE_KEY`: Your publishable key

### 2. Claim Stripe Sandbox

Visit: https://dashboard.stripe.com/claim_sandbox/[YOUR_SANDBOX_ID]

This must be completed before 2026-06-09T15:48:45.000Z

### 3. Test Payment Processing

Use test card: **4242 4242 4242 4242**
- Expiry: Any future date
- CVC: Any 3 digits

### 4. Webhook Configuration

The webhook endpoint is: `/api/stripe/webhook`

Add this URL to your Stripe Dashboard:
- Settings → Webhooks → Add endpoint
- URL: `https://your-domain.com/api/stripe/webhook`
- Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

## Database Schema

### Orders Table
```sql
- id: Primary key
- userId: Reference to user
- stripePaymentIntentId: Stripe payment identifier
- stripeCheckoutSessionId: Checkout session ID
- amount: Amount in cents
- currency: Currency code (usd)
- status: pending | completed | failed | canceled
- items: JSON array of purchased items
- metadata: Additional order metadata
- createdAt: Order creation timestamp
- updatedAt: Last update timestamp
```

### Subscriptions Table
```sql
- id: Primary key
- userId: Reference to user
- stripeSubscriptionId: Stripe subscription identifier
- stripePriceId: Stripe price identifier
- status: active | paused | canceled | past_due
- currentPeriodStart: Current billing period start
- currentPeriodEnd: Current billing period end
- canceledAt: Cancellation timestamp
- createdAt: Creation timestamp
- updatedAt: Last update timestamp
```

## API Endpoints

### Get Available Products
```typescript
trpc.payments.getProducts.useQuery()
// Returns: { oneTime: [...], subscriptions: [...] }
```

### Create Checkout Session
```typescript
trpc.payments.createCheckout.useMutation({
  productKey: string,
  successUrl: string,
  cancelUrl: string
})
// Returns: { checkoutUrl: string, sessionId: string }
```

### Get User Orders
```typescript
trpc.payments.getOrders.useQuery()
// Returns: Order[]
```

### Get User Subscriptions
```typescript
trpc.payments.getSubscriptions.useQuery()
// Returns: Subscription[]
```

### Cancel Subscription
```typescript
trpc.payments.cancelSubscription.useMutation({
  subscriptionId: number
})
// Returns: { success: boolean }
```

## Webhook Events

### checkout.session.completed
Fired when a customer completes checkout. Creates an order or subscription record.

### payment_intent.succeeded
Fired when payment is successfully processed.

### customer.subscription.updated
Fired when a subscription is updated. Updates subscription status and billing period.

### customer.subscription.deleted
Fired when a subscription is canceled. Updates status to "canceled".

## Pages

### /pricing
Displays all available products and subscription plans. Users can purchase directly from this page.

### /orders
Shows user's order history with payment details and status.

## Testing Checklist

- [ ] Test one-time purchase flow
- [ ] Test subscription purchase flow
- [ ] Verify webhook events are received
- [ ] Test order history display
- [ ] Test subscription management
- [ ] Verify email notifications (if configured)
- [ ] Test with live Stripe keys after KYC verification

## Troubleshooting

### Webhook Not Received
1. Check Stripe Dashboard → Developers → Webhooks
2. Verify webhook endpoint is publicly accessible
3. Check server logs for webhook processing errors

### Payment Failed
1. Verify Stripe keys are correct
2. Check Stripe Dashboard for error details
3. Ensure database is accessible

### Missing Orders
1. Verify webhook handler is running
2. Check database connection
3. Review server logs for errors

## Production Deployment

1. Complete Stripe KYC verification
2. Switch to live API keys
3. Update webhook endpoint URL to production domain
4. Test payment flow with real cards
5. Enable email notifications
6. Set up monitoring and alerts

## Support

For issues, check:
- Stripe Dashboard: https://dashboard.stripe.com
- Stripe Documentation: https://stripe.com/docs
- Project logs: `.manus-logs/` directory
