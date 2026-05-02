"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import AppLogo from "@/components/ui/AppLogo";
import SearchBar from "./components/SearchBar";
import ProductCard from "./components/ProductCard";
import QuickViewModal from "./components/QuickViewModal";
import CartFooterBar from "./components/CartFooterBar";
import BottomNavBar from "./components/BottomNavBar";
import SkeletonGrid from "./components/SkeletonGrid";

import {
  usePaginatedData,
  usePagination,
  useCustomSearchParams,
} from "@/hooks";
import { IProduct } from "./interfaces";
import { Pagination } from "@/components";
import { useTranslation } from "react-i18next";
import {
  persistOrgId,
  persistTelegramChatId,
  resolveOrgIdFromSources,
  resolveTelegramChatIdFromSources,
  resolveTelegramChatIdFromWebApp,
  sanitizeNumericId,
} from "@/utils/security";
import { useCart } from "@/context/CartContext";
import ErrorModal from "@/components/ui/ErrorModal";

type TelegramWebApp = {
  initDataUnsafe?: {
    start_param?: unknown;
    user?: { id?: unknown };
    chat?: { id?: unknown };
    receiver?: { id?: unknown };
    chat_id?: unknown;
  };
  initData?: unknown;
  ready?: () => void;
};

function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window === "undefined") return null;
  const telegram = (
    window as unknown as { Telegram?: { WebApp?: TelegramWebApp } }
  ).Telegram;
  return telegram?.WebApp ?? null;
}

function CatalogContent() {
  const { page, pageSize, onPageChange } = usePagination();
  const { paramsObject } = useCustomSearchParams();
  const { t } = useTranslation();
  const { loadSavedCart } = useCart();

  // 1. org_id va telegram_chat_id uchun state
  const [orgId, setOrgId] = useState<string>("");
  const [telegramChatId, setTelegramChatId] = useState<string>("");
  const [orgResolved, setOrgResolved] = useState(false);

  useEffect(() => {
    // Saved cartni yuklash
    loadSavedCart();

    const tg = getTelegramWebApp();
    const startParam = tg?.initDataUnsafe?.start_param;
    const resolvedOrgId = resolveOrgIdFromSources(
      startParam,
      paramsObject?.org_id,
      paramsObject?.startapp,
    );

    const chatIdFromTg = resolveTelegramChatIdFromWebApp(tg);
    const chatIdFromParams = sanitizeNumericId(paramsObject?.telegram_chat_id);
    const resolvedChatId = resolveTelegramChatIdFromSources(
      chatIdFromTg,
      chatIdFromParams,
    );

    // DEBUG: Log Telegram data
    console.log("=== DEBUG: Telegram initDataUnsafe ===");
    console.log("tg:", tg);
    console.log("initDataUnsafe:", tg?.initDataUnsafe);
    console.log("initData:", tg?.initData);
    console.log("chatIdFromTg:", chatIdFromTg);
    console.log("chatIdFromParams:", chatIdFromParams);
    console.log("resolvedChatId:", resolvedChatId);
    console.log("=======================================");

    tg?.ready?.();

    setOrgId(persistOrgId(resolvedOrgId));
    setTelegramChatId(persistTelegramChatId(resolvedChatId));
    setOrgResolved(true);
  }, [
    paramsObject?.org_id,
    paramsObject?.startapp,
    paramsObject?.telegram_chat_id,
  ]);

  const orgMissing = orgResolved && !orgId;

  // 2. API parametrlarini memoizatsiya qilish (Infinite loop'dan saqlaydi)
  const queryParams = useMemo(() => {
    const params = {
      ...paramsObject,
      org_id: orgId,
      telegram_chat_id: telegramChatId,
      page,
      page_size: pageSize,
    };

    // DEBUG: Log query params
    console.log("=== DEBUG: queryParams ===");
    console.log("org_id:", orgId);
    console.log("telegram_chat_id:", telegramChatId);
    console.log("params:", params);
    console.log("==========================");

    return params;
  }, [orgId, telegramChatId, page, pageSize, paramsObject]);

  // API so'rovi
  const { data: products = [], isFetching } = usePaginatedData<IProduct[]>(
    "bot/catalog",
    queryParams,
    Boolean(orgId),
  );

  const [search, setSearch] = useState("");
  const [quickViewProduct, setQuickViewProduct] = useState<IProduct | null>(
    null,
  );

  // const filteredProducts = useMemo(() => {
  //   if (!search.trim()) return products;
  //   const query = search.toLowerCase();
  //   return products.filter(
  //     (product) =>
  //       product.name.toLowerCase().includes(query) ||
  //       product.description?.toLowerCase().includes(query),
  //   );
  // }, [search, products]);
  const filteredProducts = [
    {
      id: 1176,
      name: "Механическое уплотнение (фибросальник) 108*30",
      measure: "nb",
      images: [
        "https://kamtar.uz/media/1/unknown/92cf2c2f-6a06-4053-9de4-e2829b5e91718151108691946847282.jpg",
      ],
      stock_quantity: "20.0000",
      price: "13434.00",
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(160deg, #0A0F1E 0%, #0D1428 50%, #080D1A 100%)",
      }}
    >
      {/* <ErrorModal
        open={orgMissing}
        title="Xatolik"
        messages={["Do'kon aniqlashda xatolik (org_id topilmadi)."]}
        onAction={() => window.location.reload()}
      /> */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute -top-32 -right-32 w-80 h-80 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      <header
        className="sticky top-0 z-30 glass"
        style={{ borderBottom: "1px solid rgba(0,212,255,0.12)" }}
      >
        <div className="max-w-lg mx-auto px-4 pt-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AppLogo size={28} />
              <span className="font-bold text-2xl tracking-tight text-[#F0F4FF]">
                {t("Kamtar")}
              </span>
            </div>
          </div>
          <SearchBar value={search} onChange={setSearch} />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-5 pb-36">
        {isFetching ? (
          <SkeletonGrid />
        ) : (
          <>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                {t("No products found")}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  {filteredProducts.map((product, idx) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={setQuickViewProduct}
                      animationIndex={idx}
                    />
                  ))}
                </div>
                <Pagination
                  currentPage={page}
                  onPageChange={onPageChange}
                  isLastPage={products.length < pageSize}
                />
              </>
            )}
          </>
        )}
      </main>

      <CartFooterBar />
      <BottomNavBar />
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-white text-center">Yuklanmoqda...</div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
