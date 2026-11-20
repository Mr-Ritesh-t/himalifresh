import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Himali Fresh | The Spirit of Himalayas',
    description:
      'Pure and authentic Himalayan food products, pickles, mountain teas, and organic foods.',
    url: 'https://www.himalifresh.com',
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
      <body suppressHydrationWarning className="min-h-screen flex flex-col justify-between selection:bg-himali-gold selection:text-himali-dark">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
