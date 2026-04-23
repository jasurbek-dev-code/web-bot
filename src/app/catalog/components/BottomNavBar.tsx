'use client';

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useTranslation } from 'react-i18next';

export default function BottomNavBar() {
  const pathname = useLocation().pathname;
  const { totalItems } = useCart();
  const { t } = useTranslation();
  const isCatalog = pathname === '/catalog' || pathname === '/';
  const isCart = pathname === '/cart-checkout';
  const isOrders = pathname === '/orders';

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bottom-nav"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="Main navigation"
    >
      <div className="max-w-lg mx-auto flex items-stretch">
        {/* Catalog Tab */}
        <Link
          to="/catalog"
          className="nav-tab flex-1"
          aria-label="Catalog"
          aria-current={isCatalog ? 'page' : undefined}
        >
          <div className={`nav-tab-inner ${isCatalog ? 'nav-tab-active' : 'nav-tab-inactive'}`}>
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <span className="nav-tab-label">{t('Catalog')}</span>
          </div>
        </Link>

        {/* Cart Tab */}
        <Link
          to="/cart-checkout"
          className="nav-tab flex-1"
          aria-label={`Cart, ${totalItems} items`}
          aria-current={isCart ? 'page' : undefined}
        >
          <div className={`nav-tab-inner ${isCart ? 'nav-tab-active' : 'nav-tab-inactive'}`}>
            <div className="relative inline-flex">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {totalItems > 0 && (
                <span
                  className="absolute -top-2 -right-2 min-w-[16px] h-4 rounded-full flex items-center justify-center text-white font-bold"
                  style={{
                    background: '#EF4444',
                    fontSize: '9px',
                    padding: '0 4px',
                    fontFamily: 'Manrope, sans-serif',
                    lineHeight: 1,
                  }}
                  aria-hidden="true"
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </div>
            <span className="nav-tab-label">{t('Cart')}</span>
          </div>
        </Link>

        {/* Orders Tab */}
        <Link
          to="/orders"
          className="nav-tab flex-1"
          aria-label="Orders"
          aria-current={isOrders ? 'page' : undefined}
        >
          <div className={`nav-tab-inner ${isOrders ? 'nav-tab-active' : 'nav-tab-inactive'}`}>
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <span className="nav-tab-label">{t('Orders')}</span>
          </div>
        </Link>
      </div>
    </nav>
  );
}
