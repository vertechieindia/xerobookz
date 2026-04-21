# Functional Specifications Document (FSD)
## XeroBookz – Everything You Need to Run Your Entire Business

**Version:** 2.1  
**Last Updated:** 2026

---

## Scope totals

| Metric | Count |
|--------|--------|
| **Modules** | 10 |
| **Services / functional areas** | 53 |
| **User roles & portals** | 10 |
| **Functional specs (F-*)** | 85+ |

---

## 1. Introduction

This document specifies the functional behavior of XeroBookz from an end-user and system perspective. It maps business requirements to features, user roles, and acceptance criteria across all platform modules: Platform Core, Website, Sales, Finance, Inventory & Manufacturing, Human Resources, Marketing, Services, Productivity, and Customization.

---

## 2. User Roles & Portals

| Portal | Roles | Primary Functions |
|--------|--------|-------------------|
| **Platform Admin** (internal; not in public UI) | Platform operator | Tenant management, API keys, platform config, billing oversight. Access by role-based redirect after login only; not linked from public pages. |
| **Company Admin** | Company Admin | Company profile, user/employee management, invitations, subscription, Contract Team role assignment |
| **Admin / HR** | Admin, HRBP | Employees, onboarding, documents, I-9, immigration, leave, timesheets, recruitment |
| **Manager** | Manager | Team view, approve leave/timesheets, reports |
| **Contract Team** | Contract Manager | Create, send, sign contracts (MSA, NDA, PO, WO, SOW); AI quick-read |
| **Employee Self-Service (ESS)** | Employee | Profile, documents, leave requests, timesheets, notifications |
| **Sales** | Sales / CRM | Leads, contacts, opportunities, sales orders |
| **Finance** | Finance | Accounting, invoicing, payments, expenses, reporting |
| **Operations** | Operations | Inventory, manufacturing, procurement, maintenance, quality |
| **Marketing** | Marketing | Campaigns, email/SMS/social, events, surveys |

---

## 3. Functional Areas & Specifications

### 3.1 Platform Core – Authentication & Identity

| ID | Function | Description | Acceptance Criteria |
|----|----------|-------------|---------------------|
| F-AUTH-1 | Company signup | New company and first admin created with optional promo code | Signup form accepts company name, email, password; promo optional; account created and tenant isolated |
| F-AUTH-2 | Login / Logout | Email/password login; session and token invalidation | Valid credentials grant access; logout invalidates tokens; MFA enforced when enabled |
| F-AUTH-3 | MFA (TOTP) | Enable/verify TOTP; backup codes | User can enable MFA; login requires valid TOTP when enabled |
| F-AUTH-4 | Token refresh | JWT refresh without re-login | Refresh token returns new access token within policy limits |
| F-AUTH-5 | OAuth 2.0 | Login/authorize via OAuth 2.0 | Configurable providers; scope and consent; link to tenant/user |
| F-AUTH-6 | SAML SSO | Enterprise SSO via SAML 2.0 | IdP metadata; SSO login and attribute mapping |
| F-AUTH-7 | Session management | Session lifecycle and invalidation | Sessions tracked and invalidatable |
| F-AUTH-8 | Login with tenant ID or code | User enters email, password, and tenant UUID or tenant code | Valid credentials and tenant resolve to same organization; JWT issued |

### 3.2 Platform Core – Tenant Management

| ID | Function | Description | Acceptance Criteria |
|----|----------|-------------|---------------------|
| F-TENANT-1 | Tenant creation | Create new tenant with isolation | Tenant created; data isolated by tenant_id |
| F-TENANT-2 | Tenant isolation | All data scoped by tenant | No cross-tenant data access via UI or API |
| F-TENANT-3 | Tenant settings | Per-tenant configuration | Settings saved and applied per tenant |
| F-TENANT-4 | Tenant code | Human-readable code per tenant (e.g. XB…) for login | Code unique; resolvable at login; optional on existing tenants |

### 3.3 Platform Core – RBAC & Billing

| ID | Function | Description | Acceptance Criteria |
|----|----------|-------------|---------------------|
| F-ACL-1 | Role-based access | UI and API restricted by role | Roles see only allowed menus/APIs |
| F-ACL-2 | Role management | Create/assign roles and permissions | Role changes take effect; access updated |
| F-ACL-3 | Scope-based access | OAuth scopes limit API access | Clients limited by granted scopes |
| F-BILL-1 | Subscription plans | Define and manage plans | Plans configurable; tenant can subscribe |
| F-BILL-2 | Billing cycles | Billing cycle and invoicing | Cycles run per config; invoices generated |
| F-BILL-3 | Payment processing | Process subscription and usage payments | Payments recorded; status updated |
| F-BILL-4 | Usage tracking | Track usage for metered billing | Usage recorded and reportable |

### 3.3a Public web & trust pages (Admin Web)

| ID | Function | Description | Acceptance Criteria |
|----|----------|-------------|---------------------|
| F-PUB-1 | Landing page | Marketing home with product overview and CTAs | Unauthenticated users can browse; links to signup/login |
| F-PUB-2 | About Us | Mission, values, company narrative | Route `/about`; linked from header and footer on marketing pages |
| F-PUB-3 | Contact | Contact form and information | Route `/contact`; reachable from nav |
| F-PUB-4 | Privacy & Terms | Legal pages | Routes `/privacy`, `/terms`; linked from header/footer |
| F-PUB-5 | Cross-page navigation | Consistent marketing nav | About Us, Privacy, Terms, Contact available from header/footer where applicable |

### 3.4 Website Module

| ID | Function | Description | Acceptance Criteria |
|----|----------|-------------|---------------------|
| F-WEB-1 | Website builder | Drag-and-drop builder, themes, pages, AI content | Pages created and published; themes applied |
| F-WEB-2 | Blog | Posts, categories, tags, comments, SEO | Posts published; comments moderated; SEO fields |
| F-WEB-3 | Forum | Threads, user profiles, moderation | Discussions created; moderation rules apply |
| F-WEB-4 | eLearning | Courses, video lessons, quizzes, certificates, progress | Courses completable; progress and certificates tracked |
| F-WEB-5 | Live chat | Widget, agents, chat history | Widget embeddable; chats stored and searchable |

### 3.5 Sales Module

| ID | Function | Description | Acceptance Criteria |
|----|----------|-------------|---------------------|
| F-CRM-1 | Lead management | Leads, scoring, conversion | Leads created; pipeline stages; AI scoring if enabled |
| F-CRM-2 | Contact management | Contacts and history | Contacts and activities tracked |
| F-CRM-3 | Opportunity tracking | Opportunities, pipeline, activities | Opportunities with stages and value |
| F-SO-1 | Quotations | Create and send quotations | Quotation generated; sent to customer |
| F-SO-2 | Sales orders | Create and manage sales orders | Order created; status tracked; link to invoice |
| F-POS-1 | Point of sale | Web POS, payments, offline, receipts | Sales at POS; payments recorded; offline sync |
| F-SUB-1 | Subscriptions (recurring) | Recurring billing, subscribers, plans, renewals | Recurring charges; renewals and expiry handled |
| F-RENT-1 | Rental management | Contracts, deliveries, returns, scheduling | Rentals created; deliveries and returns tracked |

### 3.6 Finance Module

| ID | Function | Description | Acceptance Criteria |
|----|----------|-------------|---------------------|
| F-ACC-1 | Accounting | Chart of accounts, journal entries, general ledger, reporting | COA and entries; GL and reports available |
| F-BK-1 | Bookkeeping | Transaction recording, bank reconciliation, financial statements | Transactions recorded; reconciliation and statements |
| F-INV-1 | Invoicing | Create/send invoices; track status; payment processing; reminders | Invoice with line items; sent; status and payments tracked |
| F-PAY-1 | Payments | Record and track payments against invoices | Payment linked to invoice; balance updated |
| F-PAY-2 | Finance dashboard | Revenue, receivables, key metrics | Dashboard shows KPIs; tenant-scoped |
| F-EXP-1 | Expense management | Expense tracking, receipts, approvals, reimbursements | Expenses submitted; approval workflow; reimbursement |
| F-DOC-1 | Document management | Storage, version control, sharing, collaboration | Documents stored; versions and sharing per design |
| F-SS-1 | Spreadsheets | Online editor, formulas, charts, collaboration | Spreadsheet editable; formulas and charts work |
| F-ESIG-1 | E-Signatures | Digital signatures, document signing, signature requests | Documents sent for signature; signed; audit record |
| F-PROMO-1 | Promo codes | Validate and apply promo at signup or subscription | Validation by code and rules; applied correctly |

### 3.7 Immigration & Compliance (Finance Module)

| ID | Function | Description | Acceptance Criteria |
|----|----------|-------------|---------------------|
| F-I9-1 | I-9 form | Digital I-9 completion (Section 1, 2, etc.) | Form follows I-9 structure; save draft; submit; status tracked |
| F-I9-2 | E-Verify | Submit and track E-Verify cases | Integration per rules; case status visible |
| F-I9-3 | I-9 audit | Audit trail and reports for I-9 | Actions logged; report by date/employee/tenant |
| F-IMM-1 | Immigration cases | Create/track H-1B or other case types | Case record with status, dates, documents |
| F-IMM-2 | LCA | Labor Condition Application workflow | LCA data and status; link to cases |
| F-IMM-3 | PAF | Public Access File generation/storage | PAF generated and stored for compliance |
| F-SOC | SOC predictor | SOC code suggestion/tools | Suggestions support LCA/case filing |

### 3.8 Contract Team (E-Signatures)

| ID | Function | Description | Acceptance Criteria |
|----|----------|-------------|---------------------|
| F-CT-1 | Create contract | Create draft (MSA, NDA, PO, WO, SOW) with title and optional PDF | Contract created; type and title stored |
| F-CT-2 | Send for signature | Send to recipients by email | Recipients receive; status = sent |
| F-CT-3 | Receive / pending list | View contracts pending my signature | List shows received pending items |
| F-CT-4 | Sign or decline | Sign with typed name or decline; audit record | Signature or decline recorded; timestamp and audit |
| F-CT-5 | AI quick-read | AI summary and sign/review/do-not-sign recommendation | Summary and recommendation returned |
| F-CT-6 | Download | Download contract PDF | PDF downloadable with access control |
| F-CT-7 | Contract Team role assignment | Company admin creates/assigns Contract Team role | Role assignable; users get Contract Team access |

### 3.9 Inventory & Manufacturing

| ID | Function | Description | Acceptance Criteria |
|----|----------|-------------|---------------------|
| F-INV-M-1 | Inventory management | Warehouse, stock tracking, replenishment, barcode, movements | Stock levels and movements accurate |
| F-MFG-1 | Manufacturing | MRP, production orders, BOMs, workcenters, planning | Orders and BOMs; capacity and planning |
| F-PLM-1 | PLM | Product lifecycle, version control, engineering changes, PDM | Lifecycle and versions tracked |
| F-PROC-1 | Procurement | RFQs, purchase orders, vendor management, workflows | PO and RFQ workflow; vendors managed |
| F-MNT-1 | Maintenance | Equipment, preventive maintenance, work orders, history | Work orders and history tracked |
| F-QC-1 | Quality control | Inspections, alerts, worksheets, quality assurance | Inspections and nonconformance tracked |

### 3.10 Human Resources

| ID | Function | Description | Acceptance Criteria |
|----|----------|-------------|---------------------|
| F-EMP-1 | Employee list | List employees for tenant with filters | List by status, department, etc.; export if specified |
| F-EMP-2 | Employee profile | View/edit demographics, job info, skills, documents, org chart | Editable fields per role; org chart visible |
| F-EMP-3 | Onboarding | Onboarding workflow and checklist | New hires see tasks; HR tracks completion; documents linked |
| F-EMP-4 | Document management | Upload, store, retrieve documents per employee | Supported formats; metadata; access by role |
| F-REC-1 | Recruitment | Job postings, applications, pipeline, interviews, candidates | Postings published; applications and pipeline tracked |
| F-LEAVE-1 | Leave request | Employee submits leave type, dates | Request created; manager notified |
| F-LEAVE-2 | Leave approval | Manager approves/rejects; PTO and accrual | Balance and policy checks; approval updates balance and calendar |
| F-PERF-1 | Performance appraisals | Reviews, 360 feedback, goal setting | Reviews and goals tracked |
| F-REF-1 | Employee referrals | Referral program, gamification, rewards | Referrals and rewards tracked |
| F-FLEET-1 | Fleet management | Vehicles, contracts, cost tracking, reporting | Vehicles and costs tracked |

### 3.11 Timesheets

| ID | Function | Description | Acceptance Criteria |
|----|----------|-------------|---------------------|
| F-TS-1 | Timesheet entry | Enter/edit timesheet (hours, project, etc.) | Entry by period; validation; submit for approval |
| F-TS-2 | Timesheet approval | Manager approval workflow | Pending list; approve/reject; status updated |
| F-TS-3 | Timer & billable hours | Timer function; mark billable/non-billable | Time logged; billable flag; invoicing link if applicable |

### 3.11a Real-time attendance (punch)

| ID | Function | Description | Acceptance Criteria |
|----|----------|-------------|---------------------|
| F-ATT-0 | Tenant toggle | Admin enables or disables real-time attendance for the organization | `enable_realtime_attendance` stored per tenant; when off, only legacy timesheet flows apply |
| F-ATT-1 | Punch flow | Employee submits PUNCH_IN, PUNCH_OUT, BREAK_IN, BREAK_OUT from web/mobile | Request includes event type, optional geo, browser timezone; server records UTC + local time, IP, source |
| F-ATT-2 | Validation | Illegal sequences rejected | Cannot PUNCH_OUT before PUNCH_IN; cannot BREAK_OUT before BREAK_IN; cannot PUNCH_OUT while on break until BREAK_OUT; multiple breaks per session allowed |
| F-ATT-3 | ESS UI | Punch buttons, current status (open session), last event | Uses `navigator.geolocation` when permitted; degrades gracefully if denied |
| F-ATT-4 | HR / Admin | Company-wide event list with filters | Admin/HR see employees, timestamps, IP, geo; tenant isolation enforced |
| F-ATT-5 | Session summary | Work seconds and break seconds per closed/open session | Derived server-side from ordered events |
| F-ATT-6 | Timesheet integration | Optional row when session closes | Upsert timesheet attendance row with `record_source = attendance`; manual rows remain `manual` |

### 3.12 Marketing Module

| ID | Function | Description | Acceptance Criteria |
|----|----------|-------------|---------------------|
| F-MKT-1 | Marketing automation | Workflows, journeys, automation rules, campaigns | Workflows run; campaigns tracked |
| F-MKT-2 | Email marketing | Campaigns, templates, segmentation, analytics, lists | Emails sent; opens/clicks tracked |
| F-MKT-3 | SMS marketing | SMS campaigns, scheduling, link tracking, credits | SMS sent; credits and tracking |
| F-MKT-4 | Social media marketing | Management, content scheduling, push notifications | Posts scheduled and published |
| F-MKT-5 | Event management | Event creation, ticket sales, sponsors, speakers, registrations | Events and registrations tracked |
| F-MKT-6 | Surveys | Survey builder, live sessions, analytics, response management | Surveys created; responses collected and analyzed |

### 3.13 Services Module

| ID | Function | Description | Acceptance Criteria |
|----|----------|-------------|---------------------|
| F-PM-1 | Project management | Tasks, Kanban, Gantt, milestones, profitability, collaboration | Tasks and milestones; views and collaboration |
| F-FS-1 | Field service | Onsite work, scheduling, worksheets, mobile, invoicing | Visits scheduled; worksheets completed; invoice link |
| F-HD-1 | Helpdesk | Ticketing, SLA, automation, multi-channel, knowledge base | Tickets created and resolved; SLA tracked |
| F-PLAN-1 | Planning | Shift scheduling, resource management, Gantt, conflict detection | Shifts and resources; conflicts highlighted |
| F-APT-1 | Appointments | Self-service booking, calendar, video, reminders | Customers book; calendar sync; reminders sent |

### 3.14 Productivity Module

| ID | Function | Description | Acceptance Criteria |
|----|----------|-------------|---------------------|
| F-CHAT-1 | Team chat | Direct messaging, channels, video/voice, WhatsApp, notifications | Messages and channels; calls and notifications |
| F-APPR-1 | Approvals | Centralized workflows, request types, multi-approver, tracking | Requests routed; approvals recorded |
| F-IOT-1 | IoT | Device management, integration, quality checks, measurement tracking | Devices registered; data collected |
| F-VOIP-1 | VoIP | Voice calls, CRM integration, call queue, call history, settings | Calls placed and logged |
| F-KB-1 | Knowledge base | Articles, wiki, collaboration, access control, revision history | Articles created; access and history |

### 3.15 Customization Module

| ID | Function | Description | Acceptance Criteria |
|----|----------|-------------|---------------------|
| F-STUDIO-1 | Studio no-code builder | Custom apps, fields, views, workflows, business rules, menu editor | Custom app created; fields and views work; menu updated |

### 3.16 Notifications, Workflow & Audit

| ID | Function | Description | Acceptance Criteria |
|----|----------|-------------|---------------------|
| F-NOT-1 | In-app notifications | User notification list and read state | List and mark read; optional push/email per config |
| F-WF-1 | Workflow engine | Configurable approval/workflows | Workflows trigger on events; steps and assignees defined |
| F-AUDIT-1 | Audit log | Log sensitive and compliance actions | Logs immutable; searchable by user, resource, date, tenant |
| F-SAFE-1 | Safety incidents | Record and track safety-related events | Configurable; tenant-scoped; reportable |

### 3.17 Employee Self-Service (ESS) & AI

| ID | Function | Description | Acceptance Criteria |
|----|----------|-------------|---------------------|
| F-ESS-1 | Profile view/edit | Employee sees and updates own profile | Limited fields; changes audited |
| F-ESS-2 | My documents | View/download own documents | Only own documents; access logged |
| F-ESS-3 | My leave | Submit leave; view balance and history | Request and history visible; balances correct |
| F-ESS-4 | My timesheets | Enter and view own timesheets | Entry and status visible to employee |
| F-ESS-5 | My attendance | Punch in/out and breaks when tenant enables real-time attendance | Status and last event visible; geo/IP captured per policy |
| F-AI-1 | Document processing | Extract data or classify documents | Supports stated document types; results stored/linked |
| F-AI-2 | Suggestions | Suggest fields, codes, or next actions (e.g. SOC, contract summary) | Suggestions shown in relevant UI; user can accept or ignore |

---

## 4. Cross-Cutting Behaviors

- **Multi-tenancy:** Every feature respects tenant boundary; APIs and UI filter by tenant.
- **Audit:** Sensitive and compliance actions produce audit records (who, what, when, tenant).
- **Errors:** User-facing errors are clear; technical details not exposed in production.
- **Performance:** List and search support pagination and reasonable response times.
- **Access control:** All modules enforce RBAC; Contract Team, Sales, Finance, etc. use role checks.

---

## 5. Dependencies

- Auth and ACL must be in place before tenant-specific features.
- I-9/E-Verify depend on external E-Verify integration.
- Payments may depend on payment gateway integration.
- Notifications may depend on email/SMS/push providers.
- Website/Live chat may depend on hosting and widget configuration.
- Studio customization depends on core entity and API stability.

---

## 6. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025 | | Initial FSD |
| 2.0 | 2025 | | Full platform: Platform Core, Website, Sales, Finance, Inventory & Manufacturing, HR, Marketing, Services, Productivity, Customization, Contract Team; all functional areas with IDs and acceptance criteria |
| 2.1 | 2026 | | F-AUTH-8, F-TENANT-4, F-PUB-1–5 (public web & trust pages); About Us and cross-page nav |
