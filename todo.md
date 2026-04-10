# AI Automation Agency Landing Page - Project TODO

## Database & Backend
- [x] Design and create leads table in drizzle schema
- [x] Design and create outreach_assets table for templates
- [x] Create database helper functions in server/db.ts
- [x] Create tRPC procedures for lead submission
- [x] Create tRPC procedures for admin lead management
- [x] Create tRPC procedures for LLM-powered outreach generation

## Frontend - Public Pages
- [x] Build hero section with bold headline and "Book Free Demo" CTA
- [x] Build services section with three offerings and pricing
- [x] Build ROI calculator with interactive business type and call volume inputs
- [x] Build social proof section with case study stats
- [x] Build lead capture form with database submission
- [x] Build booking/calendar CTA section (15-minute discovery call)
- [x] Build sticky navigation bar with smooth scrolling
- [x] Implement blueprint aesthetic styling (deep royal blue, grid pattern, technical line drawings)

## Frontend - Protected Pages (Owner-Only)
- [x] Build admin dashboard with lead management
- [x] Implement lead status tracking (New, Contacted, Closed)
- [x] Build sortable lead table by service interest and submission date
- [x] Build outreach assets page with Loom script templates
- [x] Build LLM-powered outreach tool for cold email and Loom script generation
- [x] Implement copy-ready output formatting

## Backend Features
- [x] Integrate LLM for cold email generation
- [x] Integrate LLM for Loom script generation
- [x] Implement owner notification system for new leads
- [x] Add lead status update endpoints

## Testing & Deployment
- [x] Test lead form submission and database storage
- [x] Test ROI calculator calculations
- [x] Test admin dashboard functionality
- [x] Test LLM outreach tool output quality
- [x] Test owner notifications
- [x] Verify protected routes (owner-only access)
- [x] Create checkpoint and prepare for deployment

## Additional Enhancements
- [x] Add Calendly booking widget or direct scheduling link to landing page
- [x] Add prebuilt HVAC lead outreach templates to outreach assets page
- [x] Implement structured LLM output validation (JSON schema)
- [x] Add frontend component tests for ROI calculator
- [x] Add frontend component tests for admin dashboard
- [x] Add LLM output quality tests with mocking
- [x] Add owner notification trigger tests


## Automation Pipeline - Phase 1: Lead Processing
- [ ] Implement automated lead qualification scoring system
- [ ] Create email sequence workflow (welcome, follow-up, nurture)
- [ ] Integrate SendGrid for transactional email delivery
- [ ] Implement lead status auto-update based on email engagement
- [ ] Create lead enrichment with company data (Apollo.io or Hunter.io)
- [ ] Set up automated SMS reminders for booked Calendly calls

## Automation Pipeline - Phase 2: Outreach Automation
- [ ] Implement batch cold email sender with rate limiting
- [ ] Create email personalization engine using LLM
- [ ] Integrate HubSpot CRM for lead tracking and pipeline management
- [ ] Implement email open/click tracking and analytics
- [ ] Create automated follow-up sequences based on engagement
- [ ] Build Loom video auto-generation and distribution workflow

## Automation Pipeline - Phase 3: Scheduled Jobs & Workers
- [ ] Implement Bull queue for background job processing
- [ ] Create daily lead scoring and qualification job
- [ ] Create weekly performance report generation job
- [ ] Implement lead cleanup and data hygiene job
- [ ] Create automated backup and data export job
- [ ] Set up scheduled outreach batch processing

## Automation Pipeline - Phase 4: Analytics & Monitoring
- [ ] Integrate Google Analytics 4 with custom events
- [ ] Implement conversion funnel tracking
- [ ] Create real-time dashboard for lead metrics
- [ ] Set up error logging and alerting (Sentry)
- [ ] Implement performance monitoring (New Relic or DataDog)
- [ ] Create automated performance reports

## Automation Pipeline - Phase 5: Deployment & Health
- [ ] Implement automated health checks and recovery
- [ ] Create deployment automation (GitHub Actions CI/CD)
- [ ] Set up automatic database backups
- [ ] Implement Slack/Discord alerts for critical events
- [ ] Create auto-scaling configuration
- [ ] Set up monitoring dashboards and alerts

## Automation Pipeline - Phase 6: Testing & Delivery
- [ ] Integration tests for all automation workflows
- [ ] Load testing for email batch processing
- [ ] End-to-end automation pipeline testing
- [ ] Documentation for automation configuration
- [ ] Create runbook for common issues
- [ ] Final checkpoint and deployment
