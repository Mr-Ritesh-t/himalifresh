import React from 'react';
import { AdminStatsSkeleton, AdminTableSkeleton } from '@/components/ui/Skeletons';

export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Admin Title & Add Button Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-56 rounded-lg bg-slate-200" />
          <div className="h-3.5 w-80 rounded bg-slate-200/70" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-28 rounded-xl bg-slate-200" />
          <div className="h-9 w-28 rounded-xl bg-slate-200" />
        </div>
      </div>

      {/* 4 Stats Cards Skeleton */}
      <AdminStatsSkeleton />

      {/* Table & Cards Skeleton */}
      <AdminTableSkeleton rowCount={5} />
    </div>
  );
}
