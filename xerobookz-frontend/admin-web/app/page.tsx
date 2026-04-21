"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { XeroBookzLogo, Button, Card } from "@xerobookz/ui-shared";
import { 
  Shield, Building2, UserCircle, ArrowRight, Star, Rocket, ChevronDown,
  ShoppingCart, Package, Factory, Wrench, CheckSquare, Mail, MessageCircle, 
  Calendar, FileText, Monitor, Phone, BookOpen, Code, 
  Kanban, Timer, MapPin, Headphones, CalendarDays, ClipboardCheck, 
  Cog, Repeat, Car, Search, Megaphone, BarChart, Layers, 
  Lock, Wallet, FileSpreadsheet, PenTool, CheckCircle2,
  DollarSign, Globe, Sparkles, Users, Target, UserPlus, Receipt, Files, Zap, MessageSquare, Briefcase, Settings, Plane
} from "lucide-react";

// Helper function to generate URL-friendly slugs
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export default function Home() {
  const router = useRouter();
  const [isSignInDropdownOpen, setIsSignInDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSignInDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll position tracking
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFeatureClick = (title: string) => {
    const slug = generateSlug(title);
    router.push(`/features/${slug}`);
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
        setTimeout(() => {
          const element = document.getElementById(`module-${moduleId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 300);
      }
      return next;
    });
  };

  // COMPREHENSIVE MODULES DATA
  const allModules = [
    {
      id: "platform-core",
      name: "Platform Core",
      description: "Foundation services for authentication, multi-tenancy, access control, and billing",
      icon: Shield,
      color: "primary",
      services: [
        {
          title: "Authentication & Security",
          description: "Secure user authentication with JWT tokens, refresh tokens, multi-factor authentication, and session management",
          icon: Lock,
          features: ["User Registration", "Login/Logout", "JWT Tokens", "Refresh Tokens", "Session Management", "Password Reset"],
        },
        {
          title: "Tenant Management",
          description: "Multi-tenant architecture with complete tenant isolation, tenant creation, and management",
          icon: Building2,
          features: ["Tenant Creation", "Tenant Isolation", "Tenant Settings", "Domain Management"],
        },
        {
          title: "Role-Based Access Control (RBAC)",
          description: "Comprehensive role and permission management with fine-grained access control",
          icon: Users,
          features: ["Role Management", "Permission Assignment", "Access Control", "Policy Enforcement"],
        },
        {
          title: "Billing & Subscriptions",
          description: "Subscription management, billing cycles, payment processing, and usage tracking",
          icon: Wallet,
          features: ["Subscription Plans", "Billing Cycles", "Payment Processing", "Usage Tracking", "Invoicing"],
        }
      ]
    },
    {
      id: "website",
      name: "Website Module",
      description: "Build beautiful websites, blogs, forums, eLearning platforms, and live chat",
      icon: Globe,
      color: "accent",
      services: [
        {
          title: "Website Builder",
          description: "Drag-and-drop website builder with AI-powered content generation, themes, and page management",
          icon: Code,
          features: ["Drag-and-Drop Builder", "AI Content Generation", "Theme Library", "Page Management", "Domain/Subdomain", "Publishing"],
        },
        {
          title: "Blog",
          description: "Full-featured blogging platform with categories, tags, comments, and SEO optimization",
          icon: FileText,
          features: ["Post Management", "Categories & Tags", "Comments", "SEO Tools", "Media Library"],
        },
        {
          title: "Forum",
          description: "Community forum with discussions, threads, moderation, and user engagement",
          icon: MessageCircle,
          features: ["Discussion Threads", "User Profiles", "Moderation Tools", "Notifications", "Search"],
        },
        {
          title: "eLearning",
          description: "Complete learning management system with courses, quizzes, certificates, and progress tracking",
          icon: BookOpen,
          features: ["Course Creation", "Video Lessons", "Quizzes & Assessments", "Certificates", "Progress Tracking", "Student Dashboard"],
        },
        {
          title: "Live Chat",
          description: "Real-time customer support with chat widgets, agent management, and chat history",
          icon: MessageCircle,
          features: ["Live Chat Widget", "Agent Management", "Chat History", "File Sharing", "Chatbot Integration"],
        }
      ]
    },
    {
      id: "sales",
      name: "Sales Module",
      description: "Complete CRM, sales orders, point of sale, subscriptions, and rental management",
      icon: ShoppingCart,
      color: "primary",
      services: [
        {
          title: "CRM - Customer Relationship Management",
          description: "Manage leads, contacts, opportunities, pipelines, and activities with AI-powered lead scoring",
          icon: Users,
          features: ["Lead Management", "Contact Management", "Opportunity Tracking", "Sales Pipelines", "AI Lead Scoring", "Activity Tracking"],
        },
        {
          title: "Sales Orders",
          description: "Quotations, sales orders, invoicing integration, and order management",
          icon: FileText,
          features: ["Quotations", "Sales Orders", "Order Processing", "Invoicing Integration", "Order History"],
        },
        {
          title: "Point of Sale (POS)",
          description: "Web-based POS system with payments, offline mode, and receipt printing",
          icon: Monitor,
          features: ["Web POS Interface", "Payment Processing", "Offline Mode", "Receipt Printing", "Inventory Sync"],
        },
        {
          title: "Subscriptions",
          description: "Recurring billing, subscriber management, subscription plans, and renewals",
          icon: Repeat,
          features: ["Recurring Billing", "Subscriber Management", "Subscription Plans", "Auto-Renewals", "Usage Tracking"],
        },
        {
          title: "Rental Management",
          description: "Rental contracts, deliveries, returns, scheduling, and rental tracking",
          icon: Car,
          features: ["Rental Contracts", "Delivery Management", "Returns Processing", "Scheduling", "Rental History"],
        }
      ]
    },
    {
      id: "finance",
      name: "Finance Module",
      description: "Complete accounting, invoicing, expenses, documents, spreadsheets, e-signatures, bookkeeping, and immigration services",
      icon: DollarSign,
      color: "accent",
      services: [
        {
          title: "Accounting",
          description: "Full accounting system with chart of accounts, journal entries, and financial reporting",
          icon: BarChart,
          features: ["Chart of Accounts", "Journal Entries", "General Ledger", "Financial Reports", "Multi-Currency"],
        },
        {
          title: "Bookkeeping",
          description: "Complete bookkeeping services with transaction recording, reconciliation, and financial statements",
          icon: FileText,
          features: ["Transaction Recording", "Bank Reconciliation", "Financial Statements", "Trial Balance", "Month-End Closing", "Year-End Reports"],
        },
        {
          title: "Immigration Services",
          description: "Comprehensive immigration case management including H-1B, LCA, I-9, and visa processing",
          icon: Globe,
          features: ["H-1B Processing", "LCA Management", "I-9 Compliance", "Visa Tracking", "Case Management", "Document Management"],
        },
        {
          title: "Invoicing",
          description: "Create, send, and track invoices with payment processing and reminders",
          icon: FileText,
          features: ["Invoice Creation", "Payment Processing", "Payment Reminders", "Invoice Templates", "Payment Tracking"],
        },
        {
          title: "Expense Management",
          description: "Track expenses, receipts, approvals, and reimbursements",
          icon: Receipt,
          features: ["Expense Tracking", "Receipt Management", "Approval Workflows", "Reimbursements", "Expense Reports"],
        },
        {
          title: "Documents",
          description: "Document management with version control, sharing, and collaboration",
          icon: Files,
          features: ["Document Storage", "Version Control", "Sharing & Collaboration", "Document Templates", "Search"],
        },
        {
          title: "Spreadsheets",
          description: "Online spreadsheet editor with formulas, charts, and collaboration",
          icon: FileSpreadsheet,
          features: ["Online Editor", "Formulas & Functions", "Charts & Graphs", "Collaboration", "Import/Export"],
        },
        {
          title: "E-Signatures",
          description: "Digital signature solution for documents and contracts",
          icon: PenTool,
          features: ["Digital Signatures", "Document Signing", "Signature Requests", "Audit Trail", "Compliance"],
        },
        {
          title: "Contract Team",
          description: "Create, send, and sign MSA, NDA, PO, WO, SOW with AI quick-read and e-signature",
          icon: FileText,
          features: ["Create Contracts", "Send for Signature", "Receive & Sign", "AI Summary", "Contract Dashboard"],
        }
      ]
    },
    {
      id: "inventory",
      name: "Inventory & Manufacturing",
      description: "Complete inventory management, manufacturing, PLM, procurement, maintenance, and quality control",
      icon: Package,
      color: "primary",
      services: [
        {
          title: "Inventory Management",
          description: "Warehouse management, stock tracking, replenishment, barcode scanning, and stock movements",
          icon: Package,
          features: ["Warehouse Management", "Stock Tracking", "Replenishment Rules", "Barcode Scanning", "Stock Movements", "Multi-Location"],
        },
        {
          title: "Manufacturing",
          description: "MRP, MES, production orders, BOMs, workcenters, and production planning",
          icon: Factory,
          features: ["MRP Planning", "Production Orders", "BOM Management", "Workcenters", "Production Tracking", "Quality Control"],
        },
        {
          title: "Product Lifecycle Management (PLM)",
          description: "Product lifecycle, version control, engineering changes, and product data management",
          icon: Layers,
          features: ["Product Lifecycle", "Version Control", "Engineering Changes", "Product Data Management", "Documentation"],
        },
        {
          title: "Procurement",
          description: "RFQs, purchase orders, vendor management, and procurement workflows",
          icon: ShoppingCart,
          features: ["RFQ Management", "Purchase Orders", "Vendor Management", "Procurement Workflows", "Approval Processes"],
        },
        {
          title: "Maintenance",
          description: "Equipment maintenance, preventive scheduling, work orders, and maintenance history",
          icon: Wrench,
          features: ["Equipment Management", "Preventive Maintenance", "Work Orders", "Maintenance History", "Scheduling"],
        },
        {
          title: "Quality Control",
          description: "Quality control, inspections, alerts, worksheets, and quality assurance",
          icon: CheckSquare,
          features: ["Quality Inspections", "Quality Alerts", "Inspection Worksheets", "Quality Reports", "Compliance Tracking"],
        }
      ]
    },
    {
      id: "hr",
      name: "Human Resources",
      description: "Complete HR management including employees, recruitment, time off, appraisals, referrals, and fleet",
      icon: UserCircle,
      color: "accent",
      services: [
        {
          title: "Employee Management",
          description: "Employee master data, skills, documents, organizational chart, and attendance tracking",
          icon: Users,
          features: ["Employee Profiles", "Skills Management", "Document Management", "Org Chart", "Attendance Tracking", "Employee Directory"],
        },
        {
          title: "Recruitment",
          description: "Job postings, applications, pipeline, interviews, scheduling, and candidate management",
          icon: Search,
          features: ["Job Postings", "Application Management", "Recruitment Pipeline", "Interview Scheduling", "Candidate Tracking"],
        },
        {
          title: "Time Off Management",
          description: "Leave management, PTO requests, accrual plans, approvals, and leave calendar",
          icon: CalendarDays,
          features: ["Leave Requests", "PTO Management", "Accrual Plans", "Approval Workflows", "Leave Calendar", "Balance Tracking"],
        },
        {
          title: "Performance Appraisals",
          description: "Performance evaluations, surveys, feedback, 360 reviews, and goal tracking",
          icon: Target,
          features: ["Performance Reviews", "360 Feedback", "Goal Setting", "Performance Surveys", "Review Cycles"],
        },
        {
          title: "Employee Referrals",
          description: "Employee referral program with gamification, rewards, and tracking",
          icon: UserPlus,
          features: ["Referral Program", "Gamification", "Rewards Management", "Referral Tracking", "Analytics"],
        },
        {
          title: "Fleet Management",
          description: "Fleet management, vehicles, contracts, costs, and reporting",
          icon: Car,
          features: ["Vehicle Management", "Fleet Contracts", "Cost Tracking", "Maintenance Scheduling", "Fleet Reports"],
        }
      ]
    },
    {
      id: "marketing",
      name: "Marketing Module",
      description: "Marketing automation, email marketing, SMS campaigns, social media, events, and surveys",
      icon: Megaphone,
      color: "primary",
      services: [
        {
          title: "Marketing Automation",
          description: "Workflows, customer journeys, automation rules, and campaign management",
          icon: Zap,
          features: ["Marketing Workflows", "Customer Journeys", "Automation Rules", "Campaign Management", "Event Triggers"],
        },
        {
          title: "Email Marketing",
          description: "Email campaigns, templates, segmentation, analytics, and mailing lists",
          icon: Mail,
          features: ["Email Campaigns", "Template Builder", "List Segmentation", "Email Analytics", "A/B Testing", "Mailing Lists"],
        },
        {
          title: "SMS Marketing",
          description: "SMS campaigns, scheduling, link tracking, and credit management",
          icon: MessageSquare,
          features: ["SMS Campaigns", "Message Scheduling", "Link Tracking", "Credit Management", "Delivery Reports"],
        },
        {
          title: "Social Media Marketing",
          description: "Social media management, content scheduling, and push notifications",
          icon: MessageCircle,
          features: ["Social Media Management", "Content Scheduling", "Push Notifications", "Social Analytics"],
        },
        {
          title: "Event Management",
          description: "Event management, ticket sales, sponsors, speakers, and registrations",
          icon: Calendar,
          features: ["Event Creation", "Ticket Sales", "Sponsor Management", "Speaker Management", "Registration Management"],
        },
        {
          title: "Surveys",
          description: "Survey creation, live sessions, analytics, and response management",
          icon: ClipboardCheck,
          features: ["Survey Builder", "Live Sessions", "Response Analytics", "Question Types", "Distribution"],
        }
      ]
    },
    {
      id: "services",
      name: "Services Module",
      description: "Project management, timesheets, field service, helpdesk, planning, and appointments",
      icon: Briefcase,
      color: "accent",
      services: [
        {
          title: "Project Management",
          description: "Tasks, Kanban, Gantt charts, milestones, profitability, and team collaboration",
          icon: Kanban,
          features: ["Task Management", "Kanban Boards", "Gantt Charts", "Milestones", "Profitability Analysis", "Team Collaboration"],
        },
        {
          title: "Timesheets",
          description: "Time tracking, invoicing, validation, reporting, and billable hours",
          icon: Timer,
          features: ["Time Tracking", "Timer Function", "Billable Hours", "Timesheet Validation", "Reporting", "Overtime Tracking"],
        },
        {
          title: "Field Service",
          description: "Onsite work management, scheduling, worksheets, mobile app, and invoicing",
          icon: MapPin,
          features: ["Onsite Management", "Scheduling", "Worksheets", "Mobile App", "Invoicing", "Map View"],
        },
        {
          title: "Helpdesk",
          description: "Ticketing system, SLA management, automation, multi-channel support, and knowledge base",
          icon: Headphones,
          features: ["Ticket Management", "SLA Rules", "Automation", "Multi-Channel", "Knowledge Base", "Customer Portal"],
        },
        {
          title: "Planning",
          description: "Shift scheduling, resource management, Gantt charts, and conflict detection",
          icon: CalendarDays,
          features: ["Shift Scheduling", "Resource Management", "Gantt Planning", "Conflict Detection", "Shift Swapping"],
        },
        {
          title: "Appointments",
          description: "Self-service scheduling, calendar integration, video conferencing, and reminders",
          icon: Calendar,
          features: ["Self-Service Booking", "Calendar Integration", "Video Conferencing", "Automated Reminders", "Resource Scheduling"],
        }
      ]
    },
    {
      id: "productivity",
      name: "Productivity Module",
      description: "Chat, approvals, IoT, VoIP, and knowledge base for enhanced productivity",
      icon: Zap,
      color: "primary",
      services: [
        {
          title: "Discuss - Team Chat",
          description: "Direct messaging, channels, video calls, voice calls, WhatsApp integration, and notifications",
          icon: MessageSquare,
          features: ["Direct Messaging", "Channels", "Video Calls", "Voice Calls", "WhatsApp Integration", "Notifications"],
        },
        {
          title: "Approvals",
          description: "Centralized approval workflows, request types, multi-approver, and approval tracking",
          icon: CheckSquare,
          features: ["Approval Workflows", "Request Types", "Multi-Approver", "Approval Tracking", "Custom Fields"],
        },
        {
          title: "IoT - Internet of Things",
          description: "Device management, integration, quality checks, and measurement tracking",
          icon: Settings,
          features: ["Device Management", "IoT Box Integration", "Quality Checks", "Measurement Tracking", "Device Operations"],
        },
        {
          title: "VoIP - Voice over IP",
          description: "Voice calls, CRM integration, call queue, call history, and user settings",
          icon: Phone,
          features: ["Voice Calls", "CRM Integration", "Call Queue", "Call History", "User Settings", "Call Recording"],
        },
        {
          title: "Knowledge Base",
          description: "Knowledge base, wiki, collaboration, access control, and revision history",
          icon: BookOpen,
          features: ["Article Management", "Wiki System", "Collaboration", "Access Control", "Revision History", "Search"],
        }
      ]
    },
    {
      id: "customization",
      name: "Customization Module",
      description: "No-code app builder with Studio for customizing your XeroBookz experience",
      icon: Code,
      color: "accent",
      services: [
        {
          title: "Studio - No-Code Builder",
          description: "Custom fields, views, apps, workflows, business rules, and menu editor - no programming needed",
          icon: Cog,
          features: ["Custom Apps", "Custom Fields", "Custom Views", "Workflow Builder", "Business Rules", "Menu Editor", "Document Templates"],
        }
      ]
    }
  ];


  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 50 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-grey-200' 
          : 'bg-white/80 backdrop-blur-md border-b border-grey-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <Link href="/" className="z-10 relative">
              <XeroBookzLogo size="lg" />
            </Link>
            <div className="flex gap-3 sm:gap-4 z-10 relative items-center">
              <Link
                href="/about"
                className="text-sm font-medium text-secondary-700 hover:text-primary-600 transition-colors shrink-0"
              >
                About Us
              </Link>
              <Button
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push("/signup");
                }}
                className="flex items-center gap-2"
              >
                Sign Up
              </Button>
              <div className="relative" ref={dropdownRef}>
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsSignInDropdownOpen((prev) => !prev);
                  }}
                  className="flex items-center gap-2"
                >
                  Sign In
                  <ChevronDown size={16} className={isSignInDropdownOpen ? "rotate-180" : ""} />
                </Button>
                {isSignInDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg border border-grey-200 bg-white shadow-lg py-1 z-50">
                    <Link
                      href="/login"
                      className="block px-4 py-2 text-sm text-grey-700 hover:bg-grey-50"
                      onClick={() => setIsSignInDropdownOpen(false)}
                    >
                      Company Admin
                    </Link>
                    <Link
                      href="/login"
                      className="block px-4 py-2 text-sm text-grey-700 hover:bg-grey-50"
                      onClick={() => setIsSignInDropdownOpen(false)}
                    >
                      Employee Dashboard
                    </Link>
                    <Link
                      href="/login"
                      className="block px-4 py-2 text-sm text-grey-700 hover:bg-grey-50"
                      onClick={() => setIsSignInDropdownOpen(false)}
                    >
                      Contract Team
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-24 md:pb-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-accent-50 relative overflow-hidden">
        {/* Decorative background - pointer-events-none ensures it doesn't block clicks */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/20 rounded-full blur-3xl animate-float" style={{ transform: `translateY(${scrollY * 0.3}px)` }}></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-200/20 rounded-full blur-3xl animate-float" style={{ transform: `translateY(${scrollY * -0.2}px)`, animationDelay: '1s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-8 animate-fade-in">
              <Link href="/" className="relative z-10">
                <XeroBookzLogo size="2xl" />
              </Link>
            </div>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6 animate-fade-in hover-lift">
              <Sparkles size={16} className="animate-pulse-slow" />
              <span>AI-Powered Enterprise Platform</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-secondary-900 mb-4 sm:mb-6 leading-tight animate-fade-in-up bg-gradient-to-r from-primary-600 via-secondary-700 to-accent-600 bg-clip-text text-transparent px-4">
              XeroBookz
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-secondary-700 mb-4 sm:mb-6 animate-fade-in-up px-4" style={{ animationDelay: '0.1s' }}>
              Complete Business Management Suite
            </p>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-grey-600 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up px-4" style={{ animationDelay: '0.2s' }}>
              Everything you need to run your business - from CRM and Sales to HR, Finance, Inventory, Manufacturing, Marketing, Projects, and more. All in one integrated platform.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12 max-w-4xl mx-auto animate-fade-in-up px-4" style={{ animationDelay: '0.3s' }}>
              {[
                { value: "53", label: "Services" },
                { value: "10", label: "Modules" },
                { value: "250+", label: "Features" },
                { value: "100%", label: "Integrated" },
              ].map((stat, index) => (
                <div key={index} className="text-center p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/50 backdrop-blur-sm border border-grey-200/50 hover-lift hover-glow transition-all duration-300">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-600 mb-1">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-grey-600">{stat.label}</div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in-up px-4" style={{ animationDelay: '0.4s' }}>
              <Button
                variant="gradient"
                size="lg"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const element = document.getElementById("what-we-offer");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="group hover-lift hover-glow relative overflow-hidden w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <span className="hidden sm:inline">Explore Everything We Offer</span>
                  <span className="sm:hidden">Explore Features</span>
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push("/signup");
                }}
                className="group hover-lift w-full sm:w-auto"
              >
                Get Started
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push("/login");
                }}
                className="group hover-lift w-full sm:w-auto"
              >
                Sign In
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE OFFER - COMPREHENSIVE SECTION */}
      <section id="what-we-offer" className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-6">
              <Star size={16} />
              <span>Complete Business Suite</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-800 mb-4 px-4">
              What We Offer
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-grey-600 max-w-4xl mx-auto leading-relaxed px-4">
              Everything you need to run your entire business. From customer management to manufacturing, from HR to finance - all integrated, all powerful, all in one place.
            </p>
          </div>

          {/* Modules Grid */}
          <div className="space-y-6 sm:space-y-8 md:space-y-12">
            {allModules.map((module, moduleIndex) => {
              const IconComponent = module.icon;
              const isExpanded = expandedModules.has(module.id);

              return (
                <div
                  key={module.id}
                  id={`module-${module.id}`}
                  className="bg-white rounded-xl sm:rounded-2xl border-2 border-grey-200 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 w-full hover:border-primary-300"
                >
                  {/* Module Header - Fully Clickable */}
                  <div
                    className="p-4 sm:p-6 lg:p-8 cursor-pointer hover:bg-grey-50/50 active:bg-grey-100 transition-all duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleModule(module.id);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleModule(module.id);
                      }
                    }}
                    aria-expanded={isExpanded}
                    aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${module.name} module`}
                  >
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                      {/* Module Icon Preview */}
                      <div className="relative w-full sm:w-32 h-32 sm:h-32 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center border-2 border-grey-200 shadow-sm">
                        <div className={`w-20 h-20 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-xl ${
                          module.color === "primary" ? "bg-gradient-to-br from-primary-500 to-primary-600" : "bg-gradient-to-br from-accent-500 to-accent-600"
                        }`}>
                          <IconComponent size={40} className="sm:w-8 sm:h-8 text-white drop-shadow-md" />
                        </div>
                      </div>

                      <div className="flex-1 w-full">
                        <div className="flex items-start sm:items-center justify-between mb-3 gap-3">
                          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-secondary-800 break-words leading-tight">{module.name}</h3>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-grey-100 transition-colors group">
                            <span className="text-xs sm:text-sm text-grey-600 hidden sm:inline font-medium">
                              {isExpanded ? 'Collapse' : 'Expand'}
                            </span>
                            <ChevronDown
                              size={20}
                              className={`text-primary-600 transition-all duration-300 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''} group-hover:scale-110`}
                            />
                          </div>
                        </div>
                        <p className="text-base sm:text-lg text-grey-600 mb-4 leading-relaxed">{module.description}</p>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 text-primary-700 font-medium">
                            <Package size={14} className="sm:w-4 sm:h-4" />
                            {module.services.length} {module.services.length === 1 ? 'Service' : 'Services'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Services */}
                  {isExpanded && (
                    <div className="border-t-2 border-grey-200 bg-gradient-to-b from-grey-50/30 via-white to-white overflow-hidden">
                      <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
                        <div className="mb-4 sm:mb-6 pb-4 border-b border-grey-200">
                          <h4 className="text-lg sm:text-xl font-semibold text-secondary-800 mb-1 flex items-center gap-2">
                            <Package size={20} className="text-primary-600" />
                            Available Services
                          </h4>
                          <p className="text-sm text-grey-600">
                            Explore {module.services.length} {module.services.length === 1 ? 'service' : 'services'} in this module
                          </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                          {module.services.map((service, serviceIndex) => {
                            const ServiceIcon = service.icon;
                            return (
                              <Card
                                key={`${module.id}-service-${serviceIndex}`}
                                variant="floating"
                                hover
                                className="p-6 group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border-2 border-transparent hover:border-primary-200 h-full flex flex-col"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleFeatureClick(service.title);
                                }}
                              >
                                {/* Service Icon Preview */}
                                <div className="relative w-full h-32 rounded-lg overflow-hidden mb-4 bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center border border-grey-200 shadow-sm">
                                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-md transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${
                                    module.color === "primary" ? "bg-gradient-to-br from-primary-500 to-primary-600" : "bg-gradient-to-br from-accent-500 to-accent-600"
                                  }`}>
                                    <ServiceIcon size={28} className="text-white drop-shadow-sm" />
                                  </div>
                                </div>
                                
                                <div className="mb-3">
                                  <h4 className="text-base sm:text-lg font-semibold text-secondary-800 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                                    {service.title}
                                  </h4>
                                  <p className="text-xs sm:text-sm text-grey-600 mb-3 leading-relaxed line-clamp-3">
                                    {service.description}
                                  </p>
                                </div>

                                {/* Features List */}
                                <div className="space-y-2 mb-4">
                                  {service.features.slice(0, 3).map((feature, featureIndex) => (
                                    <div key={featureIndex} className="flex items-start gap-2 text-xs text-grey-600">
                                      <CheckCircle2 size={14} className="text-primary-600 flex-shrink-0 mt-0.5" />
                                      <span className="leading-relaxed">{feature}</span>
                                    </div>
                                  ))}
                                  {service.features.length > 3 && (
                                    <div className="text-xs text-primary-600 font-medium mt-2 flex items-center gap-1">
                                      <span>+{service.features.length - 3} more features</span>
                                    </div>
                                  )}
                                </div>

                                <div className="mt-auto pt-3 border-t border-grey-200 flex items-center justify-between">
                                  <span className="text-xs text-grey-500 font-medium">Click to explore</span>
                                  <ArrowRight size={16} className="text-primary-600 group-hover:translate-x-1 transition-transform" />
                                </div>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Summary Stats */}
          <div className="mt-12 sm:mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { label: "Total Services", value: 53 },
              { label: "Modules", value: 10 },
              { label: "Features", value: "250+" },
              { label: "Integrations", value: "Unlimited" },
            ].map((stat, index) => (
              <Card key={index} variant="floating" className="p-6 text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">{stat.value}</div>
                <div className="text-sm text-grey-600">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Portals – access everything */}
      <section id="portals" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 bg-gradient-to-b from-white to-grey-50">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-6">
            <Rocket size={16} />
            <span>Access Your Portal</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-secondary-800 mb-4 px-4">
            One Platform, Every Role
          </h2>
          <p className="text-lg sm:text-xl text-grey-600 max-w-3xl mx-auto leading-relaxed px-4">
            Sign in to the right place for your role. All 53 services and 10 modules are available from your portal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
          <Card variant="floating" hover className="p-6 text-center cursor-pointer" onClick={() => router.push("/login")}>
            <Building2 className="w-12 h-12 text-primary-600 mx-auto mb-3" />
            <h3 className="font-semibold text-secondary-800 mb-1">Company Admin</h3>
            <p className="text-sm text-grey-600 mb-4">Company, users, Contract Team, HR</p>
            <Button variant="outline" size="sm">Open Portal</Button>
          </Card>
          <Card variant="floating" hover className="p-6 text-center cursor-pointer" onClick={() => router.push("/login")}>
            <UserCircle className="w-12 h-12 text-primary-600 mx-auto mb-3" />
            <h3 className="font-semibold text-secondary-800 mb-1">Employee</h3>
            <p className="text-sm text-grey-600 mb-4">Profile, leave, timesheets, docs</p>
            <Button variant="outline" size="sm">Open Portal</Button>
          </Card>
          <Card variant="floating" hover className="p-6 text-center cursor-pointer" onClick={() => router.push("/login")}>
            <PenTool className="w-12 h-12 text-primary-600 mx-auto mb-3" />
            <h3 className="font-semibold text-secondary-800 mb-1">Contract Team</h3>
            <p className="text-sm text-grey-600 mb-4">MSA, NDA, PO, WO, SOW – create & sign</p>
            <Button variant="outline" size="sm">Open Portal</Button>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="gradient"
            size="lg"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push("/signup");
            }}
            className="min-w-[200px]"
          >
            Create Free Account
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push("/login");
            }}
            className="min-w-[200px]"
          >
            Sign In
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32 text-center bg-gradient-to-br from-primary-50 via-white to-accent-50 relative overflow-hidden">
        {/* Decorative background - pointer-events-none */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-20 w-64 h-64 bg-primary-200/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 left-20 w-80 h-80 bg-accent-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
            <Rocket size={16} />
            <span>Get Started Today</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-800 mb-4 sm:mb-6 px-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-grey-600 mb-8 sm:mb-12 leading-relaxed px-4">
            Experience the power of a complete, integrated business management platform. Everything you need, all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="gradient"
              size="lg"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push("/signup");
              }}
              className="min-w-[200px]"
            >
              Create Free Account
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push("/login");
              }}
              className="min-w-[200px]"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-grey-200 py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <Link href="/">
                <XeroBookzLogo size="md" />
              </Link>
              <p className="text-grey-600 text-sm">
                © 2025 XeroBookz. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-grey-600">
              <Link href="/about" className="hover:text-secondary-800 transition-colors">About Us</Link>
              <Link href="/privacy" className="hover:text-secondary-800 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-secondary-800 transition-colors">Terms of Service</Link>
              <Link href="/contact" className="hover:text-secondary-800 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
