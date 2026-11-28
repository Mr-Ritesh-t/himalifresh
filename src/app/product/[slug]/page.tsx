import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { ProductCard } from '@/components/ui/ProductCard';
import { ProductDetailsClient } from '@/components/product/ProductDetailsClient';
import { ChevronRight } from 'lucide-react';

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product || !product.isActive) {
    return {
      title: 'Product Not Found',
      robots: { index: false, follow: false },
    };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://himalifresh.com';
  const title = `${product.name} | Authentic Himalayan Specialty`;
  const description =
    product.description ||
    `Order authentic ${product.name} from Himali Fresh. Handcrafted and harvested in Siliguri, Darjeeling & Eastern Himalayas. Direct nationwide delivery.`;
  const canonicalUrl = `${appUrl}/product/${product.slug}`;
  const imageUrl = product.mainImageUrl
    ? product.mainImageUrl.startsWith('http')
      ? product.mainImageUrl
      : `${appUrl}${product.mainImageUrl}`
    : `${appUrl}/images/herobanner.png`;

  return {
    title,
    description: description.slice(0, 160),
    alternates: {
      canonical: `/product/${product.slug}`,
    },
    openGraph: {
      title,
      description: description.slice(0, 160),
      url: canonicalUrl,
      siteName: 'Himali Fresh',
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description.slice(0, 160),
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { displayOrder: 'asc' } },
    },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  const [relatedProducts, settings] = await Promise.all([
    prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isActive: true,
      },
      take: 4,
      include: { category: true },
    }),
    prisma.businessSettings.findUnique({ where: { id: 'default-settings' } }),
  ]);

  const whatsappNumber = settings?.whatsappNumber || '917477768499';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://himalifresh.com';

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.id,
    image: product.mainImageUrl
      ? product.mainImageUrl.startsWith('http')
        ? product.mainImageUrl
        : `${appUrl}${product.mainImageUrl}`
      : undefined,
    description: product.description,
    category: product.category?.name,
    brand: {
      '@type': 'Brand',
      name: 'Himali Fresh',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.isAvailable
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${appUrl}/product/${product.slug}`,
      priceValidUntil: '2026-12-31',
      seller: {
        '@type': 'Organization',
        name: 'Himali Fresh',
      },
    },
  };

  const breadcrumbsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: appUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shop',
        item: `${appUrl}/shop`,
      },
      ...(product.category
        ? [
            {
              '@type': 'ListItem',
              position: 3,
              name: product.category.name,
              item: `${appUrl}/shop/${product.category.slug}`,
            },
            {
              '@type': 'ListItem',
              position: 4,
              name: product.name,
              item: `${appUrl}/product/${product.slug}`,
            },
          ]
        : [
            {
              '@type': 'ListItem',
              position: 3,
              name: product.name,
              item: `${appUrl}/product/${product.slug}`,
            },
          ]),
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-himali-cream/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <Header settings={settings || undefined} />

      <main className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-himali-muted mb-8">
            <Link href="/" className="hover:text-himali-primary">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/shop" className="hover:text-himali-primary">
              Shop
            </Link>
            {product.category && (
              <>
                <ChevronRight className="h-3 w-3" />
                <Link
                  href={`/shop/${product.category.slug}`}
                  className="hover:text-himali-primary"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-himali-dark truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>

          {/* Interactive Product Details */}
          <ProductDetailsClient product={product} whatsappNumber={whatsappNumber} />

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 sm:mt-24 pt-12 border-t border-himali-border">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-himali-green">
                    More From This Category
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-himali-dark mt-1">
                    Related Products
                  </h2>
                </div>
                {product.category && (
                  <Link
                    href={`/shop/${product.category.slug}`}
                    className="text-xs sm:text-sm font-semibold text-himali-green hover:underline"
                  >
                    View All in {product.category.name} →
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer settings={settings || undefined} />
      <MobileNav />
    </div>
  );
}
