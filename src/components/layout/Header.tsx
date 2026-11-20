'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
  Phone,
  Mail,
  Truck,
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Home,
  LayoutGrid,
  Info,
  PhoneCall,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  settings?: {
    phone?: string;
    email?: string;
    announcement?: string;
    logoUrl?: string;
  };
}

export function Header({ settings }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { totalCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const phone = settings?.phone || '+91 98320 78728';
  const email = settings?.email || 'info@himalifresh.com';
  const announcement = settings?.announcement || 'Delivering Authentic Himalayan Products';
  const logoUrl = settings?.logoUrl || '/images/logo.jpg';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/shop', label: 'Shop', icon: LayoutGrid },
    { href: '/about', label: 'About Us', icon: Info },
    { href: '/contact', label: 'Contact', icon: PhoneCall },
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-all">
      {/* ── Announcement Bar (hidden on mobile, matches reference mockup) ── */}
      <div className="hidden sm:block bg-[#064B32]/95 backdrop-blur-md text-white text-xs py-2 px-4 border-b border-[#043322]">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-white/90">
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="h-3 w-3 text-[#E9BE54]" />
              <span>{phone}</span>
            </a>
            <span className="hidden sm:inline text-white/30">|</span>
            <a
              href={`mailto:${email}`}
              className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail className="h-3 w-3 text-[#E9BE54]" />
              <span>{email}</span>
            </a>
          </div>
          <div className="flex items-center gap-1.5 text-white/90 font-medium">
            <Truck className="h-3 w-3 text-[#E9BE54] hidden sm:block" />
            <span>{announcement}</span>
          </div>
        </div>
      </div>

      {/* ── Main Navbar with Frosted Blur Merging Effect ── */}
      <div className="bg-white/80 backdrop-blur-md backdrop-saturate-150 border-b border-gray-200/50 shadow-[0_4px_24px_-2px_rgba(0,0,0,0.06)] relative transition-all">
        {/* Subtle ambient gold hairline at bottom edge */}
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#E9BE54]/30 to-transparent pointer-events-none" />
        {/* Soft feather merging gradient underneath */}
        <div className="absolute inset-x-0 -bottom-2.5 h-2.5 bg-gradient-to-b from-black/[0.04] to-transparent pointer-events-none" />

        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-[72px] items-center justify-between">

            {/* Mobile: Hamburger (left) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-[#064B32] rounded-lg transition-colors -ml-1"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Logo — Centered on mobile, Left on desktop */}
            <Link
              href="/"
              className="flex items-center gap-3 shrink-0 md:static absolute left-1/2 -translate-x-1/2 md:translate-x-0"
            >
              <div className="relative h-11 w-11 sm:h-14 sm:w-14 rounded-full overflow-hidden border-2 border-[#E9BE54] shadow-sm transition-transform hover:scale-105 bg-white">
                <Image
                  src={logoUrl}
                  alt="Himali Fresh - The Spirit of Himalayas"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              <div className="hidden sm:block">
                <span className="block font-serif text-xl font-bold tracking-tight text-[#064B32]">
                  Himali Fresh
                </span>
                <span className="block text-[11px] font-medium tracking-wider text-[#E9BE54] uppercase">
                  The Spirit of Himalayas
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors rounded-sm ${
                      active
                        ? 'text-[#064B32]'
                        : 'text-gray-700 hover:text-[#064B32]'
                    }`}
                  >
                    {link.label === 'Home' && <Home className="h-3.5 w-3.5" />}
                    {link.label === 'Shop' && <LayoutGrid className="h-3.5 w-3.5" />}
                    {link.label}
                    {active && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#064B32] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Search */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden lg:flex items-center relative flex-1 max-w-[260px]"
            >
              <Search className="absolute left-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:border-[#064B32] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#064B32]/30"
              />
            </form>

            {/* Right Icons */}
            <div className="flex items-center gap-1">
              <Link
                href="/shop"
                className="md:hidden p-2 text-gray-600 hover:text-[#064B32] rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Link>
              <Link
                href="/account"
                className="p-2 text-gray-600 hover:text-[#064B32] rounded-full hover:bg-gray-100 transition-colors"
                title="My Account"
                aria-label="My Account"
              >
                <User className="h-5 w-5" />
              </Link>
              <Link
                href="/cart"
                className="relative p-2 text-gray-600 hover:text-[#064B32] rounded-full hover:bg-gray-100 transition-colors"
                title="Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#0B6B43] text-[11px] font-bold text-white shadow">
                  {totalCount}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Slide-down Drawer ── */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 top-14 sm:top-[104px] z-[60] bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="h-full max-w-xs w-4/5 bg-white/95 backdrop-blur-xl p-5 shadow-2xl flex flex-col justify-between overflow-y-auto pb-10 border-r border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <form onSubmit={handleSearchSubmit} className="mb-6 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-sm focus:border-[#064B32] focus:bg-white focus:outline-none"
                />
              </form>
              <div className="flex flex-col gap-1">
                {[
                  { href: '/', label: 'Home', icon: Home },
                  { href: '/shop', label: 'Shop All Products', icon: LayoutGrid },
                  { href: '/account', label: 'My Account & Orders', icon: User },
                  { href: '/about', label: 'About Our Heritage', icon: Info },
                  { href: '/contact', label: 'Contact Us', icon: PhoneCall },
                ].map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-[#FAF8F0] hover:text-[#064B32] transition-colors"
                    >
                      <Icon className="h-4 w-4 text-[#0B6B43]" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="pt-6 border-t border-gray-100 space-y-3">
              <a
                href="https://wa.me/919832078728?text=Hi%20Himali%20Fresh%2C%20I%20would%20like%20to%20enquire%20about%20your%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#064B32] px-4 py-2.5 text-xs font-semibold text-white shadow hover:bg-[#073D2B] transition-colors"
              >
                Chat on WhatsApp
              </a>
              <div className="text-center">
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Store Owner / Admin Portal →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
