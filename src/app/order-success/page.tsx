'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, MessageSquare, ArrowRight, ShieldAlert, Copy, Check } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('ref') || 'HF-2026-ENQUIRY';
  const customerName = searchParams.get('name') || 'Customer';
  const totalAmount = searchParams.get('total') ? parseFloat(searchParams.get('total')!) : 0;
  const whatsappUrl = searchParams.get('whatsappUrl') || '';

  const [copied, setCopied] = React.useState(false);

  const copyRef = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    toast.success('Order reference copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16 text-center">
      <div className="rounded-3xl border border-himali-border bg-white p-8 sm:p-12 shadow-card">
        {/* Success Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-himali-green">
          <CheckCircle className="h-12 w-12" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-himali-green">
          Order Enquiry Recorded
        </span>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-himali-dark mt-2 mb-3">
          Thank You, {customerName}!
        </h1>

        <p className="text-xs sm:text-sm text-himali-muted max-w-md mx-auto mb-6 leading-relaxed">
          Your order enquiry has been successfully registered in our system. Please complete the WhatsApp conversation so our team can confirm product availability and delivery arrangements.
        </p>

        {/* Order Reference Box */}
        <div className="rounded-2xl bg-himali-cream border border-himali-border/80 p-4 mb-6 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[11px] font-semibold text-himali-muted uppercase tracking-wider">
              Order Reference
            </span>
            <p className="font-serif text-lg font-bold text-himali-dark">#{orderNumber}</p>
          </div>
          <button
            onClick={copyRef}
            className="flex items-center gap-1.5 rounded-xl border border-himali-border bg-white px-3 py-1.5 text-xs font-semibold text-himali-dark hover:bg-himali-cream transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {totalAmount > 0 && (
          <div className="mb-6 text-sm text-himali-dark">
            <span className="text-himali-muted">Estimated Order Amount: </span>
            <span className="font-bold text-lg text-himali-primary">{formatPrice(totalAmount)}</span>
          </div>
        )}

        {/* Important Notice */}
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 text-left mb-8 flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-1">Important Notice</p>
            <p className="leading-relaxed">
              No payment has been charged online. Himali Fresh manually confirms the freshness of every batch, calculates delivery rates to your address, and shares direct payment instructions with you on WhatsApp.
            </p>
          </div>
        </div>

        {/* WhatsApp Button */}
        {whatsappUrl && (
          <div className="space-y-3 mb-8">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-himali-green px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-emerald-700 transition-all hover:scale-105"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Open WhatsApp Conversation Now</span>
            </a>
            <p className="text-[11px] text-himali-muted">
              Click the button above if your WhatsApp did not open automatically.
            </p>
          </div>
        )}

        {/* Back Link */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-himali-primary hover:underline"
        >
          <span>Continue Exploring More Products</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-himali-cream/30">
      <Header />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="py-20 text-center text-sm text-himali-muted">
              Loading order confirmation...
            </div>
          }
        >
          <OrderSuccessContent />
        </Suspense>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
