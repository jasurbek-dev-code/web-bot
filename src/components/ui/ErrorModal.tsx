'use client';

import React, { useEffect } from 'react';

type ErrorModalProps = {
  open: boolean;
  title: string;
  messages: string[];
  actionLabel?: string;
  onAction?: () => void;
};

export default function ErrorModal({
  open,
  title,
  messages,
  actionLabel = 'Qayta urinish',
  onAction,
}: ErrorModalProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md glass-card rounded-2xl border border-white/10 p-5">
        <h2 className="text-lg font-bold" style={{ color: '#F0F4FF' }}>
          {title}
        </h2>
        <div className="mt-3 space-y-2 text-sm" style={{ color: '#8896B3' }}>
          {messages.filter(Boolean).map((msg, i) => (
            <p key={i}>{msg}</p>
          ))}
        </div>
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className="mt-4 w-full rounded-xl py-3 font-bold"
            style={{ background: '#00D4FF', color: '#06101F' }}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

