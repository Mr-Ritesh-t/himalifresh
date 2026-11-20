import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-himali-cream/30">
      <Header />

      <main className="flex-1 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-himali-border bg-white p-8 sm:p-12 shadow-card space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-himali-green">
                Customer Agreement
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-himali-dark mt-2 mb-2">
                Terms and Conditions
              </h1>
              <p className="text-xs text-himali-muted">
                Last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </p>
            </div>

            <div className="space-y-6 text-sm text-himali-text/90 leading-relaxed">
              <section className="space-y-2">
                <h2 className="font-serif text-lg font-bold text-himali-dark">
                  1. Order Enquiry Nature of the Platform
                </h2>
                <p>
                  Himali Fresh operates on a personal customer-enquiry model. Placing an enquiry on this website does not constitute an automatically binding transaction until our team verifies fresh batch availability and mutually confirms your order via WhatsApp or phone.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-serif text-lg font-bold text-himali-dark">
                  2. Product Availability and Seasonal Batches
                </h2>
                <p>
                  Because our products are authentic, traditionally harvested hill produce (including Dalle chillies, wild Timur, seasonal squash, and artisanal pickles), availability may vary depending on harvest seasons and weather conditions in the Eastern Himalayas. If an item is unavailable, we will inform you and suggest authentic alternatives.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-serif text-lg font-bold text-himali-dark">
                  3. Pricing and Payments
                </h2>
                <p>
                  All listed product prices are in Indian Rupees (INR). No payment is processed directly on this website. Delivery fees are calculated based on parcel weight and destination PIN code, and payment arrangements (such as UPI or bank transfer) are finalized directly with the business owner.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-serif text-lg font-bold text-himali-dark">
                  4. Shipping and Delivery
                </h2>
                <p>
                  Orders are dispatched from our hub in Dagapur, Siliguri, West Bengal, using reputable courier partners. We inspect and securely package all glass jars and sealed perishables to withstand inter-state transit.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-serif text-lg font-bold text-himali-dark">
                  5. Cancellations and Returns
                </h2>
                <p>
                  You may modify or cancel your order enquiry at any time before shipment dispatch by contacting us on WhatsApp. In the rare event of transit damage to glass jars, please share photographic proof upon receipt for immediate resolution.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-serif text-lg font-bold text-himali-dark">
                  6. Contact Details
                </h2>
                <p>
                  Himali Fresh, Dagapur, Siliguri, West Bengal, India. Phone: <span className="font-semibold">+91 98320 78728</span>, Email: <span className="font-semibold">info@himalifresh.com</span>.
                </p>
              </section>
            </div>

            <div className="pt-6 border-t border-himali-border flex items-center justify-between text-xs text-himali-muted">
              <span>Himali Fresh • The Spirit of Himalayas</span>
              <Link href="/privacy-policy" className="text-himali-green hover:underline">
                Privacy Policy →
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
