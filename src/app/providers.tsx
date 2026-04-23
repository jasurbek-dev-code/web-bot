'use client'; // Bu juda muhim!

import React from 'react';
import '@/i18n'; // i18n shu yerda yuklanadi
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from '@/context/CartContext';

// Agar boshqa providerlaringiz bo'lsa (masalan, Redux yoki Theme)
export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>{children}</CartProvider>
    </QueryClientProvider>
  );
}
