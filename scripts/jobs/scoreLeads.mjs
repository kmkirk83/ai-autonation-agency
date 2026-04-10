#!/usr/bin/env node
/**
 * Lead Scoring Automation Job
 * Runs every 6 hours to score and qualify all leads
 * Prioritizes hot leads for immediate follow-up
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

async function scoreLeads() {
  console.log('🚀 Starting lead scoring job...');
  
  try {
    const connection = await mysql.createConnection(DATABASE_URL);
    
    // Get all leads
    const [leads] = await connection.query('SELECT * FROM leads');
    console.log(`📊 Scoring ${leads.length} leads...`);
    
    for (const lead of leads) {
      let score = 0;
      const factors = {};
      
      // Service interest scoring (0-30 points)
      const serviceScores = {
        'AI Voice Receptionist': 25,
        'Lead Reactivation Bot': 20,
        'Customer Support Automation': 15,
      };
      factors.serviceInterest = serviceScores[lead.serviceInterest] || 15;
      score += factors.serviceInterest;
      
      // Response time scoring (0-20 points)
      const hoursSince = (Date.now() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60);
      if (hoursSince < 1) factors.responseTime = 20;
      else if (hoursSince < 24) factors.responseTime = 15;
      else if (hoursSince < 72) factors.responseTime = 10;
      else factors.responseTime = 5;
      score += factors.responseTime;
      
      // Status scoring (0-25 points)
      const statusScores = { 'New': 10, 'Contacted': 20, 'Closed': 25 };
      factors.status = statusScores[lead.status] || 10;
      score += factors.status;
      
      // Determine tier
      let tier = 'cold';
      if (score >= 70) tier = 'hot';
      else if (score >= 40) tier = 'warm';
      
      // Update lead with score
      await connection.query(
        'UPDATE leads SET leadScore = ?, leadTier = ?, updatedAt = NOW() WHERE id = ?',
        [score, tier, lead.id]
      );
      
      console.log(`✅ Lead ${lead.id} (${lead.businessName}): Score ${score}, Tier: ${tier}`);
    }
    
    await connection.end();
    console.log('✨ Lead scoring job completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error in lead scoring job:', error);
    process.exit(1);
  }
}

scoreLeads();
