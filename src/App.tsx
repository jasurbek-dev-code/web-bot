import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Providers from '@/app/providers';

import HomeRedirect from '@/app/page';
import CatalogPage from '@/app/catalog/page';
import CartCheckoutPage from '@/app/cart-checkout/page';
import OrdersPage from '@/app/orders/page';
import NotFound from '@/app/not-found';

export default function App() {
  return (
    <BrowserRouter>
      <Providers>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/cart-checkout" element={<CartCheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Providers>
    </BrowserRouter>
  );
}

