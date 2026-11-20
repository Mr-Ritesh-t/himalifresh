'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Settings,
  User,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === '/admin/login') {
    return null;
  }

  const links = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: Layers },
    { label: 'Order Enquiries', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Business Settings', href: '/admin/settings', icon: Settings },
    { label: 'Admin Profile', href: '/admin/profile', icon: User },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      toast.success('Logged out successfully');
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      router.push('/admin/login');
    }
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden flex items-center justify-between bg-himali-dark text-white px-4 py-3 sticky top-0 z-40 border-b border-himali-primary/40">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="relative h-9 w-9 rounded-full overflow-hidden border border-himali-gold">
            <Image src="/images/logo.jpg" alt="Himali Fresh" fill className="object-cover" />
          </div>
          <span className="font-serif text-lg font-bold">Admin Portal</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 text-emerald-200 hover:text-white"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Main */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-himali-dark text-white flex flex-col justify-between p-4 transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 px-2 py-4 mb-6 border-b border-emerald-900/60">
            <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-himali-gold shrink-0">
              <Image src="/images/logo.jpg" alt="Himali Fresh" fill className="object-cover" />
            </div>
            <div>
              <span className="block font-serif text-lg font-bold text-white leading-tight">
                Himali Fresh
              </span>
              <span className="block text-[10px] uppercase tracking-wider text-himali-gold">
                Admin Console
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-himali-green text-white shadow-sm'
                      : 'text-emerald-100/70 hover:bg-emerald-900/40 hover:text-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-himali-gold'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-emerald-900/60 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-medium text-emerald-100/70 hover:bg-emerald-900/40 hover:text-white transition-colors"
          >
            <ExternalLink className="h-4 w-4 text-himali-gold" />
            <span>View Public Website</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-semibold text-red-300 hover:bg-red-950/40 hover:text-red-200 transition-colors"
          >
            <LogOut className="h-4 w-4 text-red-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
