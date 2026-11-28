import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { CookieConsent } from '@/components/ui/CookieConsent';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://himalifresh.com'),
  title: {
    default: 'Himali Fresh | The Spirit of Himalayas - Authentic Food, Pickles & Organic Teas',
    template: '%s | Himali Fresh',
  },
  description:
    'Pure and authentic Himalayan food products, pickles, Dalle chillies, mountain teas, organic rice, and artisanal spices sourced directly from Siliguri, Darjeeling and Eastern Himalayan valleys.',
  keywords: [
    'Himali Fresh',
    'Himalayan food products',
    'Dalle chilli pickle',
    'Dalle Khursani',
    'Bamboo shoot pickle',
    'Titoura snack',
    'Darjeeling green tea',
    'Darjeeling orthodox tea',
    'Gundruk',
    'Yak cheese chhurpi',
    'Himalayan spices',
    'Siliguri organic store',
    'Authentic Nepali food online India',
  ],
  authors: [{ name: 'Himali Fresh', url: 'https://himalifresh.com' }],
  creator: 'Himali Fresh',
  publisher: 'Himali Fresh',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://himalifresh.com',
    siteName: 'Himali Fresh',
    title: 'Himali Fresh | The Spirit of Himalayas',
    description:
      'Pure, authentic Himalayan food products, handcrafted pickles, mountain teas, and organic produce sourced directly from hill farmers and local artisans.',
    images: [
      {
        url: '/images/herobanner.png',
        width: 1200,
        height: 630,
        alt: 'Himali Fresh Himalayan Products',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Himali Fresh | The Spirit of Himalayas',
    description:
      'Pure and authentic Himalayan food products, pickles, mountain teas, and organic foods.',
    images: ['/images/herobanner.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/images/logo.jpg',
    apple: '/images/logo.jpg',
  },
};

const jsonLdGlobal = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://himalifresh.com/#organization',
      name: 'Himali Fresh',
      url: 'https://himalifresh.com',
      logo: 'https://himalifresh.com/images/logo.jpg',
      image: 'https://himalifresh.com/images/herobanner.png',
      description:
        'Pure and authentic Himalayan food products, pickles, mountain teas, and organic foods sourced from Siliguri and Eastern Himalayas.',
      telephone: '+91 74777 68499',
      email: 'himalifresh@gmail.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Dagapur',
        addressLocality: 'Siliguri',
        addressRegion: 'West Bengal',
        postalCode: '734002',
        addressCountry: 'IN',
      },
      sameAs: [
        'https://www.instagram.com/himalifresh/',
        'https://www.facebook.com/himalifresh',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://himalifresh.com/#website',
      url: 'https://himalifresh.com',
      name: 'Himali Fresh',
      publisher: {
        '@id': 'https://himalifresh.com/#organization',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://himalifresh.com/shop?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGlobal) }}
        />
        <script
          defer
          src="https://www.boosthis.com/kit.js"
          data-key="bksend_3ab86b26b8f75c77f63e3138de348679c88d4693a895ff96e0d25b04089cf8e3"
          data-install="761b088a-10e6-49b5-89ad-afc0db6b2727"
          data-project="himalifresh"
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen flex flex-col justify-between selection:bg-himali-gold selection:text-himali-dark">
        {/* Skip to content link for keyboard and screen-reader accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-[#064B32] focus:text-white focus:px-4 focus:py-2 focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>
        <Providers>
          <div id="main-content">{children}</div>
        </Providers>
        <CookieConsent />
      </body>
    </html>
  );
}
