'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/AppIcon';
import { useCart } from '@/context/CartContext';
import { formatUZS } from '@/utils/currency';
import { useTranslation } from 'react-i18next';

interface FormData {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  comment: string;
}

interface CheckoutFormProps {
  onSuccess: () => void;
}

export default function CheckoutForm({ onSuccess }: CheckoutFormProps) {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart, saveCart } = useCart();
  const [form, setForm] = useState<FormData>({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    comment: '',
  });
  const { t } = useTranslation();
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!form.customer_name.trim()) newErrors.customer_name = 'Name is required';
    if (!form.customer_phone.trim()) newErrors.customer_phone = 'Phone is required';
    else if (!/^\+?[\d\s\-()]{7,}$/.test(form.customer_phone))
      newErrors.customer_phone = 'Enter a valid phone number';
    if (!form.customer_address.trim()) newErrors.customer_address = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const payload = {
      customer_name: form.customer_name.trim().slice(0, 80),
      customer_phone: form.customer_phone.trim().slice(0, 30),
      customer_address: form.customer_address.trim().slice(0, 200),
      comment: form.comment.trim().slice(0, 300),
      total_price: totalPrice,
      items: items.map((i) => ({
        product_id: i.product.id,
        quantity: i.quantity,
        price: i.product.price,
      })),
    };

    // Send via Telegram Web App SDK
    try {
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.sendData) {
        (window as any).Telegram.WebApp.sendData(JSON.stringify(payload));
      } else {
        throw new Error('Telegram WebApp SDK is unavailable');
      }
      // Clear cart and save to localStorage for continuity
      clearCart();
      localStorage.removeItem('kamtar_cart');
      // Navigate to catalog instead of closing
      navigate('/catalog');
    } catch (err) {
      console.error('sendData error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const fields: Array<{
    key: keyof FormData;
    label: string;
    type?: string;
    placeholder?: string;
    isTextarea?: boolean;
    required?: boolean;
  }> = [
    {
      key: 'customer_name',
      label: 'Full Name',
      type: 'text',
      placeholder: ' ',
      required: true,
    },
    {
      key: 'customer_phone',
      label: 'Phone Number',
      type: 'tel',
      placeholder: ' ',
      required: true,
    },
    {
      key: 'customer_address',
      label: 'Delivery Address',
      type: 'text',
      placeholder: ' ',
      required: true,
    },
    {
      key: 'comment',
      label: 'Comment (optional)',
      placeholder: ' ',
      isTextarea: true,
    },
  ];

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Form fields */}
      <div className="space-y-4 mb-6">
        {fields.map((field) => (
          <div key={field.key} className="floating-group">
            {field.isTextarea ? (
              <textarea
                id={field.key}
                className="floating-input floating-textarea"
                placeholder={`${field.placeholder}`}
                value={form[field.key]}
                onChange={handleChange(field.key)}
                maxLength={300}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
                aria-label={field.label}
              />
            ) : (
              <input
                id={field.key}
                type={field.type || 'text'}
                className="floating-input"
                placeholder={`${field.placeholder}`}
                value={form[field.key]}
                onChange={handleChange(field.key)}
                maxLength={
                  field.key === 'customer_phone' ? 30 : field.key === 'customer_name' ? 80 : 200
                }
                required={field.required}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
                aria-label={field.label}
                aria-invalid={!!errors[field.key]}
                aria-describedby={errors[field.key] ? `${field.key}-error` : undefined}
              />
            )}
            <label htmlFor={field.key} className="floating-label">
              {t(field.label)}
            </label>
            {errors[field.key] && (
              <p
                id={`${field.key}-error`}
                className="mt-1 text-xs"
                style={{ color: '#F87171', fontFamily: 'DM Sans, sans-serif' }}
                role="alert"
              >
                {errors[field.key]}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Order Total */}
      <div
        className="rounded-2xl p-4 mb-5"
        style={{
          background: 'rgba(0,212,255,0.06)',
          border: '1px solid rgba(0,212,255,0.15)',
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm" style={{ color: '#8896B3', fontFamily: 'DM Sans, sans-serif' }}>
            {t('Items')} ({items.reduce((s, i) => s + i.quantity, 0)})
          </span>
          <span className="text-sm" style={{ color: '#F0F4FF', fontFamily: 'Manrope, sans-serif' }}>
            {formatUZS(totalPrice)}
          </span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm" style={{ color: '#8896B3', fontFamily: 'DM Sans, sans-serif' }}>
            {t('Delivery')}
          </span>
          <span
            className="text-sm font-semibold"
            style={{ color: '#4ADE80', fontFamily: 'Manrope, sans-serif' }}
          >
            {t('Free')}
          </span>
        </div>
        <div className="divider mb-3" />
        <div className="flex items-center justify-between">
          <span
            className="font-bold text-base"
            style={{ color: '#F0F4FF', fontFamily: 'Manrope, sans-serif' }}
          >
            {t('Total')}
          </span>
          <span
            className="font-bold text-xl"
            style={{ color: '#00D4FF', fontFamily: 'Manrope, sans-serif' }}
          >
            {formatUZS(totalPrice)}
          </span>
        </div>
      </div>

      {/* Place Order Button */}
      <button
        type="submit"
        className="btn-primary w-full py-4 flex items-center justify-center gap-3 text-base relative overflow-hidden"
        disabled={submitting}
        aria-label="Place order"
      >
        {submitting ? (
          <>
            <div
              className="w-5 h-5 border-2 rounded-full animate-spin"
              style={{
                borderColor: 'rgba(10,15,30,0.3)',
                borderTopColor: '#0A0F1E',
              }}
            />
            <span style={{ fontFamily: 'Manrope, sans-serif' }}>{t('Placing Order')}...</span>
          </>
        ) : (
          <>
            <Icon name="CheckCircleIcon" size={20} variant="outline" className="text-bg" />
            <span style={{ fontFamily: 'Manrope, sans-serif' }}>{t('Place Order')}</span>
          </>
        )}
      </button>

      <p
        className="text-center text-xs mt-3"
        style={{ color: '#8896B3', fontFamily: 'DM Sans, sans-serif' }}
      >
        {t('Your order will be confirmed via Telegram')}
      </p>
    </form>
  );
}
