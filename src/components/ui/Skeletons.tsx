import React from 'react';

/**
 * Shimmering skeleton placeholder for a single Product Card
 */
export function ProductCardSkeleton() {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-[#E8DFC8]/70 bg-white shadow-sm animate-pulse">
      {/* Product Image placeholder (1:1 ratio) */}
      <div className="w-full aspect-square bg-[#FAF5EB]/90 relative skeleton-shimmer overflow-hidden">
        <div className="absolute top-2 left-2 h-4 w-14 rounded-full bg-slate-200/60" />
      </div>

      {/* Product Details */}
      <div className="flex flex-col p-2.5 sm:p-3 space-y-2">
        {/* Title (2 lines) */}
        <div className="space-y-1.5 min-h-[28px]">
          <div className="h-3.5 w-4/5 rounded bg-slate-200" />
          <div className="h-3.5 w-3/5 rounded bg-slate-200" />
        </div>

        {/* Weight */}
        <div className="h-2.5 w-1/3 rounded bg-slate-200/70" />

        {/* Price & Add to Cart button */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="h-4 w-16 rounded bg-slate-200" />
          <div className="h-7 w-16 sm:w-20 rounded-xl bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

/**
 * Grid of Product Card Skeletons
 */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
}

/**
 * Category Slider Skeletons (circular avatars with labels)
 */
export function CategorySliderSkeleton({ count = 7 }: { count?: number }) {
  return (
    <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto py-2 no-scrollbar animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="flex flex-col items-center gap-2 shrink-0">
          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-[#FAF5EB] border border-[#E8DFC8] skeleton-shimmer" />
          <div className="h-3 w-14 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

/**
 * Detailed Product Page Skeleton (Interactive Gallery Left, Buy Box Right)
 */
export function ProductDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start animate-pulse">
      {/* Image Gallery Skeleton */}
      <div className="space-y-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="aspect-square w-full rounded-2xl bg-slate-100 skeleton-shimmer" />
        </div>
        {/* Thumbnails strip */}
        <div className="flex items-center gap-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-18 w-18 sm:h-20 sm:w-20 rounded-2xl bg-slate-100 border border-slate-200 shrink-0" />
          ))}
        </div>
      </div>

      {/* Information & Purchase Box Skeleton */}
      <div className="flex flex-col space-y-4">
        {/* Category tag */}
        <div className="h-3 w-28 rounded bg-slate-200" />

        {/* Title */}
        <div className="space-y-2">
          <div className="h-7 sm:h-9 w-4/5 rounded-lg bg-slate-200" />
          <div className="h-7 sm:h-9 w-2/3 rounded-lg bg-slate-200" />
        </div>

        {/* Price & Weight pills */}
        <div className="flex items-center gap-3 py-1">
          <div className="h-8 w-24 rounded-lg bg-slate-200" />
          <div className="h-6 w-20 rounded-full bg-slate-200/80" />
          <div className="h-6 w-20 rounded-full bg-slate-200/80" />
        </div>

        {/* Description */}
        <div className="py-4 border-t border-b border-slate-200/80 space-y-2">
          <div className="h-3 w-24 rounded bg-slate-200" />
          <div className="h-3.5 w-full rounded bg-slate-200/70" />
          <div className="h-3.5 w-5/6 rounded bg-slate-200/70" />
          <div className="h-3.5 w-4/6 rounded bg-slate-200/70" />
        </div>

        {/* Quantity and Action Buttons */}
        <div className="space-y-3 pt-2">
          <div className="h-10 w-32 rounded-xl bg-slate-200" />
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="h-12 flex-1 rounded-2xl bg-slate-200" />
            <div className="h-12 sm:w-44 rounded-2xl bg-slate-200/80" />
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-200/60">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-6 w-3/4 rounded bg-slate-200/60" />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Admin Stats & Metrics Cards Skeleton
 */
export function AdminStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-3 w-24 rounded bg-slate-200" />
            <div className="h-8 w-8 rounded-lg bg-slate-200" />
          </div>
          <div className="h-8 w-16 rounded bg-slate-200" />
          <div className="h-2.5 w-28 rounded bg-slate-200/70" />
        </div>
      ))}
    </div>
  );
}

/**
 * Admin Table / Mobile Cards Skeleton
 */
export function AdminTableSkeleton({ rowCount = 5 }: { rowCount?: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden animate-pulse">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="h-4 w-32 rounded bg-slate-200" />
        <div className="h-4 w-20 rounded bg-slate-200" />
      </div>

      <div className="divide-y divide-slate-100">
        {Array.from({ length: rowCount }).map((_, idx) => (
          <div key={idx} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="h-12 w-12 rounded-xl bg-slate-200 shrink-0" />
              <div className="space-y-1.5 flex-1 max-w-sm">
                <div className="h-3.5 w-4/5 rounded bg-slate-200" />
                <div className="h-2.5 w-2/5 rounded bg-slate-200/70" />
              </div>
            </div>
            <div className="h-4 w-16 rounded bg-slate-200" />
            <div className="h-6 w-20 rounded-full bg-slate-200 hidden sm:block" />
            <div className="h-7 w-16 rounded-lg bg-slate-200 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
