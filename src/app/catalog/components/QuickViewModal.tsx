'use client';

import React, { useEffect, useMemo, useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { IProduct } from '../interfaces';

interface QuickViewModalProps {
  product: IProduct | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (product) {
      setVisible(true);
      setCurrentIndex(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [product]);

  // ✅ Move useMemo ABOVE the conditional return
  const images = useMemo(() => {
    if (!product?.images || !Array.isArray(product.images) || product.images.length === 0) {
      return ['/placeholder.png'];
    }
    return product.images;
  }, [product]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };
  const next = (e?: React.MouseEvent) => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1 >= images.length ? 0 : prev + 1));
  };

  const prev = (e?: React.MouseEvent) => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 < 0 ? images.length - 1 : prev - 1));
  };
  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60"
      onClick={handleClose}
    >
      <div
        className={`w-full max-w-lg bg-[#0b1220] rounded-t-3xl overflow-hidden transition-transform duration-300 ${
          visible ? 'translate-y-0' : 'translate-y-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center py-3">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>

        <button
          onClick={handleClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 z-50"
        >
          <Icon name="XMarkIcon" size={16} />
        </button>

        <div className="relative w-full h-[280px]">
          <AppImage src={images[currentIndex]} alt={product.name} fill className="object-cover" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />

          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full"
              >
                <Icon name="ChevronLeftIcon" size={18} />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full"
              >
                <Icon name="ChevronRightIcon" size={18} />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i === currentIndex ? 'bg-white' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-5">
          <h2 className="text-white text-xl font-semibold">{product.name}</h2>
        </div>
      </div>
    </div>
  );
}
