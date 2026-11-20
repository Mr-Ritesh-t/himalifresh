import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { ProductCard } from '@/components/ui/ProductCard';
import { ShopSort } from '@/components/shop/ShopSort';
import { Search, SlidersHorizontal, ArrowUpDown, ChevronRight, X } from 'lucide-react';

interface ShopPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    available?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const q = params.q?.trim() || '';
  const categorySlug = params.category?.trim() || '';
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined;
  const availableOnly = params.available === 'true';
  const sort = params.sort || 'newest';
  const page = parseInt(params.page || '1', 10);
  const limit = 12;
  const skip = (page - 1) * limit;

  // Build Prisma where clause
  const where: any = { isActive: true };

  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
    ];
  }

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  if (availableOnly) {
    where.isAvailable = true;
  }

  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price-low') {
    orderBy = { price: 'asc' };
  } else if (sort === 'price-high') {
    orderBy = { price: 'desc' };
  } else if (sort === 'name-asc') {
    orderBy = { name: 'asc' };
  } else if (sort === 'name-desc') {
    orderBy = { name: 'desc' };
  }

  const [products, totalCount, categories, settings] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.businessSettings.findUnique({ where: { id: 'default-settings' } }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  // Helper to build URL with query params
  const buildFilterUrl = (overrides: Record<string, string | undefined>) => {
    const current = new URLSearchParams();
    if (q) current.set('q', q);
    if (categorySlug) current.set('category', categorySlug);
    if (params.minPrice) current.set('minPrice', params.minPrice);
    if (params.maxPrice) current.set('maxPrice', params.maxPrice);
    if (params.available) current.set('available', params.available);
    if (sort) current.set('sort', sort);

    Object.entries(overrides).forEach(([key, val]) => {
      if (val === undefined || val === '') {
        current.delete(key);
      } else {
        current.set(key, val);
      }
    });

    return `/shop?${current.toString()}`;
  };

  // Helper for smart pagination with ellipsis
  const getPaginationPages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | string)[] = [];
    if (page <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPages);
    } else if (page >= totalPages - 2) {
      pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen flex flex-col bg-himali-cream/30">
      <Header settings={settings || undefined} />

      <main className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-himali-muted mb-6">
            <Link href="/" className="hover:text-himali-primary">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-himali-dark">All Products</span>
            {categorySlug && (
              <>
                <ChevronRight className="h-3 w-3" />
                <span className="font-semibold text-himali-primary">
                  {categories.find((c) => c.slug === categorySlug)?.name || categorySlug}
                </span>
              </>
            )}
          </nav>

          {/* Page Heading & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[#064B32]">
                  <path d="M3 20L9 8l4 6 3-4 5 10H3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none"/>
                </svg>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-himali-dark">
                  {categorySlug
                    ? categories.find((c) => c.slug === categorySlug)?.name || 'Himalayan Products'
                    : 'All Himalayan Products'}
                </h1>
              </div>
              <div className="ml-7 h-0.5 w-16 bg-[#E9BE54] rounded-full mb-2" />
              <p className="text-xs sm:text-sm text-himali-muted">
                Showing {products.length} of {totalCount} authentic products
              </p>
            </div>

            {/* Top Bar Sort & Search Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search in Shop */}
              <form method="GET" action="/shop" className="relative flex-1 sm:w-64">
                {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
                <input
                  type="text"
                  name="q"
                  defaultValue={q}
                  placeholder="Search catalogue..."
                  className="w-full rounded-full border border-himali-border bg-white py-2 pl-4 pr-10 text-xs sm:text-sm focus:border-himali-primary focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-2.5 text-himali-muted hover:text-himali-primary"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>

              {/* Sorting Dropdown */}
              <div className="flex items-center gap-1.5 rounded-full border border-himali-border bg-white px-3 py-1.5 text-xs text-himali-text shadow-sm">
                <ArrowUpDown className="h-3.5 w-3.5 text-himali-green shrink-0" />
                <ShopSort currentSort={sort} />
              </div>
            </div>
          </div>

          {/* Mobile Categories Horizontal Pill Bar */}
          <div className="lg:hidden mb-5 -mx-4 px-4 overflow-x-auto no-scrollbar scroll-smooth">
            <div className="flex items-center gap-2 min-w-max pb-1">
              <Link
                href={buildFilterUrl({ category: undefined, page: '1' })}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                  !categorySlug
                    ? 'bg-[#064B32] text-white shadow-sm ring-1 ring-[#064B32]'
                    : 'bg-white border border-[#E8DFC8] text-gray-700 hover:bg-[#FAF5EB]'
                }`}
              >
                All Products ({totalCount})
              </Link>
              {categories.map((cat) => {
                const active = categorySlug === cat.slug;
                return (
                  <Link
                    key={cat.id}
                    href={buildFilterUrl({ category: cat.slug, page: '1' })}
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

          {/* Active Filter Pills */}
          {(q || categorySlug || availableOnly || minPrice || maxPrice) && (
            <div className="flex items-center gap-2 flex-wrap mb-6">
              <span className="text-xs font-semibold text-himali-muted">Active Filters:</span>
              {q && (
                <Link
                  href={buildFilterUrl({ q: undefined })}
                  className="inline-flex items-center gap-1 rounded-full bg-himali-cream px-3 py-1 text-xs font-medium text-himali-dark hover:bg-himali-border"
                >
                  <span>Query: "{q}"</span>
                  <X className="h-3 w-3" />
                </Link>
              )}
              {categorySlug && (
                <Link
                  href={buildFilterUrl({ category: undefined })}
                  className="inline-flex items-center gap-1 rounded-full bg-himali-cream px-3 py-1 text-xs font-medium text-himali-dark hover:bg-himali-border"
                >
                  <span>Category: {categories.find((c) => c.slug === categorySlug)?.name}</span>
                  <X className="h-3 w-3" />
                </Link>
              )}
              {availableOnly && (
                <Link
                  href={buildFilterUrl({ available: undefined })}
                  className="inline-flex items-center gap-1 rounded-full bg-himali-cream px-3 py-1 text-xs font-medium text-himali-dark hover:bg-himali-border"
                >
                  <span>In Stock Only</span>
                  <X className="h-3 w-3" />
                </Link>
              )}
              <Link
                href="/shop"
                className="text-xs text-red-600 font-semibold hover:underline ml-2"
              >
                Clear All
              </Link>
            </div>
          )}

          {/* Main Layout: Sidebar + Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block lg:col-span-1 space-y-6">
              {/* Categories Filter Box */}
              <div className="rounded-2xl border border-himali-border bg-white p-5 shadow-card">
                <h3 className="font-serif text-base font-bold text-himali-dark mb-4">
                  Categories
                </h3>
                <div className="space-y-1.5 text-xs sm:text-sm">
                  <Link
                    href={buildFilterUrl({ category: undefined })}
                    className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 transition-colors ${
                      !categorySlug
                        ? 'bg-himali-cream font-bold text-himali-primary'
                        : 'text-himali-text hover:bg-himali-cream/50'
                    }`}
                  >
                    <span>All Categories</span>
                    <span className="text-xs text-himali-muted">{totalCount}</span>
                  </Link>

                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={buildFilterUrl({ category: cat.slug })}
                      className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 transition-colors ${
                        categorySlug === cat.slug
                          ? 'bg-himali-cream font-bold text-himali-primary'
                          : 'text-himali-text hover:bg-himali-cream/50'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs text-himali-muted">
                        {cat._count?.products || 0}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Availability Filter Box */}
              <div className="rounded-2xl border border-himali-border bg-white p-5 shadow-card">
                <h3 className="font-serif text-base font-bold text-himali-dark mb-3">
                  Availability
                </h3>
                <Link
                  href={buildFilterUrl({ available: availableOnly ? undefined : 'true' })}
                  className="flex items-center gap-2.5 text-xs sm:text-sm text-himali-text group cursor-pointer"
                >
                  <div
                    className={`h-4 w-4 rounded flex items-center justify-center border transition-colors ${
                      availableOnly
                        ? 'bg-[#064B32] border-[#064B32] text-white'
                        : 'border-[#E8DFC8] bg-white group-hover:border-[#064B32]'
                    }`}
                  >
                    {availableOnly && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <span className={availableOnly ? 'font-semibold text-[#064B32]' : ''}>
                    In Stock Only
                  </span>
                </Link>
              </div>
            </aside>

            {/* Product Grid Area */}
            <div className="lg:col-span-3">
              {products.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-himali-border bg-white p-12 text-center">
                  <p className="font-serif text-xl font-bold text-himali-dark mb-2">
                    No products found
                  </p>
                  <p className="text-sm text-himali-muted mb-6">
                    We could not find any products matching your current filters. Try adjusting your search query or category selection.
                  </p>
                  <Link
                    href="/shop"
                    className="inline-flex items-center rounded-full bg-himali-primary px-5 py-2 text-xs font-semibold text-white shadow hover:bg-himali-dark"
                  >
                    View All Products
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-2 md:grid-cols-3">
                  {products.map((prod) => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>
              )}

              {/* Server-side Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                  {/* Mobile Compact Pagination */}
                  <div className="flex sm:hidden items-center justify-between w-full max-w-xs gap-3">
                    {page > 1 ? (
                      <Link
                        href={buildFilterUrl({ page: String(page - 1) })}
                        className="flex-1 flex items-center justify-center rounded-xl border border-himali-border bg-white py-2 px-3 text-xs font-semibold text-himali-dark shadow-sm active:bg-gray-50"
                      >
                        ← Prev
                      </Link>
                    ) : (
                      <span className="flex-1 flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 py-2 px-3 text-xs font-semibold text-gray-300 cursor-not-allowed">
                        ← Prev
                      </span>
                    )}

                    <span className="text-xs font-semibold text-gray-700 whitespace-nowrap px-3 py-1.5 rounded-lg bg-white border border-gray-200 shadow-xs">
                      Page {page} of {totalPages}
                    </span>

                    {page < totalPages ? (
                      <Link
                        href={buildFilterUrl({ page: String(page + 1) })}
                        className="flex-1 flex items-center justify-center rounded-xl bg-[#064B32] py-2 px-3 text-xs font-semibold text-white shadow-sm active:bg-[#073D2B]"
                      >
                        Next →
                      </Link>
                    ) : (
                      <span className="flex-1 flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 py-2 px-3 text-xs font-semibold text-gray-300 cursor-not-allowed">
                        Next →
                      </span>
                    )}
                  </div>

                  {/* Tablet & Desktop Numbered Pagination with Ellipsis */}
                  <div className="hidden sm:flex items-center justify-center gap-1.5">
                    {page > 1 && (
                      <Link
                        href={buildFilterUrl({ page: String(page - 1) })}
                        className="rounded-xl border border-himali-border bg-white px-3.5 py-2 text-xs font-semibold text-himali-dark hover:bg-himali-cream transition-colors"
                      >
                        ← Prev
                      </Link>
                    )}
                    {getPaginationPages().map((pItem, idx) => {
                      if (pItem === '...') {
                        return (
                          <span key={`dots-${idx}`} className="px-2 text-gray-400 text-xs font-bold">
                            …
                          </span>
                        );
                      }
                      const pageNum = Number(pItem);
                      const active = pageNum === page;
                      return (
                        <Link
                          key={pageNum}
                          href={buildFilterUrl({ page: String(pageNum) })}
                          className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-semibold transition-all ${
                            active
                              ? 'bg-[#064B32] text-white shadow-sm'
                              : 'border border-himali-border bg-white text-gray-700 hover:bg-[#FAF8F0]'
                          }`}
                        >
                          {pageNum}
                        </Link>
                      );
                    })}
                    {page < totalPages && (
                      <Link
                        href={buildFilterUrl({ page: String(page + 1) })}
                        className="rounded-xl border border-himali-border bg-white px-3.5 py-2 text-xs font-semibold text-himali-dark hover:bg-himali-cream transition-colors"
                      >
                        Next →
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer settings={settings || undefined} />
      <MobileNav />
    </div>
  );
}
