# Business Requirements Document (BRD)
## XeroBookz – Everything You Need to Run Your Entire Business

**Version:** 2.1  
**Last Updated:** 2026

---

## Platform at a glance

| Metric | Count |
|--------|--------|
| **Modules** | 10 |
| **Services** | 53 |
| **Features** | 250+ |
| **Business requirements (BR)** | 60 |

---

## 1. Executive Summary

XeroBookz is a **multi-tenant SaaS platform** that delivers everything organizations need to run their entire business in one place: from customer management to manufacturing, from HR to finance—all integrated, all powerful. The platform provides:

- **Platform Core:** Authentication, multi-tenancy, role-based access control, and billing
- **Website Module:** Website builder, blog, forum, eLearning, and live chat
- **Sales Module:** CRM, sales orders, point of sale, subscriptions, and rental management
- **Finance Module:** Accounting, bookkeeping, immigration services, invoicing, expenses, documents, spreadsheets, and e-signatures
- **Inventory & Manufacturing:** Inventory, manufacturing (MRP/MES), PLM, procurement, maintenance, and quality control
- **Human Resources:** Employee management, recruitment, time off, performance appraisals, referrals, and fleet management
- **Marketing Module:** Marketing automation, email/SMS/social marketing, events, and surveys
- **Services Module:** Project management, timesheets, field service, helpdesk, planning, and appointments
- **Productivity Module:** Team chat, approvals, IoT, VoIP, and knowledge base
- **Customization Module:** Studio no-code builder for custom apps, fields, views, and workflows

All capabilities are delivered with tenant isolation, role-based access, auditability, and scalability.

---

## 2. Business Objectives

| Objective | Description |
|-----------|-------------|
| **Unified platform** | One place for CRM, HR, finance, operations, and productivity—reducing tool sprawl. |
| **Compliance** | Reduce compliance risk for I-9, E-Verify, LCA, immigration, and industry-specific regulations. |
| **Efficiency** | Centralize processes across sales, HR, finance, and operations to reduce manual work and errors. |
| **Visibility** | Provide dashboards and reports for admins, finance, managers, and operations. |
| **Self-Service** | Empower employees and customers to view/update information and submit requests. |
| **Scalability** | Support multiple organizations (tenants) and growing user and transaction counts. |
| **Security** | Protect sensitive data with authentication, authorization, and audit trails. |
| **Customization** | Allow tenants to extend the platform with no-code Studio (custom apps, fields, views). |

---

## 3. Stakeholders

| Role | Description |
|------|-------------|
| **Super Admin** | Platform operator; manages tenants, billing, and global settings. |
| **Company Admin** | Organization owner; manages company profile, users, subscriptions, and modules. |
| **HR / HRBP** | HR staff; manages employees, onboarding, documents, recruitment, and compliance. |
| **Manager** | Team lead; approves leave, timesheets, and views team data. |
| **Employee** | End user; uses self-service for profile, documents, leave, timesheets. |
| **Finance** | Finance staff; manages accounting, invoicing, payments, and financial reports. |
| **Sales / CRM** | Sales staff; manages leads, contacts, opportunities, and sales orders. |
| **Operations** | Inventory, manufacturing, procurement, maintenance, and quality staff. |
| **Marketing** | Marketing staff; runs campaigns, email/SMS/social, events, and surveys. |
| **Contract Team** | Users who create, send, and sign contracts (MSA, NDA, PO, WO, SOW). |

**Note (visibility):** The platform operator role and its portal are for internal use only. They are not linked or mentioned on public marketing pages, sign-in dropdowns, or portal lists. Users with that role are redirected to the platform admin UI automatically after login; the entry URL is not advertised.

---

## 4. Scope

### In Scope

**Platform Core**
- Multi-tenant SaaS with organization-level isolation
- Authentication: user registration, login/logout, JWT and refresh tokens, MFA, session management; login with tenant UUID or tenant code
- Tenant management: creation, isolation, tenant settings; optional human-readable tenant code per organization
- Public web (Admin Web): landing, About Us, Contact, Privacy, Terms; header/footer navigation across marketing pages
- Role-based access control (RBAC): role management, permission assignment, access control
- Billing & subscriptions: subscription plans, billing cycles, payment processing, usage tracking

**Website Module**
- Website builder (drag-and-drop, AI content generation, themes, page management)
- Blog (posts, categories, tags, comments, SEO)
- Forum (discussions, threads, moderation, user engagement)
- eLearning (courses, video lessons, quizzes, certificates, progress tracking)
- Live chat (widget, agent management, chat history)

**Sales Module**
- CRM: leads, contacts, opportunities, pipelines, activities, AI lead scoring
- Sales orders: quotations, sales orders, order processing, invoicing integration
- Point of sale (POS): web POS, payments, offline mode, receipt printing
- Subscriptions: recurring billing, subscriber management, plans, renewals
- Rental management: rental contracts, deliveries, returns, scheduling, tracking

**Finance Module**
- Accounting: chart of accounts, journal entries, general ledger, financial reporting
- Bookkeeping: transaction recording, bank reconciliation, financial statements
- Immigration services: H-1B, LCA, I-9, visa processing, case management
- Invoicing: create, send, track invoices; payment processing; reminders
- Expense management: expense tracking, receipts, approvals, reimbursements
- Documents: document storage, version control, sharing, collaboration
- Spreadsheets: online editor, formulas, charts, collaboration
- E-Signatures: digital signatures, document signing, signature requests (incl. MSA, NDA, PO, WO, SOW)

**Inventory & Manufacturing**
- Inventory: warehouse management, stock tracking, replenishment, barcode scanning, stock movements
- Manufacturing: MRP, MES, production orders, BOMs, workcenters, production planning
- PLM: product lifecycle, version control, engineering changes, product data management
- Procurement: RFQs, purchase orders, vendor management, procurement workflows
- Maintenance: equipment management, preventive maintenance, work orders, maintenance history
- Quality control: inspections, quality alerts, inspection worksheets, quality assurance

**Human Resources**
- Employee management: profiles, skills, documents, org chart, attendance
- Recruitment: job postings, applications, pipeline, interviews, scheduling, candidate management
- Time off: leave requests, PTO, accrual plans, approvals, leave calendar
- Performance appraisals: performance reviews, 360 feedback, goal setting
- Employee referrals: referral program, gamification, rewards
- Fleet management: vehicles, fleet contracts, cost tracking, reporting

**Marketing Module**
- Marketing automation: workflows, customer journeys, automation rules, campaign management
- Email marketing: campaigns, templates, segmentation, analytics, mailing lists
- SMS marketing: SMS campaigns, scheduling, link tracking, credit management
- Social media marketing: social management, content scheduling, push notifications
- Event management: event creation, ticket sales, sponsors, speakers, registrations
- Surveys: survey builder, live sessions, response analytics

**Services Module**
- Project management: tasks, Kanban, Gantt, milestones, profitability, team collaboration
- Timesheets: time tracking, timer, billable hours, invoicing, validation, reporting
- Field service: onsite work, scheduling, worksheets, mobile app, invoicing
- Helpdesk: ticketing, SLA management, automation, multi-channel support, knowledge base
- Planning: shift scheduling, resource management, Gantt, conflict detection
- Appointments: self-service booking, calendar integration, video conferencing, reminders

**Productivity Module**
- Discuss (team chat): direct messaging, channels, video/voice calls, WhatsApp integration, notifications
- Approvals: centralized approval workflows, request types, multi-approver, tracking
- IoT: device management, IoT box integration, quality checks, measurement tracking
- VoIP: voice calls, CRM integration, call queue, call history, user settings
- Knowledge base: articles, wiki, collaboration, access control, revision history

**Customization Module**
- Studio (no-code builder): custom apps, custom fields, custom views, workflows, business rules, menu editor

**Cross-Cutting**
- Notifications (in-app, email, push where applicable)
- Workflow automation and audit logging
- AI-assisted features (document processing, suggestions, content generation where stated)
- Employee self-service (web and mobile)
- Promotional codes and subscription-related flows

### Out of Scope (for this BRD)

- Full payroll processing (may integrate later)
- Legal advice or immigration legal representation
- Country-specific tax or labor law automation beyond stated features

---

## 5. High-Level Business Requirements

### 5.1 Platform Core

- BR-1: Support user registration, login/logout, JWT and refresh tokens, and session management.
- BR-2: Support multi-factor authentication (MFA) and optional OAuth 2.0 / SAML SSO.
- BR-3: Enforce role-based access to portals and features (Super Admin, Admin, HRBP, Manager, Employee, Contract Manager, etc.).
- BR-4: Isolate all data and configuration by tenant (organization).
- BR-5: Provide tenant creation, tenant isolation, and tenant settings management.
- BR-6: Provide subscription plans, billing cycles, payment processing, and usage tracking.

### 5.2 Website Module

- BR-7: Provide website builder with drag-and-drop, AI content generation, themes, and page management.
- BR-8: Provide blog with post management, categories, tags, comments, and SEO.
- BR-9: Provide forum with discussions, threads, moderation, and user engagement.
- BR-10: Provide eLearning with courses, video lessons, quizzes, certificates, and progress tracking.
- BR-11: Provide live chat with widget, agent management, and chat history.

### 5.3 Sales Module

- BR-12: Provide CRM (leads, contacts, opportunities, pipelines, activities, AI lead scoring).
- BR-13: Provide sales orders (quotations, orders, order processing, invoicing integration).
- BR-14: Provide point of sale (web POS, payments, offline mode, receipt printing).
- BR-15: Provide subscription management (recurring billing, subscribers, plans, renewals).
- BR-16: Provide rental management (contracts, deliveries, returns, scheduling, tracking).

### 5.4 Finance Module

- BR-17: Provide accounting (chart of accounts, journal entries, general ledger, reporting).
- BR-18: Provide bookkeeping (transaction recording, bank reconciliation, financial statements).
- BR-19: Provide immigration services (H-1B, LCA, I-9, visa processing, case management).
- BR-20: Provide invoicing (create, send, track; payment processing; reminders).
- BR-21: Provide expense management (tracking, receipts, approvals, reimbursements).
- BR-22: Provide document management (storage, version control, sharing, collaboration).
- BR-23: Provide spreadsheets (online editor, formulas, charts, collaboration).
- BR-24: Provide e-signatures (digital signatures, document signing, signature requests; MSA, NDA, PO, WO, SOW).

### 5.5 Inventory & Manufacturing

- BR-25: Provide inventory management (warehouse, stock tracking, replenishment, barcode, movements).
- BR-26: Provide manufacturing (MRP, MES, production orders, BOMs, workcenters, planning).
- BR-27: Provide PLM (product lifecycle, version control, engineering changes, PDM).
- BR-28: Provide procurement (RFQs, purchase orders, vendor management, workflows).
- BR-29: Provide maintenance (equipment, preventive maintenance, work orders, history).
- BR-30: Provide quality control (inspections, alerts, worksheets, quality assurance).

### 5.6 Human Resources

- BR-31: Provide employee management (profiles, skills, documents, org chart, attendance).
- BR-32: Provide recruitment (job postings, applications, pipeline, interviews, candidates).
- BR-33: Provide time off management (leave requests, PTO, accrual plans, approvals, calendar).
- BR-34: Provide performance appraisals (reviews, 360 feedback, goal setting).
- BR-35: Provide employee referrals (referral program, gamification, rewards).
- BR-36: Provide fleet management (vehicles, contracts, cost tracking, reporting).

### 5.7 Marketing Module

- BR-37: Provide marketing automation (workflows, journeys, automation rules, campaigns).
- BR-38: Provide email marketing (campaigns, templates, segmentation, analytics, lists).
- BR-39: Provide SMS marketing (campaigns, scheduling, link tracking, credits).
- BR-40: Provide social media marketing (management, content scheduling, push notifications).
- BR-41: Provide event management (creation, ticket sales, sponsors, speakers, registrations).
- BR-42: Provide surveys (builder, live sessions, analytics, response management).

### 5.8 Services Module

- BR-43: Provide project management (tasks, Kanban, Gantt, milestones, profitability, collaboration).
- BR-44: Provide timesheets (time tracking, timer, billable hours, invoicing, validation, reporting).
- BR-45: Provide field service (onsite work, scheduling, worksheets, mobile, invoicing).
- BR-46: Provide helpdesk (ticketing, SLA, automation, multi-channel, knowledge base).
- BR-47: Provide planning (shift scheduling, resource management, Gantt, conflict detection).
- BR-48: Provide appointments (self-service booking, calendar, video conferencing, reminders).

### 5.9 Productivity Module

- BR-49: Provide team chat (direct messaging, channels, video/voice calls, WhatsApp, notifications).
- BR-50: Provide approvals (workflows, request types, multi-approver, tracking).
- BR-51: Provide IoT (device management, integration, quality checks, measurement tracking).
- BR-52: Provide VoIP (voice calls, CRM integration, call queue, call history, settings).
- BR-53: Provide knowledge base (articles, wiki, collaboration, access control, revision history).

### 5.10 Customization Module

- BR-54: Provide Studio no-code builder (custom apps, fields, views, workflows, business rules, menu editor).

### 5.11 Operations & Experience

- BR-55: Notify users via in-app and configurable channels where applicable.
- BR-56: Provide Employee Self-Service (ESS) for profile and requests (web and mobile).
- BR-57: Support workflow automation (approvals, notifications, event-driven actions).
- BR-58: Maintain audit trails for compliance and sensitive actions.
- BR-59: Provide public marketing and trust pages (landing, About Us, Contact, Privacy Policy, Terms of Service) with consistent header and footer navigation.
- BR-60: Support sign-in with tenant UUID or human-readable tenant code (per-organization code for login).

---

## 6. Success Criteria

- Organizations can onboard, configure modules, invite users, and use core capabilities per module.
- Compliance-related data (I-9, E-Verify, immigration, audit) is traceable via audit logs.
- Role-based access prevents unauthorized access to sensitive data across all modules.
- Platform supports multiple tenants with no data cross-access.
- Key user journeys (signup, login, MFA, employee invite, document upload, contract signing, etc.) are measurable and stable.
- Modules can be adopted incrementally (e.g. start with HR + Finance, add Sales/Website later).

---

## 7. Assumptions & Constraints

- **Assumptions:** Customers have basic IT capability; immigration rules referenced are US-focused where stated; third-party services (e.g. E-Verify, payment gateways) are used per their terms.
- **Constraints:** Design and implementation must support multi-tenancy, auditability, and scalability from day one; integration points may have rate limits and contractual constraints.

---

## 8. Approval

| Role | Name | Date |
|------|------|------|
| Product Owner | | |
| Engineering Lead | | |
| Compliance / Legal | | |
