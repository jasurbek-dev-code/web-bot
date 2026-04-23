import React from 'react';
import { useTranslation } from 'react-i18next';

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  // Agar API'dan jami sahifalar soni kelsa, buni ishlating
  isLastPage?: boolean;
}

export default function Index({ currentPage, onPageChange, isLastPage }: PaginationProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center gap-4 mt-8 mb-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="text-sm px-4 py-2 rounded-xl glass border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
        style={{ color: '#F0F4FF' }}
      >
        ← {t('Prev')}
      </button>

      <span className="font-bold text-sm" style={{ color: '#00D4FF' }}>
        {t('Page')}: {currentPage}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLastPage}
        className="text-sm  px-4 py-2 rounded-xl glass border border-white/10 disabled:opacity-30 transition-all active:scale-95"
        style={{ color: '#F0F4FF' }}
      >
        {t('Next')} →
      </button>
    </div>
  );
}
