/**
 * Prebuilt HVAC outreach templates for the outreach assets page.
 * These templates serve as starting points for generating personalized outreach assets.
 */

export const hvacTemplates = [
  {
    businessName: "ABC HVAC Services",
    niche: "HVAC",
    coldEmail: `Subject: 62% of Your Calls Go Unanswered - Here's the Solution

Hi [Owner Name],

I noticed ABC HVAC Services is getting calls from homeowners needing emergency AC repairs, but I'm guessing some of those calls are going to voicemail or getting missed entirely.

Here's the problem: The average HVAC company loses $187K/year from missed calls alone. That's money left on the table.

Here's the solution: We've deployed AI voice agents for 50+ HVAC companies in your area. They answer every call 24/7, qualify leads, and book appointments automatically. No more missed opportunities.

The result? Our clients see a 30% increase in booked appointments within the first 30 days.

Want to see how it works? I can show you in 15 minutes.

[Schedule a demo]

Best,
[Your Name]
AI Automation Agency`,
    loomScript: `[0:00-0:05] "Hey [Owner Name], I wanted to show you something that's been game-changing for HVAC companies like yours."

[0:05-0:15] "Right now, 62% of service calls go unanswered. That's missed revenue, missed customers, and missed growth."

[0:15-0:25] "We've built an AI voice agent that answers every call, books appointments, and qualifies leads 24/7. No more missed opportunities."

[0:25-0:35] "Our clients see a 30% increase in booked appointments in the first month. One company went from losing $187K/year to capturing all their calls."

[0:35-0:45] "The setup takes 2 hours. The ROI is immediate. Want to see it in action?"

[0:45-0:60] "Book a 15-minute demo with me. I'll show you exactly how it works for HVAC companies. Link in the description."`,
  },
  {
    businessName: "Premier Plumbing Co",
    niche: "Plumbing",
    coldEmail: `Subject: Your Plumbing Business Is Leaving $150K+ on the Table Every Year

Hi [Owner Name],

I work with plumbing companies across the country, and I see the same problem over and over: missed calls = missed revenue.

The average plumbing company loses $150K+ annually from unanswered calls. That's money that should be in your pocket.

We've built an AI solution that:
- Answers every call 24/7 (even at 3 AM)
- Books emergency appointments automatically
- Qualifies leads before they reach your team
- Reduces your phone staff workload by 70%

Our plumbing clients are seeing:
- 35% more booked appointments
- $50K+ additional revenue in the first 90 days
- Zero missed emergency calls

Want to see how it works? I can walk you through it in 15 minutes.

[Schedule a demo]

Best,
[Your Name]
AI Automation Agency`,
    loomScript: `[0:00-0:05] "Hi [Owner Name], I'm reaching out because I think we can help you capture every plumbing call that's currently going to voicemail."

[0:05-0:15] "Here's the reality: Your competitors are losing money on missed calls too. But the ones using AI are capturing all of it."

[0:15-0:25] "We've deployed AI voice agents for 40+ plumbing companies. They answer calls, book emergency appointments, and qualify leads 24/7."

[0:25-0:35] "One of our clients went from losing $150K/year to capturing every single call. That's $50K+ in new revenue in just 90 days."

[0:35-0:45] "Setup is simple. ROI is immediate. Want to see it?"

[0:45-0:60] "Book a 15-minute discovery call. I'll show you exactly how it works for your plumbing business. Link in the description."`,
  },
  {
    businessName: "Elite Roofing Solutions",
    niche: "Roofing",
    coldEmail: `Subject: Stop Losing $250K+ Annually on Missed Roofing Calls

Hi [Owner Name],

I partner with roofing companies to capture 100% of their incoming calls. Here's why it matters:

The average roofing company loses $250K+ per year from unanswered calls. That's storm damage jobs, new roof installations, and maintenance contracts going to competitors.

We've built an AI voice agent that:
- Answers every call immediately (no waiting)
- Books roof inspections automatically
- Qualifies emergency jobs before they reach your team
- Works 24/7/365

Our roofing clients report:
- 40% increase in booked inspections
- $75K+ in additional revenue within 90 days
- Zero missed storm damage calls

Want to see how it works? I can show you in 15 minutes.

[Schedule a demo]

Best,
[Your Name]
AI Automation Agency`,
    loomScript: `[0:00-0:05] "Hi [Owner Name], I wanted to show you how roofing companies are capturing every storm damage call and booking more jobs than ever."

[0:05-0:15] "Right now, you're probably losing $250K+ annually on missed calls. That's money going to your competitors."

[0:15-0:25] "We've deployed AI voice agents for 35+ roofing companies. They answer calls instantly, book inspections, and qualify jobs 24/7."

[0:25-0:35] "One client went from losing calls to capturing 100% of them. That's $75K+ in new revenue in 90 days."

[0:35-0:45] "No missed storm damage calls. No lost revenue. Just pure growth."

[0:45-0:60] "Want to see it in action? Book a 15-minute demo. I'll show you exactly how it works for roofing. Link in the description."`,
  },
];

export type HVACTemplate = typeof hvacTemplates[0];
