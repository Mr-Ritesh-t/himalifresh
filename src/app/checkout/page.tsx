'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { MessageSquare, ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle, UserCheck, MapPin, Loader2, X, Edit2, Truck, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart, isLoaded } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pincodeChecking, setPincodeChecking] = useState(false);
  const [pincodeResult, setPincodeResult] = useState<{
    valid: boolean;
    city?: string;
    state?: string;
    deliveryType?: string;
    estimatedDays?: string;
    error?: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    landmark: '',
    instructions: '',
  });

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setCurrentUser(data.user);
            setFormData((prev) => ({
              ...prev,
              customerName: prev.customerName || data.user.name || '',
              email: prev.email || data.user.email || '',
              phone: prev.phone || data.user.phone || '',
              address: prev.address || data.user.address || '',
              city: prev.city || data.user.city || '',
              pincode: prev.pincode || data.user.pincode || '',
            }));
          }
        }
      } catch (err) {
        // Guest checkout continues without error
      }
    }
    fetchMe();
  }, []);

  // Escape key to dismiss confirmation modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showConfirmModal) {
        setShowConfirmModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showConfirmModal]);

  const verifyPincodeInput = async (code: string) => {
    const clean = code.trim();
    if (clean.length !== 6 || !/^\d{6}$/.test(clean)) {
      setPincodeResult(null);
      return;
    }

    try {
      setPincodeChecking(true);
      const res = await fetch(`/api/pincode/${clean}`);
      const data = await res.json();
      if (data.valid && data.deliverable) {
        setPincodeResult({
          valid: true,
          city: data.city,
          state: data.state,
          deliveryType: data.deliveryType,
          estimatedDays: data.estimatedDays,
        });
        // Auto-fill city if empty or if user desires
        if (data.city) {
          setFormData((prev) => ({
            ...prev,
            city: prev.city.trim() ? prev.city : data.city,
          }));
        }
      } else {
        setPincodeResult({
          valid: false,
          error: data.error || 'Invalid PIN code. Please enter a valid Indian postal PIN code.',
        });
      }
    } catch {
      // Non-blocking
    } finally {
      setPincodeChecking(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'pincode') {
      const clean = value.replace(/\D/g, '').slice(0, 6);
      if (clean.length === 6) {
        verifyPincodeInput(clean);
      } else {
        setPincodeResult(null);
      }
    }
  };

  const handleReviewOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (
      !formData.customerName.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.pincode.trim()
    ) {
      toast.error('Please fill in all required delivery details');
      return;
    }

    const cleanPhone = formData.phone.replace(/[\s()-]/g, '');
    if (cleanPhone.length < 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    const cleanPin = formData.pincode.replace(/\D/g, '');
    if (cleanPin.length !== 6) {
      toast.error('Please enter a valid 6-digit Indian PIN code');
      return;
    }

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      toast.error('Please enter a valid email address or leave it blank');
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmAndPlaceOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        customerName: formData.customerName.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim().replace(/[\s()-]/g, ''),
        address: formData.address.trim(),
        city: formData.city.trim(),
        pincode: formData.pincode.trim().replace(/\D/g, ''),
        landmark: formData.landmark.trim() || null,
        instructions: formData.instructions.trim() || null,
        items: items.map((i) => ({
          productId: i.id,
          quantity: i.quantity,
        })),
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        let detailedError = data.error || 'Failed to submit order. Please try again.';
        if (data.issues) {
          const firstField = Object.keys(data.issues)[0];
          const firstErr = data.issues[firstField]?.[0];
          if (firstErr) detailedError = firstErr;
        }
        setError(detailedError);
        toast.error(detailedError);
        setLoading(false);
        setShowConfirmModal(false);
        return;
      }

      // Order created successfully in database!
      const { order, whatsappUrl } = data;

      // Clear the shopping cart
      clearCart();

      // Open WhatsApp in new window
      if (whatsappUrl) {
        window.open(whatsappUrl, '_blank');
      }

      // Navigate to order-success page
      router.push(
        `/order-success?ref=${encodeURIComponent(order.orderNumber)}&name=${encodeURIComponent(
          order.customerName
        )}&total=${order.totalAmount}&whatsappUrl=${encodeURIComponent(whatsappUrl)}`
      );
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError('A network error occurred. Please verify your connection.');
      toast.error('A network error occurred.');
      setLoading(false);
      setShowConfirmModal(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-himali-cream/30">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-himali-primary"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-himali-cream/30">
        <Header />
        <main className="flex-1 py-16 text-center">
          <div className="max-w-md mx-auto p-8 rounded-2xl bg-white border border-himali-border shadow-card">
            <h2 className="font-serif text-2xl font-bold text-himali-dark mb-3">
              Your cart is empty
            </h2>
            <p className="text-sm text-himali-muted mb-6">
              Please add products to your cart before proceeding to checkout.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-himali-primary px-6 py-2.5 text-sm font-semibold text-white shadow"
            >
              Browse Products
            </Link>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-himali-cream/30">
      <Header />

      <main className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <Link
              href="/cart"
              className="inline-flex items-center gap-1 text-xs font-semibold text-himali-green hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Cart</span>
            </Link>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-himali-dark mb-2">
            Checkout & Order Enquiry
          </h1>
          <p className="text-xs sm:text-sm text-himali-muted mb-8">
            Complete your delivery details to generate an official order enquiry and connect with our Siliguri team via WhatsApp.
          </p>

          {error && (
            <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-800 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleReviewOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Delivery Information Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-himali-border bg-white p-6 shadow-card space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-himali-border gap-2">
                  <h2 className="font-serif text-lg font-bold text-himali-dark">
                    1. Customer & Delivery Address
                  </h2>
                  {currentUser ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                      Logged in as {currentUser.name}
                    </span>
                  ) : (
                    <Link
                      href="/login"
                      className="text-xs font-semibold text-[#064B32] hover:underline"
                    >
                      Already have an account? Sign in →
                    </Link>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-himali-dark mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      required
                      value={formData.customerName}
                      onChange={handleChange}
                      placeholder="e.g. Tenzing Norbu"
                      className="w-full rounded-xl border border-himali-border p-3 text-sm focus:border-himali-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-himali-dark mb-1">
                      Phone Number (with WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 9832078728"
                      className="w-full rounded-xl border border-himali-border p-3 text-sm focus:border-himali-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-himali-dark mb-1">
                    Email Address <span className="text-gray-400 font-normal">(Optional, for order confirmation & receipt)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. tenzing@example.com"
                    className="w-full rounded-xl border border-himali-border p-3 text-sm focus:border-himali-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-himali-dark mb-1">
                    Complete Street Address *
                  </label>
                  <textarea
                    name="address"
                    required
                    rows={2}
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House/Flat No., Building Name, Street"
                    className="w-full rounded-xl border border-himali-border p-3 text-sm focus:border-himali-primary focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-himali-dark mb-1">
                      City / Town *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Siliguri"
                      className="w-full rounded-xl border border-himali-border p-3 text-sm focus:border-himali-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-himali-dark mb-1">
                      PIN Code *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="pincode"
                        required
                        maxLength={6}
                        value={formData.pincode}
                        onChange={handleChange}
                        onBlur={() => {
                          if (formData.pincode.length === 6) {
                            verifyPincodeInput(formData.pincode);
                          }
                        }}
                        placeholder="e.g. 734003"
                        className={`w-full rounded-xl border p-3 text-sm focus:outline-none transition-colors ${
                          pincodeResult?.valid === true
                            ? 'border-emerald-500 bg-emerald-50/20'
                            : pincodeResult?.valid === false
                            ? 'border-rose-400 bg-rose-50/20'
                            : 'border-himali-border focus:border-himali-primary'
                        }`}
                      />
                      {pincodeChecking && (
                        <div className="absolute right-3 top-3.5">
                          <Loader2 className="h-4 w-4 animate-spin text-himali-primary" />
                        </div>
                      )}
                    </div>

                    {/* PIN Code Verification Indicator */}
                    {pincodeResult && (
                      <div className="mt-1.5">
                        {pincodeResult.valid ? (
                          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                            <span>
                              Deliverable to {pincodeResult.city || pincodeResult.state} ({pincodeResult.estimatedDays})
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs font-medium text-rose-600">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            <span>{pincodeResult.error || 'Invalid 6-digit PIN code'}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-himali-dark mb-1">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleChange}
                      placeholder="e.g. Near Dagapur Bridge"
                      className="w-full rounded-xl border border-himali-border p-3 text-sm focus:border-himali-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-himali-dark mb-1">
                    Special Instructions / Notes (Optional)
                  </label>
                  <input
                    type="text"
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleChange}
                    placeholder="e.g. Preferred delivery time, gift packaging..."
                    className="w-full rounded-xl border border-himali-border p-3 text-sm focus:border-himali-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Notice Banner */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs text-emerald-900 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-himali-green shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-0.5">Direct Owner Confirmation via WhatsApp</p>
                  <p className="leading-relaxed">
                    Submitting this form records your enquiry in our secure database and opens WhatsApp with a prefilled message. The owner will review product availability, answer any questions, and confirm your payment and delivery arrangements.
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary & Submit Button */}
            <div className="rounded-2xl border border-himali-border bg-white p-6 shadow-card space-y-5">
              <h2 className="font-serif text-lg font-bold text-himali-dark pb-3 border-b border-himali-border">
                2. Order Summary
              </h2>

              <div className="max-h-60 overflow-y-auto divide-y divide-himali-border/60 text-xs">
                {items.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-himali-cream/50">
                        <Image
                          src={item.mainImageUrl || '/images/hero-banner.jpg'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-himali-dark line-clamp-1">{item.name}</p>
                        <p className="text-himali-muted">
                          {item.weight} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-himali-dark shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-himali-border space-y-2 text-sm">
                <div className="flex justify-between text-himali-muted text-xs">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-himali-dark">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-himali-muted text-xs">
                  <span>Shipping:</span>
                  <span className="text-himali-green font-medium">To be confirmed</span>
                </div>
                <div className="pt-2 border-t border-himali-border flex justify-between items-baseline">
                  <span className="font-serif text-base font-bold text-himali-dark">
                    Estimated Total:
                  </span>
                  <span className="text-2xl font-bold text-himali-primary">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-himali-green py-3.5 px-6 text-sm font-bold text-white shadow-md hover:bg-emerald-700 transition-all duration-200 disabled:opacity-60"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Review & Confirm Order</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-himali-muted text-center pt-1">
                <ShieldCheck className="h-3.5 w-3.5 text-himali-green shrink-0" />
                <span>You will review details before final submission</span>
              </div>
            </div>
          </form>

          {/* ── Order Confirmation Modal ── */}
          {showConfirmModal && (
            <div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
              onClick={() => setShowConfirmModal(false)}
            >
              <div
                className="max-w-lg w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-himali-border animate-in zoom-in-95 duration-200 relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="bg-[#064B32] p-5 text-white text-center relative">
                  <button
                    type="button"
                    onClick={() => setShowConfirmModal(false)}
                    aria-label="Close dialog"
                    className="absolute right-3.5 top-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-all shadow-sm active:scale-95"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <div className="inline-block px-3 py-1 rounded-full bg-[#E9BE54]/20 text-[#E9BE54] text-[11px] font-bold uppercase tracking-wider mb-1">
                    Order Verification
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold">
                    Confirm Your Order Enquiry
                  </h2>
                  <p className="text-xs text-white/80 mt-1 max-w-sm mx-auto">
                    Please verify your delivery information and item summary before placing the order.
                  </p>
                </div>

                {/* Modal Body */}
                <div className="p-5 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                  {/* Delivery Details Card */}
                  <div className="rounded-2xl bg-[#F8F5F0] p-4 border border-[#E8DFC8]/70 text-xs space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-[#E2D9C8]">
                      <span className="font-bold text-[#064B32] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[#064B32]" />
                        Delivery Destination
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowConfirmModal(false)}
                        className="text-[#0B6B43] hover:underline font-semibold flex items-center gap-1"
                      >
                        <Edit2 className="h-3 w-3" />
                        Edit
                      </button>
                    </div>

                    <div className="space-y-1 pt-1 text-slate-700">
                      <div>
                        <strong>Customer:</strong> {formData.customerName}
                      </div>
                      <div>
                        <strong>Phone:</strong> {formData.phone}
                      </div>
                      {formData.email && (
                        <div>
                          <strong>Email:</strong> {formData.email}
                        </div>
                      )}
                      <div>
                        <strong>Address:</strong> {formData.address}, {formData.city} - {formData.pincode}
                      </div>
                      {formData.landmark && (
                        <div>
                          <strong>Landmark:</strong> {formData.landmark}
                        </div>
                      )}
                      {formData.instructions && (
                        <div>
                          <strong>Instructions:</strong> {formData.instructions}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Items Summary Card */}
                  <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                      <ShoppingBag className="h-3.5 w-3.5 text-[#064B32]" />
                      Items in Order ({items.length})
                    </div>

                    <div className="divide-y divide-slate-100 max-h-36 overflow-y-auto">
                      {items.map((item) => (
                        <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-semibold text-slate-900">{item.name}</span>
                            <div className="text-[11px] text-slate-500">
                              {item.weight} &times; {item.quantity}
                            </div>
                          </div>
                          <span className="font-bold text-[#064B32]">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                      <span className="font-serif text-sm font-bold text-slate-900">Total Payable:</span>
                      <span className="text-xl font-bold text-[#064B32]">{formatPrice(subtotal)}</span>
                    </div>
                  </div>

                  {/* Clarification Box */}
                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 flex items-start gap-2">
                    <Truck className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
                    <span>
                      Zero upfront payment required now. Our team in Siliguri will confirm availability and coordinate delivery via WhatsApp.
                    </span>
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleConfirmAndPlaceOrder}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#064B32] py-3.5 px-6 text-sm font-bold text-white shadow hover:bg-[#043322] transition-all disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Placing Your Order...</span>
                      </>
                    ) : (
                      <>
                        <MessageSquare className="h-4 w-4" />
                        <span>Yes, Confirm & Place Order</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
