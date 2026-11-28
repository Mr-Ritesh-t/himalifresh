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
  title: 'Himali Fresh | The Spirit of Himalayas',
  description:
    'Pure and authentic Himalayan food products, pickles, Dalle chillies, mountain teas, organic rice, and artisanal spices sourced directly from Siliguri, Darjeeling and Eastern Himalayan valleys.',
  keywords: [
    'Himali Fresh',
    'Himalayan food products',
    'Dalle chilli pickle',
    'Bamboo shoot pickle',
    'Siliguri organic store',
    'Darjeeling green tea',
    'Gundruk',
    'Yak cheese chhurpi',
    'Himalayan spices',
  ],
  authors: [{ name: 'Himali Fresh' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://himalifresh.com'),
  openGraph: {
    title: 'Himali Fresh | The Spirit of Himalayas',
    description:
      'Pure and authentic Himalayan food products, pickles, mountain teas, and organic foods.',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://himalifresh.com',
    siteName: 'Himali Fresh',
    images: [
      {
        url: '/images/herobanner.png',
        width: 1200,
        height: 630,
        alt: 'Himali Fresh Himalayan Products',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  icons: {
    icon: '/images/logo.jpg',
    apple: '/images/logo.jpg',
  },
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
