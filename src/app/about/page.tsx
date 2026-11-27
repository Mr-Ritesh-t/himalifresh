import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { Mountain, Sprout, HeartHandshake, ShieldCheck, ArrowRight, MapPin } from 'lucide-react';

export const revalidate = 300; // 5 minute ISR cache for fast static delivery

export default async function AboutPage() {
  let settings = null;
  try {
    settings = await prisma.businessSettings.findUnique({
      where: { id: 'default-settings' },
    });
  } catch (error) {
    if (process.env.DATABASE_URL) {
      console.warn('Database query fallback during AboutPage render:', error);
    }
  }

  const aboutStory =
    settings?.aboutStory ||
    'Founded in Siliguri, at the gateway to the Eastern Himalayas, Himali Fresh connects traditional hill communities, organic farmers, and artisan food makers with households across India.';

  return (
    <div className="min-h-screen flex flex-col bg-himali-cream/30">
      <Header settings={settings || undefined} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-himali-dark py-20 text-white">
          <div className="absolute inset-0 z-0 opacity-40">
            <Image
              src="/images/herobanner.png"
              alt="Himalayan Mountain Range"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-himali-dark via-himali-dark/70 to-transparent" />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-himali-gold">
              Our Mountain Roots
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold mt-2 mb-4 leading-tight">
              About Himali Fresh
            </h1>
            <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-2xl mx-auto">
              The Spirit of Himalayas — Celebrating authentic culinary heritage, mountain biodiversity, and traditional artisan food making.
            </p>
          </div>
        </section>

        {/* Section 1: Our Story */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 text-himali-green text-xs font-bold uppercase tracking-wider mb-2">
                  <Mountain className="h-4 w-4" />
                  <span>The Siliguri Gateway</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-himali-dark mb-6">
                  Preserving Pure Himalayan Traditions
                </h2>
                <div className="space-y-4 text-sm sm:text-base text-himali-text/90 leading-relaxed">
                  <p>{aboutStory}</p>
                  <p>
                    Siliguri stands at the foothills where the plains meet the majestic hills of Darjeeling, Kalimpong, Sikkim, and the Dooars. For generations, hill families have cured sun-dried fermented Gundruk, steeped firecracker Dalle chillies in stone-pressed mustard oil, and hand-plucked wild Timur berries in pristine sub-alpine valleys.
                  </p>
                  <p>
                    Himali Fresh is our dedication to preserving these rare regional flavours and making them accessible to genuine food lovers across India without artificial preservatives or industrial adulteration.
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-himali-primary">
                    <MapPin className="h-4 w-4 text-himali-gold" />
                    <span>Dagapur, Siliguri, West Bengal</span>
                  </div>
                </div>
              </div>

              <div className="relative aspect-4/3 w-full rounded-3xl overflow-hidden shadow-card border-2 border-white">
                <Image
                  src="/images/herobanner.png"
                  alt="Himalayan Produce and Mountain View"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Core Values */}
        <section className="bg-white py-16 border-y border-himali-border/70">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-himali-green text-xs font-bold uppercase tracking-wider">
                Our Values
              </span>
              <h2 className="font-serif text-3xl font-bold text-himali-dark mt-2">
                What Sets Himali Fresh Apart
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="rounded-2xl border border-himali-border/80 bg-himali-cream/40 p-6 text-center">
                <div className="mx-auto h-12 w-12 rounded-xl bg-himali-primary text-white flex items-center justify-center mb-4 shadow">
                  <Sprout className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-himali-dark mb-2">
                  Unadulterated Purity
                </h3>
                <p className="text-xs sm:text-sm text-himali-muted leading-relaxed">
                  We work closely with small-scale growers who follow natural farming methods. No chemical additives, no synthetic colours, no compromises.
                </p>
              </div>

              <div className="rounded-2xl border border-himali-border/80 bg-himali-cream/40 p-6 text-center">
                <div className="mx-auto h-12 w-12 rounded-xl bg-himali-primary text-white flex items-center justify-center mb-4 shadow">
                  <HeartHandshake className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-himali-dark mb-2">
                  Fair Farmer Partnerships
                </h3>
                <p className="text-xs sm:text-sm text-himali-muted leading-relaxed">
                  We support hill self-help groups, indigenous women fermenters, and local farmers by providing dependable market access and fair pricing.
                </p>
              </div>

              <div className="rounded-2xl border border-himali-border/80 bg-himali-cream/40 p-6 text-center">
                <div className="mx-auto h-12 w-12 rounded-xl bg-himali-primary text-white flex items-center justify-center mb-4 shadow">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-himali-dark mb-2">
                  Personal Care & Trust
                </h3>
                <p className="text-xs sm:text-sm text-himali-muted leading-relaxed">
                  Every order enquiry is reviewed individually. We pack each item securely to endure long-distance transit and deliver Himalayan freshness right to your kitchen.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: CTA Banner */}
        <section className="bg-himali-primary text-white py-14">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-3">
              Taste the True Spirit of Himalayas
            </h2>
            <p className="text-emerald-100/90 text-sm max-w-xl mx-auto mb-6">
              Explore our wide variety of pickles, snacks, spices, grains, and specialty mountain goods.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-himali-gold px-7 py-3 text-sm font-bold text-himali-dark shadow hover:bg-yellow-400 transition-all hover:scale-105"
            >
              <span>Explore All Products</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer settings={settings || undefined} />
      <MobileNav />
    </div>
  );
}
