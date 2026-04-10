# Deployment & Operations Runbook

## Quick Start

### 1. Deploy to GitHub

```bash
cd /home/ubuntu/ai_agency_landing
git add .
git commit -m "Add automation pipeline"
git push origin main
```

### 2. Configure GitHub Secrets

Visit: https://github.com/YOUR_USERNAME/ai-agency-landing/settings/secrets/actions

Add these secrets:
- `DATABASE_URL`: Your MySQL connection string
- `RESEND_API_KEY`: Get from https://resend.com
- `SLACK_WEBHOOK_URL`: Get from https://api.slack.com/apps

### 3. Enable Workflows

Go to Actions tab and enable all workflows.

## Automation Timeline

| Time | Job | Frequency |
|------|-----|-----------|
| Every 6 hours | Lead Scoring | Automatic |
| 9:00 AM UTC | Email Sequences | Daily |
| 6:00 PM UTC | Daily Report | Daily |
| 8:00 AM UTC (Mon) | Weekly Report | Weekly |
| On every push | Tests & Build | Continuous |

## Monitoring

### GitHub Actions Dashboard
- URL: https://github.com/YOUR_USERNAME/ai-agency-landing/actions
- Shows all workflow runs and status

### Slack Notifications
- Daily reports sent to your Slack channel
- Failure alerts sent immediately
- Subscribe to #ai-agency channel

### Database Monitoring
- Access via Manus Management UI
- View leads, scores, and email status
- Monitor conversion metrics

## Troubleshooting

### Workflow Failed?
1. Go to GitHub Actions
2. Click the failed workflow
3. Check the error log
4. Common issues:
   - Invalid DATABASE_URL
   - Missing RESEND_API_KEY
   - Slack webhook expired

### No Emails Sending?
1. Verify RESEND_API_KEY is correct
2. Check domain is verified in Resend
3. Check lead tier is "hot"
4. View GitHub Actions logs for errors

### Leads Not Scoring?
1. Verify DATABASE_URL is correct
2. Check database has leads
3. View GitHub Actions logs
4. Run manually: `node scripts/jobs/scoreLeads.mjs`

## Manual Operations

### Score Leads Manually
```bash
cd /home/ubuntu/ai_agency_landing
node scripts/jobs/scoreLeads.mjs
```

### Send Emails Manually
```bash
RESEND_API_KEY=your_key node scripts/jobs/sendEmailSequences.mjs
```

### Generate Report Manually
```bash
SLACK_WEBHOOK_URL=your_url node scripts/jobs/generateDailyReport.mjs
```

## Performance Targets

- Lead scoring: < 5 minutes
- Email sending: < 30 seconds per email
- Report generation: < 2 minutes
- Conversion rate: 15-25%
- Response time: < 1 hour for hot leads

## Backup & Recovery

### Database Backup
- Automatic daily backups via Manus
- Access via Management UI
- Retention: 30 days

### Code Backup
- All code in GitHub
- Automatic backups
- Can rollback any commit

## Scaling

### Increase Email Volume
1. Upgrade Resend plan (currently 100/day free)
2. Adjust batch size in sendEmailSequences.mjs
3. Increase frequency in scheduled-jobs.yml

### Improve Lead Scoring
1. Adjust scoring weights in scoreLeads.mjs
2. Add new scoring factors
3. Test with different thresholds

## Cost Optimization

Current costs: $0/month (all free tier)

To upgrade:
- Resend: $20/month for 50,000 emails
- GitHub Actions: $0 (2,000 min/month free)
- Database: $0 (Manus built-in)
- Slack: $0 (free webhooks)

## Support Resources

- GitHub Issues: Report bugs
- GitHub Discussions: Ask questions
- Resend Docs: https://resend.com/docs
- Slack API: https://api.slack.com

---

**Last Updated**: April 10, 2026
**Status**: Production Ready
