'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Check } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, items } = useCart();
  const existingInCart = items.find((i) => i.id === product.id);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#E8DFC8]/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-[#064B32]/30">
      {/* Product Image — full bleed top */}
      <div className="relative w-full overflow-hidden bg-[#FAF5EB]" style={{ aspectRatio: '1/1' }}>
        <Link href={`/product/${product.slug}`} className="block h-full w-full">
          <Image
            src={product.mainImageUrl || '/images/herobanner.png'}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Badges top-left */}
        <div className="absolute left-2 top-2 flex flex-col gap-1 z-10">
          {product.isFeatured && (
            <span className="rounded-full bg-[#E9BE54] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#073D2B] shadow-sm">
              Featured
            </span>
          )}
          {!product.isAvailable && (
            <span className="rounded-full bg-red-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col p-2 sm:p-3">
        {/* Name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 text-[11px] sm:text-sm font-semibold text-gray-800 leading-tight hover:text-[#064B32] transition-colors min-h-[26px]">
            {product.name}
          </h3>
        </Link>

        {/* Weight */}
        <p className="mt-0.5 text-[9px] sm:text-[11px] text-gray-400">
          ({product.weight})
        </p>

        {/* Price */}
        <p className="mt-1 text-xs sm:text-base font-bold text-gray-900">
          {formatPrice(product.price)}
        </p>

        {/* Add to Cart button — outlined style matching reference */}
        <button
          onClick={() => product.isAvailable && addToCart(product)}
          disabled={!product.isAvailable}
          className={`mt-2 flex items-center justify-center gap-1 w-full rounded-full border py-1 sm:py-1.5 px-1 sm:px-2 text-[10px] sm:text-xs font-semibold transition-all duration-200 ${
            !product.isAvailable
              ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
              : existingInCart
              ? 'border-[#064B32] bg-[#064B32] text-white'
              : 'border-[#064B32] bg-white text-[#064B32] hover:bg-[#064B32] hover:text-white'
          }`}
        >
          {existingInCart ? (
            <>
              <Check className="h-3 w-3 shrink-0" />
              <span className="truncate">Added ({existingInCart.quantity})</span>
            </>
          ) : (
            <>
              <ShoppingCart className="h-3 w-3 shrink-0" />
              <span className="truncate">Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
