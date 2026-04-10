/**
 * Stripe Products & Pricing Configuration
 */

export const STRIPE_PRODUCTS = {
  voiceReceptionist: {
    name: "AI Voice Receptionist",
    description: "24/7 AI-powered phone answering",
    priceInCents: 250000,
    currency: "usd",
    type: "one-time",
    features: ["Unlimited calls", "Lead qualification", "Appointment booking"],
  },
  leadReactivation: {
    name: "Lead Reactivation Bot",
    description: "Automated lead re-engagement",
    priceInCents: 250000,
    currency: "usd",
    type: "one-time",
    features: ["Email sequences", "Lead scoring", "Engagement tracking"],
  },
  customerSupport: {
    name: "Customer Support Automation",
    description: "AI-powered customer support",
    priceInCents: 250000,
    currency: "usd",
    type: "one-time",
    features: ["24/7 support", "Ticket routing", "Knowledge base"],
  },
  starterPlan: {
    name: "Starter Plan",
    description: "Perfect for small businesses",
    priceInCents: 99900,
    currency: "usd",
    type: "subscription",
    interval: "month",
    features: ["1,000 calls/month", "Basic analytics", "Email support"],
  },
  professionalPlan: {
    name: "Professional Plan",
    description: "For growing businesses",
    priceInCents: 199900,
    currency: "usd",
    type: "subscription",
    interval: "month",
    features: ["5,000 calls/month", "Advanced analytics", "Priority support"],
  },
  enterprisePlan: {
    name: "Enterprise Plan",
    description: "Unlimited scale",
    priceInCents: 499900,
    currency: "usd",
    type: "subscription",
    interval: "month",
    features: ["Unlimited calls", "Custom analytics", "24/7 support"],
  },
};

export type ProductKey = keyof typeof STRIPE_PRODUCTS;

export function getProduct(key: ProductKey) {
  return STRIPE_PRODUCTS[key];
}

export function getOneTimeProducts() {
  return Object.entries(STRIPE_PRODUCTS)
    .filter(([_, product]) => product.type === "one-time")
    .map(([key, product]) => ({ key, ...product }));
}

export function getSubscriptionPlans() {
  return Object.entries(STRIPE_PRODUCTS)
    .filter(([_, product]) => product.type === "subscription")
    .map(([key, product]) => ({ key, ...product }));
}
