'use client';

import { IProduct } from '@/app/catalog/interfaces';
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface CartItem {
  product: IProduct;
  quantity: number;
}

const CART_STORAGE_KEY = 'kamtar_cart';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: IProduct, qty?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, qty: number) => void;
  clearCart: () => void;
  saveCart: () => void;
  loadSavedCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: IProduct, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? {
                ...i,
                quantity: i.quantity + qty,
              }
            : i
        );
      }
      return [...prev, { product, quantity: qty }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i))
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const saveCart = useCallback(() => {
    if (typeof window !== 'undefined' && items.length > 0) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        console.log('=== DEBUG: Cart saved ===', items.length, 'items');
      } catch (e) {
        console.error('Failed to save cart:', e);
      }
    }
  }, [items]);

  const loadSavedCart = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as CartItem[];
          setItems(parsed);
          console.log('=== DEBUG: Cart loaded ===', parsed.length, 'items');
        }
      } catch (e) {
        console.error('Failed to load cart:', e);
      }
    }
  }, []);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + Number(i.product.price) * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        saveCart,
        loadSavedCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
