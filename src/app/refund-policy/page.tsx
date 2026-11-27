import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { Ban, AlertCircle, ShieldAlert, CheckCircle2, MessageSquare, Clock } from 'lucide-react';

export const metadata = {
  title: 'No Return & No Refund Policy | Himali Fresh',
  description: 'Strict No Return, No Replacement, and No Refund policy for consumable and perishable Himalayan food products.',
};

export default function RefundPolicyPage() {
  const lastUpdated = 'November 2026';

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <Header />

      <main className="flex-1 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-[#E8DFC8] bg-white p-6 sm:p-12 shadow-sm space-y-8">
            
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-300 px-3 py-1 text-xs font-semibold text-amber-900 mb-3">
                <Ban className="h-3.5 w-3.5 text-amber-700" />
                <span>All Sales Final • Consumable Food Products</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                No Return &amp; No Refund Policy
              </h1>
              <p className="text-xs text-gray-500 mt-2">
                Last updated: {lastUpdated} • Himali Fresh (Siliguri, West Bengal, India)
              </p>
            </div>

            {/* Prominent Warning Callout */}
            <div className="rounded-2xl border-2 border-red-200 bg-red-50/80 p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-2 text-red-900 font-serif font-bold text-base sm:text-lg">
                <ShieldAlert className="h-5 w-5 text-red-600 shrink-0" />
                <span>Strict No Replacement &amp; No Refund Policy</span>
              </div>
              <p className="text-xs sm:text-sm text-red-950 leading-relaxed font-medium">
                Due to the perishable, consumable, and artisanal nature of our authentic Himalayan food items (including traditional pickles, wild Timur, organic spices, fermented foods, teas, and grains), <strong>Himali Fresh strictly enforces a NO RETURN, NO REPLACEMENT, and NO REFUND policy on all products once ordered and dispatched. All sales are final.</strong>
              </p>
            </div>

            <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
              
              {/* 1. Why No Returns or Replacements */}
              <section className="space-y-3">
                <h2 className="font-serif text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Ban className="h-4 w-4 text-[#064B32]" /> 1. No Returns &amp; No Replacements
                </h2>
                <p>
                  In compliance with Food Safety and Standards Authority of India (FSSAI) hygiene and sanitary norms, food products cannot be returned, re-entered into inventory, or exchanged under any circumstances.
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
                  <li><strong>Zero Returns:</strong> Once a food parcel has been dispatched from our facility, we cannot accept returns or handbacks.</li>
                  <li><strong>Zero Replacements:</strong> We do not offer product replacements or exchanges for variations in personal taste, spice tolerance, colour/texture differences inherent to natural seasonal harvest, or changes of mind.</li>
                  <li><strong>Courier Transit Delays:</strong> Courier transit times are handled by third-party logistics networks. Delays in courier transit do not qualify for replacement or return.</li>
                </ul>
              </section>

              {/* 2. No Refunds Policy */}
              <section className="space-y-3 rounded-2xl bg-[#FAF5EB] p-5 border border-[#E8DFC8]">
                <h2 className="font-serif text-lg font-bold text-[#064B32]">
                  2. Strict No Refund Policy
                </h2>
                <p className="text-gray-800">
                  We do not issue monetary refunds through any payment mode (UPI, bank transfer, debit/credit cards, or cash). Please ensure you review your cart items, weights, prices, and delivery addresses thoroughly before confirming your purchase.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-gray-700">
                  <li>No cash or online account refunds are permitted once an order is placed and confirmed.</li>
                  <li>Parcels returned to origin (RTO) due to customer unavailability, incorrect delivery address, or refusal to accept delivery are not eligible for a refund.</li>
                </ul>
              </section>

              {/* 3. Rigorous Quality & Packaging Check */}
              <section className="space-y-3">
                <h2 className="font-serif text-lg font-bold text-gray-900">
                  3. Rigorous Quality Inspection Prior to Dispatch
                </h2>
                <p>
                  To ensure complete satisfaction and eliminate issues before goods leave our custody:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
                  <li>Every jar, container, and pouch undergoes rigorous manual batch verification for freshness and seal integrity.</li>
                  <li>Glass containers and liquid squashes are wrapped in heavy multi-layer air-bubble cushioning and sturdy cardboard outer boxes to withstand long-distance shipping.</li>
                </ul>
              </section>

              {/* 4. Cancellation Before Dispatch Only */}
              <section className="space-y-3">
                <h2 className="font-serif text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-600" /> 4. Order Cancellation (Before Dispatch Only)
                </h2>
                <p>
                  You may only cancel your order if the package has <strong>not yet been dispatched</strong> from our Siliguri hub.
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
                  <li>To request pre-dispatch cancellation, message us immediately on WhatsApp at <strong>+91 74777 68499</strong> with your Order Number.</li>
                  <li>Once an order has been packed, handed over to courier personnel, or assigned a tracking AWB number, it <strong>cannot</strong> be cancelled, recalled, or refunded.</li>
                </ul>
              </section>

              {/* 5. Contact Support */}
              <section className="space-y-3 rounded-2xl bg-gray-50 p-5 border border-gray-200">
                <h2 className="font-serif text-lg font-bold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-[#064B32]" /> 5. Questions Before Ordering?
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm">
                  If you have questions about specific product ingredients, spice heat levels, shelf life, or delivery timelines to your city, our team is happy to assist you before you place your order:
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="https://wa.me/917477768499?text=Hi%20Himali%20Fresh%2C%20I%20have%20a%20question%20before%20placing%20my%20order."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#064B32] px-4 py-2 text-xs font-semibold text-white hover:bg-[#073D2B] transition-colors"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    WhatsApp Pre-Order Assistance (+91 74777 68499)
                  </a>
                  <a
                    href="mailto:riteshtayade68@gmail.com"
                    className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    Email: riteshtayade68@gmail.com
                  </a>
                </div>
              </section>
            </div>

            {/* Bottom Links */}
            <div className="pt-6 border-t border-[#E8DFC8] flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500">
              <span>Himali Fresh • Dagapur, Siliguri, West Bengal</span>
              <div className="flex items-center gap-4">
                <Link href="/terms" className="text-[#064B32] font-semibold hover:underline">
                  Terms &amp; Conditions →
                </Link>
                <Link href="/privacy-policy" className="text-[#064B32] font-semibold hover:underline">
                  Privacy Policy →
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
