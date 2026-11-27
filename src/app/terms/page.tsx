import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { CheckCircle2, Shield, AlertTriangle, Truck, HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'Terms and Conditions | Himali Fresh',
  description: 'Understand the terms governing your purchases, pricing transparency, and order fulfillment at Himali Fresh.',
};

export default function TermsPage() {
  const lastUpdated = 'November 2026';

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <Header />

      <main className="flex-1 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-[#E8DFC8] bg-white p-6 sm:p-12 shadow-sm space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-[#064B32] mb-3">
                <Shield className="h-3.5 w-3.5" />
                <span>Fair Commercial Terms &amp; Zero Hidden Fees</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                Terms and Conditions
              </h1>
              <p className="text-xs text-gray-500 mt-2">
                Last updated: {lastUpdated} • Himali Fresh (Siliguri, West Bengal)
              </p>
            </div>

            <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
              
              {/* 1. Introduction & Acceptance */}
              <section className="space-y-2">
                <h2 className="font-serif text-lg font-bold text-gray-900">
                  1. Acceptance of Terms
                </h2>
                <p>
                  By accessing, browsing, or placing an order on <strong>himalifresh.com</strong>, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree with any part of these terms, please refrain from using the platform. You must be at least 18 years of age or possess legal parental/guardian consent to enter into transactions with Himali Fresh.
                </p>
              </section>

              {/* 2. Honest Pricing & Zero Hidden Charges */}
              <section className="space-y-2 rounded-2xl bg-[#FAF5EB] p-5 border border-[#E8DFC8]">
                <h2 className="font-serif text-lg font-bold text-[#064B32] flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> 2. Fair Pricing &amp; Zero Hidden Fees Policy
                </h2>
                <p>
                  At Himali Fresh, we despise dark patterns and hidden charges. We commit to complete pricing transparency:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li><strong>All Prices in INR:</strong> All product prices displayed on the store are in Indian Rupees (INR) and are inclusive of applicable taxes.</li>
                  <li><strong>Clear Delivery Fees:</strong> Delivery costs are calculated based transparently on destination PIN code and parcel weight. There are no sudden convenience fees or packaging surcharges at checkout.</li>
                  <li><strong>No Hidden Subscriptions:</strong> We do not operate pre-ticked subscription traps, auto-debits, or surprise recurring charges.</li>
                </ul>
              </section>

              {/* 3. Order Model & Availability */}
              <section className="space-y-2">
                <h2 className="font-serif text-lg font-bold text-gray-900">
                  3. Authentic Mountain Produce &amp; Seasonal Availability
                </h2>
                <p>
                  Himali Fresh curates authentic regional delicacies sourced from farmers and artisanal kitchens across Darjeeling, Kalimpong, Sikkim, and the Himalayan foothills (including genuine Dalle Khursani chillies, wild Timur pepper, Gundruk, Chhurpi yak cheese, and seasonal bamboo shoots).
                </p>
                <p>
                  Because these agricultural products depend on weather cycles and harvest seasons, occasional variations in taste, pungency, or seasonal stock shortages may occur. If an item you ordered is unavailable prior to dispatch, our team will promptly notify you on WhatsApp to adjust your order before packaging.
                </p>
              </section>

              {/* 4. Order Confirmation & Payment Coordination */}
              <section className="space-y-2">
                <h2 className="font-serif text-lg font-bold text-gray-900">
                  4. Order Placement and Payment Coordination
                </h2>
                <p>
                  Once you place an order on our website:
                </p>
                <ol className="list-decimal pl-5 space-y-1.5 text-gray-600">
                  <li>You receive an automated order confirmation and tracking ID on screen and via email.</li>
                  <li>Our Siliguri dispatch team reviews the fresh batch and securely packages glass containers.</li>
                  <li>For cash-on-delivery or direct UPI payments, our team confirms dispatch details with you directly via WhatsApp or phone.</li>
                </ol>
              </section>

              {/* 5. Shipping & Interstate Courier */}
              <section className="space-y-2">
                <h2 className="font-serif text-lg font-bold text-gray-900">
                  5. Shipping, Transit &amp; Delivery Timelines
                </h2>
                <p>
                  Orders are dispatched from our central hub in <strong>Dagapur, Siliguri, West Bengal (PIN 734010)</strong> via dependable domestic express couriers (e.g., Delhivery, BlueDart, India Post). Standard delivery typically takes 2–4 business days within North Bengal and 4–7 business days across other states in India.
                </p>
              </section>

              {/* 6. All Sales Final — No Return, Replacement, or Refund */}
              <section className="space-y-2 rounded-2xl bg-red-50/70 p-5 border border-red-200">
                <h2 className="font-serif text-lg font-bold text-red-950">
                  6. All Sales Final — Strict No Return, No Replacement &amp; No Refund Policy
                </h2>
                <p className="text-red-950 font-medium">
                  Due to the consumable, perishable, and artisanal nature of food products, Himali Fresh operates on a strict <strong>NO RETURN, NO REPLACEMENT, AND NO REFUND</strong> policy. All sales are final once an order has been dispatched.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-red-900">
                  <li>No returns or exchanges are accepted under FSSAI food hygiene guidelines.</li>
                  <li>No replacements are issued for subjective taste preferences or courier transit times.</li>
                  <li>Cancellations are accepted strictly before package dispatch from our Siliguri hub.</li>
                </ul>
              </section>

              {/* 7. Limitation of Liability */}
              <section className="space-y-2">
                <h2 className="font-serif text-lg font-bold text-gray-900">
                  7. Food Safety &amp; Allergen Disclaimers
                </h2>
                <p>
                  While we take utmost care to describe all ingredients accurately (such as mustard oil in traditional pickles or spices in titoura snacks), customers with severe food allergies (e.g., mustard, gluten, dairy, or extreme chilli capsaicin sensitivity) are strongly advised to inspect the product packaging details before consumption.
                </p>
              </section>

              {/* 8. Governing Law & Jurisdiction */}
              <section className="space-y-2">
                <h2 className="font-serif text-lg font-bold text-gray-900">
                  8. Governing Law and Dispute Jurisdiction
                </h2>
                <p>
                  These terms are governed by and construed in accordance with the laws of the Republic of India. Any legal dispute or claim arising out of your relationship with Himali Fresh shall fall under the exclusive jurisdiction of the competent civil courts at <strong>Siliguri, West Bengal, India</strong>.
                </p>
              </section>

              {/* 9. Contact Details */}
              <section className="space-y-2">
                <h2 className="font-serif text-lg font-bold text-gray-900">
                  9. Merchant &amp; Business Details
                </h2>
                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 text-xs space-y-1">
                  <p><strong>Business Name:</strong> Himali Fresh</p>
                  <p><strong>Physical Address:</strong> Dagapur, Siliguri, West Bengal, India - 734010</p>
                  <p><strong>Customer Care Phone:</strong> <a href="tel:+917477768499" className="text-[#064B32] font-semibold">+91 74777 68499</a></p>
                  <p><strong>Customer Care Email:</strong> <a href="mailto:himalifresh@gmail.com" className="text-[#064B32] font-semibold underline">himalifresh@gmail.com</a></p>
                </div>
              </section>
            </div>

            <div className="pt-6 border-t border-[#E8DFC8] flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500">
              <span>Himali Fresh • The Spirit of Himalayas</span>
              <div className="flex items-center gap-4">
                <Link href="/privacy-policy" className="text-[#064B32] font-semibold hover:underline">
                  Privacy Policy →
                </Link>
                <Link href="/refund-policy" className="text-[#064B32] font-semibold hover:underline">
                  Refund Policy →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
