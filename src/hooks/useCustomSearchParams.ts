'use client';
import { ISearchParams } from '@/interfaces/params.interface';
import { cleanParams, isObject } from '@/utils/common';
import { sanitizeSearchParams } from '@/utils/security';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

function useCustomSearchParams() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pathname = useLocation().pathname;

  // URLSearchParams-ni ob'ektga o'girish
  const paramsObj = searchParams
    ? (sanitizeSearchParams(Object.fromEntries(searchParams.entries())) as ISearchParams)
    : ({} as ISearchParams);
  const paramsStr = searchParams.toString();

  function updateUrl(newParams: ISearchParams) {
    // Tozalash (undefined/null qiymatlarni olib tashlash)
    const cleaned = cleanParams(newParams);

    // Yangi query string yaratish
    const current = new URLSearchParams(cleaned as any);
    const query = current.toString();

    // URL-ni yangilash
    navigate(
      {
        pathname,
        search: query ? `?${query}` : '',
      },
      { replace: true }
    );
  }

  function addParams(paramKeyOrObj: ISearchParams, ...removeKeys: string[]): void {
    if (!paramKeyOrObj) return;

    let newParams: ISearchParams = { ...paramsObj };

    // Keraksiz kalitlarni o'chirish
    if (removeKeys && removeKeys.length > 0) {
      removeKeys.forEach((key) => {
        delete newParams[key];
      });
    }

    // Yangi parametrlarni qo'shish
    if (isObject(paramKeyOrObj)) {
      newParams = { ...newParams, ...paramKeyOrObj };
    }

    updateUrl(newParams);
  }

  function removeParams(...paramKeys: string[]): void {
    const paramsCopy: ISearchParams = { ...paramsObj };
    paramKeys.forEach((pk) => {
      delete paramsCopy[pk];
    });

    updateUrl(paramsCopy);
  }

  return {
    paramsObject: paramsObj,
    paramsString: paramsStr,
    addParams,
    removeParams,
  };
}

export default useCustomSearchParams;
