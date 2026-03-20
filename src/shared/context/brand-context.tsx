'use client';

import { createContext, type ReactNode, useContext } from 'react';

import { type BrandConfig } from '@/shared/config/brand-config';

type BrandContextType = {
  config: BrandConfig;
};

const BrandContext = createContext<BrandContextType | null>(null);

export function BrandProvider({
  initialBrand,
  children,
}: {
  initialBrand: BrandConfig;
  children: ReactNode;
}) {
  return <BrandContext.Provider value={{ config: initialBrand }}>{children}</BrandContext.Provider>;
}

export function useBrand(): BrandContextType {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
}

// (web)/[brandSlug] 레이아웃 밖에서도 안전하게 호출 가능 — null이면 webview 컨텍스트
export function useOptionalBrand(): BrandContextType | null {
  return useContext(BrandContext);
}
