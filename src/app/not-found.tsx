import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import {
  Compass,
  Home,
  ShoppingBag,
  ArrowRight,
  Search,
  MessageCircle,
  Sparkles,
} from 'lucide-react';

export const metadata = {
  title: 'Page Not Found | Himali Fresh',
  description: 'The page you are looking for cannot be found. Explore authentic Himalayan organic products, spices, mushrooms, and teas at Himali Fresh.',
};

export default async function NotFound() {
  let settings = null;
  let categories: { id: string; name: string; slug: string }[] = [];

  try {
    const [fetchedSettings, fetchedCategories] = await Promise.all([
      prisma.businessSettings.findUnique({
        where: { id: 'default-settings' },
      }),
      prisma.category.findMany({
        where: { isActive: true },
        take: 4,
        select: { id: true, name: true, slug: true },
      }),
    ]);
    settings = fetchedSettings;
    categories = fetchedCategories;
  } catch (err) {
    // Graceful offline fallback during build or downtime
    if (process.env.DATABASE_URL) {
      console.warn('[404 Page]: Could not fetch dynamic settings/categories', err);
    }
  }

  const whatsappNumber = (settings?.whatsappNumber || '917477768499').replace(/[^\d]/g, '');

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF5EB]">
      <Header settings={settings || undefined} />

      <main className="flex-1 flex flex-col justify-center items-center px-4 py-12 sm:py-20 relative overflow-hidden">
        {/* Subtle decorative mountain background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none">
          <Image
            src="/images/herobanner.png"
            alt="Mountain Silhouette"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative z-10 max-w-2xl w-full text-center mx-auto">
          {/* Compass / Mountain Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#064B32]/10 border border-[#064B32]/20 text-[#064B32] text-xs font-semibold uppercase tracking-wider mb-6">
            <Compass className="h-4 w-4 animate-spin-slow text-[#064B32]" />
            <span>Trail Not Found</span>
          </div>

          {/* Huge Stylized 404 Header */}
          <div className="relative mb-6">
            <h1 className="font-serif text-7xl sm:text-9xl font-black text-[#064B32] tracking-tight select-none">
              4<span className="text-[#E9BE54]">0</span>4
            </h1>
            <div className="h-1 w-24 bg-[#E9BE54] mx-auto rounded-full mt-2" />
          </div>

          {/* Headline & Explanation */}
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Lost in the Himalayan Trails?
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto mb-8 leading-relaxed">
            The page you are looking for has wandered off into the mountain mist, or the path has moved. Let us help you find your way back to fresh Himalayan goodness.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10">
            <Link
              href="/"
              prefetch={false}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#064B32] px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#073D2B] transition-all duration-200"
            >
              <Home className="h-4 w-4" />
              <span>Back to Homepage</span>
            </Link>

            <Link
              href="/shop"
              prefetch={false}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#064B32] bg-white px-6 py-3 text-sm font-semibold text-[#064B32] shadow-sm hover:bg-[#064B32]/5 transition-all duration-200"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Explore Himalayan Shop</span>
            </Link>
          </div>

          {/* Popular Categories Shortcut Cards */}
          {categories.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm border border-[#E8DFC8] rounded-2xl p-5 sm:p-6 shadow-sm mb-8 text-left">
              <div className="flex items-center gap-2 mb-4 text-[#064B32]">
                <Sparkles className="h-4 w-4 text-[#E9BE54]" />
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-700">
                  Popular Himalayan Categories
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.slug}`}
                    prefetch={false}
                    className="group flex flex-col justify-between p-3 rounded-xl border border-[#E8DFC8]/60 bg-[#FAF5EB]/50 hover:bg-[#064B32] hover:border-[#064B32] transition-all duration-200"
                  >
                    <span className="text-xs font-semibold text-gray-800 group-hover:text-white transition-colors truncate">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-gray-500 group-hover:text-[#E9BE54] flex items-center gap-1 mt-1 transition-colors">
                      Shop Now <ArrowRight className="h-2.5 w-2.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quick Help / WhatsApp Assistance */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-gray-600 bg-white/60 border border-[#E8DFC8]/70 rounded-full px-5 py-2.5 shadow-xs">
            <span>Looking for a specific item or need help?</span>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi Himali Fresh, I could not find a page on your website and need some assistance.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-[#064B32] hover:text-[#073D2B] underline"
            >
              <MessageCircle className="h-3.5 w-3.5 text-green-600" />
              <span>Chat with us on WhatsApp</span>
            </a>
          </div>
        </div>
      </main>

      <Footer settings={settings || undefined} />
      <MobileNav />
    </div>
  );
}
