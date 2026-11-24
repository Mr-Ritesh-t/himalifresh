import React from 'react';
import { ProductGridSkeleton } from '@/components/ui/Skeletons';

export default function CategoryLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-himali-cream/20">
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Category Hero Skeleton */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6 animate-pulse">
          <div className="h-24 w-24 rounded-full bg-slate-200 shrink-0" />
          <div className="space-y-2.5 text-center sm:text-left flex-1">
            <div className="h-3 w-24 rounded bg-slate-200 mx-auto sm:mx-0" />
            <div className="h-8 w-60 rounded-lg bg-slate-200 mx-auto sm:mx-0" />
            <div className="h-4 w-full max-w-lg rounded bg-slate-200/70 mx-auto sm:mx-0" />
          </div>
        </div>

        {/* Category Product Grid Skeleton */}
        <ProductGridSkeleton count={8} />
      </main>
    </div>
  );
}
