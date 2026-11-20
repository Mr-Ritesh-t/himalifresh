'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  Layers,
  ShoppingBag,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  Plus,
  Settings,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/admin/dashboard');
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-himali-primary mx-auto"></div>
        <p className="text-xs text-slate-500 mt-2">Loading metrics...</p>
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentOrders = data?.recentOrders || [];

  return (
    <div className="space-y-8">
      {/* Top Welcome & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time catalog metrics and incoming customer order enquiries
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-himali-primary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-himali-dark transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>View Enquiries</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">
              Total Products
            </span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-himali-primary flex items-center justify-center">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-slate-900 mt-2">
            {stats.totalProducts || 0}
          </p>
          <p className="text-[11px] text-emerald-600 mt-1">
            {stats.activeProducts || 0} active in catalogue
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">
              New Enquiries
            </span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-slate-900 mt-2">
            {stats.newOrders || 0}
          </p>
          <p className="text-[11px] text-amber-600 mt-1">
            Pending WhatsApp review
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">
              Confirmed Orders
            </span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-slate-900 mt-2">
            {stats.confirmedOrders || 0}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Confirmed with customer
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">
              Stock Warnings
            </span>
            <div className="h-8 w-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-slate-900 mt-2">
            {stats.outOfStockProducts || 0}
          </p>
          <p className="text-[11px] text-red-600 mt-1">
            Marked out-of-stock
          </p>
        </div>
      </div>

      {/* Recent Order Enquiries */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="font-serif text-lg font-bold text-slate-900">
              Recent Order Enquiries
            </h2>
            <p className="text-xs text-slate-500">
              Latest orders submitted by customers on the website
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-himali-green hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            No order enquiries recorded yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-2.5 px-3">Order Ref</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Phone</th>
                  <th className="py-2.5 px-3">City</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((ord: any) => (
                  <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      #{ord.orderNumber}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800">
                      {ord.customerName}
                    </td>
                    <td className="py-3 px-3 text-slate-600">{ord.phone}</td>
                    <td className="py-3 px-3 text-slate-600">{ord.city}</td>
                    <td className="py-3 px-3 font-bold text-himali-primary">
                      {formatPrice(ord.totalAmount)}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          ord.status === 'NEW'
                            ? 'bg-amber-100 text-amber-800'
                            : ord.status === 'CONFIRMED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'COMPLETED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/admin/orders/${ord.id}`}
                        className="text-xs font-semibold text-himali-green hover:underline"
                      >
                        Inspect →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Links Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/products"
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-himali-primary transition-all flex items-center gap-3"
        >
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-himali-primary flex items-center justify-center">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">Manage Products</h3>
            <p className="text-[11px] text-slate-500">Edit prices, availability, photos</p>
          </div>
        </Link>

        <Link
          href="/admin/categories"
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-himali-primary transition-all flex items-center gap-3"
        >
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-himali-primary flex items-center justify-center">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">Manage Categories</h3>
            <p className="text-[11px] text-slate-500">Organize store collections</p>
          </div>
        </Link>

        <Link
          href="/admin/settings"
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-himali-primary transition-all flex items-center gap-3"
        >
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-himali-primary flex items-center justify-center">
            <Settings className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">Business Settings</h3>
            <p className="text-[11px] text-slate-500">Update phone, WhatsApp, announcements</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
