/**
 * Lead Scoring & Qualification System
 * Automatically scores and qualifies leads based on multiple factors
 * for prioritized follow-up and conversion optimization.
 */

import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { leads } from "../../drizzle/schema";

export interface LeadScore {
  leadId: number;
  score: number;
  tier: "hot" | "warm" | "cold";
  factors: {
    serviceInterest: number;
    responseTime: number;
    businessType: number;
    engagementLevel: number;
  };
  recommendation: string;
}

/**
 * Calculate lead score based on multiple factors
 * Score range: 0-100
 * Hot: 70-100, Warm: 40-69, Cold: 0-39
 */
export async function scoreLeadAutomatically(leadId: number): Promise<LeadScore> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const lead = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);
  if (!lead.length) throw new Error("Lead not found");

  const leadData = lead[0];
  let score = 0;
  const factors = {
    serviceInterest: 0,
    responseTime: 0,
    businessType: 0,
    engagementLevel: 0,
  };

  // Factor 1: Service Interest (0-30 points)
  // Higher-ticket services get higher scores
  const serviceScores: Record<string, number> = {
    "AI Voice Receptionist": 25,
    "Lead Reactivation Bot": 20,
    "Customer Support Automation": 15,
  };
  factors.serviceInterest = serviceScores[leadData.serviceInterest] || 15;
  score += factors.serviceInterest;

  // Factor 2: Response Time (0-20 points)
  // Leads that fill out form quickly are more engaged
  const createdAt = new Date(leadData.createdAt).getTime();
  const now = new Date().getTime();
  const hoursSinceSubmission = (now - createdAt) / (1000 * 60 * 60);

  if (hoursSinceSubmission < 1) {
    factors.responseTime = 20; // Very fresh lead
  } else if (hoursSinceSubmission < 24) {
    factors.responseTime = 15;
  } else if (hoursSinceSubmission < 72) {
    factors.responseTime = 10;
  } else {
    factors.responseTime = 5;
  }
  score += factors.responseTime;

  // Factor 3: Business Type (0-25 points)
  // HVAC and Plumbing are highest value niches
  const businessTypeScores: Record<string, number> = {
    HVAC: 25,
    Plumbing: 24,
    Roofing: 23,
    Electrical: 22,
    "General Contractor": 20,
  };
  factors.businessType = businessTypeScores[leadData.businessType] || 15;
  score += factors.businessType;

  // Factor 4: Engagement Level (0-25 points)
  // Based on status and interactions
  const engagementScores: Record<string, number> = {
    New: 10,
    Contacted: 20,
    Closed: 25,
  };
  factors.engagementLevel = engagementScores[leadData.status] || 10;
  score += factors.engagementLevel;

  // Determine tier
  let tier: "hot" | "warm" | "cold";
  if (score >= 70) {
    tier = "hot";
  } else if (score >= 40) {
    tier = "warm";
  } else {
    tier = "cold";
  }

  // Generate recommendation
  const recommendation = generateRecommendation(tier, factors, leadData);

  return {
    leadId,
    score,
    tier,
    factors,
    recommendation,
  };
}

/**
 * Generate actionable recommendation based on lead score
 */
function generateRecommendation(
  tier: "hot" | "warm" | "cold",
  factors: LeadScore["factors"],
  lead: any
): string {
  if (tier === "hot") {
    return `🔥 HOT LEAD: ${lead.businessName} is highly qualified. Priority: Call within 1 hour. They're interested in ${lead.serviceInterest} and submitted recently.`;
  } else if (tier === "warm") {
    return `🟡 WARM LEAD: ${lead.businessName} shows good potential. Action: Send personalized email with ROI calculator link. Follow up with call in 24 hours if no response.`;
  } else {
    return `❄️ COLD LEAD: ${lead.businessName} needs nurturing. Action: Add to email sequence. Send educational content about missed call costs. Re-score in 7 days.`;
  }
}

/**
 * Batch score all leads in the system
 * Run this as a scheduled job daily
 */
export async function scoreAllLeadsAutomatically(): Promise<LeadScore[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const allLeads = await db.select().from(leads);
  const scores: LeadScore[] = [];

  for (const lead of allLeads) {
    try {
      const score = await scoreLeadAutomatically(lead.id);
      scores.push(score);

      // Update lead with score in database
      await db
        .update(leads)
        .set({
          leadScore: score.score,
          leadTier: score.tier,
        })
        .where(eq(leads.id, lead.id));
    } catch (error) {
      console.error(`Failed to score lead ${lead.id}:`, error);
    }
  }

  return scores;
}

/**
 * Get hot leads that need immediate follow-up
 */
export async function getHotLeads(): Promise<any[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(leads).where(eq(leads.leadTier, "hot"));
}

/**
 * Get warm leads for nurture sequences
 */
export async function getWarmLeads(): Promise<any[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(leads).where(eq(leads.leadTier, "warm"));
}
