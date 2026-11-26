import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { RefreshCw, CheckCircle2, AlertCircle, MessageSquare, ShieldCheck, Clock } from 'lucide-react';

export const metadata = {
  title: 'Refund & Cancellation Policy | Himali Fresh',
  description: 'Read our transparent cancellation, transit damage replacement, and refund policies for authentic Himalayan food products.',
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
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-[#064B32] mb-3">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Customer Satisfaction &amp; Transit Guarantee</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                Refund &amp; Cancellation Policy
              </h1>
              <p className="text-xs text-gray-500 mt-2">
                Effective Date: {lastUpdated} • Himali Fresh (Siliguri, West Bengal)
              </p>
            </div>

            <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
              
              {/* Overview */}
              <section className="space-y-3">
                <p>
                  At <strong>Himali Fresh</strong>, we take extreme pride in the quality, authenticity, and freshness of our Himalayan foods. Because our products include artisanal pickles in glass jars, wild dried spices, stone-ground flours, and perishables, we maintain clear, customer-friendly policies tailored for food items.
                </p>
              </section>

              {/* 1. Cancellation Policy */}
              <section className="space-y-3 rounded-2xl bg-[#FAF5EB] p-5 border border-[#E8DFC8]">
                <h2 className="font-serif text-lg font-bold text-[#064B32] flex items-center gap-2">
                  <Clock className="h-4 w-4" /> 1. Order Cancellation Policy
                </h2>
                <ul className="list-disc pl-5 space-y-1.5 text-gray-700">
                  <li><strong>Before Dispatch:</strong> You can cancel your order free of charge at any time before it leaves our Siliguri fulfillment center. Just send a WhatsApp message to <strong>+91 98320 78728</strong> or email <strong>riteshtayade68@gmail.com</strong> with your order number.</li>
                  <li><strong>After Dispatch:</strong> Once an order is handed to our courier partner and a tracking AWB is generated, the shipment cannot be cancelled in transit due to the perishable nature of food packages.</li>
                </ul>
              </section>

              {/* 2. Transit Damage & Replacement Guarantee */}
              <section className="space-y-3">
                <h2 className="font-serif text-lg font-bold text-gray-900">
                  2. Transit Damage &amp; Breakage Guarantee
                </h2>
                <p>
                  We securely package all pickle jars, honey containers, and squashes with multi-layer bubble wrap and reinforced boxing. In the unlikely event that your parcel suffers transit damage or arrives leaking:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-3">
                  <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50 text-xs">
                    <span className="font-bold text-[#064B32] block mb-1">Step 1: Notice within 48h</span>
                    Take clear photos or a short video of the damaged item and outer packaging upon delivery.
                  </div>
                  <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50 text-xs">
                    <span className="font-bold text-[#064B32] block mb-1">Step 2: Message Us</span>
                    Share the photos with your Order ID on WhatsApp at <strong>+91 98320 78728</strong>.
                  </div>
                  <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50 text-xs">
                    <span className="font-bold text-[#064B32] block mb-1">Step 3: Free Resolution</span>
                    We will immediately dispatch a <strong>free replacement</strong> or issue a <strong>100% refund</strong>.
                  </div>
                </div>
              </section>

              {/* 3. Non-Returnable Items */}
              <section className="space-y-3">
                <h2 className="font-serif text-lg font-bold text-gray-900">
                  3. Food Safety &amp; Returns Policy
                </h2>
                <p>
                  In compliance with Food Safety and Standards Authority of India (FSSAI) guidelines, food products (once opened or tampered with by the customer) cannot be returned for resale. Returns are accepted exclusively if:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>The product received is expired or past its best-before date.</li>
                  <li>The seal is broken prior to delivery.</li>
                  <li>An incorrect item was delivered compared to your invoice.</li>
                </ul>
              </section>

              {/* 4. Refund Timeline & Mode */}
              <section className="space-y-3">
                <h2 className="font-serif text-lg font-bold text-gray-900">
                  4. Refund Processing &amp; Timeline
                </h2>
                <p>
                  When a refund is approved by our customer care team:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li><strong>UPI / Net Banking:</strong> Refund credited directly to your bank account or UPI ID within <strong>2 to 4 business days</strong>.</li>
                  <li><strong>Cash on Delivery Orders:</strong> Refund transferred to your verified UPI VPA or NEFT bank account.</li>
                  <li><strong>Store Credit Option:</strong> If you prefer, we can also issue immediate store credit for your next order.</li>
                </ul>
              </section>

              {/* 5. Contact Support */}
              <section className="space-y-3 rounded-2xl bg-emerald-50/60 p-5 border border-emerald-200">
                <h2 className="font-serif text-lg font-bold text-[#064B32] flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" /> 5. Need Immediate Assistance?
                </h2>
                <p className="text-gray-700 text-xs sm:text-sm">
                  Our customer support team is based directly at our Siliguri store and ready to help:
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="https://wa.me/919832078728?text=Hi%20Himali%20Fresh%2C%20I%20have%20an%20inquiry%20regarding%20my%20order%20or%20refund."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#064B32] px-4 py-2 text-xs font-semibold text-white hover:bg-[#073D2B] transition-colors"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    WhatsApp Support (+91 98320 78728)
                  </a>
                  <a
                    href="mailto:riteshtayade68@gmail.com"
                    className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
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
                <Link href="/privacy-policy" className="text-[#064B32] font-semibold hover:underline">
                  Privacy Policy →
                </Link>
                <Link href="/terms" className="text-[#064B32] font-semibold hover:underline">
                  Terms &amp; Conditions →
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
