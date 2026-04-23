import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import resources from '@/i18n/locales';
import i18n from 'i18next';
import { noop } from '@/utils/common';
const getInitialLanguage = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('i18nextLng') || 'uz';
  }
  return 'uz';
};
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: ['uz', 'uzb'],
    lng: getInitialLanguage(),
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })
  .then(noop);
