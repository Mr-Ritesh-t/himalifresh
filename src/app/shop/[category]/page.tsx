import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { ProductCard } from '@/components/ui/ProductCard';
import { ChevronRight } from 'lucide-react';

export const revalidate = 60; // ISR cache for fast page delivery

export async function generateStaticParams() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true },
    });
    return categories.map((c) => ({ category: c.slug }));
  } catch {
    return [];
  }
}

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sort?: string }>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const { sort = 'newest' } = await searchParams;

  const [category, allCategories, settings] = await Promise.all([
    prisma.category.findUnique({
      where: { slug: categorySlug },
      include: {
        products: {
          where: { isActive: true },
          include: { category: true },
        },
      },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.businessSettings.findUnique({
      where: { id: 'default-settings' },
    }),
  ]);

  if (!category || !category.isActive) {
    notFound();
  }

  // Sort products
  const products = [...category.products].sort((a, b) => {
    if (sort === 'price-low') return a.price - b.price;
    if (sort === 'price-high') return b.price - a.price;
    if (sort === 'name-asc') return a.name.localeCompare(b.name);
    if (sort === 'name-desc') return b.name.localeCompare(a.name);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="min-h-screen flex flex-col bg-himali-cream/30">
      <Header settings={settings || undefined} />

      <main className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-himali-muted mb-6">
            <Link href="/" className="hover:text-himali-primary">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/shop" className="hover:text-himali-primary">
              Shop
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-himali-dark">{category.name}</span>
          </nav>

          {/* Category Banner Card */}
          <div className="relative mb-6 overflow-hidden rounded-3xl bg-himali-dark text-white p-6 sm:p-10 shadow-lg">
            <div className="absolute inset-0 z-0 opacity-25">
              <Image
                src={category.imageUrl || '/images/herobanner.png'}
                alt={category.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="relative z-10 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-himali-gold">
                Himalayan Category
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 mb-3">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
                  {category.description}
                </p>
              )}
              <div className="mt-4 text-xs text-emerald-200/80">
                {products.length} {products.length === 1 ? 'Product' : 'Products'} Available
              </div>
            </div>
          </div>

          {/* Quick Category Switcher Pills */}
          <div className="mb-8 -mx-4 px-4 overflow-x-auto no-scrollbar scroll-smooth">
            <div className="flex items-center gap-2 min-w-max pb-1">
              <Link
                href="/shop"
                className="rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap bg-white border border-[#E8DFC8] text-gray-700 hover:bg-[#FAF5EB] transition-all"
              >
                All Products
              </Link>
              {allCategories.map((cat) => {
                const active = category.slug === cat.slug;
                return (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.slug}`}
                    className={`rounded-full px-3.5 py-1.5 text-xs whitespace-nowrap transition-all ${
                      active
                        ? 'bg-[#064B32] text-white font-semibold shadow-sm ring-1 ring-[#064B32]'
                        : 'bg-white border border-[#E8DFC8] text-gray-700 hover:bg-[#FAF5EB] font-medium'
                    }`}
                  >
                    {cat.name}
                    <span className={`ml-1 text-[11px] ${active ? 'text-white/80' : 'text-gray-400'}`}>
                      ({cat._count?.products || 0})
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Product Grid */}
          {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-himali-border bg-white p-12 text-center">
              <p className="font-serif text-xl font-bold text-himali-dark mb-2">
                No products in this category yet
              </p>
              <p className="text-sm text-himali-muted mb-6">
                Fresh seasonal products are being harvested and prepared. Check back shortly!
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center rounded-full bg-himali-primary px-5 py-2 text-xs font-semibold text-white shadow hover:bg-himali-dark"
              >
                Browse All Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer settings={settings || undefined} />
      <MobileNav />
    </div>
  );
}
