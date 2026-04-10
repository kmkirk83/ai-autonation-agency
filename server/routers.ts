import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { createLead, getAllLeads, updateLeadStatus, createOutreachAsset, getOutreachAssets } from "./db";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  leads: router({
    submit: publicProcedure
      .input(
        z.object({
          businessName: z.string().min(1),
          contactName: z.string().min(1),
          email: z.string().email(),
          phone: z.string().min(10),
          serviceInterest: z.enum(["AI Voice Receptionist", "Lead Reactivation Bot", "Customer Support Automation"]),
        })
      )
      .mutation(async ({ input }) => {
        const lead = await createLead({
          businessName: input.businessName,
          contactName: input.contactName,
          email: input.email,
          phone: input.phone,
          serviceInterest: input.serviceInterest,
          status: "New",
        });
        // Notify owner of new lead
        await notifyOwner({
          title: "New Lead Submission",
          content: `${input.contactName} from ${input.businessName} is interested in ${input.serviceInterest}. Email: ${input.email}, Phone: ${input.phone}`,
        });
        return lead;
      }),
    getAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
      return await getAllLeads();
    }),
    updateStatus: protectedProcedure
      .input(
        z.object({
          leadId: z.number(),
          status: z.enum(["New", "Contacted", "Closed"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        await updateLeadStatus(input.leadId, input.status);
        return { success: true };
      }),
  }),

  outreach: router({
    generateAsset: protectedProcedure
      .input(
        z.object({
          businessName: z.string().min(1),
          niche: z.string().min(1),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        
        // Generate cold email using LLM
        const emailResponse = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "You are an expert AI automation agency sales copywriter. Generate a hyper-personalized, high-converting cold email for a specific business. The email should be copy-ready with no additional editing required. Keep it concise, compelling, and focused on ROI.",
            },
            {
              role: "user",
              content: `Generate a cold email for ${input.businessName} in the ${input.niche} industry. The email should pitch AI voice receptionist services that can capture missed calls and increase revenue. Make it specific to their industry pain points. Include a subject line at the top.`,
            },
          ],
        });

        // Generate Loom script using LLM
        const scriptResponse = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "You are an expert at creating short, punchy Loom video scripts for AI automation services. Generate a 60-second script that hooks the viewer immediately, demonstrates the problem, and presents the AI solution. The script should be copy-ready and ready to record.",
            },
            {
              role: "user",
              content: `Generate a Loom video script for ${input.businessName} in the ${input.niche} industry. Focus on the pain of missed calls and how an AI voice receptionist solves it. Make it specific to their business model and pain points. Include timing cues.`,
            },
          ],
        });

        const coldEmailContent = emailResponse.choices[0]?.message.content;
        const coldEmail = typeof coldEmailContent === "string" ? coldEmailContent : "";
        
        const loomScriptContent = scriptResponse.choices[0]?.message.content;
        const loomScript = typeof loomScriptContent === "string" ? loomScriptContent : "";

        const asset = await createOutreachAsset({
          businessName: input.businessName,
          niche: input.niche,
          coldEmail: coldEmail || "Failed to generate cold email",
          loomScript: loomScript || "Failed to generate Loom script",
        });

        return asset;
      }),
    getAssets: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
      return await getOutreachAssets();
    }),
  }),
});

export type AppRouter = typeof appRouter;
