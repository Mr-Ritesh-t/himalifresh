'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Loader2,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

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
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [totalSearchMatches, setTotalSearchMatches] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  const phone = settings?.phone || '+91 98320 78728';
  const email = settings?.email || 'info@himalifresh1.com';
  const announcement = settings?.announcement || 'Delivering Authentic Himalayan Products';
  const logoUrl = settings?.logoUrl || '/images/logo.jpg';

  // Live search debounce
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSearchResults([]);
      setTotalSearchMatches(0);
      setIsSearching(false);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    setShowDropdown(true);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(q)}&limit=4`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.products || []);
          setTotalSearchMatches(data.totalCount || 0);
        }
      } catch {
        // Fallback silently
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to dismiss autocomplete dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(e.target as Node) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setShowDropdown(false);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowDropdown(false);
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

            {/* Desktop Search with Live Autocomplete Dropdown */}
            <div ref={desktopSearchRef} className="hidden lg:block relative flex-1 max-w-[280px]">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onFocus={() => {
                    if (searchQuery.trim().length >= 2) setShowDropdown(true);
                  }}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-9 pr-8 text-sm text-gray-700 placeholder-gray-400 focus:border-[#064B32] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#064B32]/30"
                />
                {isSearching ? (
                  <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-gray-400" />
                ) : searchQuery ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setShowDropdown(false);
                    }}
                    className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 p-0.5"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </form>

              {/* Autocomplete Dropdown */}
              {showDropdown && searchQuery.trim().length >= 2 && (
                <div className="absolute top-full right-0 w-[360px] mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200/90 overflow-hidden animate-in fade-in duration-150">
                  {isSearching && searchResults.length === 0 ? (
                    <div className="p-5 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-[#064B32]" />
                      <span>Searching Himalayan catalog...</span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div>
                      <div className="px-3.5 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                        <span>Top Results</span>
                        <span className="text-[#064B32] lowercase font-medium">{totalSearchMatches} found</span>
                      </div>
                      <div className="divide-y divide-gray-100 max-h-[340px] overflow-y-auto">
                        {searchResults.map((prod) => (
                          <Link
                            key={prod.id}
                            href={`/product/${prod.slug}`}
                            onClick={() => {
                              setShowDropdown(false);
                              setSearchQuery('');
                            }}
                            className="flex items-center gap-3 p-3 hover:bg-emerald-50/50 transition-colors group"
                          >
                            <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-200/60">
                              <Image
                                src={prod.mainImageUrl || '/images/hero-banner.jpg'}
                                alt={prod.name}
                                fill
                                sizes="48px"
                                className="object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-gray-900 group-hover:text-[#064B32] truncate transition-colors">
                                {prod.name}
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-gray-500">
                                {prod.category && <span>{prod.category.name}</span>}
                                {prod.category && <span>•</span>}
                                <span>{prod.weight}</span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="text-xs font-bold text-[#064B32]">
                                {formatPrice(prod.price)}
                              </div>
                              {prod.isAvailable ? (
                                <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                                  In Stock
                                </span>
                              ) : (
                                <span className="text-[10px] font-medium text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-full">
                                  Sold Out
                                </span>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                      <Link
                        href={`/shop?q=${encodeURIComponent(searchQuery.trim())}`}
                        onClick={() => setShowDropdown(false)}
                        className="block w-full py-2.5 px-4 text-center text-xs font-semibold text-[#064B32] hover:bg-emerald-50 transition-colors border-t border-gray-100 bg-gray-50/80"
                      >
                        View all {totalSearchMatches} results for &ldquo;{searchQuery}&rdquo; →
                      </Link>
                    </div>
                  ) : (
                    <div className="p-5 text-center">
                      <p className="text-xs font-semibold text-gray-700">
                        No products found for &ldquo;{searchQuery}&rdquo;
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Try searching for honey, pickle, tea, or spices.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

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
              <div ref={mobileSearchRef} className="mb-6 relative">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onFocus={() => {
                      if (searchQuery.trim().length >= 2) setShowDropdown(true);
                    }}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-8 text-sm focus:border-[#064B32] focus:bg-white focus:outline-none"
                  />
                  {isSearching ? (
                    <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-gray-400" />
                  ) : searchQuery ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setShowDropdown(false);
                      }}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : null}
                </form>

                {/* Mobile Autocomplete Dropdown */}
                {showDropdown && searchQuery.trim().length >= 2 && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    {isSearching && searchResults.length === 0 ? (
                      <div className="p-4 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-[#064B32]" />
                        <span>Searching...</span>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div>
                        <div className="divide-y divide-gray-100 max-h-[260px] overflow-y-auto">
                          {searchResults.map((prod) => (
                            <Link
                              key={prod.id}
                              href={`/product/${prod.slug}`}
                              onClick={() => {
                                setShowDropdown(false);
                                setSearchQuery('');
                                setMobileMenuOpen(false);
                              }}
                              className="flex items-center gap-2.5 p-2.5 hover:bg-emerald-50/50 transition-colors"
                            >
                              <div className="relative h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200/60">
                                <Image
                                  src={prod.mainImageUrl || '/images/hero-banner.jpg'}
                                  alt={prod.name}
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-semibold text-gray-900 truncate">
                                  {prod.name}
                                </div>
                                <div className="text-[11px] text-gray-500">
                                  {prod.weight}
                                </div>
                              </div>
                              <div className="text-xs font-bold text-[#064B32] shrink-0">
                                {formatPrice(prod.price)}
                              </div>
                            </Link>
                          ))}
                        </div>
                        <Link
                          href={`/shop?q=${encodeURIComponent(searchQuery.trim())}`}
                          onClick={() => {
                            setShowDropdown(false);
                            setMobileMenuOpen(false);
                          }}
                          className="block w-full py-2 px-3 text-center text-xs font-semibold text-[#064B32] hover:bg-emerald-50 transition-colors border-t border-gray-100 bg-gray-50"
                        >
                          View all {totalSearchMatches} results →
                        </Link>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-xs text-gray-500">
                        No products found
                      </div>
                    )}
                  </div>
                )}
              </div>
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
