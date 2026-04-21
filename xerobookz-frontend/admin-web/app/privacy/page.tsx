"use client";

import Link from "next/link";
import { XeroBookzLogo } from "@xerobookz/ui-shared";
import { Shield, Lock, Eye, FileText, Users, Globe, Mail } from "lucide-react";

export default function PrivacyPolicyPage() {
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
              <Link href="/terms" className="text-secondary-700 hover:text-primary-600 transition-colors text-sm font-medium">
                Terms
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
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-grey-600">
              Last updated: January 2025
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none space-y-8">
            <section className="bg-grey-50 rounded-xl p-8 border border-grey-200">
              <div className="flex items-start gap-4 mb-4">
                <Lock className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-secondary-800 mb-4">1. Introduction</h2>
                  <p className="text-grey-700 leading-relaxed">
                    XeroBookz ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our HR, Payroll, and Compliance management platform (the "Service").
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-grey-50 rounded-xl p-8 border border-grey-200">
              <div className="flex items-start gap-4 mb-4">
                <Eye className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-secondary-800 mb-4">2. Information We Collect</h2>
                  <div className="space-y-4 text-grey-700">
                    <div>
                      <h3 className="font-semibold text-secondary-800 mb-2">2.1 Personal Information</h3>
                      <p className="leading-relaxed">
                        We collect personal information that you provide directly to us, including but not limited to:
                      </p>
                      <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                        <li>Name, email address, phone number, and mailing address</li>
                        <li>Employment information (job title, department, employment status)</li>
                        <li>Government identification numbers (for compliance purposes)</li>
                        <li>Bank account information (for payroll processing)</li>
                        <li>Immigration and work authorization documents</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-800 mb-2">2.2 Automatically Collected Information</h3>
                      <p className="leading-relaxed">
                        We automatically collect certain information when you use our Service, including:
                      </p>
                      <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                        <li>IP address and device information</li>
                        <li>Browser type and version</li>
                        <li>Usage data and analytics</li>
                        <li>Cookies and similar tracking technologies</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-grey-50 rounded-xl p-8 border border-grey-200">
              <div className="flex items-start gap-4 mb-4">
                <FileText className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-secondary-800 mb-4">3. How We Use Your Information</h2>
                  <p className="text-grey-700 leading-relaxed mb-4">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-grey-700 ml-4">
                    <li>Provide, maintain, and improve our Service</li>
                    <li>Process payroll and manage employee benefits</li>
                    <li>Ensure compliance with employment and immigration laws</li>
                    <li>Send you administrative information and updates</li>
                    <li>Respond to your inquiries and provide customer support</li>
                    <li>Detect, prevent, and address technical issues and security threats</li>
                    <li>Comply with legal obligations and enforce our agreements</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-grey-50 rounded-xl p-8 border border-grey-200">
              <div className="flex items-start gap-4 mb-4">
                <Users className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-secondary-800 mb-4">4. Information Sharing and Disclosure</h2>
                  <p className="text-grey-700 leading-relaxed mb-4">
                    We do not sell your personal information. We may share your information in the following circumstances:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-grey-700 ml-4">
                    <li><strong>Service Providers:</strong> With third-party service providers who perform services on our behalf</li>
                    <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                    <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                    <li><strong>With Your Consent:</strong> When you have given us explicit permission to share</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-grey-50 rounded-xl p-8 border border-grey-200">
              <div className="flex items-start gap-4 mb-4">
                <Globe className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-secondary-800 mb-4">5. Data Security</h2>
                  <p className="text-grey-700 leading-relaxed">
                    We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and access controls. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-grey-50 rounded-xl p-8 border border-grey-200">
              <div className="flex items-start gap-4 mb-4">
                <Mail className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-secondary-800 mb-4">6. Your Rights</h2>
                  <p className="text-grey-700 leading-relaxed mb-4">
                    Depending on your location, you may have the following rights regarding your personal information:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-grey-700 ml-4">
                    <li>Access and receive a copy of your personal data</li>
                    <li>Rectify inaccurate or incomplete data</li>
                    <li>Request deletion of your personal data</li>
                    <li>Object to processing of your personal data</li>
                    <li>Request restriction of processing</li>
                    <li>Data portability</li>
                    <li>Withdraw consent at any time</li>
                  </ul>
                  <p className="text-grey-700 leading-relaxed mt-4">
                    To exercise these rights, please contact us at <a href="mailto:privacy@xerobookz.com" className="text-primary-600 hover:underline">privacy@xerobookz.com</a>.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-grey-50 rounded-xl p-8 border border-grey-200">
              <h2 className="text-2xl font-bold text-secondary-800 mb-4">7. Data Retention</h2>
              <p className="text-grey-700 leading-relaxed">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
              </p>
            </section>

            <section className="bg-grey-50 rounded-xl p-8 border border-grey-200">
              <h2 className="text-2xl font-bold text-secondary-800 mb-4">8. Children's Privacy</h2>
              <p className="text-grey-700 leading-relaxed">
                Our Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            <section className="bg-grey-50 rounded-xl p-8 border border-grey-200">
              <h2 className="text-2xl font-bold text-secondary-800 mb-4">9. Changes to This Privacy Policy</h2>
              <p className="text-grey-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section className="bg-grey-50 rounded-xl p-8 border border-grey-200">
              <h2 className="text-2xl font-bold text-secondary-800 mb-4">10. Contact Us</h2>
              <p className="text-grey-700 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="space-y-2 text-grey-700">
                <p><strong>Email:</strong> <a href="mailto:privacy@xerobookz.com" className="text-primary-600 hover:underline">privacy@xerobookz.com</a></p>
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

