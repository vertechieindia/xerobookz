"use client";

import Link from "next/link";
import { XeroBookzLogo, Button } from "@xerobookz/ui-shared";
import {
  Target,
  Heart,
  Lightbulb,
  Users,
  Shield,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-grey-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <Link href="/" className="shrink-0">
              <XeroBookzLogo size="lg" />
            </Link>
            <div className="flex items-center gap-4 sm:gap-6">
              <Link
                href="/about"
                className="text-sm font-medium text-primary-600"
                aria-current="page"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium text-secondary-700 hover:text-primary-600 transition-colors hidden sm:inline"
              >
                Contact
              </Link>
              <Link
                href="/signup"
                className="text-sm font-medium text-secondary-700 hover:text-primary-600 transition-colors"
              >
                Sign Up
              </Link>
              <Link href="/login">
                <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="pt-24 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-accent-50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
              <Sparkles size={16} />
              <span>Who we are</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-secondary-900 mb-6 leading-tight">
              About XeroBookz
            </h1>
            <p className="text-lg sm:text-xl text-grey-600 leading-relaxed max-w-3xl mx-auto">
              We build software that helps teams run their whole business in one place—from sales and
              finance to HR, operations, and beyond—so you can focus on growth, not juggling tools.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-grey-100">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-100 mb-4">
                  <Target className="w-6 h-6 text-primary-600" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-secondary-800 mb-4">Our mission</h2>
                <p className="text-grey-600 leading-relaxed">
                  To give every organization a single, reliable platform for how work gets done—clear
                  roles, secure access, and modules that connect instead of siloing your data.
                </p>
              </div>
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent-100 mb-4">
                  <Lightbulb className="w-6 h-6 text-accent-600" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-secondary-800 mb-4">What we believe</h2>
                <p className="text-grey-600 leading-relaxed">
                  Great software should feel simple on the surface and be serious underneath—multi-tenant
                  by design, built for compliance where it matters, and ready to scale with you.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-grey-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-secondary-800 text-center mb-12">
              What guides us
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  title: "Customer-first",
                  body: "We listen to real workflows—finance, HR, ops—and shape the product around outcomes, not buzzwords.",
                },
                {
                  icon: Shield,
                  title: "Trust & security",
                  body: "Your data and tenant boundaries matter. We design authentication, roles, and auditability into the core.",
                },
                {
                  icon: Heart,
                  title: "Long-term partnership",
                  body: "We are in this for teams that grow over years—clear roadmaps, sensible defaults, and room to customize.",
                },
              ].map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-grey-200 bg-white p-6 shadow-soft hover:border-primary-200 transition-colors"
                >
                  <Icon className="w-8 h-8 text-primary-600 mb-4" />
                  <h3 className="text-lg font-semibold text-secondary-800 mb-2">{title}</h3>
                  <p className="text-grey-600 text-sm leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-secondary-800 mb-4">
              See the platform for yourself
            </h2>
            <p className="text-grey-600 mb-8">
              Create a company account or sign in to explore dashboards, modules, and tools your team can
              use today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button variant="gradient" size="lg" className="min-w-[200px] w-full sm:w-auto">
                  Create account
                  <ArrowRight className="ml-2 w-4 h-4 inline" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="min-w-[200px] w-full sm:w-auto">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-grey-200 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <Link href="/">
                <XeroBookzLogo size="md" />
              </Link>
              <p className="text-grey-600 text-sm">© 2025 XeroBookz. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-grey-600">
              <Link href="/about" className="text-primary-600 font-medium">
                About Us
              </Link>
              <Link href="/privacy" className="hover:text-secondary-800 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-secondary-800 transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-secondary-800 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
