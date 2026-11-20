import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-himali-cream/30">
      <Header />

      <main className="flex-1 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-himali-border bg-white p-8 sm:p-12 shadow-card space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-himali-green">
                Legal & Privacy
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-himali-dark mt-2 mb-2">
                Privacy Policy
              </h1>
              <p className="text-xs text-himali-muted">
                Last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </p>
            </div>

            <div className="space-y-6 text-sm text-himali-text/90 leading-relaxed">
              <section className="space-y-2">
                <h2 className="font-serif text-lg font-bold text-himali-dark">
                  1. Information We Collect
                </h2>
                <p>
                  When you submit an order enquiry or use our contact form at Himali Fresh, we collect information necessary to fulfill your request:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-himali-muted">
                  <li>Your full name</li>
                  <li>Contact phone number (including WhatsApp contact details)</li>
                  <li>Delivery address, city, and PIN code</li>
                  <li>Optional landmarks and specific delivery instructions</li>
                  <li>Selected product items and quantities</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="font-serif text-lg font-bold text-himali-dark">
                  2. How We Use Your Information
                </h2>
                <p>
                  We use this information exclusively for:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-himali-muted">
                  <li>Verifying local stock and seasonal availability of Himalayan products</li>
                  <li>Connecting with you on WhatsApp or phone to confirm your delivery and order details</li>
                  <li>Dispatching parcels to your destination address</li>
                  <li>Responding to customer support queries</li>
                </ul>
                <p>
                  We never sell, rent, or trade your personal information with third-party advertising companies.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-serif text-lg font-bold text-himali-dark">
                  3. Order Enquiries and WhatsApp Communication
                </h2>
                <p>
                  Our website generates a formatted WhatsApp message to connect you directly with the owner of Himali Fresh. WhatsApp is a third-party service subject to its own privacy policy. Please ensure you review their terms when interacting on that platform.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-serif text-lg font-bold text-himali-dark">
                  4. Data Storage and Security
                </h2>
                <p>
                  We implement industry-standard database encryption and access controls. Administrative access to order records is strictly restricted to authenticated personnel.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-serif text-lg font-bold text-himali-dark">
                  5. Contacting Us About Your Data
                </h2>
                <p>
                  If you wish to update or delete your customer enquiry details, please reach out to us at <a href="mailto:info@himalifresh.com" className="text-himali-green font-semibold underline">info@himalifresh.com</a> or via phone at <span className="font-semibold">+91 98320 78728</span>.
                </p>
              </section>
            </div>

            <div className="pt-6 border-t border-himali-border flex items-center justify-between text-xs text-himali-muted">
              <span>Himali Fresh • Dagapur, Siliguri, West Bengal</span>
              <Link href="/terms" className="text-himali-green hover:underline">
                Terms and Conditions →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
