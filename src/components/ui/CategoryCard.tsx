import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/shop?category=${category.slug}`}
      className="group flex flex-col items-center justify-start gap-1 sm:gap-2 p-1.5 sm:p-2.5 rounded-2xl border border-[#E8DFC8]/60 bg-[#FAF5EB]/80 hover:bg-white hover:border-[#064B32]/30 hover:shadow-md transition-all duration-300 text-center shrink-0 w-[78px] sm:w-auto"
    >
      {/* Circular image with proper mobile responsive size */}
      <div className="relative h-12 w-12 sm:h-16 sm:w-16 overflow-hidden rounded-full border-2 border-white shadow-sm bg-white transition-transform duration-300 group-hover:scale-105 shrink-0">
        <Image
          src={category.imageUrl || '/images/herobanner.png'}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 50px, 80px"
          className="rounded-full object-cover"
        />
      </div>
      {/* Name */}
      <h3 className="line-clamp-2 text-[10px] sm:text-xs font-semibold text-gray-800 group-hover:text-[#064B32] transition-colors leading-tight min-h-[22px] flex items-center justify-center">
        {category.name}
      </h3>
    </Link>
  );
}
