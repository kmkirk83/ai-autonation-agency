import Stripe from "stripe";
import { Request, Response } from "express";
import { ENV } from "../_core/env";
import { getDb } from "../db";
import { orders, subscriptions, users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(ENV.stripeSecretKey);

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      ENV.stripeWebhookSecret
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(200).json({ verified: false, error: err.message });
  }

  // Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({ verified: true });
  }

  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = parseInt(session.client_reference_id || "0");
        const metadata = session.metadata || {};

        if (session.mode === "payment") {
          // Handle one-time payment
          const paymentIntent = await stripe.paymentIntents.retrieve(
            session.payment_intent as string
          );

          await db.insert(orders).values({
            userId,
            stripePaymentIntentId: paymentIntent.id,
            stripeCheckoutSessionId: session.id,
            amount: session.amount_total || 0,
            currency: session.currency || "usd",
            status: "completed",
            items: JSON.stringify([
              {
                productKey: metadata.product_key,
                quantity: 1,
              },
            ]),
            metadata: JSON.stringify(metadata),
          });

          console.log(`✅ Order created for user ${userId}`);
        } else if (session.mode === "subscription") {
          // Handle subscription
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          const sub = subscription as any;
          await db.insert(subscriptions).values({
            userId,
            stripeSubscriptionId: subscription.id,
            stripePriceId: (subscription.items.data[0]?.price.id as string) || "",
            status: "active",
            currentPeriodStart: new Date(sub.current_period_start * 1000),
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
          });

          console.log(`✅ Subscription created for user ${userId}`);
        }

        // Update user's Stripe customer ID
        if (!metadata.stripe_customer_id) {
          await db
            .update(users)
            .set({ stripeCustomerId: session.customer as string })
            .where(eq(users.id, userId));
        }

        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`✅ Payment succeeded: ${paymentIntent.id}`);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = parseInt(subscription.metadata?.user_id || "0");

        if (userId) {
          const sub = subscription as any;
          await db
            .update(subscriptions)
            .set({
              status: subscription.status as any,
              currentPeriodStart: new Date(sub.current_period_start * 1000),
              currentPeriodEnd: new Date(sub.current_period_end * 1000),
            })
            .where(eq(subscriptions.stripeSubscriptionId, subscription.id));

          console.log(`✅ Subscription updated for user ${userId}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = parseInt(subscription.metadata?.user_id || "0");

        if (userId) {
          await db
            .update(subscriptions)
            .set({
              status: "canceled",
              canceledAt: new Date(),
            })
            .where(eq(subscriptions.stripeSubscriptionId, subscription.id));

          console.log(`✅ Subscription canceled for user ${userId}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ verified: true, received: true });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    res.status(200).json({ verified: true, error: error.message });
  }
}
