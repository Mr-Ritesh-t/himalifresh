'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error cleanly for observability
    console.error('[HimaliFresh App Error Caught]:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[#FAF5EB]/50">
      <div className="w-full max-w-md bg-white border border-[#E8DFC8] rounded-3xl p-8 text-center shadow-sm">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#064B32]/10 text-[#064B32] mb-5">
          <AlertTriangle className="h-7 w-7 text-[#064B32]" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          We encountered an unexpected error while loading this page. Please try refreshing or return to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#064B32] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#073D2B] transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Home className="h-4 w-4" />
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
