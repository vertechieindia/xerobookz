"use client";

import { useState } from "react";
import Link from "next/link";
import { XeroBookzLogo, Button, Input } from "@xerobookz/ui-shared";
import { Mail, Phone, MapPin, Send, MessageSquare, User, Building2, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: "",
      });
    }, 3000);
  };

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
              <Link href="/terms" className="text-secondary-700 hover:text-primary-600 transition-colors text-sm font-medium">
                Terms
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
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-6">
              <MessageSquare className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-grey-600 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-secondary-800 mb-6">Contact Information</h2>
                <p className="text-grey-600 mb-8">
                  Reach out to us through any of these channels. We're here to help!
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 bg-grey-50 rounded-xl border border-grey-200">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-800 mb-1">Email</h3>
                    <a href="mailto:support@xerobookz.com" className="text-primary-600 hover:underline">
                      support@xerobookz.com
                    </a>
                    <p className="text-sm text-grey-600 mt-1">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-grey-50 rounded-xl border border-grey-200">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-800 mb-1">Phone</h3>
                    <a href="tel:+1-678-603-8174" className="text-primary-600 hover:underline">
                      +1 (678) 603-8174
                    </a>
                    <p className="text-sm text-grey-600 mt-1">Mon-Fri, 9am-5pm EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-grey-50 rounded-xl border border-grey-200">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-800 mb-1">Address</h3>
                    <p className="text-grey-700">
                      XeroBookz, LLC<br />
                      1111 Oak Hollow CT<br />
                      Hampton, GA 30228<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-primary-50 rounded-xl border border-primary-200">
                <h3 className="font-semibold text-secondary-800 mb-2">Support Hours</h3>
                <p className="text-sm text-grey-700">
                  <strong>Monday - Friday:</strong> 9:00 AM - 5:00 PM EST<br />
                  <strong>Saturday - Sunday:</strong> Closed<br />
                  <strong>Holidays:</strong> Closed
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-grey-50 rounded-xl p-8 border border-grey-200">
              <h2 className="text-2xl font-bold text-secondary-800 mb-6">Send us a Message</h2>
              
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-800 mb-2">Message Sent!</h3>
                  <p className="text-grey-600">We'll get back to you as soon as possible.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-secondary-700 mb-2">
                      <Building2 className="w-4 h-4 inline mr-1" />
                      Company
                    </label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Acme Inc."
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-secondary-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-grey-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="sales">Sales & Pricing</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership Opportunities</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-secondary-700 mb-2">
                      <MessageSquare className="w-4 h-4 inline mr-1" />
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Tell us how we can help..."
                      className="w-full px-4 py-2 border border-grey-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
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

