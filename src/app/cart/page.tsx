'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { Trash2, ShoppingBag, ArrowRight, ChevronLeft, ShieldCheck, Truck } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, totalCount, subtotal, isLoaded } = useCart();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-himali-cream/30">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-himali-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-himali-cream/30">
      <Header />

      <main className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-himali-dark">
              Shopping Cart
            </h1>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors"
              >
                Clear Entire Cart
              </button>
            )}
          </div>

          {items.length === 0 ? (
            /* Empty Cart View */
            <div className="rounded-3xl border border-dashed border-himali-border bg-white p-12 text-center max-w-xl mx-auto my-8 shadow-sm">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-himali-cream text-himali-primary">
                <ShoppingBag className="h-10 w-10 text-himali-green" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-himali-dark mb-2">
                Your shopping cart is empty
              </h2>
              <p className="text-sm text-himali-muted mb-8 leading-relaxed">
                Discover authentic pickles, spices, wild Timur, organic rice, and hill specialities straight from the Himalayas.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-himali-primary px-7 py-3 text-sm font-semibold text-white shadow-md hover:bg-himali-dark transition-transform hover:scale-105"
              >
                <span>Browse Our Products</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            /* Filled Cart View */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Items List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="rounded-2xl border border-himali-border bg-white p-5 shadow-card overflow-hidden">
                  <div className="divide-y divide-himali-border/70">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        {/* Image + Info */}
                        <div className="flex items-center gap-3.5">
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-himali-border bg-himali-cream/40">
                            <Image
                              src={item.mainImageUrl || '/images/hero-banner.jpg'}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <Link
                              href={`/product/${item.slug}`}
                              className="font-serif text-base font-bold text-himali-dark hover:text-himali-green transition-colors"
                            >
                              {item.name}
                            </Link>
                            <p className="text-xs text-himali-muted mt-0.5">
                              Weight / Unit: {item.weight}
                            </p>
                            <p className="text-xs font-semibold text-himali-primary mt-1">
                              Unit Price: {formatPrice(item.price)}
                            </p>
                          </div>
                        </div>

                        {/* Quantity and Subtotal Controls */}
                        <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                          <div className="flex items-center rounded-xl border border-himali-border bg-white shadow-sm">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-3 py-1.5 text-sm font-bold text-himali-text hover:bg-himali-cream rounded-l-xl transition-colors"
                              title="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="w-10 text-center text-xs font-semibold text-himali-dark">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-1.5 text-sm font-bold text-himali-text hover:bg-himali-cream rounded-r-xl transition-colors"
                              title="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="block text-sm sm:text-base font-bold text-himali-dark">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="mt-1 text-xs text-red-500 hover:text-red-700 inline-flex items-center gap-1 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-himali-green hover:underline"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Continue Shopping</span>
                  </Link>
                </div>
              </div>

              {/* Order Summary Box */}
              <div className="rounded-2xl border border-himali-border bg-white p-6 shadow-card space-y-5">
                <h2 className="font-serif text-lg font-bold text-himali-dark pb-3 border-b border-himali-border">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-himali-muted">
                    <span>Total Items:</span>
                    <span className="font-semibold text-himali-dark">{totalCount} items</span>
                  </div>

                  <div className="flex justify-between text-himali-muted">
                    <span>Estimated Subtotal:</span>
                    <span className="font-semibold text-himali-dark">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="rounded-xl bg-himali-cream/70 p-3 text-xs text-himali-text border border-himali-border/70">
                    <p className="font-semibold text-himali-primary mb-1 flex items-center gap-1.5">
                      <Truck className="h-3.5 w-3.5 text-himali-green" />
                      Hassle-Free Direct Ordering
                    </p>
                    <p className="text-himali-muted leading-relaxed">
                      Shipping cost and final payment details will be confirmed directly by the owner on WhatsApp based on your destination PIN code.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-himali-border flex justify-between items-baseline">
                    <span className="font-serif text-base font-bold text-himali-dark">
                      Estimated Total:
                    </span>
                    <span className="text-2xl font-bold text-himali-primary">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-himali-primary py-3.5 px-6 text-sm font-semibold text-white shadow-md hover:bg-himali-dark transition-all duration-200 hover:scale-[1.02]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <div className="flex items-center justify-center gap-2 text-xs text-himali-muted pt-2">
                  <ShieldCheck className="h-4 w-4 text-himali-green" />
                  <span>Direct WhatsApp order confirmation</span>
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
