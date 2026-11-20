'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, MessageSquare, Check, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

interface ProductDetailsClientProps {
  product: Product;
  whatsappNumber: string;
}

export function ProductDetailsClient({ product, whatsappNumber }: ProductDetailsClientProps) {
  const { addToCart, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const existingInCart = items.find((i) => i.id === product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const whatsappMessage = `Hi Himali Fresh, I am interested in ordering *${product.name}* (${product.weight}) priced at ${formatPrice(product.price)}. Please let me know its availability and delivery timeline.`;
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
      {/* Product Image Gallery */}
      <div className="overflow-hidden rounded-3xl border border-himali-border bg-white p-4 shadow-card">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-himali-cream/40">
          <Image
            src={product.mainImageUrl || '/images/hero-banner.jpg'}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          {product.isFeatured && (
            <span className="absolute top-4 left-4 rounded-full bg-himali-gold px-3 py-1 text-xs font-bold uppercase tracking-wider text-himali-dark shadow">
              Featured Speciality
            </span>
          )}
        </div>
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
