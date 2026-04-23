"use client";

import React, { useState, useMemo, Suspense, useEffect } from "react";
import { Link } from "react-router-dom";
import BottomNavBar from "@/app/catalog/components/BottomNavBar";
import { formatUZS } from "@/utils/currency";
import {
  usePaginatedData,
  usePagination,
  useCustomSearchParams,
} from "@/hooks";
import { Pagination } from "@/components";
import { useTranslation } from "react-i18next";
import ErrorModal from "@/components/ui/ErrorModal";
import {
  persistOrgId,
  persistTelegramChatId,
  resolveOrgIdFromSources,
  resolveTelegramChatIdFromSources,
  resolveTelegramChatIdFromWebApp,
  sanitizeNumericId,
} from "@/utils/security";

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

// API-dan keladigan item strukturasi
interface OrderItem {
  product_id: number;
  quantity: number;
  price: string; // API-dan string bo'lib keladi
}

// API-dan keladigan order strukturasi
interface IOrder {
  id: number;
  total_price: string;
  status: string;
  created_at: string;
  items: OrderItem[];
}

const STATUS_STYLE: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  PENDING: {
    label: "Kutilmoqda",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.12)",
  },
  CONFIRMED: {
    label: "Tasdiqlandi",
    color: "#00D4FF",
    bg: "rgba(0,212,255,0.12)",
  },
  CANCELLED: {
    label: "Bekor qilindi",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.12)",
  },
};

function OrderCard({ order }: { order: IOrder }) {
  const [expanded, setExpanded] = useState(false);
  const statusCfg = STATUS_STYLE[order.status] || {
    label: order.status,
    color: "#8896B3",
    bg: "rgba(255,255,255,0.05)",
  };

  const date = new Date(order.created_at);
  const { t } = useTranslation();
  return (
    <div className="glass-card rounded-2xl overflow-hidden mb-4">
      {" "}
      <button
        className="w-full text-left px-4 py-4 focus:outline-none"
        onClick={() => setExpanded(!expanded)}
      >
        {" "}
        <div className="flex justify-between items-start mb-2">
          {" "}
          <div>
            {" "}
            <span className="font-bold text-sm" style={{ color: "#F0F4FF" }}>
              ID: #{order.id}{" "}
            </span>{" "}
            <p className="text-xs mt-1" style={{ color: "#8896B3" }}>
              {date.toLocaleDateString()} ·{" "}
              {date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
            </p>{" "}
          </div>{" "}
          <div className="text-right">
            {" "}
            <span
              className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 inline-block"
              style={{ background: statusCfg.bg, color: statusCfg.color }}
            >
              {t(statusCfg.label)}{" "}
            </span>{" "}
            <p className="font-bold text-base" style={{ color: "#00D4FF" }}>
              {formatUZS(Number(order.total_price))}{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
        <div
          className="flex items-center justify-between text-xs"
          style={{ color: "#8896B3" }}
        >
          {" "}
          <span>
            {order.items.length} {t("different products")}{" "}
          </span>{" "}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            style={{
              transform: expanded ? "rotate(180deg)" : "none",
              transition: "0.3s",
            }}
          >
            <polyline points="6 9 12 15 18 9" />{" "}
          </svg>{" "}
        </div>{" "}
      </button>{" "}
      {expanded && (
        <div className="px-4 pb-4 animate-fade-in">
          <div className="divider mb-3" />{" "}
          <div className="space-y-2">
            {" "}
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center py-2 px-3 rounded-xl bg-white/5 border border-white/5"
              >
                {" "}
                <div>
                  {" "}
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#F0F4FF" }}
                  >
                    {t("Product ID")}: {item.product_id}{" "}
                  </p>{" "}
                  <p className="text-xs" style={{ color: "#8896B3" }}>
                    {t("Quantity")}: {item.quantity}{" "}
                  </p>{" "}
                </div>{" "}
                <span
                  className="text-sm font-bold"
                  style={{ color: "#00D4FF" }}
                >
                  {formatUZS(Number(item.price) * item.quantity)}{" "}
                </span>{" "}
              </div>
            ))}{" "}
          </div>{" "}
        </div>
      )}{" "}
    </div>
  );
}

// 1. Hamma mantiqni o'z ichiga olgan asosiy komponent
function OrdersContent() {
  const { page, pageSize, onPageChange } = usePagination();
  const { paramsObject } = useCustomSearchParams();

  // 1. Telegram ma'lumotlarini bir marta olish
  const [tgData, setTgData] = useState({
    org_id: "" as string,
    chat_id: "" as string,
  });
  const [tgResolved, setTgResolved] = useState(false);

  useEffect(() => {
    // Brauzer yoki TG muhitini tekshirish
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
    console.log("=== DEBUG: Orders Page Telegram ===");
    console.log("tg:", tg);
    console.log("initDataUnsafe:", tg?.initDataUnsafe);
    console.log("initData:", tg?.initData);
    console.log("initDataUnsafe.user:", tg?.initDataUnsafe?.user);
    console.log("initDataUnsafe.chat:", tg?.initDataUnsafe?.chat);
    console.log("initDataUnsafe.receiver:", tg?.initDataUnsafe?.receiver);
    console.log("paramsObject:", paramsObject);
    console.log("chatIdFromTg:", chatIdFromTg);
    console.log("chatIdFromParams:", chatIdFromParams);
    console.log("resolvedChatId:", resolvedChatId);
    console.log("====================================");

    tg?.ready?.();

    setTgData({
      org_id: persistOrgId(resolvedOrgId),
      chat_id: persistTelegramChatId(resolvedChatId),
    });
    setTgResolved(true);
  }, [
    paramsObject?.org_id,
    paramsObject?.startapp,
    paramsObject?.telegram_chat_id,
  ]);

  const missingOrg = tgResolved && !tgData.org_id;
  const missingChatId = tgResolved && !tgData.chat_id;
  const missingMessages = [
    missingOrg ? "Do'kon aniqlashda xatolik (org_id topilmadi)." : "",
    missingChatId
      ? "Telegram chat id olishda muvaffaqiyatsizlik (chat_id topilmadi)."
      : "",
  ].filter(Boolean);

  // 2. MUHIM: API parametrlarini memoizatsiya qilish (Infinite loopni to'xtatadi)
  const queryParams = useMemo(() => {
    return {
      ...paramsObject,
      org_id: tgData.org_id,
      telegram_chat_id: tgData.chat_id,
      page,
      page_size: pageSize,
    };
  }, [tgData.org_id, tgData.chat_id, page, pageSize, paramsObject]);

  // 3. API so'rovi
  const { data: orders = [], isFetching } = usePaginatedData<IOrder[]>(
    "bot/orders",
    queryParams,
    Boolean(tgData.org_id || tgData.chat_id),
  );
  const { t } = useTranslation();
  return (
    <div
      className="min-h-screen pb-24"
      style={{ background: "var(--color-bg)" }}
    >
      <ErrorModal
        open={missingMessages.length > 0}
        title="Xatolik"
        messages={missingMessages}
        onAction={() => window.location.reload()}
      />
      <header className="sticky top-0 z-40 glass border-b border-cyan-400/10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/catalog"
            className="p-2 bg-white/5 rounded-xl border border-white/10"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8896B3"
              strokeWidth="2"
            >
              <polyline points="15 18 9 12 15 6" />{" "}
            </svg>{" "}
          </Link>{" "}
          <h1 className="text-lg font-bold" style={{ color: "#F0F4FF" }}>
            {t("My orders")}{" "}
          </h1>
          <div className="w-10" />{" "}
        </div>{" "}
      </header>{" "}
      <main className="max-w-lg mx-auto px-4 pt-6">
        {" "}
        {isFetching ? (
          <div className="space-y-4">
            {" "}
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 w-full bg-white/5 animate-pulse rounded-2xl"
              />
            ))}{" "}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <p style={{ color: "#8896B3" }}>
              {t("You have no orders yet.")}
            </p>{" "}
          </div>
        ) : (
          <>
            {/* Buyurtmalar ro'yxati */}{" "}
            <div className="space-y-1">
              {" "}
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}{" "}
            </div>
            {/* PAGINATION SHU YERDA */}{" "}
            <Pagination
              currentPage={page}
              onPageChange={onPageChange} // Agar orders soni kutilgan limitdan kam bo'lsa, keyingi sahifa yo'q deb hisoblaymiz
              isLastPage={orders.length < 10}
            />{" "}
          </>
        )}{" "}
      </main>
      <BottomNavBar />{" "}
    </div>
  );
}

// 2. Build xatosi bermasligi uchun Suspense bilan o'ralgan eksport
export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0A0F1E]">
          <p className="text-cyan-400 animate-pulse">Yuklanmoqda...</p>{" "}
        </div>
      }
    >
      <OrdersContent />{" "}
    </Suspense>
  );
}
