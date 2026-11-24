'use client';

import React from 'react';
import { CartProvider } from '@/context/CartContext';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={2500}
      />
    </CartProvider>
  );
}
