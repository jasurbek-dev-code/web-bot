"use client";

import React, { useState } from "react";
import AppImage from "@/components/ui/AppImage";
import Icon from "@/components/ui/AppIcon";
import { useCart } from "@/context/CartContext";
import { formatUZS } from "@/utils/currency";
import { IProduct } from "../interfaces";
import { measurment_options } from "@/constants/mesurements";
import { useTranslation } from "react-i18next";

interface ProductCardProps {
  product: IProduct;
  onQuickView: (product: IProduct) => void;
  animationIndex: number;
}

export default function ProductCard({
  product,
  onQuickView,
  animationIndex,
}: ProductCardProps) {
  const { addToCart, items, updateQuantity } = useCart();
  const [tapped, setTapped] = useState(false);
  const { t } = useTranslation();
  // Savatchada ushbu mahsulot borligini tekshirish
  const cartItem = items.find((i) => i.product.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  // Birinchi marta savatchaga qo'shish
  const handleInitialAdd = (e: React.MouseEvent) => {
    e.stopPropagation(); // Card bosilib ketmasligi uchun
    setTapped(true);
    addToCart(product);
    setTimeout(() => setTapped(false), 300);
  };

  // Miqdorni oshirish
  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(product.id, quantity + 1);
  };

  // Miqdorni kamaytirish
  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > 0) {
      updateQuantity(product.id, quantity - 1);
    }
  };

  return (
    <div
      className="product-grid-item glass-card rounded-2xl overflow-hidden cursor-pointer opacity-0 animate-fade-in-up"
      style={{
        animationDelay: `${animationIndex * 60}ms`,
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
      onClick={() => onQuickView(product)}
      role="button"
    >
      {/* Product Image */}
      <div className="relative w-full aspect-square overflow-hidden">
        <AppImage
          src={product.images[0] || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h3 className="font-semibold text-white text-sm leading-tight mb-2 line-clamp-2 h-10">
          {product.name}
        </h3>
        <span className="text-[#7c7d7d] font-bold text-[13px]">
          {`${product.measure === "nb" ? Number(product.stock_quantity).toFixed(0) : product.stock_quantity} ${t(measurment_options.find((m) => product.measure === m.value)?.value)}`}
        </span>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[#00D4FF] font-bold text-[13px]">
            {formatUZS(Number(product.price))}
          </span>

          {/* Cart Controls Logic */}
          {quantity > 0 ? (
            <div
              className="flex items-center gap-2 bg-white/5 rounded-xl p-0.5 border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 active:bg-white/10 transition-colors"
                onClick={handleDecrease}
              >
                <Icon
                  name={quantity === 1 ? "TrashIcon" : "MinusIcon"}
                  size={14}
                  className="text-white/70"
                />
              </button>

              <span className="text-white font-bold text-xs min-w-[16px] text-center">
                {quantity}
              </span>

              <button
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#00D4FF] active:scale-90 transition-transform"
                onClick={handleIncrease}
              >
                <Icon name="PlusIcon" size={14} className="text-[#0A0F1E]" />
              </button>
            </div>
          ) : (
            <button
              className={`w-8 h-8 flex items-center justify-center rounded-xl bg-[#00D4FF] shadow-[0_0_15px_rgba(0,212,255,0.3)] transition-all ${
                tapped ? "scale-90" : "scale-100"
              }`}
              onClick={handleInitialAdd}
            >
              <Icon name="PlusIcon" size={18} className="text-[#0A0F1E]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
