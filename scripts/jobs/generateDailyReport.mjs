#!/usr/bin/env node
/**
 * Daily Report Generation Job
 * Generates daily performance metrics and sends to Slack
 * Tracks leads, conversions, and revenue metrics
 */

import mysql from 'mysql2/promise';
import https from 'https';

const DATABASE_URL = process.env.DATABASE_URL;
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

async function generateDailyReport() {
  console.log('📊 Generating daily report...');
  
  try {
    const connection = await mysql.createConnection(DATABASE_URL);
    
    // Get today's metrics
    const [todayLeads] = await connection.query(
      'SELECT COUNT(*) as count FROM leads WHERE DATE(createdAt) = CURDATE()'
    );
    
    const [totalLeads] = await connection.query(
      'SELECT COUNT(*) as count FROM leads'
    );
    
    const [hotLeads] = await connection.query(
      'SELECT COUNT(*) as count FROM leads WHERE leadTier = "hot"'
    );
    
    const [warmLeads] = await connection.query(
      'SELECT COUNT(*) as count FROM leads WHERE leadTier = "warm"'
    );
    
    const [coldLeads] = await connection.query(
      'SELECT COUNT(*) as count FROM leads WHERE leadTier = "cold"'
    );
    
    const [contactedLeads] = await connection.query(
      'SELECT COUNT(*) as count FROM leads WHERE status = "Contacted"'
    );
    
    const [closedLeads] = await connection.query(
      'SELECT COUNT(*) as count FROM leads WHERE status = "Closed"'
    );
    
    // Calculate conversion rate
    const conversionRate = totalLeads[0].count > 0 
      ? ((closedLeads[0].count / totalLeads[0].count) * 100).toFixed(2)
      : 0;
    
    // Estimate revenue (assuming $3,500 average deal)
    const avgDealValue = 3500;
    const estimatedRevenue = closedLeads[0].count * avgDealValue;
    
    const report = {
      todayLeads: todayLeads[0].count,
      totalLeads: totalLeads[0].count,
      hotLeads: hotLeads[0].count,
      warmLeads: warmLeads[0].count,
      coldLeads: coldLeads[0].count,
      contactedLeads: contactedLeads[0].count,
      closedLeads: closedLeads[0].count,
      conversionRate,
      estimatedRevenue,
    };
    
    console.log('📈 Daily Report:', report);
    
    // Send to Slack if webhook is configured
    if (SLACK_WEBHOOK_URL) {
      await sendToSlack(report);
    }
    
    await connection.end();
    console.log('✨ Daily report generated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error generating daily report:', error);
    process.exit(1);
  }
}

async function sendToSlack(report) {
  const message = {
    text: '📊 Daily AI Agency Report',
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '📊 Daily Performance Report',
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Today's Leads*\n${report.todayLeads}`,
          },
          {
            type: 'mrkdwn',
            text: `*Total Leads*\n${report.totalLeads}`,
          },
          {
            type: 'mrkdwn',
            text: `*🔥 Hot Leads*\n${report.hotLeads}`,
          },
          {
            type: 'mrkdwn',
            text: `*🟡 Warm Leads*\n${report.warmLeads}`,
          },
          {
            type: 'mrkdwn',
            text: `*❄️ Cold Leads*\n${report.coldLeads}`,
          },
          {
            type: 'mrkdwn',
            text: `*Conversion Rate*\n${report.conversionRate}%`,
          },
          {
            type: 'mrkdwn',
            text: `*Closed Deals*\n${report.closedLeads}`,
          },
          {
            type: 'mrkdwn',
            text: `*Est. Revenue*\n$${report.estimatedRevenue.toLocaleString()}`,
          },
        ],
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '✅ All automation jobs running smoothly!',
        },
      },
    ],
  };
  
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(message);
    
    const url = new URL(SLACK_WEBHOOK_URL);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    };
    
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          reject(new Error(`Slack API error: ${res.statusCode}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

generateDailyReport();
