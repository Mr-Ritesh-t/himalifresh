import React from 'react';
import { ProductGridSkeleton } from '@/components/ui/Skeletons';

export default function ShopLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-himali-cream/20">
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Title and breadcrumbs */}
        <div className="space-y-2 animate-pulse">
          <div className="h-3 w-28 rounded bg-slate-200" />
          <div className="h-8 w-56 rounded-lg bg-slate-200" />
          <div className="h-4 w-80 rounded bg-slate-200/70" />
        </div>

        {/* Search, Filter Pills & Sort Bar Skeleton */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm animate-pulse">
          <div className="h-10 w-full sm:w-80 rounded-xl bg-slate-100" />
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-8 w-20 rounded-full bg-slate-100 shrink-0" />
            ))}
          </div>
        </div>

        {/* Product Cards Grid Skeleton */}
        <div className="pt-2">
          <ProductGridSkeleton count={12} />
        </div>
      </main>
    </div>
  );
}
