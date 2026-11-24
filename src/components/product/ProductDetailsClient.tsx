'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import {
  ShoppingCart,
  MessageSquare,
  Check,
  ShieldCheck,
  Truck,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface ProductDetailsClientProps {
  product: Product;
  whatsappNumber: string;
}

export function ProductDetailsClient({ product, whatsappNumber }: ProductDetailsClientProps) {
  const { addToCart, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const existingInCart = items.find((i) => i.id === product.id);

  // Delivery Pincode Checker State
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeChecking, setPincodeChecking] = useState(false);
  const [pincodeStatus, setPincodeStatus] = useState<{
    valid: boolean;
    city?: string;
    state?: string;
    estimatedDays?: string;
    deliveryType?: string;
    error?: string;
  } | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('himali_pincode');
      if (saved && saved.length === 6) {
        setPincodeInput(saved);
        handleCheckPincode(saved, false);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const handleCheckPincode = async (codeToCheck?: string, save = true) => {
    const code = (codeToCheck || pincodeInput).trim().replace(/\D/g, '').slice(0, 6);
    if (code.length !== 6) {
      setPincodeStatus({
        valid: false,
        error: 'Please enter a valid 6-digit Indian PIN code',
      });
      return;
    }

    try {
      setPincodeChecking(true);
      const res = await fetch(`/api/pincode/${code}`);
      const data = await res.json();
      if (data.valid && data.deliverable) {
        setPincodeStatus({
          valid: true,
          city: data.city,
          state: data.state,
          estimatedDays: data.estimatedDays,
          deliveryType: data.deliveryType,
        });
        if (save) {
          try {
            localStorage.setItem('himali_pincode', code);
          } catch {}
        }
      } else {
        setPincodeStatus({
          valid: false,
          error: data.error || 'PIN code is currently non-serviceable.',
        });
      }
    } catch {
      setPincodeStatus({
        valid: false,
        error: 'Unable to verify PIN code. Please try again.',
      });
    } finally {
      setPincodeChecking(false);
    }
  };

  const allImages = useMemo(() => {
    const list: string[] = [];
    if (product.mainImageUrl) list.push(product.mainImageUrl);
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach((img) => {
        if (img.imageUrl && !list.includes(img.imageUrl)) {
          list.push(img.imageUrl);
        }
      });
    }
    return list.length > 0 ? list : ['/images/hero-banner.jpg'];
  }, [product.mainImageUrl, product.images]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const currentImage = allImages[activeImageIndex] || allImages[0];

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const whatsappMessage = `Hi Himali Fresh, I am interested in ordering *${product.name}* (${product.weight}) priced at ${formatPrice(product.price)}. Please let me know its availability and delivery timeline.`;
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
      {/* Product Image Gallery */}
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-3xl border border-himali-border bg-white p-3 sm:p-4 shadow-card">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-himali-cream/40">
            <Image
              src={currentImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-all duration-300"
            />

            {product.isFeatured && (
              <span className="absolute top-4 left-4 rounded-full bg-himali-gold px-3 py-1 text-xs font-bold uppercase tracking-wider text-himali-dark shadow">
                Featured Speciality
              </span>
            )}

            {/* Photo Counter */}
            {allImages.length > 1 && (
              <span className="absolute bottom-4 right-4 rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium text-white shadow">
                {activeImageIndex + 1} / {allImages.length}
              </span>
            )}

            {/* Prev/Next Navigation Controls for Multiple Photos */}
            {allImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  aria-label="Previous photo"
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/85 text-himali-dark shadow-md flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  aria-label="Next photo"
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/85 text-himali-dark shadow-md flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Thumbnail Strip */}
        {allImages.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            {allImages.map((imgUrl, idx) => {
              const isActive = idx === activeImageIndex;
              return (
                <button
                  key={`${imgUrl}-${idx}`}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative h-18 w-18 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-2xl border-2 bg-white transition-all duration-200 ${
                    isActive
                      ? 'border-himali-green ring-2 ring-himali-green/20 scale-105 shadow-sm'
                      : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300'
                  }`}
                >
                  <Image
                    src={imgUrl}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Information & Purchase Area */}
      <div className="flex flex-col">
        {/* Category tag */}
        {product.category && (
          <Link
            href={`/shop/${product.category.slug}`}
            className="inline-block text-xs font-semibold uppercase tracking-wider text-himali-green hover:underline mb-2"
          >
            {product.category.name}
          </Link>
        )}

        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-himali-dark mb-2">
          {product.name}
        </h1>

        <div className="flex items-center gap-4 mb-4">
          <span className="text-2xl sm:text-3xl font-bold text-himali-dark">
            {formatPrice(product.price)}
          </span>
          <span className="rounded-full bg-himali-cream px-3 py-1 text-xs font-medium text-himali-muted border border-himali-border">
            Net Weight: {product.weight}
          </span>
          {product.isAvailable ? (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
              In Stock
            </span>
          ) : (
            <span className="text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
              Currently Unavailable
            </span>
          )}
        </div>

        {/* Description */}
        <div className="border-t border-b border-himali-border/80 py-5 my-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-himali-muted mb-2">
            Product Description
          </h3>
          <p className="text-sm sm:text-base text-himali-text/90 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>

        {/* Quantity and Actions */}
        {product.isAvailable ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold uppercase text-himali-muted">
                Quantity:
              </span>
              <div className="flex items-center rounded-xl border border-himali-border bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2 text-base font-bold text-himali-text hover:bg-himali-cream rounded-l-xl transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center text-sm font-semibold text-himali-dark">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-2 text-base font-bold text-himali-text hover:bg-himali-cream rounded-r-xl transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 rounded-2xl bg-himali-primary py-3.5 px-6 text-sm font-semibold text-white shadow-md hover:bg-himali-dark transition-all duration-200"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>
                  {existingInCart
                    ? `Add More (Cart has ${existingInCart.quantity})`
                    : 'Add to Shopping Cart'}
                </span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border-2 border-himali-green bg-white py-3.5 px-5 text-sm font-semibold text-himali-green hover:bg-himali-green hover:text-white transition-all duration-200"
              >
                <MessageSquare className="h-4 w-4" />
                <span>WhatsApp Enquiry</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
            <p className="text-xs sm:text-sm text-amber-800">
              This product is temporarily out of season or sold out. Please contact us via WhatsApp to check the next fresh batch schedule.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-himali-green px-4 py-2 text-xs font-semibold text-white shadow"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Ask on WhatsApp
            </a>
          </div>
        )}

        {/* Delivery Availability Checker */}
        <div className="mt-6 rounded-2xl border border-himali-border/80 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-himali-dark">
            <Truck className="h-4 w-4 text-himali-green" />
            <span>Delivery Availability & PIN Code Check</span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCheckPincode();
            }}
            className="flex items-center gap-2 mt-2"
          >
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                maxLength={6}
                value={pincodeInput}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setPincodeInput(val);
                  if (val.length === 6) {
                    handleCheckPincode(val);
                  } else {
                    setPincodeStatus(null);
                  }
                }}
                placeholder="Enter 6-digit PIN code (e.g. 734001)"
                className="w-full rounded-xl border border-himali-border py-2 pl-9 pr-3 text-xs sm:text-sm focus:border-himali-primary focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={pincodeChecking || pincodeInput.length !== 6}
              className="rounded-xl bg-himali-primary px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow hover:bg-himali-dark transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              {pincodeChecking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              <span>{pincodeChecking ? 'Checking...' : 'Check'}</span>
            </button>
          </form>

          {/* Verification Status */}
          {pincodeStatus && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              {pincodeStatus.valid ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    <span>
                      Delivery Available to {pincodeStatus.city || pincodeStatus.state}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 pl-5">
                    Estimated Delivery: <strong>{pincodeStatus.estimatedDays}</strong> ({pincodeStatus.deliveryType})
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-rose-600">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{pincodeStatus.error}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Trust Points */}
        <div className="mt-8 grid grid-cols-2 gap-3 pt-6 border-t border-himali-border/60">
          <div className="flex items-center gap-2.5 text-xs text-himali-muted">
            <ShieldCheck className="h-4 w-4 text-himali-green shrink-0" />
            <span>100% Authentic Hill Produce</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-himali-muted">
            <Truck className="h-4 w-4 text-himali-green shrink-0" />
            <span>Dispatched from Siliguri</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-himali-muted">
            <Check className="h-4 w-4 text-himali-green shrink-0" />
            <span>Direct Farmer-to-Home</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-himali-muted">
            <RefreshCw className="h-4 w-4 text-himali-green shrink-0" />
            <span>Manual Quality Inspected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
