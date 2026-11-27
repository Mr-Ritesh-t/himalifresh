import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { ShieldCheck, Lock, FileText, UserCheck, AlertCircle, Mail, Phone, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Himali Fresh',
  description: 'Learn how Himali Fresh collects, protects, uses, and respects your personal data in compliance with the Digital Personal Data Protection Act (DPDPA 2023) and global standards.',
};

export default function PrivacyPolicyPage() {
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
                <span>DPDP Act (2023) &amp; Privacy Compliant</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                Privacy Policy
              </h1>
              <p className="text-xs text-gray-500 mt-2">
                Effective Date: {lastUpdated} • Himali Fresh (Siliguri, West Bengal, India)
              </p>
            </div>

            <div className="prose prose-emerald max-w-none space-y-8 text-sm text-gray-700 leading-relaxed">
              
              {/* Introduction */}
              <section className="space-y-3">
                <p>
                  Welcome to <strong>Himali Fresh</strong> (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). We are deeply committed to respecting your privacy, protecting your personal data, and practicing strict <strong>data minimization</strong>. This Privacy Policy outlines how we collect, process, store, and safeguard your information when you browse our website, create an account, purchase authentic Himalayan produce, or contact us.
                </p>
                <p>
                  This policy is framed in compliance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> of India, the Information Technology Act, 2000, and internationally accepted data fair-practice principles.
                </p>
              </section>

              {/* 1. Principles & Data Minimization */}
              <section className="space-y-3 rounded-2xl bg-[#FAF5EB] p-5 border border-[#E8DFC8]">
                <h2 className="font-serif text-lg font-bold text-[#064B32] flex items-center gap-2">
                  <Lock className="h-4 w-4" /> 1. Our Core Privacy &amp; Data Minimization Pledge
                </h2>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li><strong>Only What Is Needed:</strong> We never collect sensitive personal information, biometric identifiers, or unnecessary tracking profiles.</li>
                  <li><strong>No Sale of Data:</strong> We never sell, lease, or monetize your personal details with third-party advertisers or data brokers.</li>
                  <li><strong>Direct Communication:</strong> Your contact details are used strictly to coordinate order dispatches, verify fresh stock, send tracking updates, and deliver customer support.</li>
                </ul>
              </section>

              {/* 2. Information We Collect */}
              <section className="space-y-3">
                <h2 className="font-serif text-lg font-bold text-gray-900">
                  2. Information We Collect
                </h2>
                <p>We collect only the essential information needed to fulfill your purchases and provide a seamless shopping experience:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/70">
                    <h3 className="font-semibold text-gray-900 text-xs uppercase tracking-wider mb-2">Customer &amp; Delivery Data</h3>
                    <ul className="list-disc pl-4 space-y-1 text-xs text-gray-600">
                      <li>Full Name</li>
                      <li>Phone number (for delivery coordination &amp; WhatsApp order notifications)</li>
                      <li>Shipping address, landmark, city, and 6-digit postal PIN code</li>
                      <li>Email address (for receipt and automated shipment status notifications)</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/70">
                    <h3 className="font-semibold text-gray-900 text-xs uppercase tracking-wider mb-2">Account &amp; Security Data</h3>
                    <ul className="list-disc pl-4 space-y-1 text-xs text-gray-600">
                      <li>Encrypted password (hashed using industry-standard bcrypt, never stored in plaintext)</li>
                      <li>Order history and invoice records</li>
                      <li>Technical logs (IP address, user-agent) strictly for security monitoring and fraud prevention</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 3. Purpose of Processing */}
              <section className="space-y-3">
                <h2 className="font-serif text-lg font-bold text-gray-900">
                  3. Purpose of Processing Your Data
                </h2>
                <p>We process your personal information strictly for legitimate commercial and operational purposes:</p>
                <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
                  <li><strong>Order Fulfillment:</strong> Verifying product availability, packaging delicate jars safely, and handing parcels to reputable logistics couriers.</li>
                  <li><strong>Customer Support:</strong> Assisting you on WhatsApp or telephone regarding delivery timing, transit tracking, or seasonal produce questions.</li>
                  <li><strong>Transactional Notifications:</strong> Sending order confirmations and status updates via transactional email (powered by Brevo).</li>
                  <li><strong>Legal &amp; Tax Compliance:</strong> Maintaining GST/e-invoice records and accounting books as required under Indian commercial regulations.</li>
                </ul>
              </section>

              {/* 4. Cookies & Tracking Technologies */}
              <section id="cookies" className="space-y-3">
                <h2 className="font-serif text-lg font-bold text-gray-900">
                  4. Cookies and Local Storage
                </h2>
                <p>
                  Cookies are small text files placed on your device to make web applications function properly. We keep our cookie usage minimal:
                </p>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs text-left border border-gray-200 rounded-lg">
                    <thead className="bg-gray-100 font-semibold text-gray-800">
                      <tr>
                        <th className="p-2.5 border-b">Category</th>
                        <th className="p-2.5 border-b">Purpose</th>
                        <th className="p-2.5 border-b">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-600">
                      <tr>
                        <td className="p-2.5 font-medium text-gray-900">Strictly Essential</td>
                        <td className="p-2.5">User authentication (`hf_token`), cart contents in localStorage, security verification</td>
                        <td className="p-2.5">Session / 30 Days</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium text-gray-900">Consent Preferences</td>
                        <td className="p-2.5">Stores your cookie consent preferences (`himali_cookie_consent`)</td>
                        <td className="p-2.5">1 Year</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium text-gray-900">Performance &amp; Analytics</td>
                        <td className="p-2.5">Anonymized page latency, error diagnostic metrics (Vercel Speed Insights, Boosthis)</td>
                        <td className="p-2.5">Session</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500">
                  Read our full <Link href="/cookie-policy" className="text-[#064B32] underline font-medium">Cookie Policy</Link> for detailed cookie controls and management instructions.
                </p>
              </section>

              {/* 5. Third-Party Services Audit */}
              <section className="space-y-3">
                <h2 className="font-serif text-lg font-bold text-gray-900">
                  5. Third-Party Service Providers (Sub-Processors)
                </h2>
                <p>
                  To deliver a resilient, high-speed experience, we engage vetted infrastructure partners who adhere to rigorous data security obligations:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
                  <li><strong>Cloudflare (Workers &amp; CDN):</strong> Edge hosting, DDoS defense, SSL/TLS encryption.</li>
                  <li><strong>Neon PostgreSQL:</strong> Encrypted database storage for product catalogs and order details.</li>
                  <li><strong>Brevo:</strong> Transactional email delivery for order receipts and confirmation emails.</li>
                  <li><strong>WhatsApp (Meta):</strong> Optional messaging channel for customer support queries and real-time order coordination.</li>
                </ul>
              </section>

              {/* 6. Children's Data & Age of Consent */}
              <section className="space-y-3">
                <h2 className="font-serif text-lg font-bold text-gray-900">
                  6. Age of Consent &amp; Protection of Children&apos;s Data
                </h2>
                <p>
                  In compliance with Section 9 of the DPDP Act 2023, Himali Fresh does not knowingly collect, process, or track personal data belonging to individuals under the age of 18 without verifiable parental or guardian consent. If you are under 18, please browse our website under the supervision of a parent or guardian. If we discover that personal data of a minor has been collected without verified consent, we will promptly delete it.
                </p>
              </section>

              {/* 7. Data Deletion & Customer Rights */}
              <section id="deletion" className="space-y-3 rounded-2xl bg-amber-50/60 p-5 border border-amber-200/80">
                <h2 className="font-serif text-lg font-bold text-amber-900 flex items-center gap-2">
                  <UserCheck className="h-4 w-4" /> 7. Your Data Rights &amp; Deletion Requests
                </h2>
                <p className="text-amber-950">
                  You retain complete ownership over your personal data under the DPDP Act 2023 and have the right to:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-amber-900">
                  <li><strong>Right to Access:</strong> Request a summary of the personal data we hold about you.</li>
                  <li><strong>Right to Correction:</strong> Update or rectify incomplete or inaccurate contact and address records.</li>
                  <li><strong>Right to Erasure / Account Deletion:</strong> Request full deletion of your customer profile and personal records.</li>
                  <li><strong>Right to Grievance Redressal:</strong> Register any concerns with our designated Grievance Officer.</li>
                </ul>
                <div className="pt-2">
                  <p className="text-xs text-amber-900 font-medium">
                    To exercise your right to deletion:
                  </p>
                  <p className="text-xs text-amber-800 mt-1">
                    • <strong>Registered Customers:</strong> Log in to your <Link href="/account" className="underline font-semibold text-[#064B32]">Account Dashboard</Link> and click &ldquo;Request Account Deletion&rdquo; under the Profile tab.<br />
                    • <strong>Guest Orders:</strong> Email our Grievance Officer at <a href="mailto:riteshtayade68@gmail.com?subject=Personal%20Data%20Deletion%20Request" className="underline font-semibold text-[#064B32]">riteshtayade68@gmail.com</a> with the subject <em>&ldquo;Personal Data Deletion Request&rdquo;</em> quoting your phone number or order number. Requests are processed within 72 hours.
                  </p>
                </div>
              </section>

              {/* 8. Grievance Officer & Contact */}
              <section className="space-y-3">
                <h2 className="font-serif text-lg font-bold text-gray-900">
                  8. Grievance Redressal Officer
                </h2>
                <p>
                  In accordance with the Information Technology Act 2000 and DPDP Act 2023, the details of our designated Grievance Officer are provided below:
                </p>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs space-y-1.5 text-gray-700">
                  <p><strong>Name:</strong> Ritesh Tayade</p>
                  <p><strong>Designation:</strong> Data Grievance Officer, Himali Fresh</p>
                  <p><strong>Address:</strong> Dagapur, Siliguri, West Bengal, India - 734010</p>
                  <p><strong>Email:</strong> <a href="mailto:riteshtayade68@gmail.com" className="text-[#064B32] underline font-semibold">riteshtayade68@gmail.com</a></p>
                  <p><strong>Phone / WhatsApp:</strong> <a href="tel:+917477768499" className="text-[#064B32] font-semibold">+91 74777 68499</a></p>
                  <p><strong>Response Time:</strong> Within 48 to 72 business hours</p>
                </div>
              </section>
            </div>

            {/* Bottom Navigation */}
            <div className="pt-6 border-t border-[#E8DFC8] flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500">
              <span>Himali Fresh • Dagapur, Siliguri, West Bengal</span>
              <div className="flex items-center gap-4">
                <Link href="/terms" className="text-[#064B32] font-semibold hover:underline">
                  Terms &amp; Conditions →
                </Link>
                <Link href="/refund-policy" className="text-[#064B32] font-semibold hover:underline">
                  No Return &amp; Refund Policy →
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
