'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { CartItem } from '@/types';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    weight: string;
    mainImageUrl: string;
    isAvailable?: boolean;
  }, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'himali_fresh_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error('Failed to persist cart', e);
      }
    }
  }, [items, isLoaded]);

  const addToCart = (product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    weight: string;
    mainImageUrl: string;
    isAvailable?: boolean;
  }, quantity = 1) => {
    if (product.isAvailable === false) {
      toast.error('This product is currently out of stock');
      return;
    }

    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          weight: product.weight,
          mainImageUrl: product.mainImageUrl,
          quantity,
        },
      ];
    });

    toast.success(`Added ${product.name} to cart`, {
      action: {
        label: 'View Cart →',
        onClick: () => {
          if (typeof window !== 'undefined') {
            window.location.href = '/cart';
          }
        },
      },
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
    toast.info('Item removed from cart');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (e) {}
  };

  const totalCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
