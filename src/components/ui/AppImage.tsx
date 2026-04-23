'use client';

import React, { useState, useCallback, useMemo, memo, useEffect } from 'react';
import type { ImgHTMLAttributes } from 'react';

const INTERNAL_IMAGE_HOSTS = [import.meta.env.NEXT_PUBLIC_SITE_URL, import.meta.env.NEXT_PUBLIC_BASE_URL]
  .filter(Boolean)
  .map((value) => {
    try {
      return new URL(value as string).host;
    } catch {
      return '';
    }
  })
  .filter(Boolean);

interface AppImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  fill?: boolean;
  sizes?: string;
  onClick?: () => void;
  fallbackSrc?: string;
  loading?: 'lazy' | 'eager';
  unoptimized?: boolean;
  [key: string]: any;
}

const AppImage = memo(function AppImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  fill = false,
  sizes,
  onClick,
  fallbackSrc = '/placeholder.png',
  loading = 'lazy',
  unoptimized = false,
  ...props
}: AppImageProps) {
  const isAllowedImageSrc = useCallback((value: string) => {
    if (!/^https?:\/\//i.test(value)) {
      return true;
    }

    try {
      return INTERNAL_IMAGE_HOSTS.includes(new URL(value).host);
    } catch {
      return false;
    }
  }, []);
  const safeInitialSrc =
    typeof src === 'string' && !isAllowedImageSrc(src) ? fallbackSrc : src;
  const [imageSrc, setImageSrc] = useState(safeInitialSrc);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  useEffect(() => {
    setImageSrc(typeof src === 'string' && !isAllowedImageSrc(src) ? fallbackSrc : src);
    setHasError(false);
  }, [fallbackSrc, isAllowedImageSrc, src]);
  const resolvedUnoptimized = unoptimized;

  const handleError = useCallback(() => {
    if (!hasError && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      setHasError(true);
    }
    setIsLoading(false);
  }, [hasError, imageSrc, fallbackSrc]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const imageClassName = useMemo(() => {
    const classes = [className];
    if (isLoading) classes.push('bg-gray-200');
    if (onClick) classes.push('cursor-pointer hover:opacity-90 transition-opacity duration-200');
    return classes.filter(Boolean).join(' ');
  }, [className, isLoading, onClick]);

  const imageProps = useMemo(() => {
    const baseProps: ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string } = {
      src: imageSrc,
      alt,
      className: imageClassName,
      onError: handleError,
      onLoad: handleLoad,
      onClick,
    };

    baseProps.loading = priority ? 'eager' : loading;

    return baseProps;
  }, [
    imageSrc,
    alt,
    imageClassName,
    priority,
    loading,
    handleError,
    handleLoad,
    onClick,
  ]);

  if (fill) {
    return (
      <div className="relative" style={{ width: '100%', height: '100%' }}>
        <img
          {...imageProps}
          sizes={sizes}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          {...props}
        />
      </div>
    );
  }

  return (
    <img {...imageProps} width={width || 400} height={height || 300} sizes={sizes} {...props} />
  );
});

AppImage.displayName = 'AppImage';

export default AppImage;
