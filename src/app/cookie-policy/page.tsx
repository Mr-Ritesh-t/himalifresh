import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { Cookie, Shield, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Cookie Policy | Himali Fresh',
  description: 'Understand how Himali Fresh uses cookies and how you can manage your preferences.',
};

export default function CookiePolicyPage() {
  const lastUpdated = 'November 2026';

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <Header />

      <main className="flex-1 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-[#E8DFC8] bg-white p-6 sm:p-12 shadow-sm space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-[#064B32] mb-3">
                <Cookie className="h-3.5 w-3.5" />
                <span>Transparent Cookie Usage</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                Cookie Policy
              </h1>
              <p className="text-xs text-gray-500 mt-2">
                Last updated: {lastUpdated} • Himali Fresh (Siliguri, West Bengal)
              </p>
            </div>

            <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
              <section className="space-y-2">
                <h2 className="font-serif text-lg font-bold text-gray-900">
                  1. What Are Cookies?
                </h2>
                <p>
                  Cookies and browser storage mechanisms (such as localStorage) are small data files saved on your computer or mobile device when you browse websites. They help websites remember your cart items, authentication session, and display preferences.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-lg font-bold text-gray-900">
                  2. Cookies We Use
                </h2>
                <p>
                  Himali Fresh is strictly committed to data minimization. We do not use third-party behavioral advertising cookies or cross-site tracking pixels:
                </p>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs text-left border border-gray-200 rounded-lg">
                    <thead className="bg-gray-100 font-semibold text-gray-800">
                      <tr>
                        <th className="p-3 border-b">Cookie Name</th>
                        <th className="p-3 border-b">Type</th>
                        <th className="p-3 border-b">Purpose</th>
                        <th className="p-3 border-b">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-600">
                      <tr>
                        <td className="p-3 font-mono font-medium text-gray-900">hf_token</td>
                        <td className="p-3">Strictly Necessary</td>
                        <td className="p-3">HttpOnly authentication token for secure customer and store owner login.</td>
                        <td className="p-3">30 Days</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-medium text-gray-900">himalifresh_cart</td>
                        <td className="p-3">Strictly Necessary</td>
                        <td className="p-3">Local browser storage for cart items so you don&apos;t lose selected items.</td>
                        <td className="p-3">Persistent (Local)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-medium text-gray-900">himali_cookie_consent</td>
                        <td className="p-3">Essential Preference</td>
                        <td className="p-3">Stores your consent choices for cookie banners.</td>
                        <td className="p-3">1 Year</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-medium text-gray-900">_vercel_speed_insights</td>
                        <td className="p-3">Performance</td>
                        <td className="p-3">Aggregate anonymized Core Web Vitals to optimize page loading speeds.</td>
                        <td className="p-3">Session</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="space-y-2">
                <h2 className="font-serif text-lg font-bold text-gray-900">
                  3. Managing and Disabling Cookies
                </h2>
                <p>
                  You can modify your browser settings to decline or remove cookies at any time. Most browsers allow you to:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>See what cookies you have and delete them individually.</li>
                  <li>Block third-party cookies or all cookies.</li>
                  <li>Clear all cookies when you close your browser.</li>
                </ul>
                <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-lg border border-amber-200 mt-2">
                  Please note: Disabling strictly necessary cookies (such as authentication or cart storage) may cause features like your account login and checkout cart to fail.
                </p>
              </section>
            </div>

            <div className="pt-6 border-t border-[#E8DFC8] flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500">
              <span>Himali Fresh • Siliguri, West Bengal</span>
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
