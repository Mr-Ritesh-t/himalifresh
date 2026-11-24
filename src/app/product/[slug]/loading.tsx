import React from 'react';
import { ProductDetailsSkeleton, ProductGridSkeleton } from '@/components/ui/Skeletons';

export default function ProductPageLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-himali-cream/30">
      <main className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumb Skeleton */}
          <div className="flex items-center gap-2 animate-pulse">
            <div className="h-3 w-12 rounded bg-slate-200" />
            <div className="h-3 w-3 rounded bg-slate-200" />
            <div className="h-3 w-16 rounded bg-slate-200" />
            <div className="h-3 w-3 rounded bg-slate-200" />
            <div className="h-3 w-32 rounded bg-slate-200" />
          </div>

          {/* Main Product Display Skeleton */}
          <ProductDetailsSkeleton />

          {/* Related Products Skeleton */}
          <div className="pt-8 border-t border-slate-200/80 space-y-4">
            <div className="h-6 w-44 rounded bg-slate-200 animate-pulse" />
            <ProductGridSkeleton count={4} />
          </div>
        </div>
      </main>
    </div>
  );
}
