import { Router, Request, Response } from "express";
import { handleStripeWebhook } from "../stripe/webhooks";

export function createStripeWebhookRouter() {
  const router = Router();

  // Stripe webhook endpoint - must use raw body parser
  router.post("/stripe/webhook", async (req: Request, res: Response) => {
    await handleStripeWebhook(req, res);
  });

  return router;
}
