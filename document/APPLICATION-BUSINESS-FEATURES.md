# XeroBookz – Application Business Features
## Complete List of Features We Provide and Plan to Provide

**Version:** 2.1  
**Last Updated:** 2026

This document lists **each and every** business feature of the XeroBookz platform, organized by module and service. It reflects the full scope: *Everything you need to run your entire business—from customer management to manufacturing, from HR to finance—all integrated, all in one place.*

### Platform totals

| Metric | Count |
|--------|--------|
| **Modules** | 10 |
| **Services** | 53 |
| **Features** | 250+ |
| **Backend microservices** | 31+ |

- **Modules:** Platform Core, Website, Sales, Finance, Inventory & Manufacturing, Human Resources, Marketing, Services, Productivity, Customization.
- **Services:** Each product area (e.g. Authentication & Security, Website Builder, CRM, Accounting, Contract Team) counted as one service; 53 total across all modules.
- **Features:** Individual capabilities (e.g. “Login / Logout”, “Drag-and-drop builder”); 250+ listed across services; status ✅ implemented or 🔲 planned.
- **Backend microservices:** Deployed services (api-gateway, auth-service, contract-service, etc.); see ARCHITECTURE.md.

**Legend:** ✅ Implemented / in use · 🔲 Planned / not yet implemented or partial

---

## Platform Core – Foundation services for authentication, multi-tenancy, access control, and billing

### 1. Authentication & Security

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 1.1 | User registration | New organization and first admin account creation | ✅ |
| 1.2 | Login / Logout | Email/password login; session and token invalidation on logout | ✅ |
| 1.3 | JWT tokens | Short-lived access token; refresh token for new access token | ✅ |
| 1.4 | MFA (TOTP) | Two-factor auth via TOTP (e.g. Google/Microsoft Authenticator) | ✅ |
| 1.5 | MFA backup codes | One-time backup codes when MFA is enabled | ✅ |
| 1.6 | OAuth 2.0 login | Sign in with external provider (e.g. Google, Microsoft) | ✅ |
| 1.7 | OAuth 2.0 scopes | Scope-based API access for OAuth clients | ✅ |
| 1.8 | SAML 2.0 SSO | Enterprise single sign-on via SAML IdP | ✅ (structure) |
| 1.9 | Session management | Session lifecycle and invalidation | ✅ |
| 1.10 | Password reset | Request and complete password reset via email | 🔲 |
| 1.11 | Promo code at signup | Apply promotional code (e.g. FREE2026) during signup | ✅ |
| 1.12 | Promo code validation | Validate promo code before use | ✅ |
| 1.13 | HTTP Basic Auth (API) | Optional Basic Auth for machine-to-machine API access | ✅ |
| 1.14 | Login with tenant ID or code | Sign in using tenant UUID or human-readable tenant code (e.g. XB000016272) | ✅ |

### 2. Tenant Management

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 2.1 | Tenant creation | Create new tenant (organization) with isolation | ✅ |
| 2.2 | Tenant isolation | All data and actions scoped by organization (tenant) | ✅ |
| 2.3 | Tenant settings | Per-tenant configuration and preferences | ✅ |
| 2.4 | Tenant suspension | Suspend or reactivate tenant access | 🔲 |
| 2.5 | Tenant code | Optional human-readable code per tenant for login (assigned at signup; seedable for dev) | ✅ |

### 3. Role-Based Access Control (RBAC)

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 3.1 | Role management | Create and manage roles (platform operator, Admin, HRBP, Manager, Employee, Contract Manager, etc.). Platform operator role is internal-only and not advertised in public UI. | ✅ |
| 3.2 | Permission assignment | Permissions attached to roles (resource + action) | ✅ |
| 3.3 | Access control | UI and API restricted by role; unauthorized handling | ✅ |
| 3.4 | Route protection | Admin, Employer, ESS, Contract Team routes protected by role | ✅ |

### 4. Billing & Subscriptions

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 4.1 | Subscription plans | Define and manage subscription tiers and plans | 🔲 |
| 4.2 | Billing cycles | Billing cycle management and invoicing | 🔲 |
| 4.3 | Payment processing | Process payments for subscriptions and usage | 🔲 |
| 4.4 | Usage tracking | Track usage for metered billing | 🔲 |
| 4.5 | Promo codes (billing) | Apply promo at signup or subscription (validate, apply) | ✅ |

### 5. Public marketing site (Admin Web)

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 5.1 | Landing page | Home: product overview, modules, stats, sign up / sign in | ✅ |
| 5.2 | About Us | Mission, values, and company story; linked from header and footer | ✅ |
| 5.3 | Contact | Contact form and company information | ✅ |
| 5.4 | Privacy Policy | Privacy policy page | ✅ |
| 5.5 | Terms of Service | Terms of service page | ✅ |
| 5.6 | Cross-page navigation | About Us, Privacy, Terms, Contact in header/footer on marketing pages | ✅ |

---

## Website Module – Build beautiful websites, blogs, forums, eLearning, and live chat

### 5. Website Builder

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 5.1 | Drag-and-drop builder | Drag-and-drop website builder with blocks and layout | 🔲 |
| 5.2 | AI content generation | AI-powered content generation for pages | 🔲 |
| 5.3 | Theme library | Prebuilt themes and styling options | 🔲 |
| 5.4 | Page management | Create, edit, publish, and manage pages | 🔲 |
| 5.5 | SEO optimization | Meta tags, sitemaps, and SEO tools | 🔲 |

### 6. Blog

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 6.1 | Post management | Create, edit, schedule, and publish blog posts | 🔲 |
| 6.2 | Categories & tags | Organize posts with categories and tags | 🔲 |
| 6.3 | Comments | Reader comments and moderation | 🔲 |
| 6.4 | SEO optimization | Blog-specific SEO | 🔲 |

### 7. Forum

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 7.1 | Discussion threads | Create and manage discussion threads | 🔲 |
| 7.2 | User profiles | Forum user profiles and reputation | 🔲 |
| 7.3 | Moderation tools | Moderation, flags, and rules | 🔲 |

### 8. eLearning

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 8.1 | Course creation | Create courses with sections and content | 🔲 |
| 8.2 | Video lessons | Video content and streaming | 🔲 |
| 8.3 | Quizzes & assessments | Quizzes, assessments, and grading | 🔲 |
| 8.4 | Certificates | Issue certificates on completion | 🔲 |
| 8.5 | Progress tracking | Track learner progress and completion | 🔲 |

### 9. Live Chat

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 9.1 | Live chat widget | Embeddable chat widget for websites | 🔲 |
| 9.2 | Agent management | Assign agents, queues, and availability | 🔲 |
| 9.3 | Chat history | Store and search chat history | 🔲 |

---

## Sales Module – CRM, sales orders, POS, subscriptions, rental management

### 10. CRM – Customer Relationship Management

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 10.1 | Lead management | Leads, scoring, and conversion | ✅ (basic) |
| 10.2 | Contact management | Contacts and contact history | ✅ (basic) |
| 10.3 | Opportunity tracking | Opportunities, stages, and pipeline | 🔲 |
| 10.4 | Pipeline management | Sales pipeline and stages | 🔲 |
| 10.5 | Activity tracking | Activities, tasks, and follow-ups | 🔲 |
| 10.6 | AI lead scoring | AI-powered lead scoring | 🔲 |

### 11. Sales Orders

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 11.1 | Quotations | Create and send quotations | 🔲 |
| 11.2 | Sales orders | Create and manage sales orders | 🔲 |
| 11.3 | Order processing | Order workflow and status | 🔲 |
| 11.4 | Invoicing integration | Link orders to invoices | ✅ (partial) |

### 12. Point of Sale (POS)

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 12.1 | Web POS interface | Web-based POS interface | 🔲 |
| 12.2 | Payment processing | Accept payments at POS | 🔲 |
| 12.3 | Offline mode | Work offline and sync later | 🔲 |
| 12.4 | Receipt printing | Print or email receipts | 🔲 |

### 13. Subscriptions (Recurring)

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 13.1 | Recurring billing | Recurring billing cycles | 🔲 |
| 13.2 | Subscriber management | Manage subscribers and plans | 🔲 |
| 13.3 | Subscription plans | Define plans and pricing | 🔲 |
| 13.4 | Renewals | Renewal and expiry handling | 🔲 |

### 14. Rental Management

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 14.1 | Rental contracts | Create and manage rental contracts | 🔲 |
| 14.2 | Delivery management | Schedule and track deliveries | 🔲 |
| 14.3 | Returns processing | Process returns and condition check | 🔲 |
| 14.4 | Rental scheduling | Schedule and calendar | 🔲 |
| 14.5 | Rental tracking | Track items and status | 🔲 |

---

## Finance Module – Accounting, bookkeeping, immigration, invoicing, expenses, documents, spreadsheets, e-signatures

### 15. Accounting

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 15.1 | Chart of accounts | Chart of accounts and hierarchy | 🔲 |
| 15.2 | Journal entries | Create and post journal entries | 🔲 |
| 15.3 | General ledger | General ledger and trial balance | 🔲 |
| 15.4 | Financial reporting | P&L, balance sheet, cash flow | 🔲 |

### 16. Bookkeeping

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 16.1 | Transaction recording | Record transactions and entries | 🔲 |
| 16.2 | Bank reconciliation | Reconcile bank statements | 🔲 |
| 16.3 | Financial statements | Generate financial statements | 🔲 |

### 17. Immigration Services

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 17.1 | H-1B processing | H-1B case management and workflow | ✅ |
| 17.2 | LCA management | Labor Condition Application data and workflow | ✅ |
| 17.3 | I-9 compliance | Digital I-9 completion and status | ✅ |
| 17.4 | E-Verify integration | E-Verify case submission and results | ✅ |
| 17.5 | Visa processing | Visa case types and tracking | ✅ |
| 17.6 | PAF (Public Access File) | PAF generation and storage for LCA | ✅ |
| 17.7 | SOC code predictor | Suggest SOC codes for job classification | ✅ |

### 18. Invoicing

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 18.1 | Invoice creation | Create invoice with line items, amount, customer | ✅ |
| 18.2 | Payment processing | Record and track payments against invoices | ✅ |
| 18.3 | Payment reminders | Send payment reminders | 🔲 |
| 18.4 | Invoice list and filters | List invoices with status and filters | ✅ |
| 18.5 | Send invoice | Send invoice to customer (email/link) | 🔲 |
| 18.6 | Finance dashboard | KPIs: revenue, receivables, aging | ✅ |

### 19. Expense Management

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 19.1 | Expense tracking | Track expenses by category and project | 🔲 |
| 19.2 | Receipt management | Upload and attach receipts | 🔲 |
| 19.3 | Approval workflows | Expense approval workflow | 🔲 |
| 19.4 | Reimbursements | Reimbursement requests and processing | 🔲 |

### 20. Documents (Finance / General)

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 20.1 | Document storage | Upload and store files (e.g. GridFS, object storage) | ✅ |
| 20.2 | Version control | Keep multiple versions of a document | 🔲 |
| 20.3 | Sharing & collaboration | Share documents and collaborate | 🔲 |
| 20.4 | Document list per entity | List documents by employee/tenant/entity | ✅ |
| 20.5 | Document download | Download with access control | ✅ |
| 20.6 | Document types | I-9, PAF, passport, HR document, etc. | ✅ |

### 21. Spreadsheets

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 21.1 | Online editor | In-browser spreadsheet editor | 🔲 |
| 21.2 | Formulas & functions | Formulas and built-in functions | 🔲 |
| 21.3 | Charts & graphs | Create charts and graphs | 🔲 |
| 21.4 | Collaboration | Real-time or async collaboration | 🔲 |

### 22. E-Signatures

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 22.1 | Digital signatures | Capture and store digital signatures | ✅ |
| 22.2 | Document signing | Sign documents (MSA, NDA, PO, WO, SOW) | ✅ |
| 22.3 | Signature requests | Send for signature; track status | ✅ |
| 22.4 | Contract Team role | Create, send, sign contracts (Contract Team) | ✅ |
| 22.5 | AI quick-read | AI summary and sign/review recommendation | ✅ |

---

## Inventory & Manufacturing – Inventory, manufacturing, PLM, procurement, maintenance, quality

### 23. Inventory Management

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 23.1 | Warehouse management | Multi-warehouse and locations | 🔲 |
| 23.2 | Stock tracking | Track stock levels and movements | 🔲 |
| 23.3 | Replenishment rules | Reorder points and replenishment rules | 🔲 |
| 23.4 | Barcode scanning | Barcode scanning and lookup | 🔲 |
| 23.5 | Stock movements | Record and track stock movements | 🔲 |

### 24. Manufacturing

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 24.1 | MRP planning | Material requirements planning | 🔲 |
| 24.2 | Production orders | Create and manage production orders | 🔲 |
| 24.3 | BOM management | Bills of materials and variants | 🔲 |
| 24.4 | Workcenters | Workcenters and capacity | 🔲 |
| 24.5 | Production planning | Production scheduling and planning | 🔲 |
| 24.6 | MES | Manufacturing execution system features | 🔲 |

### 25. Product Lifecycle Management (PLM)

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 25.1 | Product lifecycle | Lifecycle stages and transitions | 🔲 |
| 25.2 | Version control | Product and document versioning | 🔲 |
| 25.3 | Engineering changes | Engineering change orders and approval | 🔲 |
| 25.4 | Product data management | Central product data and attributes | 🔲 |

### 26. Procurement

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 26.1 | RFQ management | Request for quotation workflow | 🔲 |
| 26.2 | Purchase orders | Create and manage purchase orders | 🔲 |
| 26.3 | Vendor management | Vendor master and performance | 🔲 |
| 26.4 | Procurement workflows | Approval and procurement workflows | 🔲 |

### 27. Maintenance

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 27.1 | Equipment management | Equipment and asset register | 🔲 |
| 27.2 | Preventive maintenance | Preventive maintenance scheduling | 🔲 |
| 27.3 | Work orders | Maintenance work orders | 🔲 |
| 27.4 | Maintenance history | History and cost tracking | 🔲 |

### 28. Quality Control

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 28.1 | Quality inspections | Inspection plans and results | 🔲 |
| 28.2 | Quality alerts | Alerts and nonconformance | 🔲 |
| 28.3 | Inspection worksheets | Worksheets and checklists | 🔲 |
| 28.4 | Quality assurance | QA workflows and reporting | 🔲 |

---

## Human Resources – Employee management, recruitment, time off, appraisals, referrals, fleet

### 29. Employee Management

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 29.1 | Employee profiles | Master data, demographics, job info, contact | ✅ |
| 29.2 | Skills management | Skills and competencies | 🔲 |
| 29.3 | Document management | Employee documents and storage | ✅ |
| 29.4 | Organizational chart | Org chart and reporting structure | 🔲 |
| 29.5 | Attendance tracking | Attendance and time tracking | 🔲 |
| 29.6 | Employee list and filters | List employees with search/filter | ✅ |
| 29.7 | Employee invitation | Invite by email; complete signup/onboarding | ✅ |
| 29.8 | Bulk import | Import employees from CSV | 🔲 |

### 30. Recruitment

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 30.1 | Job postings | Create and publish job postings | 🔲 |
| 30.2 | Application management | Applications and applicant tracking | 🔲 |
| 30.3 | Recruitment pipeline | Pipeline stages and movement | 🔲 |
| 30.4 | Interviews | Interview scheduling and feedback | 🔲 |
| 30.5 | Candidate management | Candidate profiles and history | 🔲 |

### 31. Time Off Management

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 31.1 | Leave requests | Employee submits leave type, dates, reason | ✅ |
| 31.2 | PTO management | PTO balance and accrual | ✅ |
| 31.3 | Accrual plans | Accrual rules and plans | 🔲 |
| 31.4 | Approvals | Manager approval workflow | ✅ |
| 31.5 | Leave calendar | Calendar view of leave | 🔲 |
| 31.6 | Leave history | History of requests and balances | ✅ |

### 32. Performance Appraisals

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 32.1 | Performance reviews | Conduct and track performance reviews | 🔲 |
| 32.2 | 360 feedback | 360-degree feedback collection | 🔲 |
| 32.3 | Goal setting | Goals and OKRs | 🔲 |

### 33. Employee Referrals

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 33.1 | Referral program | Employee referral program setup | 🔲 |
| 33.2 | Gamification | Badges, points, leaderboards | 🔲 |
| 33.3 | Rewards management | Referral rewards and payouts | 🔲 |

### 34. Fleet Management

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 34.1 | Vehicle management | Vehicle register and assignment | 🔲 |
| 34.2 | Fleet contracts | Leasing and contract tracking | 🔲 |
| 34.3 | Cost tracking | Fuel, maintenance, cost tracking | 🔲 |
| 34.4 | Fleet reporting | Reports and analytics | 🔲 |

---

## Marketing Module – Automation, email, SMS, social, events, surveys

### 35. Marketing Automation

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 35.1 | Marketing workflows | Automated workflows and triggers | 🔲 |
| 35.2 | Customer journeys | Design and run customer journeys | 🔲 |
| 35.3 | Automation rules | Rules and conditions | 🔲 |
| 35.4 | Campaign management | Campaign creation and tracking | ✅ (basic) |

### 36. Email Marketing

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 36.1 | Email campaigns | Create and send email campaigns | 🔲 |
| 36.2 | Template builder | Email templates and editor | 🔲 |
| 36.3 | List segmentation | Segment lists and audiences | 🔲 |
| 36.4 | Analytics | Open rates, clicks, conversions | 🔲 |
| 36.5 | Mailing lists | Manage mailing lists | 🔲 |

### 37. SMS Marketing

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 37.1 | SMS campaigns | Create and send SMS campaigns | 🔲 |
| 37.2 | Message scheduling | Schedule sends | 🔲 |
| 37.3 | Link tracking | Track links in SMS | 🔲 |
| 37.4 | Credit management | SMS credits and usage | 🔲 |

### 38. Social Media Marketing

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 38.1 | Social media management | Manage multiple social accounts | 🔲 |
| 38.2 | Content scheduling | Schedule posts across platforms | 🔲 |
| 38.3 | Push notifications | Push notification campaigns | 🔲 |

### 39. Event Management

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 39.1 | Event creation | Create events and agenda | 🔲 |
| 39.2 | Ticket sales | Sell tickets and manage capacity | 🔲 |
| 39.3 | Sponsor management | Sponsors and tiers | 🔲 |
| 39.4 | Speakers | Speaker profiles and sessions | 🔲 |
| 39.5 | Registrations | Registration and check-in | 🔲 |

### 40. Surveys

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 40.1 | Survey builder | Create surveys and forms | 🔲 |
| 40.2 | Live sessions | Live polling and feedback | 🔲 |
| 40.3 | Response analytics | Analyze responses and reports | 🔲 |
| 40.4 | Response management | Export and manage responses | 🔲 |

---

## Services Module – Projects, timesheets, field service, helpdesk, planning, appointments

### 41. Project Management

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 41.1 | Task management | Tasks, subtasks, assignments | 🔲 |
| 41.2 | Kanban boards | Kanban view and drag-and-drop | 🔲 |
| 41.3 | Gantt charts | Gantt chart and timeline | 🔲 |
| 41.4 | Milestones | Milestones and deliverables | 🔲 |
| 41.5 | Profitability | Project profitability tracking | 🔲 |
| 41.6 | Team collaboration | Collaboration and comments | 🔲 |

### 42. Timesheets

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 42.1 | Time tracking | Log time by project/task/activity | ✅ |
| 42.2 | Timer function | Start/stop timer | 🔲 |
| 42.3 | Billable hours | Mark billable and non-billable | 🔲 |
| 42.4 | Invoicing integration | Link timesheets to invoicing | 🔲 |
| 42.5 | Validation | Submit and approval workflow | ✅ |
| 42.6 | Reporting | Timesheet reports and analytics | 🔲 |

### 43. Field Service

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 43.1 | Onsite management | Plan and manage onsite work | 🔲 |
| 43.2 | Scheduling | Schedule technicians and visits | 🔲 |
| 43.3 | Worksheets | Mobile worksheets and checklists | 🔲 |
| 43.4 | Mobile app | Field service mobile app | 🔲 |
| 43.5 | Invoicing | Generate invoices from field work | 🔲 |

### 44. Helpdesk

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 44.1 | Ticket management | Create, assign, and track tickets | 🔲 |
| 44.2 | SLA rules | SLA rules and escalation | 🔲 |
| 44.3 | Automation | Auto-assign, auto-reply, rules | 🔲 |
| 44.4 | Multi-channel support | Email, chat, portal | 🔲 |
| 44.5 | Knowledge base | KB articles and self-service | 🔲 |

### 45. Planning

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 45.1 | Shift scheduling | Schedule shifts and rotations | 🔲 |
| 45.2 | Resource management | Resources and capacity | 🔲 |
| 45.3 | Gantt planning | Gantt for planning view | 🔲 |
| 45.4 | Conflict detection | Detect scheduling conflicts | 🔲 |

### 46. Appointments

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 46.1 | Self-service booking | Customers book appointments online | 🔲 |
| 46.2 | Calendar integration | Sync with calendars | 🔲 |
| 46.3 | Video conferencing | Integrate video calls | 🔲 |
| 46.4 | Reminders | Email/SMS reminders | 🔲 |

---

## Productivity Module – Chat, approvals, IoT, VoIP, knowledge base

### 47. Discuss – Team Chat

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 47.1 | Direct messaging | One-on-one and group DMs | 🔲 |
| 47.2 | Channels | Channels and topics | 🔲 |
| 47.3 | Video calls | Video conferencing in chat | 🔲 |
| 47.4 | Voice calls | Voice calls | 🔲 |
| 47.5 | WhatsApp integration | WhatsApp integration | 🔲 |
| 47.6 | Notifications | Notifications and mentions | ✅ (in-app) |

### 48. Approvals

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 48.1 | Approval workflows | Centralized approval workflows | ✅ (workflow-service) |
| 48.2 | Request types | Configurable request types | 🔲 |
| 48.3 | Multi-approver | Multiple approvers and delegation | 🔲 |
| 48.4 | Approval tracking | Track status and history | 🔲 |

### 49. IoT – Internet of Things

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 49.1 | Device management | Register and manage IoT devices | 🔲 |
| 49.2 | IoT box integration | Integrate IoT box / gateways | 🔲 |
| 49.3 | Quality checks | Use IoT for quality checks | 🔲 |
| 49.4 | Measurement tracking | Track measurements from devices | 🔲 |

### 50. VoIP – Voice over IP

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 50.1 | Voice calls | Place and receive voice calls | 🔲 |
| 50.2 | CRM integration | Log calls in CRM | 🔲 |
| 50.3 | Call queue | Call queue and distribution | 🔲 |
| 50.4 | Call history | Call history and recording | 🔲 |
| 50.5 | User settings | User VoIP settings | 🔲 |

### 51. Knowledge Base

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 51.1 | Article management | Create and manage KB articles | 🔲 |
| 51.2 | Wiki system | Wiki-style organization | 🔲 |
| 51.3 | Collaboration | Collaborative editing | 🔲 |
| 51.4 | Access control | Permissions and visibility | 🔲 |
| 51.5 | Revision history | Version history of articles | 🔲 |

---

## Customization Module – No-code app builder and Studio

### 52. Studio – No-Code Builder

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 52.1 | Custom apps | Build custom applications | 🔲 |
| 52.2 | Custom fields | Define custom fields on entities | 🔲 |
| 52.3 | Custom views | Custom list and form views | 🔲 |
| 52.4 | Workflows | Custom workflows and automation | 🔲 |
| 52.5 | Business rules | Business rules and validation | 🔲 |
| 52.6 | Menu editor | Customize menus and navigation | 🔲 |

---

## Contract Team (E-Signatures – MSA, NDA, PO, WO, SOW)

### 53. Contract Team

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 53.1 | Contract Team role | Role for users who create, send, and sign contracts | ✅ |
| 53.2 | Create contracts | Create draft (MSA, NDA, PO, WO, SOW, other) with title and optional PDF | ✅ |
| 53.3 | Send for signature | Send contract to recipients by email for e-signature | ✅ |
| 53.4 | Receive / pending list | View contracts sent to me pending my signature | ✅ |
| 53.5 | E-sign (sign or decline) | Sign with typed name or decline; audit record | ✅ |
| 53.6 | AI quick-read | AI summary and sign/review/do-not-sign recommendation | ✅ |
| 53.7 | Download document | Download contract PDF from the app | ✅ |
| 53.8 | Contract Team dashboard | Dedicated dashboard (sent / received) | ✅ |

---

## Cross-Cutting – Onboarding, compliance, safety, ESS, AI, platform

### 54. Onboarding

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 54.1 | Onboarding checklist | Configurable tasks for new hires | ✅ |
| 54.2 | Onboarding workflow | Assign tasks; track completion | ✅ |
| 54.3 | Document collection | Collect required documents during onboarding | ✅ |

### 55. I-9 & E-Verify Compliance

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 55.1 | Digital I-9 form | Complete Form I-9 digitally | ✅ |
| 55.2 | I-9 status tracking | Draft, complete, reverification, expired | ✅ |
| 55.3 | I-9 audit trail | Log all I-9 actions | ✅ |
| 55.4 | E-Verify integration | Submit and track E-Verify cases | ✅ |
| 55.5 | Non-confirmation workflow | TNC/FNC workflow | 🔲 |

### 56. Audit & Compliance

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 56.1 | Audit log | Log sensitive and compliance actions | ✅ |
| 56.2 | Audit search | Search by user, resource, action, date, tenant | ✅ |
| 56.3 | Immutable audit | Audit records cannot be edited or deleted | ✅ |
| 56.4 | Compliance reports | I-9, E-Verify, immigration reports | ✅ |

### 57. Safety (Workplace Safety)

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 57.1 | Safety incident reporting | Record safety incidents | ✅ |
| 57.2 | Safety records list | List and filter safety records | ✅ |
| 57.3 | Safety analytics | Analytics and trends | 🔲 |

### 58. Employee Self-Service (ESS)

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 58.1 | ESS portal | Web portal for employees | ✅ |
| 58.2 | My profile | View and edit own profile | ✅ |
| 58.3 | My documents | View and download own documents | ✅ |
| 58.4 | My leave | Submit leave; view balance and history | ✅ |
| 58.5 | My timesheets | Enter and view own timesheets | ✅ |
| 58.6 | My notifications | View in-app notifications | ✅ |
| 58.7 | Mobile ESS | Mobile app for ESS | ✅ (React Native) |

### 59. AI & Automation

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 59.1 | Document processing | Extract text/data; classify documents | ✅ |
| 59.2 | Form auto-fill | Suggest or auto-fill form fields | 🔲 |
| 59.3 | SOC code suggestion | Suggest SOC code from job title/description | ✅ |
| 59.4 | Contract AI quick-read | Summarize contract and recommend sign/review | ✅ |
| 59.5 | Intelligent suggestions | Suggest next actions or missing data | 🔲 |
| 59.6 | Chatbot / assistant | Answer FAQs or guide users | 🔲 |

### 60. API & Platform

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 60.1 | REST API | REST API for core entities | ✅ |
| 60.2 | API versioning | /api/v1 and versioning strategy | ✅ |
| 60.3 | API documentation | OpenAPI/Swagger at /docs | ✅ |
| 60.4 | Rate limiting | Per-tenant/user rate limits (Redis) | ✅ |
| 60.5 | Webhooks | Notify external systems on events | 🔲 |
| 60.6 | Multi-tenant deployment | Single deployment serves all tenants | ✅ |
| 60.7 | Health checks | /health for gateway and services | ✅ |
| 60.8 | Docker & Compose | Containerized run (e.g. docker-compose.local.yml) | ✅ |
| 60.9 | Local run script | ./start-api.sh for local API stack | ✅ |
| 60.10 | Frontend hosting | Vercel or static hosting for web apps | ✅ |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025 | | Initial application business features list |
| 2.0 | 2025 | | Full platform scope: Platform Core, Website, Sales, Finance, Inventory & Manufacturing, HR, Marketing, Services, Productivity, Customization, Contract Team; all services and features from “What We Offer” |
| 2.1 | 2026 | | Tenant code login; public marketing site (landing, About Us, Contact, Privacy, Terms, cross-page nav); auth & tenant feature rows updated |
