"use client";

import Link from "next/link";
import { XeroBookzLogo } from "@xerobookz/ui-shared";
import { FileText, Scale, AlertCircle, CheckCircle, XCircle, Users, CreditCard, Shield } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-grey-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <XeroBookzLogo size="lg" />
            </Link>
            <div className="flex gap-4 flex-wrap justify-end">
              <Link href="/about" className="text-secondary-700 hover:text-primary-600 transition-colors text-sm font-medium">
                About Us
              </Link>
              <Link href="/contact" className="text-secondary-700 hover:text-primary-600 transition-colors text-sm font-medium">
                Contact
              </Link>
              <Link href="/privacy" className="text-secondary-700 hover:text-primary-600 transition-colors text-sm font-medium">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-6">
              <Scale className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-grey-600">
              Last updated: January 2025
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none space-y-8">
            <section className="bg-grey-50 rounded-xl p-8 border border-grey-200">
              <div className="flex items-start gap-4 mb-4">
                <FileText className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-secondary-800 mb-4">1. Agreement to Terms</h2>
                  <p className="text-grey-700 leading-relaxed">
                    By accessing or using XeroBookz ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service. These Terms apply to all visitors, users, and others who access or use the Service.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-grey-50 rounded-xl p-8 border border-grey-200">
              <div className="flex items-start gap-4 mb-4">
                <Users className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-secondary-800 mb-4">2. Use License</h2>
                  <p className="text-grey-700 leading-relaxed mb-4">
                    Permission is granted to temporarily use the Service for personal or commercial purposes. This license does not include:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-grey-700 ml-4">
                    <li>Modifying or copying the Service</li>
                    <li>Using the Service for any commercial purpose without our written consent</li>
                    <li>Attempting to decompile or reverse engineer any software contained in the Service</li>
                    <li>Removing any copyright or other proprietary notations</li>
                    <li>Transferring the Service to another person or "mirroring" the Service on any other server</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-grey-50 rounded-xl p-8 border border-grey-200">
              <div className="flex items-start gap-4 mb-4">
                <AlertCircle className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-secondary-800 mb-4">3. User Accounts</h2>
                  <p className="text-grey-700 leading-relaxed mb-4">
                    When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-grey-700 ml-4">
                    <li>Maintaining the security of your account and password</li>
                    <li>All activities that occur under your account</li>
                    <li>Notifying us immediately of any unauthorized use of your account</li>
                    <li>Ensuring that your account information is kept up to date</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-grey-50 rounded-xl p-8 border border-grey-200">
              <div className="flex items-start gap-4 mb-4">
                <Shield className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-secondary-800 mb-4">4. Acceptable Use</h2>
                  <p className="text-grey-700 leading-relaxed mb-4">
                    You agree not to use the Service:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-grey-700 ml-4">
                    <li>In any way that violates any applicable national or international law or regulation</li>
                    <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent</li>
                    <li>To impersonate or attempt to impersonate the company, a company employee, another user, or any other person or entity</li>
                    <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful</li>
                    <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-grey-50 rounded-xl p-8 border border-grey-200">
              <div className="flex items-start gap-4 mb-4">
                <CreditCard className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-secondary-800 mb-4">5. Payment Terms</h2>
                  <p className="text-grey-700 leading-relaxed mb-4">
                    If you purchase a subscription to the Service, you agree to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-grey-700 ml-4">
                    <li>Pay all fees associated with your subscription</li>
                    <li>Provide current, complete, and accurate purchase and account information</li>
                    <li>Promptly update your account and payment information to keep it current</li>
                    <li>Authorize us to charge your chosen payment method for all fees</li>
                  </ul>
                  <p className="text-grey-700 leading-relaxed mt-4">
                    All fees are non-refundable unless otherwise stated. We reserve the right to change our pricing with 30 days' notice.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-grey-50 rounded-xl p-8 border border-grey-200">
              <h2 className="text-2xl font-bold text-secondary-800 mb-4">6. Intellectual Property</h2>
              <p className="text-grey-700 leading-relaxed">
                The Service and its original content, features, and functionality are and will remain the exclusive property of XeroBookz and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
              </p>
            </section>

            <section className="bg-grey-50 rounded-xl p-8 border border-grey-200">
              <h2 className="text-2xl font-bold text-secondary-800 mb-4">7. Disclaimer</h2>
              <p className="text-grey-700 leading-relaxed mb-4">
                The information on the Service is provided on an "as is" basis. To the fullest extent permitted by law, XeroBookz:
              </p>
              <ul className="list-disc list-inside space-y-2 text-grey-700 ml-4">
                <li>Excludes all representations, warranties, and conditions relating to the Service</li>
                <li>Excludes all liability for damages arising out of or in connection with your use of the Service</li>
                <li>Does not guarantee that the Service will be available, uninterrupted, secure, or error-free</li>
              </ul>
            </section>

            <section className="bg-grey-50 rounded-xl p-8 border border-grey-200">
              <h2 className="text-2xl font-bold text-secondary-800 mb-4">8. Limitation of Liability</h2>
              <p className="text-grey-700 leading-relaxed">
                In no event shall XeroBookz, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
              </p>
            </section>

            <section className="bg-grey-50 rounded-xl p-8 border border-grey-200">
              <h2 className="text-2xl font-bold text-secondary-800 mb-4">9. Indemnification</h2>
              <p className="text-grey-700 leading-relaxed">
                You agree to defend, indemnify, and hold harmless XeroBookz and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees).
              </p>
            </section>

            <section className="bg-grey-50 rounded-xl p-8 border border-grey-200">
              <h2 className="text-2xl font-bold text-secondary-800 mb-4">10. Termination</h2>
              <p className="text-grey-700 leading-relaxed">
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
              </p>
            </section>

            <section className="bg-grey-50 rounded-xl p-8 border border-grey-200">
              <h2 className="text-2xl font-bold text-secondary-800 mb-4">11. Governing Law</h2>
              <p className="text-grey-700 leading-relaxed">
                These Terms shall be interpreted and governed by the laws of the State of Georgia, United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>
            </section>

            <section className="bg-grey-50 rounded-xl p-8 border border-grey-200">
              <h2 className="text-2xl font-bold text-secondary-800 mb-4">12. Changes to Terms</h2>
              <p className="text-grey-700 leading-relaxed">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </section>

            <section className="bg-grey-50 rounded-xl p-8 border border-grey-200">
              <h2 className="text-2xl font-bold text-secondary-800 mb-4">13. Contact Information</h2>
              <p className="text-grey-700 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-grey-700">
                <p><strong>Email:</strong> <a href="mailto:legal@xerobookz.com" className="text-primary-600 hover:underline">legal@xerobookz.com</a></p>
                <p><strong>Address:</strong> XeroBookz, LLC</p>
                <p className="ml-6">1111 Oak Hollow CT</p>
                <p className="ml-6">Hampton, GA 30228</p>
                <p className="ml-6">United States</p>
                <p><strong>Phone:</strong> <a href="tel:+1-678-603-8174" className="text-primary-600 hover:underline">+1 (678) 603-8174</a></p>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-grey-200 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
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

