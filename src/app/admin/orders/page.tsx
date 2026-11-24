'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Eye, MessageSquare, ArrowUpDown, Download } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const loadOrders = async () => {
    try {
      setLoading(true);
      const url = `/api/admin/orders?status=${statusFilter}&q=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (e) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadOrders();
  };

  const exportToCsv = () => {
    if (orders.length === 0) {
      toast.error('No orders to export');
      return;
    }
    const headers = ['Order Number', 'Date', 'Customer Name', 'Phone', 'Address', 'City', 'PIN Code', 'Status', 'Total Amount', 'Items Count'];
    const rows = orders.map((o) => [
      o.orderNumber,
      new Date(o.createdAt).toLocaleDateString('en-IN'),
      `"${(o.customerName || '').replace(/"/g, '""')}"`,
      `"${o.phone || ''}"`,
      `"${(o.address || '').replace(/"/g, '""')}"`,
      `"${o.city || ''}"`,
      o.pincode || '',
      o.status,
      o.totalAmount,
      o.items?.length || 0,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `himali-fresh-orders-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Orders exported successfully to CSV');
  };

  const statuses = ['ALL', 'NEW', 'CONTACTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Order Enquiries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Review incoming WhatsApp checkout requests and manage fulfillment statuses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportToCsv}
            disabled={orders.length === 0}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Status Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-himali-primary text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order ref, customer, phone..."
            className="w-full rounded-xl border border-slate-300 py-1.5 pl-8 pr-3 text-xs focus:border-himali-primary focus:outline-none"
          />
          <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
        </form>
      </div>

      {/* Orders Table & Mobile Cards */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500">
            Loading order enquiries...
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            No order enquiries found for the selected status.
          </div>
        ) : (
          <>
            {/* Mobile View: Responsive Cards (No horizontal scroll) */}
            <div className="block md:hidden divide-y divide-slate-100">
              {orders.map((ord) => (
                <div key={ord.id} className="p-4 space-y-3 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        #{ord.orderNumber}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        ord.status === 'NEW'
                          ? 'bg-amber-100 text-amber-800'
                          : ord.status === 'CONTACTED'
                          ? 'bg-blue-100 text-blue-800'
                          : ord.status === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.status === 'COMPLETED'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="flex items-baseline justify-between">
                      <span className="font-semibold text-slate-800 text-sm">{ord.customerName}</span>
                      <span className="font-bold text-himali-primary text-sm">
                        {formatPrice(ord.totalAmount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span>{ord.phone}</span>
                      <span>{ord.items?.length || 0} product(s)</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {ord.city} ({ord.pincode})
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                    <a
                      href={`https://wa.me/${ord.phone.replace(/[^\d]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold hover:bg-emerald-100 transition-colors"
                    >
                      <MessageSquare className="h-3.5 w-3.5 text-emerald-700" />
                      <span>WhatsApp</span>
                    </a>

                    <Link
                      href={`/admin/orders/${ord.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      <span>View Details →</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table: Hidden on Mobile */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase font-semibold">
                    <th className="py-3 px-4">Order Ref</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Phone</th>
                    <th className="py-3 px-3">City / PIN</th>
                    <th className="py-3 px-3">Items</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        #{ord.orderNumber}
                      </td>

                      <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                        {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-3 px-3 font-medium text-slate-800">
                        {ord.customerName}
                      </td>

                      <td className="py-3 px-3 text-slate-600 font-mono">
                        {ord.phone}
                      </td>

                      <td className="py-3 px-3 text-slate-600">
                        {ord.city} ({ord.pincode})
                      </td>

                      <td className="py-3 px-3 text-slate-600">
                        {ord.items?.length || 0} product(s)
                      </td>

                      <td className="py-3 px-3 font-bold text-himali-primary">
                        {formatPrice(ord.totalAmount)}
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            ord.status === 'NEW'
                              ? 'bg-amber-100 text-amber-800'
                              : ord.status === 'CONTACTED'
                              ? 'bg-blue-100 text-blue-800'
                              : ord.status === 'CONFIRMED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.status === 'COMPLETED'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`https://wa.me/${ord.phone.replace(/[^\d]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-emerald-600 hover:text-emerald-800"
                            title="Open Customer WhatsApp"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </a>
                          <Link
                            href={`/admin/orders/${ord.id}`}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 font-semibold text-slate-700 hover:bg-slate-200"
                          >
                            Details →
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
