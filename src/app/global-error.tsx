'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[HimaliFresh Global Crash Caught]:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-[#FAF5EB] p-4 font-sans text-gray-800">
        <div className="w-full max-w-md bg-white border border-[#E8DFC8] rounded-3xl p-8 text-center shadow-md">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#064B32]/10 text-[#064B32] mb-5">
            <AlertTriangle className="h-7 w-7 text-[#064B32]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Notice</h1>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            The application experienced an unexpected interruption. Our team has been notified.
          </p>
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#064B32] px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#073D2B] transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Reload Page
          </button>
        </div>
      </body>
    </html>
  );
}
