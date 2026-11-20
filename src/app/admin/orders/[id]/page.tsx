'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  MessageSquare,
  Phone,
  MapPin,
  Clock,
  User,
  Copy,
  Check,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [copiedPhone, setCopiedPhone] = useState(false);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/orders/${id}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
        setStatus(data.order.status);
      }
    } catch (e) {
      toast.error('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadOrder();
  }, [id]);

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error('Failed to update status');
        setUpdating(false);
        return;
      }

      toast.success('Order status updated');
      setNotes('');
      loadOrder();
    } catch (err) {
      toast.error('Network error');
    } finally {
      setUpdating(false);
    }
  };

  const copyCustomerPhone = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.phone);
    setCopiedPhone(true);
    toast.success('Phone copied to clipboard');
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-slate-500">
        Loading order enquiry details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center text-xs text-red-500">
        Order enquiry not found.
      </div>
    );
  }

  const whatsappCustomerUrl = `https://wa.me/${order.phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
    `Hello ${order.customerName}, regarding your Himali Fresh order enquiry #${order.orderNumber}...`
  )}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Orders</span>
        </Link>
        <span className="text-xs text-slate-400 font-mono">ID: {order.id}</span>
      </div>

      {/* Main Order Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl font-bold text-slate-900">
              Order #{order.orderNumber}
            </h1>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                order.status === 'NEW'
                  ? 'bg-amber-100 text-amber-800'
                  : order.status === 'CONTACTED'
                  ? 'bg-blue-100 text-blue-800'
                  : order.status === 'CONFIRMED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : order.status === 'COMPLETED'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {order.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>
              Placed on {new Date(order.createdAt).toLocaleString('en-IN')}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyCustomerPhone}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            {copiedPhone ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>Copy Phone</span>
          </button>
          <a
            href={whatsappCustomerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-himali-green px-4 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-700"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer & Delivery Information */}
        <div className="md:col-span-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <h2 className="font-serif text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <User className="h-4 w-4 text-himali-green" />
            <span>Customer Details</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Name</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{order.customerName}</p>
            </div>

            <div>
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Phone</span>
              <p className="font-mono text-slate-800 text-sm mt-0.5">{order.phone}</p>
            </div>

            <div>
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Delivery Address</span>
              <p className="text-slate-700 mt-0.5 leading-relaxed">
                {order.address}<br />
                {order.city} - <span className="font-semibold">{order.pincode}</span>
              </p>
            </div>

            {order.landmark && (
              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Landmark</span>
                <p className="text-slate-700 mt-0.5">{order.landmark}</p>
              </div>
            )}

            {order.instructions && (
              <div className="rounded-xl bg-amber-50 p-3 border border-amber-200 text-amber-900">
                <span className="font-bold uppercase text-[10px] block mb-0.5">Instructions</span>
                <p className="leading-relaxed">{order.instructions}</p>
              </div>
            )}
          </div>
        </div>

        {/* Ordered Items & Summary */}
        <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <h2 className="font-serif text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <FileText className="h-4 w-4 text-himali-green" />
            <span>Ordered Items Snapshot</span>
          </h2>

          <div className="divide-y divide-slate-100">
            {order.items?.map((item: any) => (
              <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{item.productNameSnapshot}</p>
                  <p className="text-slate-500">
                    Unit: {item.weightSnapshot || 'Standard'} • Price: {formatPrice(item.unitPriceSnapshot)} × {item.quantity}
                  </p>
                </div>
                <span className="font-bold text-slate-900 text-sm">
                  {formatPrice(item.subtotal)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
            <span className="font-serif font-bold text-slate-900">Total Order Amount:</span>
            <span className="text-2xl font-bold text-himali-primary">
              {formatPrice(order.totalAmount)}
            </span>
          </div>

          {/* Status Updater Form */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Update Order Status
            </h3>
            <form onSubmit={handleStatusUpdate} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="rounded-xl border border-slate-300 p-2 text-xs font-medium focus:border-himali-primary focus:outline-none"
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>

                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Audit note (optional)..."
                  className="rounded-xl border border-slate-300 p-2 text-xs focus:border-himali-primary focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="rounded-xl bg-himali-primary px-4 py-2 text-xs font-semibold text-white shadow hover:bg-himali-dark disabled:opacity-60"
              >
                {updating ? 'Saving...' : 'Update Status & Log Audit'}
              </button>
            </form>
          </div>

          {/* Audit History Log */}
          {order.statusHistory?.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Status Audit History
              </h3>
              <div className="space-y-2">
                {order.statusHistory.map((hist: any) => (
                  <div key={hist.id} className="rounded-lg bg-slate-50 p-2.5 text-[11px] text-slate-600 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-800">
                        {hist.previousStatus} → {hist.newStatus}
                      </span>
                      {hist.notes && <span className="ml-2 text-slate-500 italic">({hist.notes})</span>}
                    </div>
                    <span className="text-slate-400">
                      {new Date(hist.createdAt).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
