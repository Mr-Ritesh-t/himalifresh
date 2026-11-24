'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { formatPrice } from '@/lib/utils';
import {
  Search,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get('ref') || '';

  const [orderNumber, setOrderNumber] = useState(initialRef);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderNumber.trim()) return;

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: orderNumber.trim(),
          phone: phone.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        setError(data.error || 'No matching order found');
      }
    } catch {
      setError('Unable to track order. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CONFIRMED':
        return <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold">Confirmed & Packing</span>;
      case 'COMPLETED':
        return <span className="rounded-full bg-purple-100 text-purple-800 px-3 py-1 text-xs font-bold">Dispatched / Completed</span>;
      case 'CANCELLED':
        return <span className="rounded-full bg-rose-100 text-rose-800 px-3 py-1 text-xs font-bold">Cancelled</span>;
      case 'CONTACTED':
        return <span className="rounded-full bg-blue-100 text-blue-800 px-3 py-1 text-xs font-bold">In Review</span>;
      default:
        return <span className="rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-xs font-bold">Order Received</span>;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-himali-green">
          Live Order Status
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-himali-dark mt-1">
          Track Your Order
        </h1>
        <p className="text-xs sm:text-sm text-himali-muted max-w-md mx-auto mt-2">
          Enter your Himali Fresh order number to see dispatch updates and current preparation status.
        </p>
      </div>

      {/* Lookup Card */}
      <div className="rounded-2xl border border-himali-border bg-white p-6 shadow-sm mb-8">
        <form onSubmit={handleTrack} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-himali-dark mb-1">
                Order Reference Number *
              </label>
              <input
                type="text"
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. HF-20261124-1001"
                className="w-full rounded-xl border border-himali-border p-3 text-sm focus:border-himali-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-himali-dark mb-1">
                Phone Number (Optional verification)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9832078728"
                className="w-full rounded-xl border border-himali-border p-3 text-sm focus:border-himali-primary focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !orderNumber.trim()}
            className="w-full rounded-xl bg-himali-primary py-3 text-sm font-semibold text-white shadow hover:bg-himali-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            <span>{loading ? 'Searching Order...' : 'Track Order Status'}</span>
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Order Status Display */}
      {order && (
        <div className="rounded-2xl border border-himali-border bg-white p-6 shadow-card space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-himali-border gap-2">
            <div>
              <div className="text-xs text-himali-muted">Order Reference:</div>
              <div className="font-mono text-lg font-bold text-himali-dark">#{order.orderNumber}</div>
            </div>
            <div>{getStatusBadge(order.status)}</div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-himali-muted block">Customer:</span>
              <strong className="text-himali-dark">{order.customerName}</strong>
            </div>
            <div>
              <span className="text-himali-muted block">Destination:</span>
              <strong className="text-himali-dark">{order.city}</strong>
            </div>
            <div>
              <span className="text-himali-muted block">Total Amount:</span>
              <strong className="text-himali-green text-sm">{formatPrice(order.totalAmount)}</strong>
            </div>
          </div>

          {/* Items breakdown */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-himali-muted mb-2">
              Items in this Order ({order.items.length})
            </h3>
            <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="p-3 flex items-center justify-between text-xs bg-slate-50/50">
                  <div>
                    <strong>{item.name}</strong>
                    {item.weight && <span className="text-slate-400 ml-1.5">({item.weight})</span>}
                    <div className="text-slate-500">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-semibold text-himali-dark">{formatPrice(item.subtotal)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-himali-muted mb-3">
                Tracking Updates
              </h3>
              <div className="space-y-3">
                {order.statusHistory.map((h: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 text-xs">
                    <div className="h-2 w-2 rounded-full bg-himali-green mt-1.5 shrink-0"></div>
                    <div className="flex-1">
                      <div className="font-semibold text-himali-dark">{h.status}</div>
                      {h.notes && <div className="text-slate-500">{h.notes}</div>}
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(h.createdAt).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-himali-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-himali-muted">Need help with this order?</span>
            <a
              href={`https://wa.me/919832078728?text=Hi%20Himali%20Fresh,%20I%20am%20inquiring%20about%20Order%20${order.orderNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-himali-green bg-emerald-50 px-4 py-2 text-xs font-semibold text-himali-green hover:bg-himali-green hover:text-white transition-colors"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>WhatsApp Support</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen flex flex-col bg-himali-cream/30">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="py-20 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-himali-primary" /></div>}>
          <TrackOrderContent />
        </Suspense>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
