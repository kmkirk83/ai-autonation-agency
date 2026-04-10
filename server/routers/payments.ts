import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { createCheckoutSession, createSubscriptionSession } from "../stripe/checkout";
import { getProduct, getOneTimeProducts, getSubscriptionPlans } from "../stripe/products";
import { getDb } from "../db";
import { orders, subscriptions } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const paymentsRouter = router({
  /**
   * Get all available products
   */
  getProducts: protectedProcedure.query(async () => {
    return {
      oneTime: getOneTimeProducts(),
      subscriptions: getSubscriptionPlans(),
    };
  }),

  /**
   * Create checkout session for one-time purchase
   */
  createCheckout: protectedProcedure
    .input(
      z.object({
        productKey: z.string(),
        successUrl: z.string(),
        cancelUrl: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const product = getProduct(input.productKey as any);
      if (!product) throw new Error("Product not found");

      const session = await createCheckoutSession({
        userId: ctx.user.id,
        userEmail: ctx.user.email || "",
        userName: ctx.user.name || "Customer",
        productKey: input.productKey,
        priceInCents: product.priceInCents,
        currency: product.currency,
        successUrl: input.successUrl,
        cancelUrl: input.cancelUrl,
      });

      return {
        checkoutUrl: session.url,
        sessionId: session.id,
      };
    }),

  /**
   * Get user's order history
   */
  getOrders: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, ctx.user.id));

    return userOrders.map((order) => ({
      ...order,
      items: JSON.parse(order.items || "[]"),
      metadata: order.metadata ? JSON.parse(order.metadata) : {},
    }));
  }),

  /**
   * Get user's active subscriptions
   */
  getSubscriptions: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    return db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.user.id));
  }),

  /**
   * Cancel subscription
   */
  cancelSubscription: protectedProcedure
    .input(z.object({ subscriptionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const subscription = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.id, input.subscriptionId))
        .limit(1);

      if (!subscription.length || subscription[0].userId !== ctx.user.id) {
        throw new Error("Subscription not found");
      }

      await db
        .update(subscriptions)
        .set({
          status: "canceled",
          canceledAt: new Date(),
        })
        .where(eq(subscriptions.id, input.subscriptionId));

      return { success: true };
    }),
});
