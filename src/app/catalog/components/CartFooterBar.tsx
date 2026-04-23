'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/AppIcon';
import { useCart } from '@/context/CartContext';
import { formatUZS } from '@/utils/currency';
import { useTranslation } from 'react-i18next';

export default function CartFooterBar() {
  const { totalItems, totalPrice } = useCart();
  const navigate = useNavigate();
  const { t } = useTranslation();
  if (totalItems === 0) return null;

  return (
    <div
      className="fixed left-0 right-0 z-40 cart-footer animate-slide-up"
      style={{ bottom: 'calc(60px + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="max-w-lg mx-auto px-4 py-3">
        <button
          className="btn-primary w-full py-4 flex items-center justify-between px-5 animate-pulse-cyan"
          onClick={() => navigate('/cart-checkout')}
          aria-label={`View cart with ${totalItems} items, total ${formatUZS(totalPrice)}`}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-7 h-7 rounded-full font-bold text-sm"
              style={{
                background: 'rgba(10,15,30,0.4)',
                fontFamily: 'Manrope, sans-serif',
              }}
            >
              {totalItems}
            </div>
            <span className="font-bold text-base" style={{ fontFamily: 'Manrope, sans-serif' }}>
              {t('View Cart')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base" style={{ fontFamily: 'Manrope, sans-serif' }}>
              {formatUZS(totalPrice)}
            </span>
            <Icon name="ArrowRightIcon" size={18} variant="outline" className="text-bg" />
          </div>
        </button>
      </div>
    </div>
  );
}
