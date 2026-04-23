"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLogo from "@/components/ui/AppLogo";
import Icon from "@/components/ui/AppIcon";
import CartItemRow from "./components/CartItemRow";
import CheckoutForm from "./components/CheckoutForm";
import { useCart } from "@/context/CartContext";
import { formatUZS } from "@/utils/currency";
import { useTranslation } from "react-i18next";

type Tab = "cart" | "checkout";

function CartCheckoutContent() {
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, clearCart, saveCart } = useCart();
  const [activeTab, setActiveTab] = useState<Tab>("cart");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const { t } = useTranslation();

  const handleSaveAndClose = () => {
    saveCart();
    navigate("/catalog");
  };

  if (orderPlaced) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{
          background:
            "linear-gradient(160deg, #0A0F1E 0%, #0D1428 50%, #080D1A 100%)",
        }}
      >
        <div className="text-center animate-scale-in">
          {/* Success icon */}
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-cyan"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,212,255,0.2) 0%, rgba(0,153,204,0.1) 100%)",
              border: "2px solid rgba(0,212,255,0.4)",
            }}
          >
            <Icon
              name="CheckCircleIcon"
              size={48}
              variant="solid"
              className="text-cyan-400"
              style={{ color: "#00D4FF" }}
            />
          </div>
          <h1
            className="text-2xl font-bold mb-3"
            style={{ color: "#F0F4FF", fontFamily: "Manrope, sans-serif" }}
          >
            {t("Order Placed!")}
          </h1>
          <p
            className="text-base mb-2"
            style={{ color: "#8896B3", fontFamily: "DM Sans, sans-serif" }}
          >
            {t("Your order has been sent successfully.")}
          </p>
          <p
            className="text-sm mb-8"
            style={{ color: "#8896B3", fontFamily: "DM Sans, sans-serif" }}
          >
            {t("You will receive a confirmation in Telegram shortly.")}
          </p>
          <button
            className="btn-primary px-8 py-4 text-base"
            onClick={() => navigate("/catalog")}
            aria-label="Continue shopping"
          >
            <span style={{ fontFamily: "Manrope, sans-serif" }}>
              {t("Continue Shopping")}
            </span>
          </button>
        </div>
      </div>
    );
  }

  if (totalItems === 0) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{
          background:
            "linear-gradient(160deg, #0A0F1E 0%, #0D1428 50%, #080D1A 100%)",
        }}
      >
        {/* Header */}
        <header
          className="glass sticky top-0 z-30"
          style={{ borderBottom: "1px solid rgba(0,212,255,0.12)" }}
        >
          <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
            <button
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              onClick={() => navigate("/catalog")}
              aria-label="Back to catalog"
            >
              <Icon
                name="ArrowLeftIcon"
                size={18}
                variant="outline"
                style={{ color: "#8896B3" }}
              />
            </button>
            <div className="flex items-center gap-2">
              <AppLogo size={28} />
              <span
                className="font-bold  text-xl"
                style={{ fontFamily: "Manrope, sans-serif", color: "#F0F4FF" }}
              >
                {t("My Cart")}
              </span>
            </div>
          </div>
        </header>

        {/* Empty state */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Icon
              name="ShoppingCartIcon"
              size={40}
              variant="outline"
              style={{ color: "#8896B3" }}
            />
          </div>
          <h2
            className="text-xl font-bold mb-2"
            style={{ color: "#F0F4FF", fontFamily: "Manrope, sans-serif" }}
          >
            {t("Your cart is empty")}
          </h2>
          <p
            className="text-sm text-center mb-8"
            style={{
              color: "#8896B3",
              fontFamily: "DM Sans, sans-serif",
              maxWidth: "260px",
            }}
          >
            {t("Browse the catalog and add products to get started")}
          </p>
          <button
            className="btn-primary px-8 py-4 text-base flex items-center gap-2"
            onClick={() => navigate("/catalog")}
            aria-label="Browse catalog"
          >
            <Icon
              name="ArrowLeftIcon"
              size={18}
              variant="outline"
              className="text-bg"
            />
            <span style={{ fontFamily: "Manrope, sans-serif" }}>
              {t("Browse Catalog")}
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(160deg, #0A0F1E 0%, #0D1428 50%, #080D1A 100%)",
      }}
    >
      {/* Background decoration */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Sticky Header */}
      <header
        className="glass sticky top-0 z-30"
        style={{ borderBottom: "1px solid rgba(0,212,255,0.12)" }}
      >
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              onClick={() => navigate("/catalog")}
              aria-label="Back to catalog"
            >
              <Icon
                name="ArrowLeftIcon"
                size={18}
                variant="outline"
                style={{ color: "#8896B3" }}
              />
            </button>
            <button
              className="text-xs font-semibold px-3 py-2 rounded-lg transition-all"
              style={{
                background: "rgba(0,212,255,0.1)",
                color: "#00D4FF",
                border: "1px solid rgba(0,212,255,0.2)",
                fontFamily: "Manrope, sans-serif",
              }}
              onClick={handleSaveAndClose}
              aria-label="Save and return to catalog"
            >
              {t("Save")}
            </button>
            <div className="flex items-center gap-2 flex-1">
              <AppLogo size={28} />
              <span
                className="font-bold text-xl"
                style={{ fontFamily: "Manrope, sans-serif", color: "#F0F4FF" }}
              >
                {t("Checkout")}
              </span>
            </div>
            {/* Item count badge */}
            <div
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{
                background: "rgba(0,212,255,0.12)",
                color: "#00D4FF",
                border: "1px solid rgba(0,212,255,0.2)",
                fontFamily: "Manrope, sans-serif",
              }}
            >
              {totalItems} {totalItems !== 1 ? `${t("items")}` : `${t("item")}`}
            </div>
          </div>

          {/* Tab switcher */}
          <div
            className="flex rounded-xl p-1"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            role="tablist"
          >
            {(["cart", "checkout"] as Tab[]).map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                className="flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200"
                style={{
                  fontFamily: "Manrope, sans-serif",
                  background:
                    activeTab === tab
                      ? "linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)"
                      : "transparent",
                  color: activeTab === tab ? "#0A0F1E" : "#8896B3",
                }}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "cart" ? `🛒 ${t("Cart")}` : `📋 ${t("Details")}`}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-lg mx-auto px-4 pt-5 pb-10">
        {activeTab === "cart" ? (
          <div>
            {/* Cart items */}
            <div className="space-y-3 mb-6">
              {items.map((item, idx) => (
                <CartItemRow
                  key={item.product.id}
                  item={item}
                  animIndex={idx}
                />
              ))}
            </div>

            {/* Summary */}
            <div
              className="rounded-2xl p-4 mb-5"
              style={{
                background: "rgba(0,212,255,0.05)",
                border: "1px solid rgba(0,212,255,0.12)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-sm"
                  style={{
                    color: "#8896B3",
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  {t("Subtotal")}
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{
                    color: "#F0F4FF",
                    fontFamily: "Manrope, sans-serif",
                  }}
                >
                  {formatUZS(totalPrice)}
                </span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-sm"
                  style={{
                    color: "#8896B3",
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  {t("Delivery")}
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{
                    color: "#4ADE80",
                    fontFamily: "Manrope, sans-serif",
                  }}
                >
                  Free
                </span>
              </div>
              <div className="divider mb-3" />
              <div className="flex items-center justify-between">
                <span
                  className="font-bold text-base"
                  style={{
                    color: "#F0F4FF",
                    fontFamily: "Manrope, sans-serif",
                  }}
                >
                  {t("Total")}
                </span>
                <span
                  className="font-bold text-xl"
                  style={{
                    color: "#00D4FF",
                    fontFamily: "Manrope, sans-serif",
                  }}
                >
                  {formatUZS(totalPrice)}
                </span>
              </div>
            </div>

            {/* Clear cart */}
            <button
              className="w-full py-3 rounded-xl text-sm font-semibold mb-4 transition-all"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#F87171",
                fontFamily: "Manrope, sans-serif",
              }}
              onClick={clearCart}
              aria-label="Clear all items from cart"
            >
              {t("Clear Cart")}
            </button>

            {/* Proceed to checkout */}
            <button
              className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-base"
              onClick={() => setActiveTab("checkout")}
              aria-label="Proceed to checkout details"
            >
              <span style={{ fontFamily: "Manrope, sans-serif" }}>
                {t("Proceed to Checkout")}
              </span>
              <Icon
                name="ArrowRightIcon"
                size={18}
                variant="outline"
                className="text-bg"
              />
            </button>
          </div>
        ) : (
          <div className="animate-fade-in-up" style={{ animationDelay: "0ms" }}>
            {/* Order summary mini */}
            <div
              className="rounded-2xl p-4 mb-5 flex items-center justify-between"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div>
                <p
                  className="text-xs mb-0.5"
                  style={{
                    color: "#8896B3",
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  {t("Order total")}
                </p>
                <p
                  className="font-bold text-lg"
                  style={{
                    color: "#00D4FF",
                    fontFamily: "Manrope, sans-serif",
                  }}
                >
                  {formatUZS(totalPrice)}
                </p>
              </div>
              <button
                className="text-xs font-semibold px-3 py-2 rounded-lg transition-all"
                style={{
                  background: "rgba(0,212,255,0.1)",
                  color: "#00D4FF",
                  border: "1px solid rgba(0,212,255,0.2)",
                  fontFamily: "Manrope, sans-serif",
                }}
                onClick={() => setActiveTab("cart")}
                aria-label="Edit cart items"
              >
                {t("Edit Cart")}
              </button>
            </div>

            {/* Delivery form */}
            <div
              className="rounded-2xl p-5 mb-2"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <h2
                className="font-bold text-base mb-4 flex items-center gap-2"
                style={{ color: "#F0F4FF", fontFamily: "Manrope, sans-serif" }}
              >
                <Icon
                  name="MapPinIcon"
                  size={18}
                  variant="outline"
                  style={{ color: "#00D4FF" }}
                />
                {t("Delivery Details")}
              </h2>
              <CheckoutForm onSuccess={() => setOrderPlaced(true)} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function CartCheckoutPage() {
  return <CartCheckoutContent />;
}
