'use client';

import React from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { CartItem, useCart } from '@/context/CartContext';
import { formatUZS } from '@/utils/currency';
import { useTranslation } from 'react-i18next';

interface CartItemRowProps {
  item: CartItem;
  animIndex: number;
}

export default function CartItemRow({ item, animIndex }: CartItemRowProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;
  const { t } = useTranslation();
  // Miqdorni oshirish (hech qanday stock cheklovisiz)
  const handleIncrease = () => {
    updateQuantity(product.id, quantity + 1);
  };

  // Miqdorni kamaytirish
  const handleDecrease = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      // Agar 1 ta bo'lsa va minus bosilsa, savatchadan o'chirib tashlaydi
      removeFromCart(product.id);
    }
  };

  return (
    <div
      className="cart-item p-3 flex gap-3 opacity-0 animate-fade-in-up"
      style={{
        animationDelay: `${animIndex * 80}ms`,
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Product Image */}
      <div
        className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0"
        style={{ background: 'rgba(255,255,255,0.05)' }}
      >
        <AppImage
          src={product.images?.[0] || '/placeholder.png'}
          alt={product.name}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>

      {/* Info Section */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3
            className="text-sm font-semibold leading-tight line-clamp-2 flex-1"
            style={{ color: '#F0F4FF', fontFamily: 'Manrope, sans-serif' }}
          >
            {product.name}
          </h3>
          <button
            className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all active:scale-90"
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.15)',
            }}
            onClick={() => removeFromCart(product.id)}
          >
            <Icon name="TrashIcon" size={14} className="text-red-400" />
          </button>
        </div>

        <p
          className="text-xs mt-1 mb-2"
          style={{ color: '#8896B3', fontFamily: 'DM Sans, sans-serif' }}
        >
          {formatUZS(Number(product.price))} {product.measure ? `/ ${t(product.measure)}` : ''}
        </p>

        <div className="flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center gap-3 bg-white/5 rounded-lg p-1">
            <button
              className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white/5 transition-colors"
              onClick={handleDecrease}
              aria-label="Decrease"
            >
              <Icon name="MinusIcon" size={12} className="text-white/70" />
            </button>

            <span
              className="font-bold text-sm min-w-[20px] text-center"
              style={{ color: '#F0F4FF', fontFamily: 'Manrope, sans-serif' }}
            >
              {quantity}
            </span>

            <button
              className="w-6 h-6 flex items-center justify-center rounded-md bg-[#00D4FF] transition-transform active:scale-90"
              onClick={handleIncrease}
              aria-label="Increase"
            >
              <Icon name="PlusIcon" size={12} className="text-[#0A0F1E]" />
            </button>
          </div>

          {/* Subtotal for this item */}
          <span
            className="font-bold text-sm"
            style={{ color: '#00D4FF', fontFamily: 'Manrope, sans-serif' }}
          >
            {formatUZS(Number(product.price) * quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
