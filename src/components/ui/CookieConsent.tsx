'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, Shield, Check, X } from 'lucide-react';

const STORAGE_KEY = 'himali_cookie_consent';

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(STORAGE_KEY);
      if (!consent) {
        // Small delay so it doesn't abruptly pop during initial page paint
        const timer = setTimeout(() => setShow(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage may be disabled in certain private browsing modes
    }
  }, []);

  const handleConsent = (level: 'all' | 'essential') => {
    try {
      localStorage.setItem(STORAGE_KEY, level);
    } catch {
      // ignore
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="region"
      aria-label="Cookie Preferences"
      className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 pointer-events-none"
    >
      <div className="mx-auto max-w-4xl rounded-2xl bg-white border border-[#E8DFC8] p-4 sm:p-6 shadow-2xl pointer-events-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md bg-white/95 transition-all">
        <div className="flex items-start gap-3.5 max-w-xl">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-[#FAF5EB] flex items-center justify-center text-[#064B32] border border-[#E8DFC8]">
            <Cookie className="h-5 w-5" />
          </div>
          <div className="text-xs text-gray-600 leading-relaxed">
            <p className="font-semibold text-gray-900 text-sm mb-1">
              Your Privacy &amp; Cookies
            </p>
            <p>
              We use strictly necessary cookies to keep your shopping cart and authentication secure, and privacy-first telemetry for site performance. We never sell your personal data or track you across sites. Read our{' '}
              <Link href="/cookie-policy" className="text-[#064B32] font-semibold underline hover:text-[#073D2B]">
                Cookie Policy
              </Link>{' '}
              and{' '}
              <Link href="/privacy-policy" className="text-[#064B32] font-semibold underline hover:text-[#073D2B]">
                Privacy Policy
              </Link>.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
          <button
            type="button"
            onClick={() => handleConsent('essential')}
            className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#064B32]"
          >
            Essential Only
          </button>
          <button
            type="button"
            onClick={() => handleConsent('all')}
            className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-white bg-[#064B32] hover:bg-[#073D2B] rounded-xl shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#064B32]"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
