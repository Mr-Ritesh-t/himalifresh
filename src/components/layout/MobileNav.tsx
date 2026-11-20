'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export function MobileNav() {
  const pathname = usePathname();
  const { totalCount } = useCart();

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Shop', href: '/shop', icon: LayoutGrid },
    { label: 'Cart', href: '/cart', icon: ShoppingCart, badge: totalCount },
    { label: 'Account', href: '/account', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/80 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom,4px)]">
      <div className="flex items-center justify-around px-1 py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href === '/shop' && pathname.startsWith('/shop') && item.label === 'Shop') ||
            (item.href === '/account' &&
              (pathname.startsWith('/account') || pathname === '/login' || pathname === '/register'));
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center justify-center gap-0.5 min-w-[50px] py-1 transition-colors"
            >
              <div
                className={`relative flex items-center justify-center rounded-full transition-all px-3 py-1 ${
                  active
                    ? 'bg-[#E8F5EE] text-[#064B32]'
                    : 'text-gray-500 hover:text-[#064B32]'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-0.5 right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#064B32] text-[10px] font-bold text-white shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium leading-none mt-0.5 ${
                  active ? 'text-[#064B32] font-semibold' : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
