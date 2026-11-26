import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, MessageSquare } from 'lucide-react';

interface FooterProps {
  settings?: {
    businessName?: string;
    phone?: string;
    email?: string;
    address?: string;
    mapUrl?: string;
    logoUrl?: string;
    whatsappNumber?: string;
  };
}

export function Footer({ settings }: FooterProps) {
  const businessName = settings?.businessName || 'Himali Fresh';
  const phone = settings?.phone || '+91 98320 78728';
  const email = settings?.email || 'riteshtayade68@gmail.com';
  const address = settings?.address || 'Dagapur, Siliguri, West Bengal, India';
  const mapUrl = settings?.mapUrl || 'https://maps.app.goo.gl/ecdT4JyhbpveKzhJ9';
  const logoUrl = settings?.logoUrl || '/images/logo.jpg';
  const whatsapp = settings?.whatsappNumber || '919832078728';

  return (
    <footer className="bg-himali-dark text-white pt-10 pb-20 sm:pt-16 sm:pb-24 md:pb-12 border-t border-himali-primary/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-himali-gold/60">
                <Image
                  src={logoUrl}
                  alt={businessName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="block font-serif text-2xl font-bold tracking-tight text-white">
                  {businessName}
                </span>
                <span className="block text-xs font-medium tracking-wider text-himali-gold uppercase">
                  The Spirit of Himalayas
                </span>
              </div>
            </Link>
            <p className="text-sm text-emerald-100/80 leading-relaxed max-w-sm mb-6">
              Sourcing, packaging, and delivering authentic farm-fresh produce,
              traditional pickles, organic rice, mountain honey, and artisan
              delicacies directly from the Eastern Himalayas to your doorstep.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/${whatsapp.replace(/[^\d]/g, '')}?text=${encodeURIComponent('Hi Himali Fresh, I would like to enquire about your products.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-himali-green px-4 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-600 transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-base font-semibold text-himali-gold mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-emerald-100/80">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Our Heritage
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  Customer Account / Orders
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Store Owner Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="font-serif text-base font-semibold text-himali-gold mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-emerald-100/80">
              <li>
                <Link href="/shop/pickles-traditional-foods" className="hover:text-white transition-colors">
                  Pickles & Ferments
                </Link>
              </li>
              <li>
                <Link href="/shop/titoura-local-snacks" className="hover:text-white transition-colors">
                  Titoura & Snacks
                </Link>
              </li>
              <li>
                <Link href="/shop/spices-seasonings" className="hover:text-white transition-colors">
                  Mountain Spices & Timur
                </Link>
              </li>
              <li>
                <Link href="/shop/rice-grains-flours" className="hover:text-white transition-colors">
                  Organic Rice & Flours
                </Link>
              </li>
              <li>
                <Link href="/shop/beverages-squashes" className="hover:text-white transition-colors">
                  Teas & Squashes
                </Link>
              </li>
              <li>
                <Link href="/shop/dairy-products" className="hover:text-white transition-colors">
                  Traditional Yak Cheese
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-serif text-base font-semibold text-himali-gold mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm text-emerald-100/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-himali-gold mt-1" />
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition-colors"
                >
                  {address}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-himali-gold" />
                <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="hover:text-white">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-himali-gold" />
                <a href={`mailto:${email}`} className="hover:text-white">
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-200/60">
          <p>© {new Date().getFullYear()} Himali Fresh. All rights reserved. Dagapur, Siliguri, West Bengal.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link href="/refund-policy" className="hover:text-white transition-colors">
              Refund Policy
            </Link>
            <Link href="/cookie-policy" className="hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
