import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { ProductCard } from '@/components/ui/ProductCard';
import { CategoryCard } from '@/components/ui/CategoryCard';
import { TrustBadges } from '@/components/ui/TrustBadges';
import { ArrowRight, ShoppingCart, Play, Star, MessageSquare } from 'lucide-react';

export const revalidate = 60;

async function getHomepageData() {
  try {
    const [settings, categories, featuredProducts] = await Promise.all([
      prisma.businessSettings.findUnique({ where: { id: 'default-settings' } }),
      prisma.category.findMany({
        where: { isActive: true },
        include: {
          _count: {
            select: { products: { where: { isActive: true } } },
          },
        },
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.product.findMany({
        where: { isActive: true, isFeatured: true },
        include: { category: true },
        take: 6,
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return { settings, categories, featuredProducts };
  } catch (error) {
    if (process.env.DATABASE_URL) {
      console.warn('Database fallback during homepage render:', error);
    }
    return { settings: null, categories: [], featuredProducts: [] };
  }
}

export default async function HomePage() {
  const { settings, categories, featuredProducts } = await getHomepageData();

  const heroDescription =
    settings?.homepageDescription ||
    'Traditional flavours, organic goodness and handcrafted products from the Himalayas.';
  const heroImage = settings?.heroImageUrl || '/images/herobanner.png';
  const whatsappNumber = settings?.whatsappNumber || '917477768499';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header settings={settings || undefined} />

      <main className="flex-1">

        {/* ════════════════════════════════════════════
            HERO BANNER — text left, image right
        ════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-[#F8F0E4]" style={{ minHeight: '420px' }}>
          {/* Full-bleed background — Himalayan landscape, natural with zero overlay lines */}
          <div className="absolute inset-0 z-0">
            <Image
              src={heroImage}
              alt="Himalayan Mountain Range"
              fill
              priority
              unoptimized
              className="object-cover object-bottom"
            />
            {/* Soft text-area contrast vignette — darkens behind text, but fades to 100% transparent well before the bottom torn-paper edge and jars */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 95% 75% at 15% 25%, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0) 80%)',
              }}
            />
            {/* Seamless soft blur & fade transition on bottom edge into page background */}
            <div className="absolute inset-x-0 bottom-0 h-10 sm:h-14 bg-gradient-to-t from-[#F8F0E4] via-[#F8F0E4]/60 to-transparent pointer-events-none backdrop-blur-[2px]" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">

              {/* ── LEFT: Text Content with sharp contrast ── */}
              <div className="text-white">
                {/* Welcome label badge — crisp contrast against the mountain sky */}
                <div className="inline-flex items-center gap-2 rounded-full border border-[#E9BE54]/60 bg-[#064B32] px-3 py-1 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-[#E9BE54] mb-3 sm:mb-4 shadow-md">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-[#E9BE54]">
                    <path d="M3 20L9 8l4 6 3-4 5 10H3z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
                  </svg>
                  <span>Welcome to {settings?.businessName || 'Himali Fresh'}</span>
                </div>

                {/* Main heading */}
                <h1 className="font-serif font-bold leading-tight mb-3 sm:mb-4 [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)] max-w-[270px] sm:max-w-none">
                  {settings?.homepageHeading && settings.homepageHeading !== 'Pure & Authentic Himalayan Products' ? (
                    <span className="block text-2xl sm:text-4xl lg:text-5xl xl:text-6xl text-white">
                      {settings.homepageHeading}
                    </span>
                  ) : (
                    <>
                      <span className="block text-2xl sm:text-4xl lg:text-5xl xl:text-6xl text-white">
                        Pure &amp; Authentic
                      </span>
                      <span className="block text-2xl sm:text-4xl lg:text-5xl xl:text-6xl text-[#E9BE54] italic mt-0.5 sm:mt-1">
                        Himalayan
                      </span>
                      <span className="block text-2xl sm:text-4xl lg:text-5xl xl:text-6xl text-white">
                        Products
                      </span>
                    </>
                  )}
                </h1>

                {/* Sub-text */}
                <p className="text-xs sm:text-base text-white/95 leading-relaxed mb-5 sm:mb-7 max-w-[250px] sm:max-w-sm [text-shadow:_0_1px_4px_rgba(0,0,0,0.8)]">
                  {heroDescription}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 max-w-[270px] sm:max-w-none">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#064B32] border border-white/30 px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#073D2B] hover:scale-105"
                  >
                    <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>Shop Now →</span>
                  </Link>
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/60 bg-black/20 px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-white/10"
                  >
                    <Play className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-white" />
                    <span>Our Story</span>
                  </Link>
                </div>
              </div>

              {/* ── RIGHT: Product imagery — hidden on mobile (bg image shows) ── */}
              <div className="hidden lg:block" />
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            TRUST BADGES
        ════════════════════════════════════════════ */}
        <TrustBadges />

        {/* ════════════════════════════════════════════
            SHOP BY CATEGORY
        ════════════════════════════════════════════ */}
        <section id="categories" className="py-10 sm:py-14 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            {/* Section Header */}
            <div className="flex items-end justify-between mb-4 sm:mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {/* Mountain icon SVG */}
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[#064B32]">
                    <path d="M3 20L9 8l4 6 3-4 5 10H3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none"/>
                  </svg>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
                    Shop by Category
                  </h2>
                </div>
                {/* Gold underline accent */}
                <div className="ml-7 h-0.5 w-16 bg-[#E9BE54] rounded-full" />
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#064B32] hover:text-[#073D2B] transition-colors"
              >
                <span>View All</span>
                <span className="hidden sm:inline">Categories</span>
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Link>
            </div>

            {/* Category Horizontal Scroll on Mobile, Grid on Tablet/Desktop */}
            <div className="flex sm:grid sm:grid-cols-4 lg:grid-cols-11 gap-2.5 sm:gap-3 overflow-x-auto sm:overflow-visible no-scrollbar pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
              {categories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            FEATURED PRODUCTS
        ════════════════════════════════════════════ */}
        <section className="py-10 sm:py-14 bg-[#FAF5EB] border-t border-[#E8DFC8]/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            {/* Section Header */}
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Star className="h-5 w-5 text-[#E9BE54] fill-[#E9BE54]" />
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
                    Featured Products
                  </h2>
                </div>
                {/* Gold underline accent */}
                <div className="ml-7 h-0.5 w-16 bg-[#E9BE54] rounded-full" />
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#064B32] hover:text-[#073D2B] transition-colors"
              >
                View All Products <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Product Grid — 3 cols mobile, 6 cols desktop */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:grid-cols-6">
              {featuredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            BRAND STORY BANNER
        ════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-[#064B32] py-14 sm:py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="text-[#E9BE54] text-xs font-bold uppercase tracking-wider">
                  Our Himalayan Heritage
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-2 mb-4 leading-snug">
                  Bringing the Spirit of Himalayas to Your Home
                </h2>
                <p className="text-white/80 text-sm leading-relaxed mb-6">
                  {settings?.aboutStory ||
                    `Nestled in ${settings?.address || 'Dagapur, Siliguri'}—the gateway to the Eastern Himalayas—${settings?.businessName || 'Himali Fresh'} was created to share the authentic flavours, untamed aroma, and rich culinary traditions of our mountain communities. From tongue-tingling Dalle Khursani pickles and wild Timur to stone-ground grains and organic Darjeeling flushes, we celebrate authentic mountain goodness.`}
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-full bg-[#E9BE54] px-6 py-2.5 text-sm font-bold text-[#064B32] shadow hover:bg-yellow-400 transition-transform hover:scale-105"
                >
                  Explore Our Story <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="relative aspect-video lg:aspect-square w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10">
                <Image
                  src="/images/storybanner.jpeg"
                  alt="Himalayan Products"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            WHATSAPP CTA
        ════════════════════════════════════════════ */}
        <section className="bg-[#073D2B] text-white py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-3">
              Need help choosing your favourite Himalayan products?
            </h2>
            <p className="text-white/80 text-sm max-w-xl mx-auto mb-7">
              Our team in Siliguri is always happy to assist with product recommendations, seasonal
              availability, and bulk queries.
            </p>
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
                'Hi Himali Fresh, I have a question about your products!'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#E9BE54] px-7 py-3 text-sm font-bold text-[#064B32] shadow-lg transition-transform hover:scale-105 hover:bg-yellow-400"
            >
              <MessageSquare className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </div>
        </section>
      </main>

      <Footer settings={settings || undefined} />
      <MobileNav />
    </div>
  );
}
