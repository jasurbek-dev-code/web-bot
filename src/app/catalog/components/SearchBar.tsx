'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import { useTranslation } from 'react-i18next';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const { t } = useTranslation();
  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <Icon name="MagnifyingGlassIcon" size={18} variant="outline" className="text-muted" />
      </div>
      <input
        type="search"
        className="search-input w-full pl-11 pr-4 py-3 text-sm font-body"
        placeholder={`${t('Search')}...`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search products"
        style={{ fontFamily: 'DM Sans, sans-serif' }}
      />
      {value && (
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          {/* <Icon
            name="XCircleIcon"
            size={18}
            variant="outline"
            className="text-muted"
          /> */}
        </button>
      )}
    </div>
  );
}
