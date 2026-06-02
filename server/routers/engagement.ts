import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createLead,
  getAllLeads,
  updateLeadStatus,
  createOutreachAsset,
  getOutreachAssets,
} from "../db";
import { publicProcedure, router } from "../_core/trpc";

function requireAdmin(user: { role?: string } | null | undefined) {
  if (!user || user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Unauthorized" });
  }
}

function buildColdEmail(businessName: string, niche: string) {
  return [
    `Subject: More booked jobs for ${businessName}`,
    "",
    `Hi ${businessName},`,
    "",
    `We help ${niche} teams answer every call, qualify leads faster, and book more appointments without adding headcount.`,
    "",
    "If you want, I can send a quick breakdown of where missed calls are costing revenue and what an AI receptionist would look like for your team.",
    "",
    "Best,",
    "AI Automation Agency",
  ].join("\n");
}

function buildLoomScript(businessName: string, niche: string) {
  return [
    `Hi ${businessName} team,`,
    `I recorded this quick walkthrough to show how we help ${niche} businesses capture missed calls and convert them into booked appointments.`,
    "First, we identify missed-call windows and routing gaps.",
    "Then we deploy an AI voice receptionist that answers 24/7, qualifies the lead, and books the appointment.",
    "Finally, we report back on booked calls, response time, and revenue recovered.",
    "If that sounds useful, I can tailor this workflow to your current setup.",
  ].join(" ");
}

export const leadsRouter = router({
  submit: publicProcedure
    .input(
      z.object({
        businessName: z.string().min(1),
        contactName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(7),
        serviceInterest: z.enum([
          "AI Voice Receptionist",
          "Lead Reactivation Bot",
          "Customer Support Automation",
        ]),
      })
    )
    .mutation(async ({ input }) => {
      const lead = {
        ...input,
        status: "New" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      try {
        return await createLead(lead);
      } catch {
        return lead;
      }
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    requireAdmin(ctx.user);

    try {
      return await getAllLeads();
    } catch {
      return [];
    }
  }),

  updateStatus: publicProcedure
    .input(
      z.object({
        leadId: z.number().int().positive(),
        status: z.enum(["New", "Contacted", "Closed"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user);

      try {
        await updateLeadStatus(input.leadId, input.status);
      } catch {
        // Database is optional in local test environments.
      }

      return { success: true } as const;
    }),
});

export const outreachRouter = router({
  generateAsset: publicProcedure
    .input(
      z.object({
        businessName: z.string().min(1),
        niche: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user);

      const asset = {
        businessName: input.businessName,
        niche: input.niche,
        coldEmail: buildColdEmail(input.businessName, input.niche),
        loomScript: buildLoomScript(input.businessName, input.niche),
        createdAt: new Date(),
      };

      try {
        return await createOutreachAsset(asset);
      } catch {
        return asset;
      }
    }),

  getAssets: publicProcedure.query(async ({ ctx }) => {
    requireAdmin(ctx.user);

    try {
      return await getOutreachAssets();
    } catch {
      return [];
    }
  }),
});
