#!/usr/bin/env node
/**
 * Email Sequence Automation Job
 * Sends automated email sequences to leads based on their tier and engagement
 * Uses Resend API for free tier email delivery
 */

import mysql from 'mysql2/promise';
import https from 'https';

const DATABASE_URL = process.env.DATABASE_URL;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

const emailSequences = {
  hot: [
    {
      number: 1,
      subject: '🔥 Your $187K Problem (And Our Solution)',
      template: 'hot-1-urgent',
      delay: 0, // Send immediately
    },
    {
      number: 2,
      subject: 'See How [Business] Captured 100% of Calls',
      template: 'hot-2-social-proof',
      delay: 24, // Send after 24 hours
    },
  ],
  warm: [
    {
      number: 1,
      subject: 'The Cost of Missing Calls',
      template: 'warm-1-education',
      delay: 0,
    },
    {
      number: 2,
      subject: 'How HVAC Companies Are Winning With AI',
      template: 'warm-2-case-study',
      delay: 48,
    },
    {
      number: 3,
      subject: 'Ready to Capture Every Call?',
      template: 'warm-3-cta',
      delay: 72,
    },
  ],
  cold: [
    {
      number: 1,
      subject: 'Quick Question: Are You Losing Calls?',
      template: 'cold-1-awareness',
      delay: 0,
    },
  ],
};

async function sendEmailSequences() {
  console.log('📧 Starting email sequence job...');
  
  try {
    const connection = await mysql.createConnection(DATABASE_URL);
    
    // Get hot leads that haven't received emails yet
    const [hotLeads] = await connection.query(
      'SELECT * FROM leads WHERE leadTier = "hot" AND emailsSent = 0 LIMIT 10'
    );
    
    console.log(`📨 Found ${hotLeads.length} hot leads to email`);
    
    for (const lead of hotLeads) {
      try {
        // Send first email in sequence
        const emailContent = generateEmail(lead, emailSequences.hot[0]);
        
        // Send via Resend API
        if (RESEND_API_KEY) {
          await sendViaResend(lead.email, emailSequences.hot[0].subject, emailContent);
        } else {
          console.log(`📧 Would send email to ${lead.email} (Resend API key not configured)`);
        }
        
        // Update lead
        await connection.query(
          'UPDATE leads SET emailsSent = emailsSent + 1, lastEmailSent = NOW() WHERE id = ?',
          [lead.id]
        );
        
        console.log(`✅ Email sent to ${lead.businessName} (${lead.email})`);
      } catch (error) {
        console.error(`❌ Failed to send email to ${lead.email}:`, error.message);
      }
    }
    
    await connection.end();
    console.log('✨ Email sequence job completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error in email sequence job:', error);
    process.exit(1);
  }
}

function generateEmail(lead, sequence) {
  const templates = {
    'hot-1-urgent': `Hi ${lead.contactName},

I noticed ${lead.businessName} is in the ${lead.serviceInterest} space.

Here's the problem: 62% of service calls go unanswered. That's $187K/year lost.

We've deployed AI voice agents for 50+ companies like yours. They answer every call, qualify leads, and book appointments 24/7.

Result: 30% more booked appointments in 30 days.

Want to see how it works?

[Book a 15-minute demo](https://calendly.com/ai-automation-agency/15min)

Best,
AI Automation Agency`,
  };
  
  return templates[sequence.template] || templates['hot-1-urgent'];
}

async function sendViaResend(to, subject, html) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      from: 'noreply@ai-automation-agency.com',
      to,
      subject,
      html,
    });
    
    const options = {
      hostname: 'api.resend.com',
      path: '/emails',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
    };
    
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`Resend API error: ${res.statusCode}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

sendEmailSequences();
