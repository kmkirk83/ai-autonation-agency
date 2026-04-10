import Stripe from "stripe";
import { ENV } from "../_core/env";

const stripe = new Stripe(ENV.stripeSecretKey);

export async function createCheckoutSession(options: {
  userId: number;
  userEmail: string;
  userName: string;
  productKey: string;
  priceInCents: number;
  currency: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: options.userEmail,
    client_reference_id: options.userId.toString(),
    metadata: {
      user_id: options.userId.toString(),
      customer_email: options.userEmail,
      customer_name: options.userName,
      product_key: options.productKey,
    },
    line_items: [
      {
        price_data: {
          currency: options.currency,
          product_data: {
            name: options.productKey,
            description: `AI Automation Service - ${options.productKey}`,
          },
          unit_amount: options.priceInCents,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: options.successUrl,
    cancel_url: options.cancelUrl,
    allow_promotion_codes: true,
  });

  return session;
}

export async function createSubscriptionSession(options: {
  userId: number;
  userEmail: string;
  userName: string;
  stripePriceId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: options.userEmail,
    client_reference_id: options.userId.toString(),
    metadata: {
      user_id: options.userId.toString(),
      customer_email: options.userEmail,
      customer_name: options.userName,
    },
    line_items: [
      {
        price: options.stripePriceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: options.successUrl,
    cancel_url: options.cancelUrl,
    allow_promotion_codes: true,
  });

  return session;
}
