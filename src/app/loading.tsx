import React from 'react';
import { ProductGridSkeleton, CategorySliderSkeleton } from '@/components/ui/Skeletons';

export default function RootLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Banner Skeleton */}
      <div className="h-9 w-full bg-[#064B32]/90 hidden sm:block animate-pulse" />

      {/* Header Skeleton */}
      <div className="border-b border-slate-100 bg-white/80 py-3.5 px-4 animate-pulse">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-full bg-slate-200" />
            <div className="h-6 w-32 rounded bg-slate-200" />
          </div>
          <div className="h-10 w-72 rounded-full bg-slate-100 hidden md:block" />
          <div className="h-10 w-24 rounded-full bg-slate-200" />
        </div>
      </div>

      <main className="flex-1 space-y-12">
        {/* Hero Banner Skeleton */}
        <div className="w-full bg-[#F8F0E4] py-12 sm:py-16 px-4 animate-pulse">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="h-4 w-36 rounded bg-slate-300" />
              <div className="h-10 sm:h-12 w-4/5 rounded-xl bg-slate-300" />
              <div className="h-4 w-full max-w-md rounded bg-slate-200" />
              <div className="h-4 w-3/4 max-w-sm rounded bg-slate-200" />
              <div className="pt-2 flex gap-3">
                <div className="h-11 w-36 rounded-2xl bg-[#064B32]/30" />
                <div className="h-11 w-36 rounded-2xl bg-white/70" />
              </div>
            </div>
            <div className="aspect-[4/3] rounded-3xl bg-slate-200/70 skeleton-shimmer" />
          </div>
        </div>

        {/* Categories Bar Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-44 rounded bg-slate-200" />
            <div className="h-4 w-20 rounded bg-slate-200/80" />
          </div>
          <CategorySliderSkeleton count={7} />
        </div>

        {/* Featured Products Grid Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="h-6 w-48 rounded bg-slate-200" />
              <div className="h-3.5 w-64 rounded bg-slate-200/70" />
            </div>
            <div className="h-4 w-20 rounded bg-slate-200/80" />
          </div>
          <ProductGridSkeleton count={6} />
        </div>
      </main>
    </div>
  );
}
